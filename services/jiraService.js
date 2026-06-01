const axios = require("axios");

var ambiente_processo = 'desenvolvimento';
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
require("dotenv").config({ path: caminho_env });

var JIRA_EMAIL = process.env.JIRA_EMAIL;
var JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
var JIRA_BASE_URL = process.env.JIRA_BASE_URL;

function extrairDescricao(campoDescricao) {
    if (!campoDescricao) return "Sem descrição";
    if (typeof campoDescricao === "string") return campoDescricao;
    
    try {
        if (campoDescricao.content) {
            var textoFinal = "";
            for (var i = 0; i < campoDescricao.content.length; i++) {
                var paragrafo = campoDescricao.content[i];
                if (paragrafo.content) {
                    for (var j = 0; j < paragrafo.content.length; j++) {
                        if (paragrafo.content[j].text) {
                            textoFinal += paragrafo.content[j].text;
                        }
                    }
                }
                textoFinal += "\n";
            }
            return textoFinal.trim();
        }
    } catch (e) {
        return "[Jira service] Erro ao processar descrição.";
    }
    return "[Jira service] Ver detalhe no painel Jira.";
}

async function buscarIssues(fkEmpresa) {
    try {
        var resposta = await axios.get(
            `${JIRA_BASE_URL}/rest/api/3/search/jql`,
            {
                params: {
                    jql: `project = KAN AND labels = "empresa:${fkEmpresa}" AND created >= startOfDay() ORDER BY created DESC`,
                    maxResults: 100,
                    fields: ["summary", "description", "status", "priority", "created", "labels", "assignee"]
                },
                headers: { Accept: "application/json" },
                auth: { username: JIRA_EMAIL, password: JIRA_API_TOKEN }
            }
        );

        var issuesJira = resposta.data.issues || [];
        var listaFormatada = [];

        for (var i = 0; i < issuesJira.length; i++) {
            var issue = issuesJira[i];
            var labels = issue.fields.labels || [];

            var componente = "Desconhecido";
            var idMaquina = "N/A";
            var nomeLinha = "Não informada";
            var corLinha = "#7f8c8d";

            for (var j = 0; j < labels.length; j++) {
                var label = labels[j];
                if (label.startsWith("componente:")) {
                    componente = label.split(":")[1].toUpperCase();

                } else if (label.startsWith("id_maquina:")) {
                    idMaquina = label.split(":")[1];

                } else if (label.startsWith("linha:")) {
                    nomeLinha = label.split(":")[1];

                } else if (label.startsWith("cor:")) {
                    corLinha = label.split(":")[1];
                }
            }

            var nomeAnalista = "Não atribuído";
            if (issue.fields.assignee && issue.fields.assignee.displayName) {
                nomeAnalista = issue.fields.assignee.displayName;
            }

            var dataCriacao = new Date(issue.fields.created);
            var horarioFormatado = dataCriacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

            listaFormatada.push({
                id: issue.id,
                key: issue.key,
                link: `${JIRA_BASE_URL}/browse/${issue.key}`,
                titulo: issue.fields.summary,
                descricao: extrairDescricao(issue.fields.description),
                status: issue.fields.status.name.toUpperCase(),
                prioridade: issue.fields.priority ? issue.fields.priority.name : "Medium",
                horario: horarioFormatado,
                analista: nomeAnalista,
                componente: componente,
                id_maquina: idMaquina,
                linha: nomeLinha,
                corLinha: corLinha,
                etiquetas: labels
            });
        }

        return listaFormatada;

    } catch (erro) {
        console.log("[Jira service] Erro ao buscar dados no Jira:", erro.response?.data || erro.message);
        throw erro;
    }
}

async function filtrarDashboard(fkEmpresa) {
    var incidentes = await buscarIssues(fkEmpresa);

    var totalDoDia = incidentes.length;
    var abertos = 0;
    var semResponsavel = 0;
    var slaRisco = 0;

    var qtdAlta = 0;
    var qtdMedia = 0;
    var qtdBaixa = 0;

    for (var i = 0; i < incidentes.length; i++) {
        var item = incidentes[i];

        if (item.status !== "CONCLUÍDO" && item.status !== "DONE" && item.status !== "RESOLVIDO") {
            abertos++;
        }

        if (item.analista === "systraintrack" || item.analista === "Não Atribuído") { //so p contar o nome da organização como nao atribuido
            semResponsavel++;
        }

    }

    return {
        kpis: {
            kpi_incidentesDia: totalDoDia,
            kpi_incidentesAbertos: abertos,
            kpi_slaRisco: slaRisco,
            kpi_semResponsavel: semResponsavel
        },
        listaIncidentes: incidentes,
    };
}

module.exports = {
    buscarIssues,
    filtrarDashboard
};