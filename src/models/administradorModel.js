var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O ADM MODEL");
    var instrucaoSql = `
        SELECT idAdministrador, nome, email, nivel
        FROM administrador
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function enviarDuvida(mensagem, emailContato) {
    console.log("ACESSEI O ADM MODEL - enviarDuvida");
    var instrucaoSql = `
        INSERT INTO faleConosco (mensagem, emailContato)
        VALUES ('${mensagem}', '${emailContato}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarDuvidas() {
    console.log("ACESSEI O ADM MODEL - listarDuvidas");
    var instrucaoSql = `
        SELECT idMensagem, mensagem, emailContato
        FROM faleConosco
        ORDER BY idMensagem DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    enviarDuvida,
    listarDuvidas
};