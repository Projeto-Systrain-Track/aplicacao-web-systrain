
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");


const s3Client = new S3Client({
    region: process.env.AWS_REGION,

    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});



//A função csvToObjects converte o conteúdo CSV em um array de objetos que o JavaScript consegue manipular
function csvToObjects(csvText) {
    const linhas = csvText.trim().split("\n"); //função que recebe o texto CSV
    //o .trim() remove espaços em branco no início e no final do texto, 
    //o .split("\n") quebra o texto a cada nova linha, o que transforma o CSV em um Array




    const cabecalho = linhas[0].split(",");
    
    return linhas.slice(1).map(linha => {
        const values = linha.split(",");
        const obj = {};
        cabecalho.forEach((key, index) => {
            obj[key.trim()] = values[index]?.trim();
        });
        return obj;
    });


}


async function obterDadosVisaoGeral(req, res) {
    
    console.log("ENTROU NO CONTROLLER");
    console.log(req.params);

    console.log("Bucket:", process.env.S3_BUCKET_NAME);
    console.log("Region:", process.env.AWS_REGION);
    console.log("Access Key existe?", !!process.env.AWS_ACCESS_KEY_ID);
    console.log("Secret Key existe?", !!process.env.AWS_SECRET_ACCESS_KEY);
    console.log("Session Token existe?", !!process.env.AWS_SESSION_TOKEN);


    try {
        
        const idEmpresa = req.params.idEmpresa;

        if (!idEmpresa) {
            return res.status(400).json({ erro: "O ID da empresa não foi informado na URL." });
        }


        const nomeCaminho = "client/13h39";                
        //"raw/30-1b-a1-92-17-dc/2026/06/01/13h39.csv";
        console.log("Arquivo procurado:", nomeCaminho);

  



        console.log("Bucket enviado para AWS:", process.env.S3_BUCKET_NAME);

        const command = new GetObjectCommand({
            Bucket: "rbc-train-track-sys",
            Key: nomeCaminho
            
            // Bucket: "raw-s3-123456",
            // Key: nomeCaminho


        });



        const response = await s3Client.send(command);
        console.log("Arquivo encontrado!");


        const csvContent = await response.Body.transformToString("utf-8");
        console.log("CSV carregado!");
        console.log(csvContent.substring(0, 500));

        
        const registros = csvToObjects(csvContent);
        console.log("Quantidade de registros:", registros.length);
        if (registros.length > 0) {
            console.log("Primeiro registro:");
            console.log(registros[0]);
        }
        console.log("Primeiro registro:", registros[0]);





        if (registros.length === 0) {
            return res.status(404).json({ erro: "Nenhum dado encontrado no arquivo CSV desta empresa." });
        }

        // 2. PROCESSAMENTO DOS DADOS PARA A SUA DASHBOARD
        const ultimoRegistro = registros[registros.length - 1];
        
        const totalLatencia = registros.reduce((acc, cur) => acc + Number(cur.latencia_ping_ms), 0);
        const mediaLatencia = (totalLatencia / registros.length).toFixed(1);

        const incidentesAtivos = registros.filter(r => Number(r.percentual_uso_ram) > 75 || Number(r.percentual_uso_cpu) > 80).length;
        const servidoresCriticos = Number(ultimoRegistro.percentual_uso_ram) > 75 ? 1 : 0;

        // O seu dashboard.html espera as propriedades exatamente nos nomes abaixo:
        // Ex: dados.ultimaAtualizacao, dados.disponibilidade, dados.maiorLatencia, dados.maisIncidentes...
        const dadosDashboard = {
            ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR"),
            disponibilidade: 100, 
            incidentesAtivos: incidentesAtivos,
            servidoresCriticos: servidoresCriticos,
            
            // Formatando arrays para bater perfeitamente com os loops (for) do seu dashboard.html
            maiorLatencia: [
                { nome: `Servidor (${ultimoRegistro.nome_usuario})`, valor: Number(ultimoRegistro.latencia_ping_ms), cor: "#449dd1" }
            ],
            maisIncidentes: [
                { nome: `Servidor (${ultimoRegistro.nome_usuario})`, valor: incidentesAtivos, cor: "#f0ad4e" }
            ],
            
            // Dados estruturados para popular o 'tabelaLinhas'
            linhas: [
                {
                    nome: `Linha (${ultimoRegistro.nome_usuario})`,
                    status: servidoresCriticos > 0 ? "Atenção" : "Operando",
                    servidores: 1,
                    incidentes: incidentesAtivos,
                    latencia: Number(ultimoRegistro.latencia_ping_ms)
                }
            ],
            
            // Estrutura mockada básica necessária para alimentar a função carregarGraficoETL()
            graficoSemana: [
                { dia: "Seg", valor: incidentesAtivos },
                { dia: "Ter", valor: Math.floor(incidentesAtivos * 0.5) },
                { dia: "Qua", valor: incidentesAtivos + 1 },
                { dia: "Qui", valor: 0 },
                { dia: "Sex", valor: incidentesAtivos }
            ]
        };

        console.log("DADOS ENVIADOS:");
        console.log(JSON.stringify(dadosDashboard, null, 2));
        return res.status(200).json(dadosDashboard);

        

    } catch (err) {
        console.error("Erro ao processar CSV do S3:", err);
        return res.status(500).json({ 
            erro: "Falha ao processar dados de telemetria", 
            detalhes: err.message 
        });
    }
}

module.exports = { obterDadosVisaoGeral };