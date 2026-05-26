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

    //anotação: o this ajuda na referencia do click p o classlist
    html += `
      <div class="incidente-item status-${incidentes[i].statusSLA} mb-2" onclick="selecionarIncidente(${i}, this)" > 
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

//meio q pega aquele this com o id e transforma em "itemClicado" aqui
function selecionarIncidente(index, itemClicado) {
  incidenteSelecionado = incidentes[index];

  var cardAtivoAnterior = document.querySelector(".incidente-item.clicado");
  if (cardAtivoAnterior) {
    cardAtivoAnterior.classList.remove("clicado");
  }

  itemClicado.classList.add("clicado");

  renderizarIncidenteDetalhe();

  console.log(incidenteSelecionado);

}

function renderizarIncidenteDetalhe() {
  var detalhe = document.getElementById("detalheIncidente");
  var cor = document.getElementById("cor-linha");
  var linha = document.getElementById("linha");
  var impacto = document.getElementById("impacto");
  var titulo = document.getElementById("titulo-incidente");
  var descricao = document.getElementById("descricao-incidente");

  if (incidenteSelecionado.nivel == "Alto") {
    var corClassificacao = "alto";
  } else if (incidenteSelecionado.nivel == "Médio") {
    corClassificacao = "medio";
  } else {
    corClassificacao = "baixo";
  }

  cor.innerHTML = `<span class="linha-cor-bolinha" style="background-color: ${incidenteSelecionado.cor}; display: inline-block; width: 10px; height: 10px; border-radius: 50%;"></span>`;
  linha.innerHTML = `<span class="linha text-muted small fw-bold">${incidenteSelecionado.linha}</span>`;
  impacto.innerHTML = ` <span class="badge text-black ${corClassificacao}">${incidenteSelecionado.nivel}</span>`;
  titulo.innerHTML = ` <h3 class="fw-bold mb-1">${incidenteSelecionado.titulo}</h3>`;
  descricao.innerHTML = `<p class="text-muted small mb-3">${incidenteSelecionado.descricao}</p> `;


}




