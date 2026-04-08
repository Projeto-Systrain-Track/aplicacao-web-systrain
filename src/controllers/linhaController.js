
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
        console.log("Nome: ", nome,  "Numero: ", numero,"Cor: ",  cor,"Empresa: ", empresa, "Trecho: ", trecho);
    
        var requisicaoBd = await linhaModel.cadastrar(nome, numero, cor, empresa, trecho)
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
    console.log("requisicaoBd.length", requisicaoBd.length );
    if (requisicaoBd.length > 0) {
        return res.status(200).json({ listaLinhas: requisicaoBd });
    } else {
        return res.status(400).json({ mensagem: "Não foi possível listar as linhas" });
    }
}
async function listarLinhasEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa
    if (idEmpresa == undefined) {
        return res.status(400).json({mensagem: "O seu idEmpresa está undefined"})
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
    } else {
        return res.status(400).json({ mensagem: "Não foi possível listar as linhas" });
    }
}



module.exports = {
    cadastrar,
    listar,
    listarLinhasEmpresa
}