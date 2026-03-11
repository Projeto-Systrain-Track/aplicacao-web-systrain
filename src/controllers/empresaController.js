var empresaModel = require("../models/empresaModel");

function cadastrarEmpresa(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var razaoSocial = req.body.razaoSocialServer;
    var token = req.body.tokenServer;
    var cnpj = req.body.cnpjServer;
    var email_empresa = req.body.email_empresaServer;
    var telefone = req.body.telefoneServer;
    var estado = req.body.estadoServer;
    var cep = req.body.cepServer;
    var numero = req.body.numeroServer;
    var endereco = req.body.enderecoServer;
    var complemento = req.body.complementoServer;


    // Faça as validações dos valores
    if (razaoSocial == undefined) {
        res.status(400).send("Razao social está undefined!");
    } else if (token == undefined) {
        res.status(400).send("token está undefined!");
    } else if (cnpj == undefined) {
        res.status(400).send("cnpj está undefined!");
    } else if (email_empresa == undefined) {
        res.status(400).send("email está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("telefone está undefined!");
    } else if (estado == undefined) {
        res.status(400).send("estado está undefined!");
    } else if (cep == undefined) {
        res.status(400).send("cep está undefined!");
    } else if(endereco == undefined){
        res.status(400).send("Endereco está undefined!");
    } else if (numero == undefined) {
        res.status(400).send("numero está undefined!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        empresaModel.cadastrarEmpresa(razaoSocial, token, cnpj, email_empresa, telefone)
            .then(
                function (resultado) {
                    res.json(resultado);
                    var fk_end_empresa = resultado.insertId;
                    empresaModel.cadastrarEndereco(estado, cep, numero, endereco, complemento, fk_end_empresa)
                    .then(
                        function () {
                            res.status(201).json({
                                message: 'Cadastro de serviços ok!',
                                empresaId: fk_end_empresa
                            })
                        }
                    )
                    .catch(function (erroServicos) {
                        res.status(500).json(erroServicos.sqlMessage);
                    })
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

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorToken(req, res) {
  var token = req.params.token;
  empresaModel.buscarPorToken(token).then((resultado) => {
    res.status(200).json(resultado);
  });
}



module.exports = {
  cadastrarEmpresa,
  buscarPorCnpj,
  buscarPorId,
  buscarPorToken,
  listar,
};