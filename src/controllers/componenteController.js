var componentesModel = require("../models/componenteModel")

function cadastrarComponente(req, res) {
    var nome = req.body.nomeServer;
    var tipo = req.body.tipoServer;
    var unidadeMedida = req.body.unidadeMedidaServer;
    var parametro = req.body.parametroServer;
    if (nome == undefined) {
        res.status(400).send("Nome do componente está undefined!");
    } else if (tipo == undefined) {
        res.status(400).send("tipo do componente está undefined!");
    } else if (unidadeMedida == undefined) {
        res.status(400).send("Unidade de Medida do componente está undefined!");
    } else if (parametro == undefined) {
        res.status(400).send("Parametro do componente está undefined!");
    } else {
        componentesModel.cadastrarComponente(nome, tipo, unidadeMedida, parametro)
            .then(
                function (resultado) {
                    res.json(resultado);
                    console.log(fkEmpresa)
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function listarComponentes(req, res) {
    componentesModel.listarComponentes().then((resposta) => {
        res.status(200).json(resposta)
    })
}

module.exports = {
    cadastrarComponente,
    listarComponentes
}