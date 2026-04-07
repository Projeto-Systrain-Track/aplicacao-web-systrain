var database = require('../database/config')

function listarRbc(){
    var instrucaoSql = `select rbc.*, empresa.razaoSocial as empresa, linha.* from rbc join empresa ON fkEmpresa = idEmpresa join linha on linha.idLinha = rbc.fkLinha order by idRbc;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function cadastrarRbc(modelo, versao, linhaResp, fkEmpresa) {
    console.log("ACESSEI O RBC MODEL")
    var instrucaoSql = `
        INSERT INTO rbc(modelo, versao, fkLinha, fkEmpresa) VALUES
            ('${modelo}','${versao}', '${linhaResp}', ${fkEmpresa});
        `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarRbc,
    cadastrarRbc
}