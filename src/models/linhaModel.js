var database = require("../database/config");

function cadastrar(nome, numero, cor, empresa) {
    var instrucaoSql = `
        INSERT INTO linha (nomeLinha, corLinha, numeroLinha, fkEmpresa) VALUES 
        ('${nome}', '${cor}', '${numero}', '${empresa}');
    `;
    return database.executar(instrucaoSql);
}
function listar() {
    var instrucaoSql = `
    SELECT linha.*, empresa.razaoSocial as nomeEmpresa FROM linha JOIN empresa ON empresa.idEmpresa = linha.fkEmpresa;

    `;
    return database.executar(instrucaoSql);
}
module.exports = {
    cadastrar,
    listar
}