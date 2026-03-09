var express = require("express");
var router = express.Router();

var admController = require("../controllers/administradorController");

router.post("/autenticar", function (req, res) {
    admController.autenticar(req, res);
});

module.exports = router