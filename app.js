// const ambiente_processo = 'producao';
const ambiente_processo = 'desenvolvimento';

const caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

const express = require("express");
const cors = require("cors");
const path = require("path");
const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;

const app = express();

const indexRouter = require("./src/routes/index");
const usuarioRouter = require("./src/routes/usuarios");
const empresasRouter = require("./src/routes/empresas");
const rbcRouter = require("./src/routes/rbcs")
const componentesRouter = require("./src/routes/componentes");
const admRouter = require("./src/routes/adminitradores")
const linhaRouter = require("./src/routes/linha")

const visaoGeralRouter = require("./src/routes/dashVisaoGeral")
const dashLinhasRoutes = require("./src/routes/dashLinhas");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/empresas", empresasRouter);
app.use("/rbcs", rbcRouter)
app.use("/componentes", componentesRouter)
app.use("/adm", admRouter)
app.use("/linha", linhaRouter)

app.use("/visaoGeral", visaoGeralRouter);

app.use("/dashLinhas", dashLinhasRoutes);





app.listen(PORTA_APP, function () {
    console.log(`


  /$$$$$$                        /$$                        /$$                 /$$$$$$$$                           /$$      
 /$$__  $$                      | $$                       |__/                |__  $$__/                          | $$      
| $$  \\__/ /$$   /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$  /$$ /$$$$$$$          | $$  /$$$$$$  /$$$$$$   /$$$$$$$| $$   /$$
|  $$$$$$ | $$  | $$ /$$_____/|_  $$_/   /$$__  $$|____  $$| $$| $$__  $$         | $$ /$$__  $$|____  $$ /$$_____/| $$  /$$/
 \\____  $$| $$  | $$|  $$$$$$   | $$    | $$  \\__/ /$$$$$$$| $$| $$  \\ $$         | $$| $$  \\__/ /$$$$$$$| $$      | $$$$$$/ 
 /$$  \\ $$| $$  | $$ \\____  $$  | $$ /$$| $$      /$$__  $$| $$| $$  | $$         | $$| $$      /$$__  $$| $$      | $$_  $$ 
|  $$$$$$/|  $$$$$$$ /$$$$$$$/  |  $$$$/| $$     |  $$$$$$$| $$| $$  | $$         | $$| $$     |  $$$$$$$|  $$$$$$$| $$ \\  $$
 \\______/  \\____  $$|_______/    \\___/  |__/      \\_______/|__/|__/  |__/         |__/|__/      \\_______/ \\_______/|__/  \\__/
           /$$  | $$                                                                                                         
          |  $$$$$$/                                                                                                         
           \\______/                                                                                                          


    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
