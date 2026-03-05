var express = require("express");
var router = express.Router();

var rbcController = require("../controllers/rbcControlle")

router.get("/listarRBC", function(req, res){
    rbcController.listarRbc(req, res)
})

router.post("/cadastrarRbc", function(req, res){
    rbcController.cadastrarRbc(req, res);
})

module.exports = router;
