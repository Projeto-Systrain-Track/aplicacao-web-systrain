var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

var LambdaClient = null;
var InvokeCommand = null;
var lambda = null;


LambdaClient = require("@aws-sdk/client-lambda").LambdaClient;
InvokeCommand = require("@aws-sdk/client-lambda").InvokeCommand;
lambda = new LambdaClient({ region: process.env.AWS_REGION || "us-east-1" });



function parsePayload(payload) {
    var text = Buffer.from(payload || []).toString("utf-8");
    if (!text) return {};
    var outer = JSON.parse(text);
    if (typeof outer.body === "string") return JSON.parse(outer.body);
    return outer.body || outer;
}

function normalizarMac(valor) {
    return String(valor || "").toLowerCase().replace(/[^a-f0-9]/g, "");
}

function numero(valor, padrao) {
    var n = Number(valor);
    return Number.isFinite(n) ? n : padrao;
}

function pegarValor(obj, caminhos) {
    for (var i = 0; i < caminhos.length; i++) {
        var atual = obj;
        var partes = caminhos[i].split(".");
        for (var j = 0; j < partes.length; j++) {
            if (atual == null) break;
            atual = atual[partes[j]];
        }
        if (atual !== undefined && atual !== null && atual !== "") return atual;
    }
    return null;
}

function obterLeituras(rbc) {
    return rbc.ultimas_leituras || rbc.leituras || rbc.metricas || rbc.readings || [];
}

function coletarProcessosDaLeitura(leitura) {
    var listas = [
        leitura.processos_problematicos,
        leitura.processos_alerta,
        leitura.processos_anomalia,
        leitura.processos_anomalias,
        leitura.processos_com_alerta,
        leitura.alertas_processos,
        leitura.processos
    ];
    var processos = [];
    listas.forEach(function (lista) {
        if (Array.isArray(lista)) processos = processos.concat(lista);
    });
    return processos;
}

function processoEhProblematico(proc) {
    var status = String(proc.status || proc.situacao || proc.nivel || "").toUpperCase();
    var motivos = proc.motivos || proc.alertas || proc.anomalias || proc.problemas;
    var flags = [proc.problematico, proc.em_alerta, proc.alerta, proc.anomalia, proc.anomalo, proc.is_anomaly, proc.vazamento_memoria, proc.memory_leak, proc.crash];

    if (Array.isArray(motivos) && motivos.length > 0) return true;
    if (flags.some(Boolean)) return true;
    if (status && !["OK", "NORMAL", "ONLINE", "SAUDAVEL", "SAUDÁVEL"].includes(status)) return true;

    var cpu = numero(pegarValor(proc, ["cpu_percent", "cpu_percentual", "percentual_cpu", "cpu", "uso_cpu", "cpu_percentual_uso"]), 0);
    var ram = numero(pegarValor(proc, ["memory_percent", "memoria_percent", "percentual_memoria", "ram", "uso_ram", "memory_percentual"]), 0);
    var rssMb = numero(pegarValor(proc, ["rss_mb", "memoria_rss_mb", "rss", "memory_rss_mb"]), 0);
    var score = numero(pegarValor(proc, ["score", "score_alerta", "score_anomalia", "risk_score"]), 0);

    return cpu >= numero(process.env.PROCESS_CPU_ALERT, 15) ||
        ram >= numero(process.env.PROCESS_MEMORY_PERCENT_ALERT, 10) ||
        rssMb >= numero(process.env.PROCESS_RSS_MB_ALERT, 200) ||
        score > 0;
}

function obterNomeProcesso(proc) {
    return pegarValor(proc, ["name", "nome", "processo", "process_name", "nome_processo", "cmdline"]) || "Processo sem nome";
}

function resumirProcesso(proc, leitura, indice) {
    var cpu = pegarValor(proc, ["cpu_percent", "cpu_percentual", "percentual_cpu", "cpu", "uso_cpu", "cpu_percentual_uso"]);
    var ram = pegarValor(proc, ["memory_percent", "memoria_percent", "percentual_memoria", "ram", "uso_ram", "memory_percentual"]);
    var rssMb = pegarValor(proc, ["rss_mb", "memoria_rss_mb", "memory_rss_mb"]);
    var pid = pegarValor(proc, ["pid", "process_id"]);
    var score = pegarValor(proc, ["score", "score_alerta", "score_anomalia", "risk_score"]);
    var motivos = proc.motivos || proc.alertas || proc.anomalias || proc.problemas || [];

    if (!Array.isArray(motivos)) motivos = [motivos].filter(Boolean);
    if (!motivos.length) {
        if (numero(cpu, 0) >= numero(process.env.PROCESS_CPU_ALERT, 15)) motivos.push("CPU acima do limite");
        if (numero(ram, 0) >= numero(process.env.PROCESS_MEMORY_PERCENT_ALERT, 10)) motivos.push("RAM acima do limite");
        if (numero(rssMb, 0) >= numero(process.env.PROCESS_RSS_MB_ALERT, 200)) motivos.push("RSS acima do limite");
        if (numero(score, 0) > 0) motivos.push("Score de alerta informado pela ETL");
    }

    return {
        id: indice + 1,
        nome: obterNomeProcesso(proc),
        pid: pid,
        cpu: cpu,
        ram: ram,
        rss_mb: rssMb,
        score: score,
        status: proc.status || proc.situacao || proc.nivel || (motivos.length ? "ALERTA" : "OK"),
        motivos: motivos,
        timestamp: leitura.data_hora_iso || leitura.timestamp || leitura.data_hora || leitura.coletado_em || null
    };
}

