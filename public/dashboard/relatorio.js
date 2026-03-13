var linha = [
    {
        linha: "Linha 8 - Diamante",
        status: "Operando",
        horario: "19:15",
        cor: "#8f8f8f",
        cpu: "45%",
        ram: "63%",
        latencia: "88 ms"
    },
    {
        linha: "Linha 9 - Esmeralda",
        status: "Operando",
        horario: "19:15",
        cor: "#00A88E",
        cpu: "42%",
        ram: "61%",
        latencia: "84 ms"
    },
    {
        linha: "Linha 11 - Coral",
        status: "Operando",
        horario: "19:02",
        cor: "#F05A28",
        cpu: "49%",
        ram: "64%",
        latencia: "91 ms"
    },
    {
        linha: "Linha 12 - Safira",
        status: "Atenção",
        horario: "19:05",
        cor: "#0B0F4B",
        cpu: "57%",
        ram: "68%",
        latencia: "103 ms"
    }
];

var relatorios = [
    {
        linha: "Linha 11 - Coral",
        cor: "#F05A28",
        status: "Atenção",
        data: "12/03/2026 12:25:05",
        usuario: "Brandão"
    },
    {
        linha: "Linha 11 - Coral",
        cor: "#F05A28",
        status: "Estável",
        data: "12/03/2026 16:12:42",
        usuario: "Brandão"
    },
    {
        linha: "Linha 9 - Esmeralda",
        cor: "#00A88E",
        status: "Crítico",
        data: "12/03/2026 18:59:04",
        usuario: "Brandão"
    },
]

function mostrarLinha() {
    var areaCard = document.getElementById("painelCardLinhas")
    var card = '';
    for (var i = 0; i < linha.length; i++) {
        var classeStatus = "";

        if (linha[i].status == "Operando") {
            classeStatus = "status-operando";
        } else if (linha[i].status == "Atenção") {
            classeStatus = "status-atencao";
        } else {
            classeStatus = "status-monitoramento";
        }
        card += `
            <div class="card-linha">
                <div class="card-incidente-topo">
                <div class="incidente-linha">
                    <span class="linha-cor-bolinha" style="background-color: ${linha[i].cor};"></span>
                    <span>${linha[i].linha}</span>
                </div>
                <span class="nivel-badge ${classeStatus}">
                    ${linha[i].status}
                </span>
                </div>
                <div class="card-incidente-conteudo">
                <div class="card-incidente-infos card-relatorio">
                    <h3>Visão Geral:</h3>
                    <div>
                        <span>CPU: ${linha[i].cpu}</span>
                        <span>RAM: ${linha[i].ram}</span>
                        <span>Rede:${linha[i].latencia} </span>
                    </div>
                </div>
                </div>
                <div class="card-relatorio-rodape">
                    <div class="linha-cor-barra" style="background-color: ${linha[i].cor};">
                    </div>
                    <div class="card-infos-rodape">
                        <span>Última coleta: ${linha[i].horario} </span>
                        <button class="btn-relatorio">Gerar Relatório</button>
                    </div>
                </div>
            </div>
         `
    }
    console.log(areaCard)
    areaCard.innerHTML = card
}


function mostrarRelatorios() {
    var tabelarelatorios = document.getElementById("tabelaRelatorios")
    var colunasRelatorios = ``
    // Aq ta invertido
    for (var i = relatorios.length - 1; i >= 0; i--) {
        var tipoStatus = ''
        if (relatorios[i].status == "Estável") {
            tipoStatus = "status-operando";

        } else if (relatorios[i].status == "Atenção") {
            tipoStatus = "status-atencao";

        } else {
            tipoStatus = "status-monitoramento";

        }

        colunasRelatorios += `
            <tr>
              <td>
                <span class="linha-cor-bolinha" style="background-color: ${relatorios[i].cor};"></span>
                <span class="linha-nome">${relatorios[i].linha}</span>
              </td>
              <td><span class="status-badge ${tipoStatus}">${relatorios[i].status}</span></td>
              <td>${relatorios[i].data}</td>
              <td>${relatorios[i].usuario}</td>
            </tr>   
        `
    }
    tabelarelatorios.innerHTML = colunasRelatorios
}



mostrarLinha()
mostrarRelatorios()