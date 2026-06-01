var express = require("express");
var router = express.Router();
var jiraService = require("../../services/jiraService"); 


router.get("/dashboard", async function (req, res) {
    var fkEmpresa = req.query.fkEmpresa;

    try {
        //jiraService passando a empresa
        var dados = await jiraService.filtrarDashboard(fkEmpresa);
        res.json(dados); 
    } catch (erro) {
        console.error("Erro ao buscar dados do Jira:", erro);
        res.status(500).json({ erro: "Erro interno no servidor do Jira" });
    }
});

module.exports = router;