
console.log("DASH VISAO GERAL CARREGADO");

var express = require("express");
var router = express.Router();
const controller = require("../controllers/controllerVisaoGeral");

router.get("/:idEmpresa", controller.obterDadosVisaoGeral);

module.exports = router;
