var express = require("express");
var router = express.Router();

// Importação clássica
var servidoresDetalhesController = require("../controllers/servidoresDetalhesController");

router.post("/buscarLeitura", function(req, res) {
    servidoresDetalhesController.readS3Json(req, res);
});

module.exports = router;
