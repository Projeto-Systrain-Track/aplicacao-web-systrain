var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrarEmpresa", function (req, res) {
    empresaController.cadastrarEmpresa(req, res);
});

router.get("/listar", function (req, res) {
  empresaController.listar(req, res);
});

router.get("/buscar", function (req, res) {
    empresaController.buscarPorCnpj(req, res);
});

router.get("/buscar/:id", function (req, res) {
  empresaController.buscarPorId(req, res);
});

router.get("/buscarPorToken/:token", function (req, res) {
  empresaController.buscarPorToken(req, res);
});

module.exports = router;