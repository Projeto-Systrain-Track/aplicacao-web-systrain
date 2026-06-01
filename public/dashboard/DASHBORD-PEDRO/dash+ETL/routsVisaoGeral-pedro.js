var express = require("express");
var router = express.Router();
const controller = require("./controllerVisaoGeral-pedro");

router.get("/visaoGeral", controller.obterDadosVisaoGeral);

module.exports = router;