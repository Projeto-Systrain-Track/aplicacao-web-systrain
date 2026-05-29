-- drop database if exists systraintrack;
create database systraintrack;
use systraintrack;


CREATE TABLE empresa (
    idEmpresa INT AUTO_INCREMENT,
    razaoSocial VARCHAR(100) UNIQUE,
    token CHAR(10) UNIQUE,
    dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    cnpj VARCHAR(40) UNIQUE,
    email VARCHAR(100),
    telefone VARCHAR(15) DEFAULT NULL,
    PRIMARY KEY (idEmpresa)
);

INSERT INTO empresa (razaoSocial, token, dataCadastro, cnpj, email, telefone) VALUES
('Via Paulista Mobilidade', 'VPMB1234A1', DEFAULT, '12345678000101', 'contato@viapaulista.com', '11987654321'),
('Ferrovia Bandeirante S.A.', 'FBSA5678B2', DEFAULT, '12345678000102', 'suporte@ferrobandeirante.com', '11987654322'),
('Rota Trilhos Tecnologia', 'RTTC9012C3', DEFAULT, '12345678000103', 'atendimento@rotatrilhos.com', '11987654323');


CREATE TABLE linha (
    idLinha INT AUTO_INCREMENT,
    nomeLinha VARCHAR(45),
    corLinha VARCHAR(45),
    numeroLinha VARCHAR(45),
    trecho VARCHAR(45),
    fkEmpresa INT,
    PRIMARY KEY (idLinha),
    CONSTRAINT fkEmpresaLinha FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa)
);

INSERT INTO linha(idLinha, nomeLinha, numeroLinha, corLinha, trecho, fkEmpresa) VALUES
(1, "DIAMANTE", 8,"#898989","Amador Bueno.", 1),
(2, "SAFIRA", 12, "#0F52BA", "Calmon Viana ", 1),
(3, "CORAL", 11, "#D75413", "Mogi das Cruzes", 2),
(4, "JADE",13, "#00A86B", "Aeroporto-Guarulhos", 2),
(5, "ESMERALDA",9, "#00674f", "Osasco", 3);


CREATE TABLE rbc (
    idRbc INT AUTO_INCREMENT,
    nomeServidor VARCHAR(45),
    macAdress VARCHAR(45) UNIQUE NOT NULL,
    fkLinha INT,
    PRIMARY KEY (idRbc),
    CONSTRAINT fkLinhaRbc FOREIGN KEY (fkLinha) REFERENCES linha (idLinha)
);

INSERT INTO rbc (idRbc, nomeServidor, macAdress, fkLinha) VALUES
(1,'SV-PRIM','ec:3f:b6:b9:ae:2f', 1),
(2,'SV-MHRT','ae:b1:7d:b6:3a:19', 2),
(3,'SV-JOKT','13:47:52:e1:8a:7f', 2),
(4,'RB_ALPH','60:c7:27:3e:4f:56', 3),
(5,'RB_BETA','06:71:a3:c2:10:07', 4),
(6,'RB_KAIO','08:00:27:3e:8d:d0', 5);


CREATE TABLE componente (
    idComponente INT AUTO_INCREMENT,
    nome VARCHAR(99),
    tipo VARCHAR(99),
    parametros VARCHAR(99),
    unidade VARCHAR(99) DEFAULT NULL,
    PRIMARY KEY (idComponente)
);

