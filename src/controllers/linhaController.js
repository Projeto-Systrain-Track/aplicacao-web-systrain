var linhaModel = require("../models/linhaModel")
async function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var numero = req.body.numeroServer;
    var cor = req.body.corServer;
    var empresa = req.body.empresaServer;
    var trecho = req.body.trechoServer;

    if (nome == undefined) {
        return res.status(400).send("nome está undefined!");
    } else if (numero == undefined) {
        return res.status(400).send("numero está undefined!");
    } else if (cor == undefined) {
        return res.status(400).send("cor está undefined!");
    } else if (empresa == undefined) {
        return res.status(400).send("empresa está undefined!");
    } else if (trecho == undefined) {
        return res.status(400).send("empresa está undefined!");
    }
    try {
        console.log("Nome: ", nome, "Numero: ", numero, "Cor: ", cor, "Empresa: ", empresa, "Trecho: ", trecho);

        var requisicaoBd = await linhaModel.cadastrar(nome, numero, cor, empresa, trecho)
        console.log(requisicaoBd);

        if (requisicaoBd.affectedRows == 1) {
            return res.status(200).json({ mensagem: "O cadastro da linha foi feito com sucesso!", idLinhaCadastrada: requisicaoBd.insertId });
        } else {
            throw new Error("O cadastro da linha não foi feito!");
        }
    } catch (error) {
        return res.status(400).json({ mensagem: error });
    }

}

async function listar(req, res) {
    var requisicaoBd = await linhaModel.listar()
    console.log("Linhas: ", requisicaoBd);
    console.log("requisicaoBd.length", requisicaoBd.length);
    return res.status(200).json({ listaLinhas: requisicaoBd });
}


async function listarLinhasEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa
    if (idEmpresa == undefined) {
        return res.status(400).json({ mensagem: "O seu idEmpresa está undefined" })
    }
    idEmpresa = idEmpresa.replace(":", "")

    var requisicaoBd = await linhaModel.listarLinhasEmpresa(idEmpresa)
    console.log("Linhas: ", requisicaoBd);
    console.log("requisicaoBd.length", requisicaoBd.length);
    if (requisicaoBd.length > 0) {

        for (var i = 0; i < requisicaoBd.length; i++) {
            requisicaoBd[i].status = "Operando"
            console.log("requisicaoBd[i].status", requisicaoBd[i].status);
            var incidentes = Math.round(Math.random() * 10)
            var disponibilidade = Math.round(Math.random() * 10) + 90
            requisicaoBd[i].status = "Operando"
            requisicaoBd[i].incidentes = incidentes
            requisicaoBd[i].disponibilidade = disponibilidade
        }

        return res.status(200).json(requisicaoBd);
    } else if (requisicaoBd.length == 0) {
        return res.status(204).json({ mensagem: "Nenhuma linha cadastrada!" });
    }
    return res.status(400).json({ mensagem: "Não foi possível listar as linhas" });
}

// Substituir pelas chamadas de objetos do Bucket
/*
function dashLinhas(req, res) {
    res.json({
        servidoresAtivos: "5/6",
        statusSistema: "Operação parada",
        latenciaMedia: "RB_SRV_MIK",
        incidentesAbertos: "15",

        resumo: [
            { nome: "Latência elevada", valor: 4 },
            { nome: "Uso de CPU elevado", valor: 1 },
            { nome: "Pico de RAM", valor: 3 },
            { nome: "Servidor offline", valor: 1 },
        ],

        alertas: [
            { tipo: "Crítico", msg: "Servidor RB_SRV_MIK - Offline" },
            { tipo: "Atenção", msg: "Servidor RB_SRV_ALF - RAM em 95%" },
            { tipo: "Atenção", msg: "Servidor RB_SVR_DELT - CPU em 92%" }
        ],

        servidores: [
            { nome: "RB_SVR_MIK", status: "Offline", cpu: '', ram: '', disco: '', latencia: "0ms" },
            { nome: "RB_SVR_DELT", status: "Online", cpu: 92, ram: 91, disco: 25, latencia: "100ms" },
            { nome: "RB_SVR_ALPH", status: "Online", cpu: 62, ram: 88, disco: 50, latencia: "98ms" },
            { nome: "SV-PRIM", status: "Online", cpu: 60, ram: 87, disco: 50, latencia: "95ms" },
            { nome: "SV-JOKT", status: "Online", cpu: 60, ram: 20, disco: 50, latencia: "90ms" },
            { nome: "SV-MHRT", status: "Online", cpu: 20, ram: 45, disco: 30, latencia: "150ms" },
        ]
    });
}
    */

