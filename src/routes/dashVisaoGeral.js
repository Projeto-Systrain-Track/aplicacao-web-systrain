var express = require("express");
var router = express.Router();
const controller = require("../controllers/controllerVisaoGeral");

router.get("/visaoGeral", controller.obterDadosVisaoGeral);

module.exports = router;