INSERT INTO componente (idComponente, nome, tipo, parametros, unidade) values
(1, "CPU_PER", "%", "uso de cpu", NULL),
(2, "CPU_MAX", "num", "maximo clock de cpu", "MHz"),
(3, "CPU_MIN", "num", "minimo clock de cpu", "MHz"),
(4, "CPUUSE", "num", "uso de clock", "MHz"),
(5, "RAM_PER", "%", "uso de ram", NULL),
(6, "RAM_MAX", "num", "maximo de memoria", "MB"),
(7, "RAM_USE", "num", "uso de ram", "MB"),
(8, "VOL_PER", "%", "uso de disco", NULL),
(9, "VOL_MAX", "num", "maximo de disco", "MB"),
(10, "VOL_USE", "num", "uso de disco", "MB"),
(11, "VOL_OUT", "com", "escrita de disco", "MB/s"),
(12, "VOL_INP", "com", "leitura de disco", "MB/s"),
(13, "WEB_NUM", "num", "latencia de rede", "ms"),
(14, "WEB_INP", "com", "download", "MB/s"),
(15, "WEB_OUT", "com", "upload", "MB/s"),
(16, "PRS_NUM", "num", "quantidade de processos", NULL),
(17, "PRS_STX", "txt", "sintaxe de prioridade", NULL),
(18, "PRS_RAM_PER", "%", "uso de ram", NULL),
(19, "PRS_RAM_USE", "num", "uso de memoria", "MB"),
(20, "PRS_CPU_PER", "%", "uso de cpu", NULL),
(21, "PRS_CPU_THR", "num", "quantidade de threads", NULL),
(22, 'SWP_PER', '%', 'uso de swap', NULL),
(23, 'SWP_MAX', 'num', 'maximo de swap', 'MB'),
(24, 'SWP_USE', 'num', 'uso de swap', 'MB'),
(25, 'SWP_FRE', 'num', 'swap livre', 'MB'),
(26, 'SWP_INP', 'com', 'entrada de swap', 'MB/s'),
(27, 'SWP_OUT', 'com', 'saida de swap', 'MB/s');


CREATE TABLE endereco (
    idEndereco INT AUTO_INCREMENT,
    estado VARCHAR(99),
    cep VARCHAR(9),
    numero VARCHAR(9),
    rua VARCHAR(99),
    complemento VARCHAR(99),
    fkEmpresa INT,
    PRIMARY KEY (idEndereco),
    CONSTRAINT fk_end_empresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

INSERT INTO endereco (estado, cep, numero, rua, complemento, fkEmpresa) VALUES
('SP', '01001-000', '120', 'Rua da Consolação', 'Bloco A', 1),
('SP', '02002-000', '245', 'Avenida Tiradentes', 'Sala 12', 2),
('SP', '03003-000', '89', 'Rua Vergueiro', 'Andar 3', 3);


CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(45) UNIQUE,
    senha VARCHAR(200),
    fkEmpresa INT,
    tipoUsuario VARCHAR(45),
    PRIMARY KEY (idUsuario),
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa)
);

INSERT INTO usuario (nome, email, senha, fkEmpresa, tipoUsuario) VALUES
('Thiago', 'thiago@viapaulista.com', '12345', 1, "Operador"),
('Brandão', 'brandao@viapaulista.com', '12345', 1, "Gerente de operacoes"),
('Marina Souza', 'marina.souza@viapaulista.com', '12345', 1, "Coordenador de incidentes"),
('Carlos Henrique', 'carlos.henrique@ferrobandeirante.com', '12345', 2, "Operador"),
('Fernanda Lima', 'fernanda.lima@ferrobandeirante.com', '12345', 2, "Gerente de operacoes"),
('Henrique Lima', 'henrique.lima@ferrobandeirante.com', '12345', 2, "Coordenador de incidentes"),
('Alvares Tino', 'alvares.tino@rotatrilhos.com', '12345', 3, "Operador"),
('Thiago Alves', 'thiago.alves@rotatrilhos.com', '12345', 3, "Gerente de operacoes"),
('Amanda Castro', 'amanda.castro@rotatrilhos.com', '12345', 3, "Coordenador de incidentes");


CREATE TABLE rbcComponente (
    fkRbc INT,
    fkComponente INT,
    definicao VARCHAR(99),
    PRIMARY KEY(fkRbc, fkComponente),
    CONSTRAINT fk_componente_rbc FOREIGN KEY (fkComponente) REFERENCES componente(idComponente),
    CONSTRAINT fk_rbc_componente FOREIGN KEY (fkRbc) REFERENCES rbc(idRbc)
);



INSERT INTO rbcComponente (fkRbc, fkComponente, definicao) VALUES

