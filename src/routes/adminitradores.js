var express = require("express");
var router = express.Router();

var admController = require("../controllers/administradorController");

router.post("/autenticar", function (req, res) {
    admController.autenticar(req, res);
});

router.post("/enviarDuvida", function (req, res) {
    admController.enviarDuvida(req, res);
});

router.get("/listarDuvidas", function (req, res) {
    admController.listarDuvidas(req, res);
});

module.exports = router;