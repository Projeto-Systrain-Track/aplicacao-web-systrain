var database = require('../database/config')

function listarRbc(){
    var instrucaoSql = `select idRbc, modelo, versao, linhaResp as linha, razaoSocial as empresa from rbc join empresa ON fkEmpresa = idEmpresa order by idRbc;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function cadastrarRbc(modelo, versao, linhaResp, fkEmpresa) {
    console.log("ACESSEI O RBC MODEL")
    var instrucaoSql = `
        INSERT INTO rbc(modelo, versao, linhaResp, fkEmpresa) VALUES
            ('${modelo}','${versao}', '${linhaResp}', ${fkEmpresa});
        `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarRbc,
    cadastrarRbc
}