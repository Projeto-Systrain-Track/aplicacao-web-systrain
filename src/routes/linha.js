var express = require("express");
var router = express.Router();

var linhaController = require("../controllers/linhaController")

router.post("/cadastrar", function(req, res){
    linhaController.cadastrar(req, res)
})
router.get("/listar", function(req, res){
    linhaController.listar(req, res)
})
router.get("/listarLinhasEmpresa/:idEmpresa", function(req, res){
    linhaController.listarLinhasEmpresa(req, res)
})


module.exports = router;
