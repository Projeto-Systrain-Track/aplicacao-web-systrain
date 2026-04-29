drop database systraintrack;
create database systraintrack;
use systraintrack;
CREATE TABLE IF NOT EXISTS empresa (
  idEmpresa INT NOT NULL AUTO_INCREMENT,
  razaoSocial VARCHAR(100) UNIQUE NOT NULL,
  token CHAR(10) UNIQUE NOT NULL,
  dataCadastro DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  cnpj VARCHAR(40) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefone VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (idEmpresa));

CREATE TABLE IF NOT EXISTS linha (
  idLinha INT NOT NULL AUTO_INCREMENT,
  nomeLinha VARCHAR(45) NULL,
  corLinha VARCHAR(45) NULL,
  numeroLinha VARCHAR(45) NULL,
  trecho VARCHAR(45) NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idLinha),
  CONSTRAINT fkEmpresa
    FOREIGN KEY (fkEmpresa)
    REFERENCES empresa (idEmpresa));

CREATE TABLE IF NOT EXISTS rbc (
  idRbc INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nomeServidor VARCHAR(45) NULL DEFAULT NULL,
  macAdress VARCHAR(45) NULL DEFAULT NULL,
  fkLinha INT NULL DEFAULT NULL,
  CONSTRAINT fkLinha
    FOREIGN KEY (fkLinha)
    REFERENCES linha (idLinha)
);
    
CREATE TABLE IF NOT EXISTS eventoOperacional (
  idEventoOperacional INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(45) NULL,
  descricao VARCHAR(45) NULL,
  classificacao VARCHAR(45) NULL,
  PRIMARY KEY (idEventoOperacional));

CREATE TABLE IF NOT EXISTS administrador (
  idAdministrador INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(45) NULL DEFAULT NULL,
  nivel INT NULL DEFAULT NULL,
  PRIMARY KEY (idAdministrador)
);
  
CREATE TABLE IF NOT EXISTS componente (
  idComponente INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NULL DEFAULT NULL,
  tipo VARCHAR(45) NULL DEFAULT NULL,
  unidadeMedida VARCHAR(45) NULL DEFAULT NULL,
  campoWeb VARCHAR(45) NULL,
  parametros VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (idComponente));

CREATE TABLE IF NOT EXISTS endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT,
  estado VARCHAR(45) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  numeroResidencial CHAR(9) NULL DEFAULT NULL,
  rua VARCHAR(45) NULL DEFAULT NULL,
  complemento VARCHAR(45) NULL DEFAULT NULL,
  fk_end_empresa INT NOT NULL,
  PRIMARY KEY (idEndereco),
  CONSTRAINT fk_empresa_endereco
    FOREIGN KEY (fk_end_empresa)
    REFERENCES systraintrack.empresa (idEmpresa));

CREATE TABLE IF NOT EXISTS faleConosco (
  idMensagem INT NOT NULL AUTO_INCREMENT,
  mensagem VARCHAR(400) NOT NULL,
  emailContato VARCHAR(100) NOT NULL,
  PRIMARY KEY (idMensagem));
CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  senha VARCHAR(200) NOT NULL,
  fk_empresa INT NOT NULL,
  tipoUsuario VARCHAR(45),
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email ASC) VISIBLE,
  INDEX fk_empresa (fk_empresa ASC) VISIBLE,
  CONSTRAINT usuario_ibfk_1
    FOREIGN KEY (fk_empresa)
    REFERENCES empresa (idEmpresa));
CREATE TABLE IF NOT EXISTS linha (
  idLinha INT NOT NULL AUTO_INCREMENT,
  nomeLinha VARCHAR(45) NULL,
  corLinha VARCHAR(45) NULL,
  numeroLinha VARCHAR(45) NULL,
  trecho VARCHAR(45) NULL,
  fkEmpresa INT NOT NULL,
  PRIMARY KEY (idLinha),
  CONSTRAINT fkEmpresa
    FOREIGN KEY (fkEmpresa)
    REFERENCES empresa (idEmpresa));
CREATE TABLE IF NOT EXISTS rbcComponente (
  fkRbc INT NOT NULL,
  fkEmpresa INT NOT NULL,
  fkCompRbc INT NOT NULL,
  limite INT NULL,
  PRIMARY KEY (fkRbc, fkCompRbc),
  CONSTRAINT fk_rbc_has_componentes_rbc1
    FOREIGN KEY (fkRbc)
    REFERENCES rbc (idRbc),
  CONSTRAINT fk_rbc_has_componentes_componentes1
    FOREIGN KEY (fkCompRbc)
    REFERENCES componente (idComponente)
    );

insert into administrador(nome, email, senha, nivel) values
	('Geraldo', 'geraldo@systrain', 'systrain_adm', 3);

