var express = require("express");
var fs = require("fs");
var path = require("path");
var router = express.Router();

function carregarJsonLocal() {
    var caminho = process.env.LOCAL_PROCESSOS_JSON || path.join(__dirname, "../local/processos_rbc_mock.json");
    return JSON.parse(fs.readFileSync(caminho, "utf8"));
}

function listarRbcsLocais() {
    var dados = carregarJsonLocal();
    var lista = [];

    (dados.empresas || []).forEach(function (empresa) {
        (empresa.linhas || []).forEach(function (linha) {
            (linha.rbc || linha.rbcs || []).forEach(function (rbc) {
                lista.push({
                    idRbc: rbc.idRbc,
                    nomeServidor: rbc.nomeServidor || rbc.nome_rbc || rbc.nome || "Servidor RBC Local",
                    macAdress: rbc.macAdress || rbc.endereco_mac || rbc.macAddress || rbc.mac,
                    status_atual: rbc.status_atual || rbc.status || "ONLINE",
                    empresa: empresa.razaoSocial || empresa.nome_empresa || empresa.empresa,
                    idLinha: linha.idLinha,
                    numeroLinha: linha.numeroLinha || linha.nome_linha || linha.linha || "Local",
                    trecho: linha.trecho || "Trecho local",
                    corLinha: linha.corLinha || "#2364aa"
                });
            });
        });
    });

    return lista;
}

router.post("/usuarios/autenticar", function (req, res) {
    return res.status(200).json({
        id: 1,
        nome: "Usuário Local",
        email: req.body.emailServer || "local@teste.com",
        razaoSocial: "Empresa Local de Teste",
        tipoUsuario: "Gerente de operações",
        empresaId: 1
    });
});

router.get("/rbcs/listarRbcEmpresa/:idEmpresa", function (req, res) {
    return res.status(200).json(listarRbcsLocais());
});

router.get("/rbcs/listarRBC", function (req, res) {
    return res.status(200).json(listarRbcsLocais());
});

module.exports = router;
