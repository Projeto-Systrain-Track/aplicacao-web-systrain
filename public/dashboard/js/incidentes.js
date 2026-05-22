var incidentes = [
  {
    statusSLA: "risco",
    titulo: "Falha de comunicação RBC-09",
    linha: "Linha 9 - Esmeralda",
    nivel: "Alto",
    horario: "09:15",
    descricao: "Leitura acima do ideal de monitoramento estabelecido.",
    cor: "#00A88E",
    climaRegiao: "alguma coisa"
  },
  {
    statusSLA: "risco",
    titulo: "Alto consumo de Disco",
    linha: "Linha 8 - Diamante",
    nivel: "Alto",
    horario: "11:27",
    descricao: "Um dos dispositivos deixou de enviar dados temporariamente.",
    cor: "#8f8f8f",
    climaRegiao: "alguma coisa"
  },
  {
    statusSLA: "normal",
    titulo: "Pico de uso de CPU",
    linha: "Linha 11 - Coral",
    nivel: "Médio",
    horario: "12:18",
    descricao: "Servidor de processamento apresentou carga acima da média.",
    cor: "#F05A28",
    climaRegiao: "alguma coisa"
  },
  {
    statusSLA: "atencao",
    titulo: "Queda de disponibilidade",
    linha: "Linha 12 - Safira",
    nivel: "Baixo",
    horario: "13:40",
    descricao: "Redução pontual da disponibilidade geral da linha.",
    cor: "#0B0F4B",
    climaRegiao: "alguma coisa"
  },
  {
    statusSLA: "atencao",
    titulo: "aaaaaaaaaaaaaaaaa",
    linha: "Linha 11 - Coral",
    nivel: "Baixo",
    horario: "13:40",
    descricao: "Redução pontual da disponibilidade geral da linha.",
    cor: "#0B0F4B",
    climaRegiao: "alguma coisa"
  }
];

// function montarIncidentes() {
//   var lista = document.getElementById("listaIncidentes");
//   var conteudo = "";

//   for (var i = 0; i < incidentes.length; i++) {
//     var classeNivel = "";

//     if (incidentes[i].nivel == "Alto") {
//       classeNivel = "nivel-alto";
//     } else if (incidentes[i].nivel == "Médio") {
//       classeNivel = "nivel-medio";
//     } else {
//       classeNivel = "nivel-baixo";
//     }

//     conteudo += `
//       <div class="card-incidente">
//         <div class="card-incidente-topo">
//           <div class="incidente-linha">
//             <span class="linha-cor-bolinha" style="background-color: ${incidentes[i].cor};"></span>
//             <span>${incidentes[i].linha}</span>
//           </div>

//           <span class="nivel-badge ${classeNivel}">
//             ${incidentes[i].nivel}
//           </span>
//         </div>

//         <div class="card-incidente-conteudo">
//           <h3>${incidentes[i].titulo}</h3>
//           <p>${incidentes[i].descricao}</p>
//         </div>

//         <div class="card-incidente-rodape">
//           <span>Horário: ${incidentes[i].horario}</span>
//         </div>
//       </div>
//     `;
//   }

//   lista.innerHTML = conteudo;
// }

// montarIncidentes();



function montarIncidentes() {

  //organizar eles por tempo de sla dps - decidir qual é a prioridade (impacto ou SLA)
  var lista = document.getElementById("lista-incidentes");
  var html = "";

  for (var i = 0; i < incidentes.length; i++) {
    if (incidentes[i].nivel == "Alto") {
      var corClassificacao = "alto";
    } else if (incidentes[i].nivel == "Médio") {
      corClassificacao = "medio";
    } else {
      corClassificacao = "baixo";
    }

    html += `
      <div class="incidente-item status-${incidentes[i].statusSLA} mb-2" onclick="selecionarIncidente(${i})" > 
            <div class="linha-info">
              <span class="linha-cor-bolinha" style="background-color: ${incidentes[i].cor};"></span>
              <span class="linha">${incidentes[i].linha}</span>
          </div>

          <strong class="text-black">${incidentes[i].titulo}</strong>
          <span class="classificacao-incidente text-black ${corClassificacao}">${incidentes[i].nivel}</span>
          <span class="linha mt-2">Horário: ${incidentes[i].horario}</span>
      </div>
    `;
  }

  lista.innerHTML = html;
}

montarIncidentes();

var primeiroCard = document.querySelector(".incidente-item");
if (primeiroCard) {
  selecionarIncidente(0, primeiroCard);
}

var incidenteSelecionado = null;

function selecionarIncidente(index,) {
  incidenteSelecionado = incidentes[index];


  console.log(incidenteSelecionado);

}





