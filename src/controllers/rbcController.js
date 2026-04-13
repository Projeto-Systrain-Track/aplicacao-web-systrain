var rbcModel = require("../models/rbcModel");

async function cadastrarRbc(req, res) {
    var objetoFormulario = req.body.objetoFormularioServer
    if (objetoFormulario == undefined) {
        res.status(400).send("Formulário está undefined!")
    }
    console.log("Lista de formulário: ", objetoFormulario);
    var nome_servidor = objetoFormulario.nome_servidor;
    var mac_address = objetoFormulario.mac_address;
    var linha_responsavel = objetoFormulario.linha_responsavel;
    var empresa_responsavel = objetoFormulario.empresa_responsavel;
    try {
        var resultado = await rbcModel.cadastrarRbc(nome_servidor, mac_address, linha_responsavel, empresa_responsavel);
        console.log("RBC cadastrado ", resultado);
        await cadastrarRbcComponente(resultado.insertId, empresa_responsavel, objetoFormulario);
        res.status(200).json({ mensagem: cadastrarRbcComponente })
    } catch (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    }
}

async function cadastrarRbcComponente(idServidor, idEmpresa, objetoFormulario) {
    cpu = { idComponente: objetoFormulario.componentes_cpu_id_1, limite: objetoFormulario.componentes_cpu_limite }
    memoria_ram = { idComponente: objetoFormulario.componentes_memoria_id_2, limite: objetoFormulario.componentes_memoria_limite }
    disco = { idComponente: objetoFormulario.componentes_disco_id_3, limite: objetoFormulario.componentes_disco_limite }
    processo_cpu = { idComponente: objetoFormulario.componentes_proc_cpu_id_4, limite: objetoFormulario.componentes_proc_cpu_limite }
    processo_ram = { idComponente: objetoFormulario.componentes_proc_memoria_id_5, limite: objetoFormulario.componentes_proc_memoria_limite }
    processo_disco = { idComponente: objetoFormulario.componentes_proc_disco_id_6, limite: objetoFormulario.componentes_proc_disco_limite }
    latencia = { idComponente: objetoFormulario.componentes_latencia_id_7, limite: objetoFormulario.componentes_latencia_limite }

    console.log(cpu);
    console.log(memoria_ram);
    console.log(disco);
    console.log(processo_cpu);
    console.log(processo_ram);
    console.log(processo_disco);
    console.log(latencia);


    var componentes = {
        cpu: cpu,
        memoria_ram: memoria_ram,
        disco: disco,
        processo_cpu: processo_cpu,
        processo_ram: processo_ram,
        processo_disco: processo_disco,
        latencia: latencia,
    }



    var requisicao_cpu = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, cpu.idComponente, cpu.limite)
    var requisicao_ram = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, memoria_ram.idComponente, memoria_ram.limite)
    var requisicao_disco = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, disco.idComponente, disco.limite)
    var requisicao_proc_cpu = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, processo_cpu.idComponente, processo_cpu.limite)
    var requisicao_proc_ram = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, processo_ram.idComponente, processo_ram.limite)
    var requisicao_proc_disco = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, processo_disco.idComponente, processo_disco.limite)
    var requisicao_latencia = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, latencia.idComponente, latencia.limite)

    if (requisicao_cpu.affectedRows != 1 ||
        requisicao_ram.affectedRows != 1 ||
        requisicao_disco.affectedRows != 1 ||
        requisicao_proc_cpu.affectedRows != 1 ||
        requisicao_proc_ram.affectedRows != 1 ||
        requisicao_proc_disco.affectedRows != 1 ||
        requisicao_latencia.affectedRows != 1
    ) {
        return { mensagem: "Cadastro de servidor realizado com sucesso!" }
    } else {
        return { mensagem: "Erro ao cadastrar limites" }
    }
}
function listarRbc(req, res) {
    rbcModel.listarRbc().then((resultado) => {
        res.status(200).json(resultado);
    }).catch(
        console.error("Erro ao buscar os RBCs")
    );
}
async function listarRbcEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa
    if (idEmpresa == undefined) {
        return res.status(400).json({ mensagem: "O idEmpresa está undefined" })
    }
    try {
        var listarRbcBd =  await rbcModel.listarRbcEmpresa(idEmpresa)
        console.log("Listar ", listarRbcBd);
        return res.status(200).json(listarRbcBd)
    } catch (error) {
        console.error("Erro ao buscar os RBCs")
        return res.status(400).json(error)
    }
}

module.exports = {
    listarRbc,
    cadastrarRbc,
    listarRbcEmpresa
}