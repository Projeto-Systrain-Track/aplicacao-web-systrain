var express = require("express");
var router = express.Router();

var rbcController = require("../controllers/rbcController")

router.get("/listarRBC", function(req, res){
    rbcController.listarRbc(req, res)
})

router.post("/cadastrarRbc", function(req, res){
    rbcController.cadastrarRbc(req, res);
})

module.exports = router;