function montarRelatorio(result, filtroRbc) {
    var json = result.json || result.dados || result;
    var empresas = json.empresas || [];
    var macFiltro = normalizarMac(filtroRbc.macAdress || filtroRbc.macAddress || filtroRbc.endereco_mac || filtroRbc.enderecoMac);
    var nomeFiltro = String(filtroRbc.nomeServidor || filtroRbc.nome_rbc || filtroRbc.nome || "").toLowerCase();
    var rbcEncontrado = null;
    var contexto = {};

    empresas.forEach(function (empresa) {
        (empresa.linhas || []).forEach(function (linha) {
            (linha.rbc || linha.rbcs || []).forEach(function (rbc) {
                var macRbc = normalizarMac(rbc.endereco_mac || rbc.macAdress || rbc.macAddress || rbc.mac);
                var nomeRbc = String(rbc.nome_rbc || rbc.nomeServidor || rbc.nome || "").toLowerCase();
                if ((macFiltro && macRbc && macFiltro === macRbc) || (!macFiltro && nomeFiltro && nomeRbc.includes(nomeFiltro))) {
                    rbcEncontrado = rbc;
                    contexto = { empresa: empresa.nome_empresa || empresa.empresa || empresa.razaoSocial, linha: linha.nome_linha || linha.trecho || linha.numeroLinha };
                }
            });
        });
    });

    if (!rbcEncontrado) {
        return {
            ok: true,
            encontrado: false,
            mensagem: "A Lambda respondeu, mas o servidor RBC selecionado não foi encontrado no JSON retornado.",
            processos: [],
            resposta_lambda: { total_empresas: result.total_empresas, total_maquinas: result.total_maquinas, leituras_offline: result.leituras_offline }
        };
    }

    var leituras = obterLeituras(rbcEncontrado);
    var processos = [];
    leituras.forEach(function (leitura) {
        coletarProcessosDaLeitura(leitura).forEach(function (proc) {
            if (processoEhProblematico(proc)) processos.push(resumirProcesso(proc, leitura, processos.length));
        });
    });

    processos.sort(function (a, b) {
        return numero(b.score, 0) - numero(a.score, 0) || numero(b.cpu, 0) - numero(a.cpu, 0) || numero(b.ram, 0) - numero(a.ram, 0);
    });

    return {
        ok: true,
        encontrado: true,
        servidor: {
            nome: rbcEncontrado.nome_rbc || rbcEncontrado.nomeServidor || filtroRbc.nomeServidor,
            mac: rbcEncontrado.endereco_mac || rbcEncontrado.macAdress || filtroRbc.macAdress,
            status: rbcEncontrado.status_atual || rbcEncontrado.status,
            empresa: contexto.empresa,
            linha: contexto.linha
        },
        leituras_analisadas: leituras.length,
        total_processos_problematicos: processos.length,
        processos: processos.slice(0, 30),
        resposta_lambda: { total_empresas: result.total_empresas, total_maquinas: result.total_maquinas, leituras_offline: result.leituras_offline }
    };
}

router.post("/gerarRelatorio", async function (req, res) {
    try {
        if (process.env.LOCAL_TEST_MODE === "true") {
            var resultLocal = carregarJsonLocal();
            return res.json(montarRelatorio(resultLocal, req.body.rbc || {}));
        }

        var payload = {
            input_bucket: req.body.input_bucket || process.env.INPUT_BUCKET,
            input_prefix: req.body.input_prefix || process.env.INPUT_PREFIX || "raw/",
            input_key: req.body.input_key,
            input_keys: req.body.input_keys,
            output_bucket: req.body.output_bucket || process.env.OUTPUT_BUCKET || process.env.INPUT_BUCKET,
            output_key: req.body.output_key || process.env.OUTPUT_KEY || "client/empresas_linhas_rbc.json",
            return_json: true
        };

        var command = new InvokeCommand({
            FunctionName: process.env.LAMBDA_ETL_NAME || "etl_process",
            InvocationType: "RequestResponse",
            Payload: Buffer.from(JSON.stringify(payload))
        });

        var response = await lambda.send(command);
        var result = parsePayload(response.Payload);
        if (!result.ok) return res.status(500).json(result);

        return res.json(montarRelatorio(result, req.body.rbc || {}));
    } catch (erro) {
        console.error("Erro gerando relatório de processos:", erro);
        return res.status(500).json({ ok: false, erro: "Erro gerando relatório de processos", detalhe: erro.message });
    }
});

module.exports = router;
