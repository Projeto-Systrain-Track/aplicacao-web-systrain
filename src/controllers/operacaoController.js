const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});
async function buscarArquivo(req, res) {
    var id_empresa = req.body.idEmpresaServer
    var nome_empresa = req.body.nomeEmpresaServer
    console.log("id_empresa: " + id_empresa)
    if (id_empresa == null || nome_empresa == null) {
        return res.status(400).json({"mensagem": "O id_empresa está nulo"})
    } 
    try {
        var nome_empresa_formatado = nome_empresa.trim().replaceAll(" ", "_").toLowerCase()
        // 2. Definir parâmetros da busca
        var parametros = {
            Bucket: process.env.AWS_BUCKET,
            Key: `client/${nome_empresa_formatado}/dashboard_operacao.json`
        };
        // 3. Enviar o comando para o S3
        const comando = new GetObjectCommand(parametros);
        const resposta = await s3.send(comando);
        var conteudo = await resposta.Body.transformToString("utf-8");
        conteudo = JSON.parse(conteudo) 
        console.log("Chaves do JSON:", Object.keys(conteudo));
        console.log("Conteudo da empresa:", conteudo);
        return res.status(200).json(conteudo);
    } catch (erro) {
        console.error("Erro ao buscar arquivo no S3:", erro);
        return res.status(500).json({
            mensagem: "Erro ao buscar arquivo no S3",
            erro: erro.message
        });
    }
}

module.exports = {
    buscarArquivo
};