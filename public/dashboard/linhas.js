var linhas = [
  {
    nome: "Linha 8 - Diamante",
    trecho: "Amador Bueno ↔ Júlio Prestes",
    status: "Operando",
    estacoes: 22,
    incidentes: 1,
    disponibilidade: "95%",
    cor: "#9E9E9E"
  },
  {
    nome: "Linha 9 - Esmeralda",
    trecho: "Osasco - Varginha",
    status: "Operando",
    estacoes: 21,
    incidentes: 2,
    disponibilidade: "96%",
    cor: "#00A88E"
  },
  {
    nome: "Linha 11 - Coral",
    trecho: "Estudantes - Luz",
    status: "Operando",
    estacoes: 16,
    incidentes: 1,
    disponibilidade: "94%",
    cor: "#F05A28"
  },
  {
    nome: "Linha 12 - Safira",
    trecho: "Calmon Viana - Brás",
    status: "Atenção",
    estacoes: 13,
    incidentes: 3,
    disponibilidade: "92%",
    cor: "#0B0F4B"
  }
];

function montarTabelaLinhas() {
  var corpoTabela = document.getElementById("tabelaLinhas");
  var conteudo = "";

  for (var i = 0; i < linhas.length; i++) {
    var classeStatus = "";

    if (linhas[i].status == "Operando") {
      classeStatus = "status-operando";
    } else if (linhas[i].status == "Atenção") {
      classeStatus = "status-atencao";
    } else {
      classeStatus = "status-monitoramento";
    }

    conteudo += `
      <tr>
        <td>
          <div class="linha-info">
            <span class="linha-cor-bolinha" style="background-color: ${linhas[i].cor};"></span>
            <span class="linha-nome">${linhas[i].nome}</span>
          </div>
        </td>

        <td>${linhas[i].trecho}</td>

        <td>
          <span class="status-badge ${classeStatus}">
            ${linhas[i].status}
          </span>
        </td>

        <td>${linhas[i].estacoes}</td>
        <td>${linhas[i].incidentes}</td>
        <td>${linhas[i].disponibilidade}</td>
      </tr>
    `;
  }

  corpoTabela.innerHTML = conteudo;
}

montarTabelaLinhas();