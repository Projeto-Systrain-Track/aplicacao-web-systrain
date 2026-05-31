var incidentes = [];
var incidenteSelecionado = null;

var CORES_LINHAS = {
  "Linha 7": { nome: "Linha 7 - Rubi", cor: "#A61C5D" },
  "Linha 8": { nome: "Linha 8 - Diamante", cor: "#8F8F8F" },
  "Linha 9": { nome: "Linha 9 - Esmeralda", cor: "#00A88E" },
  "Linha 11": { nome: "Linha 11 - Coral", cor: "#F05A28" },
  "Linha 12": { nome: "Linha 12 - Safira", cor: "#0B0F4B" },
  "Linha 13": { nome: "Linha 13 - Jade", cor: "#56298A" }
};

var incidentesDia_kpi = document.getElementById("kpi_incidentesDia");
var incidentesAbertos_kpi = document.getElementById("kpi_incidentesAbertos");
var slaRisco_kpi = document.getElementById("kpi_slaRisco");
var semResponsavel_kpi = document.getElementById("kpi_semResponsavel");

function obterDadosDashboard() {
  var fkEmpresa = sessionStorage.ID_EMPRESA;

  //provavel q precise mudar aqui quando for p nuvem
  fetch(`/incidentes/dashboard?fkEmpresa=${fkEmpresa}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(resposta => {
      if (resposta.ok) {
        resposta.json().then(dados => {
          incidentesDia_kpi.innerHTML = dados.kpis.kpi_incidentesDia;
          incidentesAbertos_kpi.innerHTML = dados.kpis.kpi_incidentesAbertos;
          slaRisco_kpi.innerHTML = dados.kpis.kpi_slaRisco;
          semResponsavel_kpi.innerHTML = dados.kpis.kpi_semResponsavel;



          var listaCompleta = dados.listaIncidentes || [];
          incidentes = [];

          for (var i = 0; i < listaCompleta.length; i++) {
            if (listaCompleta[i].status == "TAREFAS PENDENTES" || listaCompleta[i].status === "EM ANDAMENTO") {
              incidentes.push(listaCompleta[i]);
            }
          }
          montarIncidentes();
        });
      } else {
        console.error("[Busca incidentes] Erro ao obter dados.");
      }
    })
    .catch(erro => console.error("[Busca incidentes] Erro na requisição:", erro));
}


function descobrirLinhaECor(item) {
  var titulo = item.titulo || "";

  for (var linha in CORES_LINHAS) {
    if (titulo.includes(linha)) {
      return CORES_LINHAS[linha];
    }
  }

  return { nome: "Desconhecida", cor: "#cccccc" };
}

function montarIncidentes() {
  var lista = document.getElementById("lista-incidentes");
  var html = "";

  if (incidentes.length === 0) {
    lista.innerHTML = `<p class="text-muted small text-center mt-3">Nenhum incidente crítico registrado hoje.</p>`;
    return;
  }

  for (var i = 0; i < incidentes.length; i++) {
    var item = incidentes[i];
    var infoLinha = descobrirLinhaECor(item);

    var corClassificacao = "baixo";

    if (item.prioridade === "Highest" || item.prioridade === "High")
      corClassificacao = "alto";

    else if (item.prioridade === "Medium")
      corClassificacao = "medio";

    var statusSLA = "normal";
    if (corClassificacao === "alto" && item.status !== "FEITO") statusSLA = "risco";
    else if (corClassificacao === "medio" && item.status !== "FEITO") statusSLA = "atencao";

    html += `
      <div class="incidente-item status-${statusSLA} mb-2" onclick="selecionarIncidente(${i}, this)"> 
          <div class="linha-info">
              <span class="linha-cor-bolinha" style="background-color: ${infoLinha.cor};"></span>
              <span class="linha">${infoLinha.nome}</span>
          </div>
          <strong class="text-black d-block mt-1">${item.titulo}</strong>
          <span class="classificacao-incidente text-black ${corClassificacao}">${corClassificacao.toUpperCase()}</span>
          <span class="linha mt-2 d-block">Horário: ${item.horario}</span>
      </div>
    `;
  }
  lista.innerHTML = html;

  var primeiroCard = document.querySelector(".incidente-item");
  if (primeiroCard) selecionarIncidente(0, primeiroCard);
}

function selecionarIncidente(index, itemClicado) {
  incidenteSelecionado = incidentes[index];

  var cardAtivoAnterior = document.querySelector(".incidente-item.clicado");
  if (cardAtivoAnterior) cardAtivoAnterior.classList.remove("clicado");

  itemClicado.classList.add("clicado");

  renderizarIncidenteDetalhe();
  console.log(incidenteSelecionado);
}

function renderizarIncidenteDetalhe() {
  if (!incidenteSelecionado) return;

  var cor = document.getElementById("cor-linha");
  var linha = document.getElementById("linha");
  var impacto = document.getElementById("impacto");
  var titulo = document.getElementById("titulo-incidente");
  var descricao = document.getElementById("descricao-incidente");
  var afetado = document.getElementById("afetado");
  var horario = document.getElementById("horario");
  var causa = document.getElementById("causa");
  var contexto = document.getElementById("contexto-externo");
  var responsavel = document.getElementById("responsavel");


  var infoLinha = descobrirLinhaECor(incidenteSelecionado);
  var linkCard = document.getElementById("abrirJira");

  linkCard.href = incidenteSelecionado.link;
  linkCard.target = "_blank";


  var corClassificacao = "baixo";

  if (incidenteSelecionado.prioridade === "Highest" || incidenteSelecionado.prioridade === "High")
    corClassificacao = "alto";

  else if (incidenteSelecionado.prioridade === "Medium")
    corClassificacao = "medio";

  var valCpu = "--%";
  var valRam = "--%";
  var valDisco = "--%";
  var valLatencia = "-- ms";

  var motivoDisparo = "Não informado";
  var climaCondicao = "";
  var climaVento = "";

  if (incidenteSelecionado.descricao) {
    var linhasDesc = incidenteSelecionado.descricao.split("\n");

    for (var i = 0; i < linhasDesc.length; i++) {
      var linhaTexto = linhasDesc[i].trim();

      if (linhaTexto.includes("Motivo do Disparo:")) {
        motivoDisparo = linhaTexto.split("Motivo do Disparo:")[1].trim();

      } else if (linhaTexto.includes("CPU:")) {
        valCpu = linhaTexto.split("CPU:")[1].trim();

      } else if (linhaTexto.includes("RAM:")) {
        valRam = linhaTexto.split("RAM:")[1].trim();

      } else if (linhaTexto.includes("DISCO:")) {
        valDisco = linhaTexto.split("DISCO:")[1].trim();

      } else if (linhaTexto.includes("Latência:") || linhaTexto.includes("Latencia:")) {
        var label = linhaTexto.includes("Latência:") ? "Latência:" : "Latencia:";
        valLatencia = linhaTexto.split(label)[1].trim();

      } else if (linhaTexto.includes("Condição:") || linhaTexto.includes("Condicao:")) {
        var labelClima = linhaTexto.includes("Condição:") ? "Condição:" : "Condicao:";
        climaCondicao = linhaTexto.split(labelClima)[1].trim();

      } else if (linhaTexto.includes("Vento:")) {
        climaVento = linhaTexto.split("Vento:")[1].trim();
      }
    }
  }

  cor.innerHTML = `<span class="linha-cor-bolinha" style="background-color: ${infoLinha.cor}; display: inline-block; width: 10px; height: 10px; border-radius: 50%;"></span>`;
  linha.innerHTML = `<span class="linha text-muted small fw-bold">${infoLinha.nome}</span>`;
  impacto.innerHTML = `<span class="badge text-black ${corClassificacao}">${corClassificacao.toUpperCase()}</span>`;
  titulo.innerHTML = `<h3 class="fw-bold mb-1 text-black">${incidenteSelecionado.titulo}</h3>`;

  descricao.innerHTML = `<p class="text-muted small mb-3">${motivoDisparo}</p>`;

  var comp = incidenteSelecionado.componente;
  afetado.innerHTML = comp || "INDEFINIDO";
  horario.innerHTML = incidenteSelecionado.horario || "--:--";


  if (["CPU", "RAM", "DISCO", "HARDWARE"].includes(comp)) {
    causa.innerHTML = "HARDWARE";
  } else if (["PING", "CONEXÃO", "CONEXAO", "LATÊNCIA", "LATENCIA"].includes(comp)) {
    causa.innerHTML = "OFFLINE/SOBRECARGA";
  } else {
    causa.innerHTML = "INDEFINIDO";
  }


  var cValor = document.getElementById("val-cpu");
  var rValor = document.getElementById("val-ram");
  var dValor = document.getElementById("val-disco");
  var lValor = document.getElementById("val-lat");

  cValor.innerHTML = valCpu;
  rValor.innerHTML = valRam;
  dValor.innerHTML = valDisco;
  lValor.innerHTML = valLatencia;

  var cStatus = document.getElementById("status-cpu");
  var rStatus = document.getElementById("status-ram");
  var dStatus = document.getElementById("status-disco");
  var lStatus = document.getElementById("status-lat");

  var statusNormalHTML = `<small class="text-success fw-bold">Normal</small>`;
  cStatus.innerHTML = statusNormalHTML;
  rStatus.innerHTML = statusNormalHTML;
  dStatus.innerHTML = statusNormalHTML;
  lStatus.innerHTML = statusNormalHTML;

  var statusErroHTML = `<small class="text-danger fw-bold">${motivoDisparo}</small>`;
  if (comp === "CPU" && cStatus)
    cStatus.innerHTML = statusErroHTML;

  else if (comp === "RAM" && rStatus)
    rStatus.innerHTML = statusErroHTML;

  else if (comp === "DISCO" && dStatus)
    dStatus.innerHTML = statusErroHTML;

  else if (["PING", "CONEXÃO", "LATÊNCIA"].includes(comp) && lStatus) {
    lValor.innerHTML = "ERR";

    lStatus.innerHTML = statusErroHTML;
  }


  if (incidenteSelecionado.analista === "systraintrack")
    var analista = "NÃO ATRIBUÍDO";
  else
    analista = incidenteSelecionado.analista

  var statusJira = incidenteSelecionado.status || "PENDENTE";
  responsavel.innerHTML = `
        <strong class="d-block lh-1 text-black">${analista}</strong>
        <small class="text-muted">Status: ${statusJira.toUpperCase()}</small>
      `;

  if (climaCondicao !== "") {
    contexto.innerHTML = `
              <div class="text-start text-black fs-6">
                  ${climaCondicao}<br>
                  <span class="text-black" style="font-size: 14px;">vento: ${climaVento}</span>
              </div>
          `;
  } else {
    contexto.innerHTML = `<span class="text-muted small">Não foi possível coletar o clima</span>`;
  }
}


window.onload = function () {
  obterDadosDashboard();
};