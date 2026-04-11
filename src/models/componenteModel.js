var database = require("../database/config")

function cadastrarComponente(nome, tipo, unidadeMedida, parametro){
    console.log("ACESSEI COMPONENTES MODEL")

    var instrucaoSql = `
        insert into componente (nome, tipo, unidadeMedida, parametros)
	        values ("${nome}", "${tipo}", ${unidadeMedida}, ${parametro});
    `
    console.log(`Execultando a instrução SQL: \n\n\t\t ${instrucaoSql}`)
    return database.executar(instrucaoSql)
}

function listarComponentes(){
    var instrucaoSql = `select * from componente`
    return database.executar(instrucaoSql)
}


module.exports = {
    cadastrarComponente,
    listarComponentes,
    
}