// ======================================================= \\
//          FUNÇÃO PARA DESMOCKAR O dashLinhas             \\
// ======================================================= \\

async function dashLinhas(req, res) {

    try {

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: "empresas_linhas_rbc.json"
        });

        const response = await s3.send(command);

        const streamToString = (stream) =>
            new Promise((resolve, reject) => {

                const chunks = [];

                stream.on("data", chunk => chunks.push(chunk));
                stream.on("error", reject);

                stream.on("end", () => {
                    resolve(Buffer.concat(chunks).toString("utf8"));
                });

            });

        const bodyContents = await streamToString(response.Body);

        const jsonData = JSON.parse(bodyContents);

        console.log("ID recebido:", idLinha);

        jsonData.incidentes.forEach(i => {
            console.log(
                "Incidente:",
                i.nome_linha,
                "| id_linha:",
                i.id_linha
            );
        });

        // ============================================================
        // EXTRAÇÃO DOS DADOS DA ETL
        // ============================================================

        const empresa = jsonData.empresas?.[0];

        if (!empresa) {
            return res.status(404).json({
                erro: "Nenhuma empresa encontrada"
            });
        }

        const linha = empresa.linhas?.[0];

        if (!linha) {
            return res.status(404).json({
                erro: "Nenhuma linha encontrada"
            });
        }

        const rbcs = linha.rbc || [];

        // ============================================================
        // KPIs
        // ============================================================

        let online = 0;
        let offline = 0;

        let maiorLatencia = 0;
        let servidorCritico = "N/A";

        let incidentes = 0;

        const servidores = [];

        const resumo = [
            { nome: "CPU elevada", valor: 0 },
            { nome: "RAM elevada", valor: 0 },
            { nome: "Disco elevado", valor: 0 },
            { nome: "Latência elevada", valor: 0 },
            { nome: "Servidor offline", valor: 0 }
        ];

        const alertas = [];

        // ============================================================
        // LOOP RBC
        // ============================================================

        for (const rbc of rbcs) {

            const ultima =
                rbc.ultimas_leituras?.[
                    rbc.ultimas_leituras.length - 1
                ];

            if (!ultima) continue;

            const status =
                rbc.status_atual === "ONLINE"
                    ? "Online"
                    : "Offline";

            if (status === "Online") {
                online++;
            } else {
                offline++;

                resumo[4].valor++;

                alertas.push({
                    tipo: "Crítico",
                    msg: `${rbc.nome_rbc} offline`
                });
            }

            const cpu =
                ultima.cpu?.percentual_uso_cpu || 0;

            const ram =
                ultima.memoria?.percentual_uso_ram || 0;

            const disco =
                ultima.disco?.percentual_uso_disco || 0;

            const latencia =
                ultima.latencia_ping_ms || 0;

            // ========================================================
            // ALERTAS
            // ========================================================

            if (cpu >= 85) {
                resumo[0].valor++;
                incidentes++;

                alertas.push({
                    tipo: "Atenção",
                    msg: `${rbc.nome_rbc} CPU em ${cpu}%`
                });
            }

            if (ram >= 85) {
                resumo[1].valor++;
                incidentes++;

                alertas.push({
                    tipo: "Atenção",
                    msg: `${rbc.nome_rbc} RAM em ${ram}%`
                });
            }

            if (disco >= 85) {
                resumo[2].valor++;
                incidentes++;

                alertas.push({
                    tipo: "Atenção",
                    msg: `${rbc.nome_rbc} Disco em ${disco}%`
                });
            }

            if (latencia >= 100) {
                resumo[3].valor++;
                incidentes++;

                alertas.push({
                    tipo: "Atenção",
                    msg: `${rbc.nome_rbc} Latência em ${latencia}ms`
                });
            }

            // ========================================================
            // SERVIDOR MAIS CRÍTICO
            // ========================================================

            if (latencia > maiorLatencia) {
                maiorLatencia = latencia;
                servidorCritico = rbc.nome_rbc;
            }

            // ========================================================
            // STATUS VISUAL
            // ========================================================

            let statusVisual = "Online";

            if (
                cpu >= 85 ||
                ram >= 85 ||
                disco >= 85
            ) {
                statusVisual = "Crítico";
            } else if (
                cpu >= 70 ||
                ram >= 70 ||
                disco >= 70
            ) {
                statusVisual = "Degradado";
            }

            if (status === "Offline") {
                statusVisual = "Offline";
            }

            // ========================================================
            // TABELA
            // ========================================================

            servidores.push({
                nome: rbc.nome_rbc,
                status: statusVisual,
                cpu,
                ram,
                disco,
                latencia: `${latencia}ms`
            });

        }

        // ============================================================
        // RESPOSTA FINAL
        // ============================================================

        return res.status(200).json({

            servidoresAtivos: `${online}/${online + offline}`,

            statusSistema:
                offline > 0
                    ? "Operação degradada"
                    : "Operando normalmente",

            latenciaMedia: servidorCritico,

            incidentesAbertos: incidentes,

            resumo,

            alertas,

            servidores

        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: erro.message
        });

    }

}

