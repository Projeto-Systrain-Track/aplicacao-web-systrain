var rbcModel = require("../models/rbcModel");

function cadastrarRbc(req, res){

    var modelo = req.body.modeloServer
    var versao = req.body.versaoServer
    var linhaResp = req.body.linhaRespServer
    var fkEmpresa = req.body.fkEmpresaServer

    if(modelo == undefined){
        res.status(400).send("Modelo do RBC está undefined!")
    }else if(versao == undefined){
        res.status(400).send("versão do RBC está undefined!")
    }else if(linhaResp == undefined){
        res.status(400).send("Linha do RBC está undefined!")
    }else if(fkEmpresa == undefined){
        res.status(400).send("fkEmpresa do RBC está undefined!")
    }else{
        console.log(modelo, versao, linhaResp, fkEmpresa)
        rbcModel.cadastrarRbc(modelo, versao, linhaResp, fkEmpresa)
            .then(
                function(resultado){
                    res.json(resultado);
                    console.log("RBC cadastrado")
                }
            ).catch(
                function(erro){
                    console.log(erro)
                    console.log(
                        "\n44Houve um erro ao realizar o cadastro do RBC! Erro:"+
                        erro.sqlMessage
                    )
                    res.status(500).json(erro.sqlMessage);
                }
            )
    }
}

module.exports = {
    cadastrarRbc
}