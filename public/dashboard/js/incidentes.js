var incidentes = [
  {
    titulo: "Temperatura elevada",
    linha: "Linha 9 - Esmeralda",
    nivel: "Alto",
    horario: "09:15",
    descricao: "Leitura acima do ideal de monitoramento estabelecido.",
    cor: "#00A88E"
  },
  {
    titulo: "Falha de Rede",
    linha: "Linha 8 - Diamante",
    nivel: "Alto",
    horario: "11:27",
    descricao: "Um dos dispositivos deixou de enviar dados temporariamente.",
    cor: "#8f8f8f"
  },
  {
    titulo: "Pico de uso de CPU",
    linha: "Linha 11 - Coral",
    nivel: "Médio",
    horario: "12:18",
    descricao: "Servidor de processamento apresentou carga acima da média.",
    cor: "#F05A28"
  },
  {
    titulo: "Queda de disponibilidade",
    linha: "Linha 12 - Safira",
    nivel: "Baixo",
    horario: "13:40",
    descricao: "Redução pontual da disponibilidade geral da linha.",
    cor: "#0B0F4B"
  }
];

function montarIncidentes() {
  var lista = document.getElementById("listaIncidentes");
  var conteudo = "";

  for (var i = 0; i < incidentes.length; i++) {
    var classeNivel = "";

    if (incidentes[i].nivel == "Alto") {
      classeNivel = "nivel-alto";
    } else if (incidentes[i].nivel == "Médio") {
      classeNivel = "nivel-medio";
    } else {
      classeNivel = "nivel-baixo";
    }

    conteudo += `
      <div class="card-incidente">
        <div class="card-incidente-topo">
          <div class="incidente-linha">
            <span class="linha-cor-bolinha" style="background-color: ${incidentes[i].cor};"></span>
            <span>${incidentes[i].linha}</span>
          </div>

          <span class="nivel-badge ${classeNivel}">
            ${incidentes[i].nivel}
          </span>
        </div>

        <div class="card-incidente-conteudo">
          <h3>${incidentes[i].titulo}</h3>
          <p>${incidentes[i].descricao}</p>
        </div>

        <div class="card-incidente-rodape">
          <span>Horário: ${incidentes[i].horario}</span>
        </div>
      </div>
    `;
  }

  lista.innerHTML = conteudo;
}

montarIncidentes();