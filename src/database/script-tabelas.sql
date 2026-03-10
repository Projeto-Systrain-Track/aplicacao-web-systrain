-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE SysTrainTrack;
USE SysTrainTrack;


CREATE TABLE empresa(
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
razaoSocial VARCHAR(100) NOT NULL,
token CHAR(10) NOT NULL UNIQUE,
dataCadastro DATETIME DEFAULT current_timestamp,
cnpj VARCHAR(40) NOT NULL UNIQUE,
email VARCHAR(100) NOT NULL UNIQUE,
telefone VARCHAR(15) UNIQUE
);

CREATE TABLE usuario (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45) NOT NULL,
email VARCHAR(45) NOT NULL UNIQUE,
senha VARCHAR(200) NOT NULL,
fk_empresa INT NOT NULL,
FOREIGN KEY (fk_empresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE endereco(
idEndereco INT PRIMARY KEY AUTO_INCREMENT,
estado VARCHAR(45) NOT NULL,
cep VARCHAR(9) NOT NULL,
numeroResidencial CHAR(9),
rua VARCHAR(45),
complemento VARCHAR(45),
fk_end_empresa INT NOT NULL,
CONSTRAINT fk_empresa_endereco FOREIGN KEY (fk_end_empresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE rbc(
idRbc INT PRIMARY KEY AUTO_INCREMENT,
modelo VARCHAR(45),
versao VARCHAR(45),
linhaResp VARCHAR(45),
fkEmpresa INT,
FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE componente(
idComponente INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45),
tipo VARCHAR(45),
unidadeMedida FLOAT,
parametros INT
);

CREATE TABLE administrador(
idAdministrador INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45) NOT NULL,
email VARCHAR(50) UNIQUE NOT NULL,
senha VARCHAR(45),
nivel INT 
);

CREATE TABLE faleConosco(
idMensagem INT PRIMARY KEY AUTO_INCREMENT,
mensagem VARCHAR(400) NOT NULL,
emailContato VARCHAR(100) NOT NULL
);


insert into empresa values	
	(DEFAULT, 'teste', '1234567891', DEFAULT, '123456789123', 'luiz@gmail', '119876523');

insert into usuario(nome, email, senha, fk_empresa) values	
	('Brandão', 'brandao@systrain', '12345', 1);

insert into administrador(nome, email, senha, nivel) values
	('Geraldo', 'geraldo@systrain', 'systrain_adm', 3);



SELECT * FROM empresa WHERE idEmpresa = 1; 
select * from empresa;
select * from endereco;
select * from usuario;
select * from rbc;
select * from componente;
select * from administrador;
select * from faleConosco;
