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

function carregarJsonLocal() {
    var caminhosPossiveis = [
        process.env.LOCAL_JSON_PATH,
        process.env.LOCAL_OUTPUT_JSON,
        path.join(__dirname, "../client/empresas_linhas_rbc.json"),
        path.join(__dirname, "../trusted/empresas_linhas_rbc.json"),
        path.join(process.cwd(), "client/empresas_linhas_rbc.json"),
        path.join(process.cwd(), "trusted/empresas_linhas_rbc.json")
    ].filter(Boolean);

    for (var i = 0; i < caminhosPossiveis.length; i++) {
        var caminho = caminhosPossiveis[i];
        if (fs.existsSync(caminho)) {
            return JSON.parse(fs.readFileSync(caminho, "utf-8"));
        }
    }

    throw new Error("JSON local não encontrado. Defina LOCAL_JSON_PATH ou LOCAL_OUTPUT_JSON no .env.");
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

function normalizarTextoItem(item) {
    if (item === null || item === undefined || item === "") return null;
    if (typeof item === "string") return item;
    if (typeof item === "number" || typeof item === "boolean") return String(item);
    if (typeof item === "object") return Object.keys(item).map(function (chave) {
        return chave + ": " + item[chave];
    }).join(" | ");
    return String(item);
}

function normalizarLista(valor) {
    if (!valor) return [];
    if (Array.isArray(valor)) return valor.map(normalizarTextoItem).filter(Boolean);
    var texto = normalizarTextoItem(valor);
    return texto ? [texto] : [];
}

function formatarChaveAnomalia(chave) {
    var mapa = {
        cpu_delta_desde_leitura_anterior: "Variação de CPU desde a leitura anterior",
        memory_percent_delta_desde_leitura_anterior: "Variação de RAM desde a leitura anterior",
        rss_growth_mb_desde_leitura_anterior: "Crescimento de RSS desde a leitura anterior",
        score_anomalia_processo: "Score de anomalia do processo",
        cpu_delta: "Variação de CPU",
        memory_delta: "Variação de RAM",
        memory_percent_delta: "Variação de RAM",
        rss_growth_mb: "Crescimento de RSS",
        score_anomalia: "Score de anomalia"
    };

    return mapa[chave] || chave.replaceAll("_", " ");
}

function formatarValorAnomalia(chave, valor) {
    var n = Number(valor);
    if (!Number.isFinite(n)) return String(valor);
    var valorFormatado = n.toFixed(2);
    if (chave.includes("rss") || chave.includes("mb")) return valorFormatado + " MB";
    if (chave.includes("cpu") || chave.includes("memory") || chave.includes("percent")) return valorFormatado + "%";
    return valorFormatado;
}

function normalizarAnomalias(proc) {
    var bruto = proc.anomalias || proc.anomalia || proc.anomalies || proc.anomaly || null;
    if (!bruto) return [];

    if (Array.isArray(bruto)) return normalizarLista(bruto);

    if (typeof bruto === "object") {
        return Object.keys(bruto).map(function (chave) {
            var valor = bruto[chave];
            if (valor === null || valor === undefined || valor === "") return null;
            return formatarChaveAnomalia(chave) + ": " + formatarValorAnomalia(chave, valor);
        }).filter(Boolean);
    }

    return normalizarLista(bruto);
}

function obterScoreAnomalia(proc) {
    return pegarValor(proc, [
        "anomalias.score_anomalia_processo",
        "anomalias.score_anomalia",
        "score_anomalia_processo",
        "score_anomalia",
        "score",
        "score_alerta",
        "risk_score"
    ]);
}

function obterLimitesProcesso(proc) {
    var altaPrioridade = Boolean(proc.alta_prioridade) || String(proc.name || proc.nome || "").startsWith("RBC_");
    return {
        cpu: numero(altaPrioridade ? process.env.HIGH_PRIORITY_PROCESS_CPU_ALERT : process.env.PROCESS_CPU_ALERT, altaPrioridade ? 2 : 15),
        ram: numero(altaPrioridade ? process.env.HIGH_PRIORITY_PROCESS_MEMORY_PERCENT_ALERT : process.env.PROCESS_MEMORY_PERCENT_ALERT, altaPrioridade ? 5 : 10),
        rssMb: numero(altaPrioridade ? process.env.HIGH_PRIORITY_PROCESS_RSS_MB_ALERT : process.env.PROCESS_RSS_MB_ALERT, altaPrioridade ? 20 : 200),
        threads: numero(process.env.PROCESS_THREADS_ALERT, 75)
    };
}

function statusIndicaProblema(status) {
    var statusNormalizado = String(status || "").toUpperCase();
    var statusProblematicos = ["CRASH", "CRASHED", "ERRO", "ERROR", "FAILED", "FALHA", "FALHOU", "DEAD", "ZOMBIE", "OFFLINE", "TERMINATED", "PARADO", "STOPPED"];
    return statusProblematicos.some(function (item) {
        return statusNormalizado.includes(item);
    });
}

function obterMotivos(proc) {
    var motivos = [];
    motivos = motivos.concat(normalizarLista(proc.motivos_alerta));
    motivos = motivos.concat(normalizarLista(proc.motivos));
    motivos = motivos.concat(normalizarLista(proc.alertas));
    motivos = motivos.concat(normalizarLista(proc.problemas));

    var cpu = numero(pegarValor(proc, ["cpu_percent", "cpu_percentual", "percentual_cpu", "cpu", "uso_cpu", "cpu_percentual_uso"]), 0);
    var ram = numero(pegarValor(proc, ["memory_percent", "memoria_percent", "percentual_memoria", "ram", "uso_ram", "memory_percentual"]), 0);
    var rssMb = numero(pegarValor(proc, ["rss_mb", "memoria_rss_mb", "rss", "memory_rss_mb"]), 0);
    var threads = numero(pegarValor(proc, ["num_threads", "threads", "qtd_threads"]), 0);
    var score = numero(obterScoreAnomalia(proc), 0);
    var limites = obterLimitesProcesso(proc);

    if (cpu >= limites.cpu) motivos.push("CPU acima do limite (" + limites.cpu + "%)");
    if (ram >= limites.ram) motivos.push("RAM acima do limite (" + limites.ram + "%)");
    if (rssMb >= limites.rssMb) motivos.push("RSS acima do limite (" + limites.rssMb + " MB)");
    if (threads >= limites.threads) motivos.push("Threads acima do limite (" + limites.threads + ")");
    if (score > 0) motivos.push("Score de anomalia informado pela ETL");
    if (statusIndicaProblema(proc.status || proc.situacao || proc.nivel)) motivos.push("Status do processo indica falha");

    return Array.from(new Set(motivos.filter(Boolean)));
}

function processoEhProblematico(proc) {
    var flags = [proc.problematico, proc.em_alerta, proc.alerta, proc.anomalia, proc.anomalo, proc.is_anomaly, proc.vazamento_memoria, proc.memory_leak, proc.crash];
    if (flags.some(Boolean)) return true;
    if (obterMotivos(proc).length > 0) return true;
    if (normalizarAnomalias(proc).length > 0) return true;
    return false;
}

function obterNomeProcesso(proc) {
    var nome = pegarValor(proc, ["name", "nome", "processo", "process_name", "nome_processo"]);
    if (nome) return nome;
    if (Array.isArray(proc.cmdline) && proc.cmdline.length) return proc.cmdline[0];
    if (typeof proc.cmdline === "string" && proc.cmdline) return proc.cmdline;
    return "Processo sem nome";
}

function resumirProcesso(proc, leitura, indice) {
    var cpu = pegarValor(proc, ["cpu_percent", "cpu_percentual", "percentual_cpu", "cpu", "uso_cpu", "cpu_percentual_uso"]);
    var ram = pegarValor(proc, ["memory_percent", "memoria_percent", "percentual_memoria", "ram", "uso_ram", "memory_percentual"]);
    var rssMb = pegarValor(proc, ["rss_mb", "memoria_rss_mb", "rss", "memory_rss_mb"]);
    var pid = pegarValor(proc, ["pid", "process_id"]);
    var score = obterScoreAnomalia(proc);
    var motivos = obterMotivos(proc);
    var anomalias = normalizarAnomalias(proc);
    var statusOriginal = proc.status || proc.situacao || proc.nivel;

    return {
        id: indice + 1,
        nome: obterNomeProcesso(proc),
        pid: pid,
        cpu: cpu,
        ram: ram,
        rss_mb: rssMb,
        score: score,
        anomalia: score,
        status: statusIndicaProblema(statusOriginal) ? statusOriginal : (motivos.length || anomalias.length ? "ALERTA" : "OK"),
        motivos: motivos,
        motivos_alerta: motivos,
        anomalias: anomalias,
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
        return numero(b.score, 0) - numero(a.score, 0) || numero(b.cpu, 0) - numero(a.cpu, 0) || numero(b.rss_mb, 0) - numero(a.rss_mb, 0) || numero(b.ram, 0) - numero(a.ram, 0);
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