(1, 1, 'limite_alerta=85;limite_critico=95'),
(2, 1, 'limite_alerta=85;limite_critico=95'), 
(3, 1, 'limite_alerta=85;limite_critico=95'), 
(4, 1, 'limite_alerta=85;limite_critico=95'), 
(5, 1, 'limite_alerta=85;limite_critico=95'), 
(6, 1, 'limite_alerta=85;limite_critico=95'), 

(1, 2, 'limite_alerta=99999;limite_critico=999999'), 
(2, 2, 'limite_alerta=99999;limite_critico=999999'), 
(3, 2, 'limite_alerta=99999;limite_critico=999999'), 
(4, 2, 'limite_alerta=99999;limite_critico=999999'), 
(5, 2, 'limite_alerta=99999;limite_critico=999999'), 
(6, 2, 'limite_alerta=99999;limite_critico=999999'), 

(1, 3, 'limite_alerta=600;limite_critico=200'), 
(2, 3, 'limite_alerta=600;limite_critico=200'), 
(3, 3, 'limite_alerta=600;limite_critico=200'), 
(4, 3, 'limite_alerta=600;limite_critico=200'), 
(5, 3, 'limite_alerta=600;limite_critico=200'), 
(6, 3, 'limite_alerta=600;limite_critico=200'), 

(1, 4, 'limite_alerta=2500;limite_critico=3000'), 
(2, 4, 'limite_alerta=2500;limite_critico=3000'), 
(3, 4, 'limite_alerta=2500;limite_critico=3000'), 
(4, 4, 'limite_alerta=2500;limite_critico=3000'), 
(5, 4, 'limite_alerta=2500;limite_critico=3000'), 
(6, 4, 'limite_alerta=2500;limite_critico=3000'), 

(1, 5, 'limite_alerta=80;limite_critico=90'), 
(2, 5, 'limite_alerta=80;limite_critico=90'), 
(3, 5, 'limite_alerta=80;limite_critico=90'), 
(4, 5, 'limite_alerta=80;limite_critico=90'), 
(5, 5, 'limite_alerta=80;limite_critico=90'), 
(6, 5, 'limite_alerta=80;limite_critico=90'), 

(1, 6, 'limite_alerta=99999;limite_critico=99999'), 
(2, 6, 'limite_alerta=99999;limite_critico=99999'), 
(3, 6, 'limite_alerta=99999;limite_critico=99999'), 
(4, 6, 'limite_alerta=99999;limite_critico=99999'), 
(5, 6, 'limite_alerta=99999;limite_critico=99999'), 
(6, 6, 'limite_alerta=99999;limite_critico=99999'), 

(1, 7, 'limite_alerta=6000;limite_critico=7000'), 
(2, 7, 'limite_alerta=6000;limite_critico=7000'), 
(3, 7, 'limite_alerta=6000;limite_critico=7000'), 
(4, 7, 'limite_alerta=6000;limite_critico=7000'), 
(5, 7, 'limite_alerta=6000;limite_critico=7000'), 
(6, 7, 'limite_alerta=6000;limite_critico=7000'), 

(1, 8, 'limite_alerta=80;limite_critico=90'), 
(2, 8, 'limite_alerta=80;limite_critico=90'), 
(3, 8, 'limite_alerta=80;limite_critico=90'), 
(4, 8, 'limite_alerta=80;limite_critico=90'), 
(5, 8, 'limite_alerta=80;limite_critico=90'), 
(6, 8, 'limite_alerta=80;limite_critico=90'), 

(1, 9, 'limite_alerta=9999999;limite_critico=9999999'), 
(2, 9, 'limite_alerta=9999999;limite_critico=9999999'), 
(3, 9, 'limite_alerta=9999999;limite_critico=9999999'), 
(4, 9, 'limite_alerta=9999999;limite_critico=9999999'), 
(5, 9, 'limite_alerta=9999999;limite_critico=9999999'), 
(6, 9, 'limite_alerta=9999999;limite_critico=9999999'), 

