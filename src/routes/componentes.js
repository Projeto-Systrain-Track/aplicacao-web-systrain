var express = require("express");
var router = express.Router();

var componentesController = require("../controllers/componenteController")

router.get("/listarComponentes", function (req, res){
    componentesController.listarComponentes(req, res);
})

router.post("/cadastrarComponente", function (req, res){
    componentesController.cadastrarComponente(req, res);
})


module.exports = router;
