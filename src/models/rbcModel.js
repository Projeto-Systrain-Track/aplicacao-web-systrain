var database = require('../database/config')

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
    cadastrarRbc
}