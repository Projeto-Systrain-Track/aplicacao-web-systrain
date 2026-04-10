var database = require('../database/config')

function listarRbc(){
    var instrucaoSql = `select rbc.*, empresa.razaoSocial as empresa, linha.* from rbc join empresa ON fkEmpresa = idEmpresa join linha on linha.idLinha = rbc.fkLinha order by idRbc;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function cadastrarRbc(nome_servidor, linha_responsavel, empresa_responsavel) {
    console.log("ACESSEI O RBC MODEL")
    var instrucaoSql = `
        INSERT INTO rbc(nome_servidor, fkLinha, fkEmpresa) VALUES
            ('${nome_servidor}', '${linha_responsavel}', ${empresa_responsavel});
        `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function cadastrarRbcComponente(idServidor, idEmpresa, idComponente, limite) {
    console.log("ACESSEI O RBC MODEL")
    var instrucaoSql = `
        INSERT INTO rbcComponente(fkRbc, fkEmpresa, fkCompRbc, limite) VALUES
            (${idServidor}, ${idEmpresa}, ${idComponente}, ${limite});
        `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarRbc,
    cadastrarRbc,
    cadastrarRbcComponente
}