INSERT INTO empresa (razaoSocial, token, dataCadastro, cnpj, email, telefone) VALUES
('Via Paulista Mobilidade', 'VPMB1234A1', DEFAULT, '12345678000101', 'contato@viapaulista.com', '11987654321'),
('Ferrovia Bandeirante S.A.', 'FBSA5678B2', DEFAULT, '12345678000102', 'suporte@ferrobandeirante.com', '11987654322'),
('Rota Trilhos Tecnologia', 'RTTC9012C3', DEFAULT, '12345678000103', 'atendimento@rotatrilhos.com', '11987654323'),
('Linha Segura Operações', 'LSOP3456D4', DEFAULT, '12345678000104', 'contato@linhasegura.com', '11987654324'),
('MetroRail Systems Brasil', 'MRSB7890E5', DEFAULT, '12345678000105', 'comercial@metrorail.com', '11987654325'),
('Trilho Forte Infraestrutura', 'TFIN1122F6', DEFAULT, '12345678000106', 'infra@trilhoforte.com', '11987654326'),
('Sinal Verde Logística Ferroviária', 'SVLF3344G7', DEFAULT, '12345678000107', 'operacao@sinalverde.com', '11987654327'),
('Eixo Central Transportes', 'ECTR5566H8', DEFAULT, '12345678000108', 'contato@eixocentral.com', '11987654328'),
('Nova Malha Inteligente', 'NMIT7788I9', DEFAULT, '12345678000109', 'suporte@novamalha.com', '11987654329'),
('RBC Connect Soluções', 'RBCX9900J0', DEFAULT, '12345678000110', 'contato@rbcconnect.com', '11987654330');

INSERT INTO endereco (estado, cep, numeroResidencial, rua, complemento, fk_end_empresa) VALUES
('SP', '01001-000', '120', 'Rua da Consolação', 'Bloco A', 1),
('SP', '02002-000', '245', 'Avenida Tiradentes', 'Sala 12', 2),
('SP', '03003-000', '89', 'Rua Vergueiro', 'Andar 3', 3),
('SP', '04004-000', '560', 'Avenida Paulista', 'Conjunto 7', 4),
('SP', '05005-000', '300', 'Rua Augusta', 'Próximo ao metrô', 5),
('SP', '06006-000', '41', 'Rua Haddock Lobo', 'Fundos', 6),
('SP', '07007-000', '780', 'Avenida Rebouças', 'Bloco C', 7),
('SP', '08008-000', '1500', 'Rua Bela Cintra', 'Cobertura', 8),
('SP', '09009-000', '92', 'Rua Teodoro Sampaio', 'Sala 5', 9),
('SP', '10010-000', '640', 'Avenida Faria Lima', 'Andar 9', 10);

INSERT INTO usuario (nome, email, senha, fk_empresa, tipoUsuario) VALUES


('Thiago', 'thiago@viapaulista.com', '12345', 1, "Operador"),
('Brandão', 'brandao@viapaulista.com', '12345', 1, "Gerente de operações"),
('Marina Souza', 'marina.souza@viapaulista.com', '12345', 1, "Coordenador de incidentes"),


('Carlos Henrique', 'carlos.henrique@ferrobandeirante.com', '12345', 2, "Operador"),
('Fernanda Lima', 'fernanda.lima@ferrobandeirante.com', '12345', 2, "Gerente de operações"),
('Henrique Lima', 'henrique.lima@ferrobandeirante.com', '12345', 2, "Coordenador de incidentes"),

('Alvares Tino', 'alvares.tino@rotatrilhos.com', '12345', 3, "Operador"),
('Thiago Alves', 'thiago.alves@rotatrilhos.com', '12345', 3, "Gerente de operações"),
('Amanda Castro', 'amanda.castro@rotatrilhos.com', '12345', 3, "Coordenador de incidentes"),


('Pedri Castro', 'pedri.castro@linhasegura.com', '12345', 4, "Operador"),
('Bruno Ferreira', 'bruno.ferreira@linhasegura.com', '12345', 4, "Gerente de operações"),
('Juliana Prado', 'juliana.prado@linhasegura.com', '12345', 4, "Coordenador de incidentes"),

('Rafael Gomes', 'rafael.gomes@metrorail.com', '12345', 5, "Operador"),
('Camila Rocha', 'camila.rocha@metrorail.com', '12345', 5, "Gerente de operações"),
('Lucas Mendonça', 'lucas.mendonca@metrorail.com', '12345', 5, "Coordenador de incidentes"),

('Diego Martins', 'diego.martins@trilhoforte.com', '12345', 6, "Operador"),
('Patricia Nunes', 'patricia.nunes@trilhoforte.com', '12345', 6, "Gerente de operações"),
('Ricardo Alves', 'ricardo.alves@trilhoforte.com', '12345', 6, "Coordenador de incidentes"),