// ======================================================= \\

async function detalheLinha(req, res) {

    try {

        const idLinha = Number(req.params.idLinha);

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: "linhas.json"
        });

        const response = await s3.send(command);

        const streamToString = (stream) =>
            new Promise((resolve, reject) => {

                const chunks = [];

                stream.on("data", chunk => chunks.push(chunk));
                stream.on("error", reject);

                stream.on("end", () => {
                    resolve(Buffer.concat(chunks).toString("utf8"));
                });

            });

        const bodyContents =
            await streamToString(response.Body);

        const jsonData =
            JSON.parse(bodyContents);

        let linhaEncontrada = null;

        jsonData.empresas.forEach(empresa => {

            const linha =
                empresa.linhas.find(
                    l => l.id_linha == idLinha
                );

            if (linha) {
                linhaEncontrada = linha;
            }

        });

        if (!linhaEncontrada) {

            return res.status(404).json({
                erro: "Linha não encontrada"
            });

        }

        return res.status(200).json(linhaEncontrada);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: erro.message
        });

    }

}

// ======================================================= \\

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
}); // Ajuste para a sua região do S3
async function readS3Json(req, res) {
    console.log("Chamando os dados! DADOS")
  try {
    // const idEmpresa = req.body.idEmpresa;

    // Jeito correto de receber o dado no controller:
    // const { nomeCaminho } = "dados_csv/trusted_empresa (3).csv";


    // if (!nomeCaminho) {
    //   return res.status(400).json({ error: "O nome do arquivo (Key) não foi definido." });
    // }

    const command = new GetObjectCommand({ 
      Bucket: process.env.AWS_BUCKET,
      Key: "linhas.json"
    });

    const response = await s3.send(command);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });

    const bodyContents = await streamToString(response.Body);
    const jsonData = JSON.parse(bodyContents);

    return res.status(200).json(jsonData);
  } catch (err) { 
    console.error("Error reading file:", err);
    return res.status(500).json({ error: err.message }); 
  }
}

async function incidentesLinha(req, res) {

    try {

        const idLinha = Number(req.params.idLinha);

        if (!idLinha) {
            return res.status(400).json({
                erro: "ID da linha inválido"
            });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: "incidentes.json"
        });

        const response = await s3.send(command);

        const streamToString = (stream) =>
            new Promise((resolve, reject) => {

                const chunks = [];

                stream.on("data", chunk => chunks.push(chunk));
                stream.on("error", reject);

                stream.on("end", () => {
                    resolve(Buffer.concat(chunks).toString("utf8"));
                });

            });

        const bodyContents = await streamToString(response.Body);

        const jsonData = JSON.parse(bodyContents);

        const commandLinha = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: "linhas.json"
        });

        const responseLinha = await s3.send(commandLinha);

        const bodyLinha = await streamToString(responseLinha.Body);

        const jsonLinhas = JSON.parse(bodyLinha);

        let linhaAtual = null;

        jsonLinhas.empresas.forEach(empresa => {

            const encontrada = empresa.linhas.find(
                l => l.id_linha == idLinha
            );

            if (encontrada) {
                linhaAtual = encontrada;
            }

        });

        if (!linhaAtual) {
            return res.status(404).json({
                erro: "Linha não encontrada"
            });
        }

        const numeroLinha = linhaAtual.numero_linha;

        const incidentesLinha = jsonData.incidentes.filter(
            incidente => incidente.id_linha == numeroLinha
        );

        // CONSOLE DE TESTE
        console.log("Linha recebida:", idLinha);
        console.log("Número da linha:", numeroLinha);
        console.log("Incidentes encontrados:", incidentesLinha.length);

        return res.status(200).json(incidentesLinha);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: erro.message
        });

    }

}



module.exports = {
    cadastrar,
    listar,
    listarLinhasEmpresa,
    readS3Json,
    dashLinhas,
    detalheLinha,
    incidentesLinha
}