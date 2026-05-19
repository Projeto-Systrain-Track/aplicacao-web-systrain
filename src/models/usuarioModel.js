var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT usuario.idUsuario, usuario.nome, usuario.email, usuario.tipoUsuario, empresa.razaoSocial, usuario.fkEmpresa as empresaId FROM usuario JOIN empresa ON empresa.idEmpresa = usuario.fkEmpresa WHERE usuario.email = '${email}' AND usuario.senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, fkEmpresa, tipoUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, fkEmpresa);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fkEmpresa, tipoUsuario) VALUES ('${nome}', '${email}', '${senha}', '${fkEmpresa}', '${tipoUsuario}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarUsuarios(){
    var instucaoSql = `select idUsuario, nome, usuario.email, tipoUsuario, razaoSocial as empresa from usuario join empresa on fkEmpresa = idEmpresa order by idUsuario;` 

    return database.executar(instucaoSql)
}
function listarUsuariosEmpresa(fkEmpresa){
    var instucaoSql = `select idUsuario, nome, usuario.email, tipoUsuario, razaoSocial as empresa from usuario join empresa on fkEmpresa = idEmpresa where ${fkEmpresa} = empresa.idEmpresa order by idUsuario;` 

    return database.executar(instucaoSql)
}

module.exports = {
    autenticar,
    cadastrar,
    listarUsuarios,
    listarUsuariosEmpresa
};