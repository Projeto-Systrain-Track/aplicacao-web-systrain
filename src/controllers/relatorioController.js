var { spawn } = require("child_process");
const path = require("path");



function gerarRelatorioLinha(req, res) {
    console.log("Entrou na rota /relatorio/gerar");
    console.log("Body recebido:", req.body);
    
    var idEmpresa = req.body.idEmpresaServer
    var nomeEmpresa = req.body.nomeEmpresaServer
    var idLinha = req.body.idLinhaServer
    var nomeLinha = req.body.nomeLinhaServer
    var emailUsuario = req.body.emailUsuarioServer

    console.log(idEmpresa, nomeEmpresa, idLinha, nomeLinha, emailUsuario);

    if (idEmpresa == null || nomeEmpresa == null || idLinha == null || nomeLinha == null || emailUsuario == null) {
        return res.status(400).json({ mensagem: "Campo nulo!" })
    }
    var caminho = path.join(__dirname, "..", "java", `relatorio_linha_${idEmpresa}.pdf`)
    var caminho_exe = path.join(__dirname, "..", "java", "gerar_relatorio.jar")
    var caminho_env = path.join(__dirname, "..", "..")

    console.log("Caminho: " + caminho);
    console.log("Caminho exe: " + caminho_exe);
    console.log("Caminho env: " + caminho_env);

    var geracao = spawn('java', ['-jar', caminho_exe, `${idEmpresa}`, `${nomeEmpresa}`, `${idLinha}`, `Linha ${nomeLinha}`, `${emailUsuario}`, `${caminho}`, `${caminho_env}`]);
    geracao.stdout.on('data', (data) => {
        console.log('Java:', data.toString())
    })

    geracao.stderr.on('data', (data) => {
        console.error('Java erro:', data.toString())
    })

    geracao.on('close', (codigo) => {
        if (codigo === 0) {
            return res.download(caminho)
        } else {
            return res.status(500).json({ mensagem: "Erro ao gerar relatório" })
        }
    })
}

module.exports = {
    gerarRelatorioLinha
}