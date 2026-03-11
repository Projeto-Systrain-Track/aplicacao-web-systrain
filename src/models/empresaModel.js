var database = require("../database/config");

function cadastrarEmpresa( razaoSocial, token, cnpj, email_empresa, telefone) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", razaoSocial, token, cnpj, email_empresa, telefone);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO empresa (razaoSocial, token, cnpj, email, telefone) VALUES 
        ('${razaoSocial}', '${token}', '${cnpj}', '${email_empresa}', '${telefone}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarEndereco(estado, cep, numero, endereco,complemento,  fk_end_empresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", estado, cep, numero, complemento, fk_end_empresa);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO endereco (estado, cep, numeroResidencial, rua, complemento, fk_end_empresa) VALUES 
        ('${estado}', '${cep}', '${numero}', '${endereco}', '${complemento}', '${fk_end_empresa}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(id) {
  var instrucaoSql = `SELECT * FROM empresa WHERE idEmpresa = '${id}'`;

  return database.executar(instrucaoSql);
}

function buscarPorToken(token) {
  var instrucaoSql = `SELECT * FROM empresa WHERE token = '${token}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT idEmpresa, razaoSocial, cnpj, token, email FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

module.exports = { cadastrarEndereco, cadastrarEmpresa, buscarPorCnpj, buscarPorId, listar, buscarPorToken };