(1, 10, 'limite_alerta=350000;limite_critico=400000'), 
(2, 10, 'limite_alerta=350000;limite_critico=400000'), 
(3, 10, 'limite_alerta=350000;limite_critico=400000'), 
(4, 10, 'limite_alerta=350000;limite_critico=400000'), 
(5, 10, 'limite_alerta=350000;limite_critico=400000'), 
(6, 10, 'limite_alerta=350000;limite_critico=400000'), 

(1, 11, 'limite_alerta=50;limite_critico=100'), 
(2, 11, 'limite_alerta=50;limite_critico=100'), 
(3, 11, 'limite_alerta=50;limite_critico=100'), 
(4, 11, 'limite_alerta=50;limite_critico=100'), 
(5, 11, 'limite_alerta=50;limite_critico=100'), 
(6, 11, 'limite_alerta=50;limite_critico=100'), 

(1, 12, 'limite_alerta=50;limite_critico=100'), 
(2, 12, 'limite_alerta=50;limite_critico=100'), 
(3, 12, 'limite_alerta=50;limite_critico=100'), 
(4, 12, 'limite_alerta=50;limite_critico=100'), 
(5, 12, 'limite_alerta=50;limite_critico=100'), 
(6, 12, 'limite_alerta=50;limite_critico=100'), 

(1, 13, 'limite_alerta=120;limite_critico=250'), 
(2, 13, 'limite_alerta=120;limite_critico=250'), 
(3, 13, 'limite_alerta=120;limite_critico=250'), 
(4, 13, 'limite_alerta=120;limite_critico=250'), 
(5, 13, 'limite_alerta=120;limite_critico=250'), 
(6, 13, 'limite_alerta=120;limite_critico=250'), 

(1, 14, 'limite_alerta=10;limite_critico=20'), 
(2, 14, 'limite_alerta=10;limite_critico=20'), 
(3, 14, 'limite_alerta=10;limite_critico=20'), 
(4, 14, 'limite_alerta=10;limite_critico=20'), 
(5, 14, 'limite_alerta=10;limite_critico=20'), 
(6, 14, 'limite_alerta=10;limite_critico=20'), 

(1, 15, 'limite_alerta=10;limite_critico=20'), 
(2, 15, 'limite_alerta=10;limite_critico=20'), 
(3, 15, 'limite_alerta=10;limite_critico=20'), 
(4, 15, 'limite_alerta=10;limite_critico=20'), 
(5, 15, 'limite_alerta=10;limite_critico=20'), 
(6, 15, 'limite_alerta=10;limite_critico=20'), 

(1, 16, 'limite_alerta=250;limite_critico=350'), 
(2, 16, 'limite_alerta=250;limite_critico=350'), 
(3, 16, 'limite_alerta=250;limite_critico=350'), 
(4, 16, 'limite_alerta=250;limite_critico=350'), 
(5, 16, 'limite_alerta=250;limite_critico=350'), 
(6, 16, 'limite_alerta=250;limite_critico=350'), 

(1, 17, 'RBC_'), 
(2, 17, 'RBC_'), 
(3, 17, 'RBC_'), 
(4, 17, 'RBC_'), 
(5, 17, 'RBC_'), 
(6, 17, 'RBC_'), 

(1, 18, 'limite_alerta=10;limite_critico=20'), 
(2, 18, 'limite_alerta=10;limite_critico=20'), 
(3, 18, 'limite_alerta=10;limite_critico=20'), 
(4, 18, 'limite_alerta=10;limite_critico=20'), 
(5, 18, 'limite_alerta=10;limite_critico=20'), 
(6, 18, 'limite_alerta=10;limite_critico=20'), 

(1, 19, 'limite_alerta=200;limite_critico=500'), 
(2, 19, 'limite_alerta=200;limite_critico=500'), 
(3, 19, 'limite_alerta=200;limite_critico=500'), 
(4, 19, 'limite_alerta=200;limite_critico=500'), 
(5, 19, 'limite_alerta=200;limite_critico=500'), 
(6, 19, 'limite_alerta=200;limite_critico=500'), 

