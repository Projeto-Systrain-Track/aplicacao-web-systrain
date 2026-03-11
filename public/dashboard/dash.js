const dadosLinhas = {
  7: {
    nome: "Rubi",
    subtitulo: "Estrutura simplificada da linha selecionada",
    status: "Atenção moderada em uma estação",
    descricao:
      "Esqueleto para exibir resumo da operação e indicadores principais da linha.",
    estacoes: 17,
    incidentes: 3,
    disponibilidade: "92%",
    cor: "#9B1B6D",
    metricas: {
      cpu: {
        valor: "57%",
        stat1: "Pico 74%",
        stat2: "Média 57%",
        serie: [46, 48, 52, 55, 59, 62, 60, 58, 61, 57, 56, 57],
      },
      ram: {
        valor: "68%",
        stat1: "Pico 79%",
        stat2: "Média 68%",
        serie: [58, 60, 61, 64, 66, 68, 70, 71, 69, 67, 66, 68],
      },
      latencia: {
        valor: "103 ms",
        stat1: "Pico 146 ms",
        stat2: "Média 103 ms",
        serie: [82, 86, 91, 95, 102, 118, 111, 107, 109, 103, 99, 103],
      },
      incidentes: {
        valor: "3",
        stat1: "Críticos 1",
        stat2: "Médios 2",
        serie: [1, 1, 2, 2, 2, 3, 3, 2, 2, 3, 3, 3],
      },
    },
  },

  8: {
    nome: "Diamante",
    subtitulo: "Estrutura simplificada da linha selecionada",
    status: "Operação com monitoramento preventivo",
    descricao:
      "Esqueleto para exibir resumo da operação e indicadores principais da linha.",
    estacoes: 23,
    incidentes: 1,
    disponibilidade: "95%",
    cor: "#9A9A9A",
    metricas: {
      cpu: {
        valor: "45%",
        stat1: "Pico 63%",
        stat2: "Média 45%",
        serie: [35, 37, 38, 40, 42, 46, 49, 48, 46, 44, 45, 45],
      },
      ram: {
        valor: "63%",
        stat1: "Pico 74%",
        stat2: "Média 63%",
        serie: [54, 56, 57, 59, 61, 64, 67, 66, 64, 63, 62, 63],
      },
      latencia: {
        valor: "88 ms",
        stat1: "Pico 114 ms",
        stat2: "Média 88 ms",
        serie: [79, 81, 82, 84, 86, 90, 94, 92, 90, 88, 87, 88],
      },
      incidentes: {
        valor: "1",
        stat1: "Críticos 0",
        stat2: "Médios 1",
        serie: [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
      },
    },
  },

  9: {
    nome: "Esmeralda",
    subtitulo: "Estrutura simplificada da linha selecionada",
    status: "Operação estável",
    descricao:
      "Esqueleto para exibir resumo da operação e indicadores principais da linha.",
    estacoes: 21,
    incidentes: 2,
    disponibilidade: "96%",
    cor: "#00A88E",
    metricas: {
      cpu: {
        valor: "42%",
        stat1: "Pico 61%",
        stat2: "Média 42%",
        serie: [31, 34, 36, 39, 40, 44, 47, 46, 43, 41, 42, 42],
      },
      ram: {
        valor: "61%",
        stat1: "Pico 70%",
        stat2: "Média 61%",
        serie: [51, 54, 55, 58, 60, 63, 65, 64, 62, 61, 60, 61],
      },
      latencia: {
        valor: "84 ms",
        stat1: "Pico 108 ms",
        stat2: "Média 84 ms",
        serie: [76, 74, 78, 80, 82, 85, 89, 87, 86, 83, 82, 84],
      },
      incidentes: {
        valor: "2",
        stat1: "Críticos 0",
        stat2: "Médios 2",
        serie: [0, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2],
      },
    },
  },

  10: {
    nome: "Turquesa",
    subtitulo: "Estrutura simplificada da linha selecionada",
    status: "Monitoramento de trecho final",
    descricao:
      "Esqueleto para exibir resumo da operação e indicadores principais da linha.",
    estacoes: 15,
    incidentes: 1,
    disponibilidade: "91%",
    cor: "#0099AD",
    metricas: {
      cpu: {
        valor: "49%",
        stat1: "Pico 67%",
        stat2: "Média 49%",
        serie: [39, 40, 41, 43, 46, 49, 52, 53, 51, 49, 48, 49],
      },
      ram: {
        valor: "64%",
        stat1: "Pico 73%",
        stat2: "Média 64%",
        serie: [55, 57, 58, 60, 61, 64, 67, 68, 66, 65, 64, 64],
      },
      latencia: {
        valor: "91 ms",
        stat1: "Pico 120 ms",
        stat2: "Média 91 ms",
        serie: [79, 80, 82, 86, 88, 94, 97, 100, 96, 94, 92, 91],
      },
      incidentes: {
        valor: "1",
        stat1: "Críticos 1",
        stat2: "Médios 0",
        serie: [0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      },
    },
  },
};

const ordem = [7, 8, 9, 10];
let indiceLinha = 2;
let graficoMetrica = null;

function obterLinhaAtual() {
  return ordem[indiceLinha];
}

function renderizarLinha() {
  const chave = obterLinhaAtual();
  const dados = dadosLinhas[chave];

  document.getElementById("tituloLinha").textContent =
    "Linha " + chave + " - " + dados.nome;
  document.getElementById("subtituloLinha").textContent = dados.subtitulo;
  document.getElementById("statusLinha").textContent = dados.status;
  document.getElementById("descricaoLinha").textContent = dados.descricao;

  document.getElementById("valorEstacoes").textContent = dados.estacoes;
  document.getElementById("incidentesResumo").textContent = dados.incidentes;
  document.getElementById("disponibilidadeResumo").textContent =
    dados.disponibilidade;

  document.getElementById("valorCpu").textContent = dados.metricas.cpu.valor;
  document.getElementById("valorRam").textContent = dados.metricas.ram.valor;
  document.getElementById("valorLatencia").textContent =
    dados.metricas.latencia.valor;
  document.getElementById("valorIncidentes").textContent =
    dados.metricas.incidentes.valor;

  document.getElementById("imagemLinha").style.background = dados.cor;
  document.getElementById("imagemLinha").alt =
    "Mapa simplificado da Linha " + chave + " - " + dados.nome;

  const amostraLinha = document.querySelector(".linha-cor");
  if (amostraLinha) {
    amostraLinha.style.backgroundColor = dados.cor;
  }
}

function trocarLinha(direcao) {
  indiceLinha = indiceLinha + direcao;

  if (indiceLinha < 0) {
    indiceLinha = ordem.length - 1;
  }

  if (indiceLinha >= ordem.length) {
    indiceLinha = 0;
  }

  renderizarLinha();
}

function abrirModalMetrica(metrica) {
  const chave = obterLinhaAtual();
  const dados = dadosLinhas[chave];
  const dadosMetrica = dados.metricas[metrica];

  let nomeMetrica = "";

  if (metrica === "cpu") {
    nomeMetrica = "CPU";
  } else if (metrica === "ram") {
    nomeMetrica = "RAM";
  } else if (metrica === "latencia") {
    nomeMetrica = "Rede";
  } else if (metrica === "incidentes") {
    nomeMetrica = "Incidentes";
  }

  document.getElementById("tituloModal").textContent =
    nomeMetrica + " - Linha " + chave + " - " + dados.nome;

  document.getElementById("faixaResumoModal").innerHTML = `
    <div class="item"><small>Atual</small><strong>${dadosMetrica.valor}</strong></div>
    <div class="item"><small>Resumo 1</small><strong>${dadosMetrica.stat1}</strong></div>
    <div class="item"><small>Resumo 2</small><strong>${dadosMetrica.stat2}</strong></div>
  `;

  const canvas = document.getElementById("graficoMetrica");

  if (graficoMetrica) {
    graficoMetrica.destroy();
  }

  graficoMetrica = new Chart(canvas, {
    type: metrica === "incidentes" ? "bar" : "line",
    data: {
      labels: [
        "08h",
        "09h",
        "10h",
        "11h",
        "12h",
        "13h",
        "14h",
        "15h",
        "16h",
        "17h",
        "18h",
        "19h",
      ],
      datasets: [
        {
          label: nomeMetrica,
          data: dadosMetrica.serie,
          borderColor: dados.cor,
          backgroundColor:
            metrica === "incidentes" ? dados.cor + "55" : dados.cor + "22",
          fill: metrica !== "incidentes",
          tension: 0.3,
          borderWidth: 2,
          pointRadius: metrica === "incidentes" ? 0 : 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  document.getElementById("modalMetrica").classList.add("show");
}

function fecharModalMetrica() {
  document.getElementById("modalMetrica").classList.remove("show");
}

document.getElementById("btnAnterior").addEventListener("click", function () {
  trocarLinha(-1);
});

document.getElementById("btnProxima").addEventListener("click", function () {
  trocarLinha(1);
});

document.getElementById("fecharModal").addEventListener("click", function () {
  fecharModalMetrica();
});

document
  .getElementById("modalMetrica")
  .addEventListener("click", function (event) {
    if (event.target === document.getElementById("modalMetrica")) {
      fecharModalMetrica();
    }
  });

const cards = document.querySelectorAll(".card-indicador");

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {
    const metrica = cards[i].dataset.metrica;
    abrirModalMetrica(metrica);
  });
}

renderizarLinha();