('Eduardo Silva', 'eduardo.silva@sinalverde.com', '12345', 7, "Operador"),
('Bianca Melo', 'bianca.melo@sinalverde.com', '12345', 7, "Gerente de operações"),
('Felipe Diniz', 'felipe.diniz@sinalverde.com', '12345', 7, "Coordenador de incidentes"),

('Gustavo Ramos', 'gustavo.ramos@eixocentral.com', '12345', 8, "Operador"),
('Larissa Costa', 'larissa.costa@eixocentral.com', '12345', 8, "Gerente de operações"),
('Rodrigo Faro', 'rodrigo.faro@eixocentral.com', '12345', 8, "Coordenador de incidentes"),

('Vinicius Teixeira', 'vinicius.teixeira@novamalha.com', '12345', 9, "Operador"),
('Aline Fernandes', 'aline.fernandes@novamalha.com', '12345', 9, "Gerente de operações"),
('Roberto Carlos', 'roberto.carlos@novamalha.com', '12345', 9, "Coordenador de incidentes"),

('Pedro Oliveira', 'pedro.oliveira@rbcconnect.com', '12345', 10, "Operador"),
('Beatriz Santos', 'beatriz.santos@rbcconnect.com', '12345', 10, "Gerente de operações"),
('Marcos Viana', 'marcos.viana@rbcconnect.com', '12345', 10, "Coordenador de incidentes");




INSERT INTO componente (nome, tipo, unidadeMedida, parametros, campoWeb) VALUES
('Processador do servidor', 'CPU', '%', 'Porcentagem de Uso', 'componentes_cpu'),
('Memória RAM do servidor', 'RAM', '%', 'Porcentagem de Uso', 'componentes_memoria'),
('Disco do servidor', 'Disco', '%', 'Porcentagem de Uso', 'componentes_disco'),
('Tipo de métrica para processo', 'Processos', '%', 'Uso de CPU', 'componentes_proc_cpu'),
('Tipo de métrica para processo', 'Processos', '%', 'Uso de Memória RAM', 'componentes_proc_memoria'),
('Tipo de métrica para processo', 'Processos', '%', 'Uso de Disco', 'componentes_proc_disco'),
('Latência de rede', 'Rede', 'Mbps', 'Velocidade de Transmissão', 'componentes_latencia');

INSERT INTO faleConosco (mensagem, emailContato) VALUES
('Gostaria de entender melhor como funciona o monitoramento em tempo real do RBC.', 'contato1@gmail.com'),
('Vocês oferecem suporte para integração com sistemas legados ferroviários?', 'engenharia.sp@outlook.com'),
('Quais métricas de servidor são monitoradas pela plataforma?', 'cliente.rbc@yahoo.com'),
('É possível configurar alertas personalizados por criticidade?', 'operacao.metro@gmail.com'),
('A plataforma possui dashboard histórico para análise de incidentes?', 'analista.ti@empresa.com'),
('Gostaria de agendar uma demonstração comercial da solução.', 'comercial.interesse@gmail.com'),
('Vocês possuem algum plano voltado para empresas de médio porte?', 'infraestrutura@provedor.com'),
('Qual é o tempo médio de implantação da plataforma?', 'implantacao@cliente.com'),
('A solução consegue monitorar CPU, RAM e disco ao mesmo tempo?', 'tecnologia@empresa.com'),
('Como funciona o cadastro de usuários administradores?', 'suporte.duvida@gmail.com'),
('O sistema envia notificações por email automaticamente?', 'alertas@cliente.com'),
('Existe compatibilidade com ambientes virtualizados?', 'vmware.contato@gmail.com'),
('Vocês trabalham com relatórios exportáveis?', 'dados.export@outlook.com'),
('Quero saber se a solução atende operação 24x7.', 'operacao24h@yahoo.com'),
('É possível monitorar mais de um RBC por empresa?', 'rbc.multi@gmail.com');




INSERT INTO linha(idLinha, nomeLinha, numeroLinha, corLinha, trecho, fkEmpresa) VALUES
	(1, "DIAMANTE", 8,"#898989","Amador Bueno.", 1),
	(2, "SAFIRA", 12, "#0F52BA", "Calmon Viana ", 1),
	(3, "CORAL", 11, "#D75413", "Mogi das Cruzes", 1),
    
	(4, "JADE",13, "#00A86B", "Aeroporto-Guarulhos", 2),
    (5, "ESMERALDA",9, "#00674f", "Osasco", 2);

    

INSERT INTO rbc (idRbc, macAdress, fkLinha) VALUES 
	(1,'ec:3f:b6:b9:ae:2f', 1),
	(2,'ae:b1:7d:b6:3a:19', 1),
	(3,'13:47:52:e1:8a:7f', 1),
	(4,'60:c7:27:3e:4f:56', 2),
	(5,'06:71:a3:c2:10:07', 2);
