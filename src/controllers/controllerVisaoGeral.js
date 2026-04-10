function obterDadosVisaoGeral(req, res) {
    res.json({
        latenciaMedia: "62ms",
        linhasAtivas: "18 de 20",
        disponibilidade: "95%",
        incidentes: "11",

        maiorLatencia: [
            { nome: "Linha Safira", valor: "95ms" },
            { nome: "Linha Coral", valor: "40ms" }
        ],

        maisIncidentes: [
            { nome: "Linha Safira", valor: "9" },
            { nome: "Linha Coral", valor: "7" }
        ],

        linhas: [
            {
                nome: "Linha Safira",
                status: "Operando",
                servidores: "3/3",
                trens: "11/15",
                incidentes: "12",
                latencia: "50ms"
            },
            {
                nome: "Linha Esmeralda",
                status: "Atenção",
                servidores: "2/5",
                trens: "7/15",
                incidentes: "8",
                latencia: "120ms"
            },
            {
                nome: "Linha Diamante",
                status: "Offline",
                servidores: "0/6",
                trens: "0/15",
                incidentes: "8",
                latencia: "320ms"
            }

        ]
    });
}

module.exports = {
    obterDadosVisaoGeral
};