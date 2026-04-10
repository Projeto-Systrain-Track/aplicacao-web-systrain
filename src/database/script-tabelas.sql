create database SysTrainTrack;
use SysTrainTrack;
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
  idRbc INT NOT NULL AUTO_INCREMENT,
  nome_servidor VARCHAR(45) NULL DEFAULT NULL,
  fkLinha INT NULL DEFAULT NULL,
  CONSTRAINT fkLinha
    FOREIGN KEY (fkLinha)
    REFERENCES linha (idLinha),
  fkEmpresa INT NULL DEFAULT NULL,
  PRIMARY KEY (idRbc),
  CONSTRAINT rbc_ibfk_1
    FOREIGN KEY (fkEmpresa)
    REFERENCES empresa (idEmpresa));
    
CREATE TABLE IF NOT EXISTS eventoOperacional (
  idEventoOperacional INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(45) NULL,
  descricao VARCHAR(45) NULL,
  classificacao VARCHAR(45) NULL,
  PRIMARY KEY (idEventoOperacional));

CREATE TABLE IF NOT EXISTS administrador (
  idAdministrador INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(50) NOT NULL,
  senha VARCHAR(45) NULL DEFAULT NULL,
  nivel INT NULL DEFAULT NULL,
  PRIMARY KEY (idAdministrador),
  UNIQUE INDEX email (email ASC) VISIBLE);
  
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
  INDEX fk_empresa_endereco (fk_end_empresa ASC) VISIBLE,
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
  PRIMARY KEY (idUsuario),
  UNIQUE INDEX email (email ASC) VISIBLE,
  INDEX fk_empresa (fk_empresa ASC) VISIBLE,
  CONSTRAINT usuario_ibfk_1
    FOREIGN KEY (fk_empresa)
    REFERENCES empresa (idEmpresa));
    
CREATE TABLE IF NOT EXISTS rbcComponente (
  fkRbc INT NOT NULL,
  fkEmpresa INT NOT NULL,
  fkCompRbc INT NOT NULL,
  limite INT NULL,
  PRIMARY KEY (fkRbc, fkEmpresa, fkCompRbc),
  CONSTRAINT fk_rbc_has_componentes_rbc1
    FOREIGN KEY (fkRbc)
    REFERENCES rbc (idRbc),
  CONSTRAINT fk_rbc_has_componentes_componentes1
    FOREIGN KEY (fkCompRbc)
    REFERENCES componente (idComponente),
    CONSTRAINT fkRbcComponenteEmpresa
		FOREIGN KEY (fkEmpresa)
        REFERENCES empresa (idEmpresa)
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

INSERT INTO usuario (nome, email, senha, fk_empresa) VALUES
('Brandão', 'brandao@viapaulista.com', '12345', 1),
('Marina Souza', 'marina.souza@viapaulista.com', '12345', 1),
('Carlos Henrique', 'carlos.henrique@ferrobandeirante.com', '12345', 2),
('Fernanda Lima', 'fernanda.lima@ferrobandeirante.com', '12345', 2),
('Thiago Alves', 'thiago.alves@rotatrilhos.com', '12345', 3),
('Amanda Castro', 'amanda.castro@rotatrilhos.com', '12345', 3),
('Bruno Ferreira', 'bruno.ferreira@linhasegura.com', '12345', 4),
('Juliana Prado', 'juliana.prado@linhasegura.com', '12345', 4),
('Rafael Gomes', 'rafael.gomes@metrorail.com', '12345', 5),
('Camila Rocha', 'camila.rocha@metrorail.com', '12345', 5),
('Diego Martins', 'diego.martins@trilhoforte.com', '12345', 6),
('Patricia Nunes', 'patricia.nunes@trilhoforte.com', '12345', 6),
('Eduardo Silva', 'eduardo.silva@sinalverde.com', '12345', 7),
('Bianca Melo', 'bianca.melo@sinalverde.com', '12345', 7),
('Gustavo Ramos', 'gustavo.ramos@eixocentral.com', '12345', 8),
('Larissa Costa', 'larissa.costa@eixocentral.com', '12345', 8),
('Vinicius Teixeira', 'vinicius.teixeira@novamalha.com', '12345', 9),
('Aline Fernandes', 'aline.fernandes@novamalha.com', '12345', 9),
('Pedro Oliveira', 'pedro.oliveira@rbcconnect.com', '12345', 10),
('Beatriz Santos', 'beatriz.santos@rbcconnect.com', '12345', 10);
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

