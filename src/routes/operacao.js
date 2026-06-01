var express = require("express");
var router = express.Router();

var operacaoController = require("../controllers/operacaoController")

router.post("/buscarArquivo", function (req, res) {
    operacaoController.buscarArquivo(req, res)
});

module.exports = router;