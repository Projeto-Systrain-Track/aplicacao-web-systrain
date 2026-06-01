var express = require("express");
var router = express.Router();

var relatorioController = require("../controllers/relatorioController");


router.post("/gerar", function(req, res){
    relatorioController.gerarRelatorioLinha(req, res)
})



module.exports = router;