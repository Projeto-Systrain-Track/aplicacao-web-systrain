var database = require('../database/config')

function listarRbc(){
    var instrucaoSql = `select rbc.*, empresa.razaoSocial as empresa, linha.* from rbc join linha ON rbc.fkLinha = linha.idLinha join empresa on linha.fkEmpresa = empresa.idEmpresa order by idRbc;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}
function listarRbcEmpresa(idEmpresa){
    var instrucaoSql = `            SELECT
				e.razaoSocial as empresa,
				l.*,
                r.*
            FROM rbc r
            JOIN linha l
                ON r.fkLinha = l.idLinha
            JOIN empresa e 
                ON e.idEmpresa = l.fkEmpresa
            WHERE e.idEmpresa = ${idEmpresa} 
            order    by idRbc;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function cadastrarRbc(nome_servidor, mac_address, linha_responsavel, empresa_responsavel) {
    console.log("ACESSEI O RBC MODEL")
    var instrucaoSql = `
        INSERT INTO rbc(nomeServidor, macAdress, fkLinha, fkEmpresa) VALUES
            ('${nome_servidor}', '${mac_address}', '${linha_responsavel}', ${empresa_responsavel});
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
    cadastrarRbcComponente,
    listarRbcEmpresa
}