(1, 20, 'limite_alerta=15;limite_critico=30'), 
(2, 20, 'limite_alerta=15;limite_critico=30'), 
(3, 20, 'limite_alerta=15;limite_critico=30'), 
(4, 20, 'limite_alerta=15;limite_critico=30'), 
(5, 20, 'limite_alerta=15;limite_critico=30'), 
(6, 20, 'limite_alerta=15;limite_critico=30'), 

(1, 21, 'limite_alerta=75;limite_critico=120'), 
(2, 21, 'limite_alerta=75;limite_critico=120'), 
(3, 21, 'limite_alerta=75;limite_critico=120'), 
(4, 21, 'limite_alerta=75;limite_critico=120'), 
(5, 21, 'limite_alerta=75;limite_critico=120'), 
(6, 21, 'limite_alerta=75;limite_critico=120'), 

(1, 22, 'limite_alerta=50;limite_critico=80'), 
(2, 22, 'limite_alerta=50;limite_critico=80'), 
(3, 22, 'limite_alerta=50;limite_critico=80'), 
(4, 22, 'limite_alerta=50;limite_critico=80'), 
(5, 22, 'limite_alerta=50;limite_critico=80'), 
(6, 22, 'limite_alerta=50;limite_critico=80'), 

(1, 23, 'limite_alerta=9999999;limite_critico=9999999'), 
(2, 23, 'limite_alerta=9999999;limite_critico=9999999'), 
(3, 23, 'limite_alerta=9999999;limite_critico=9999999'), 
(4, 23, 'limite_alerta=9999999;limite_critico=9999999'), 
(5, 23, 'limite_alerta=9999999;limite_critico=9999999'), 
(6, 23, 'limite_alerta=9999999;limite_critico=9999999'), 

(1, 24, 'limite_alerta=500;limite_critico=1000'), 
(2, 24, 'limite_alerta=500;limite_critico=1000'), 
(3, 24, 'limite_alerta=500;limite_critico=1000'), 
(4, 24, 'limite_alerta=500;limite_critico=1000'), 
(5, 24, 'limite_alerta=500;limite_critico=1000'), 
(6, 24, 'limite_alerta=500;limite_critico=1000'), 

(1, 25, 'limite_alerta=500;limite_critico=200'), 
(2, 25, 'limite_alerta=500;limite_critico=200'), 
(3, 25, 'limite_alerta=500;limite_critico=200'), 
(4, 25, 'limite_alerta=500;limite_critico=200'), 
(5, 25, 'limite_alerta=500;limite_critico=200'), 
(6, 25, 'limite_alerta=500;limite_critico=200'), 

(1, 26, 'limite_alerta=5;limite_critico=10'), 
(2, 26, 'limite_alerta=5;limite_critico=10'), 
(3, 26, 'limite_alerta=5;limite_critico=10'), 
(4, 26, 'limite_alerta=5;limite_critico=10'), 
(5, 26, 'limite_alerta=5;limite_critico=10'), 
(6, 26, 'limite_alerta=5;limite_critico=10'), 

(1, 27, 'limite_alerta=5;limite_critico=10'), 
(2, 27, 'limite_alerta=5;limite_critico=10'), 
(3, 27, 'limite_alerta=5;limite_critico=10'), 
(4, 27, 'limite_alerta=5;limite_critico=10'), 
(5, 27, 'limite_alerta=5;limite_critico=10'), 
(6, 27, 'limite_alerta=5;limite_critico=10'); 





CREATE TABLE administrador (
    idAdministrador INT AUTO_INCREMENT,
    nome VARCHAR(45),
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(45),
    nivel INT,
    PRIMARY KEY (idAdministrador)
);

INSERT INTO administrador(nome, email, senha, nivel) VALUES
('Geraldo', 'geraldo@systrain', 'systrain_adm', 3);


CREATE TABLE faleConosco (
    idMensagem INT AUTO_INCREMENT,
    mensagem VARCHAR(400),
    emailContato VARCHAR(100),
    PRIMARY KEY (idMensagem)
);


CREATE TABLE eventoOperacional (
    idEvento INT AUTO_INCREMENT,
    titulo VARCHAR(45),
    descricao VARCHAR(45),
    classificacao VARCHAR(45),
    PRIMARY KEY (idEvento)
);
