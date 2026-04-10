var rbcModel = require("../models/rbcModel");

async function cadastrarRbc(req, res) {
    var listaFormulario = req.body.listaFormularioServer
    if (listaFormulario == undefined) {
        res.status(400).send("Formulário está undefined!")
    } else {
        console.log("Lista de formulário: ", listaFormulario);
        var nome_servidor = listaFormulario[0][1]
        var linha_responsavel = listaFormulario[1][1]
        var empresa_responsavel = listaFormulario[2][1]
        try {
            var resultado = await rbcModel.cadastrarRbc(nome_servidor, linha_responsavel, empresa_responsavel);
            console.log("RBC cadastrado ", resultado);
            await cadastrarRbcComponente(resultado.insertId, empresa_responsavel, listaFormulario);
            res.status(200).json({ mensagem: cadastrarRbcComponente })
        } catch (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        }
    }
}

async function cadastrarRbcComponente(idServidor, idEmpresa, listaFormulario) {
        
    cpu = { idComponente: listaFormulario[3][1], limite: listaFormulario[4][1]}
    memoria_ram = { idComponente: listaFormulario[5][1], limite: listaFormulario[6][1]}
    disco = { idComponente: listaFormulario[7][1], limite: listaFormulario[8][1]}
    processo_cpu = { idComponente: listaFormulario[9][1], limite: listaFormulario[10][1]}
    processo_ram = { idComponente: listaFormulario[11][1], limite: listaFormulario[12][1]}
    processo_disco = { idComponente: listaFormulario[13][1], limite: listaFormulario[14][1]}
    latencia = { idComponente: listaFormulario[15][1], limite: listaFormulario[16][1]}

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
    


    var requisicao_cpu = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.cpu.idComponente, componentes.cpu.limite)
    var requisicao_ram = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.memoria_ram.idComponente, componentes.memoria_ram.limite)
    var requisicao_disco = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.disco.idComponente, componentes.disco.limite)
    var requisicao_proc_cpu = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.processo_cpu.idComponente, componentes.processo_cpu.limite)
    var requisicao_proc_ram = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.processo_ram.idComponente, componentes.processo_ram.limite)
    var requisicao_proc_disco = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.processo_disco.idComponente, componentes.processo_disco.limite)
    var requisicao_latencia = await rbcModel.cadastrarRbcComponente(idServidor, idEmpresa, componentes.latencia.idComponente, componentes.latencia.limite)

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

module.exports = {
    listarRbc,
    cadastrarRbc
}