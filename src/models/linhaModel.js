var database = require("../database/config");

function cadastrar(nome, numero, cor, empresa, trecho) {
    console.log("ENTREI NO MODEL", nome, numero, cor, empresa, trecho);
    
    var instrucaoSql = `
        INSERT INTO linha (nomeLinha, corLinha, numeroLinha, fkEmpresa, trecho) VALUES 
        ('${nome}', '${cor}', '${numero}', ${empresa}, '${trecho}');
    `;
    return database.executar(instrucaoSql);
}
function listar() {
    var instrucaoSql = `
    SELECT linha.*, empresa.razaoSocial as nomeEmpresa FROM linha JOIN empresa ON empresa.idEmpresa = linha.fkEmpresa;

    `;
    return database.executar(instrucaoSql);
}
function listarLinhasEmpresa(idEmpresa) {
    var instrucaoSql = `
        SELECT linha.*, empresa.razaoSocial as nomeEmpresa 
            FROM linha JOIN empresa 
            ON empresa.idEmpresa = linha.fkEmpresa
            WHERE empresa.idEmpresa = ${idEmpresa};
    `;
    return database.executar(instrucaoSql);
}
module.exports = {
    cadastrar,
    listar,
    listarLinhasEmpresa
}