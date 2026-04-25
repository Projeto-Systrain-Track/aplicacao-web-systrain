function obterDadosVisaoGeral(req, res) {
    res.json({
        latenciaMedia: "62ms",
        linhaMaiorConsumo: "Linha 7 - Rubi",
        disponibilidade: "95%",
        incidentes: "11",

        maiorLatencia: [
            { nome: "Linha Diamante", cor: "#D9D9D9", valor: 150 },
            { nome: "Linha Safira", cor: "#A855F7", valor: 120 },
            { nome: "Linha Prata", cor: "#5E5E5E", valor: 100 },
            { nome: "Linha Esmeralda", cor: "#22E38F", valor: 90 },
            { nome: "Linha Rubi", cor: "#9C1F1F", valor: 75 }
        ],

        maisIncidentes: [
            { nome: "Linha Prata", cor: "#5E5E5E", valor: "15" },
            { nome: "Linha Safira", cor: "#A855F7", valor: "9" },
            { nome: "Linha Esmeralda", cor: "#22E38F", valor: "9" },
            { nome: "Linha Diamante", cor: "#D9D9D9", valor: "8" },
            { nome: "Linha Rubi", cor: "#9C1F1F", valor: "7" }
        ],
        
        linhas: [
            { 
                nome: "Linha Prata",
                status: "Atenção",
                servidores: "1/3",
                incidentes: "15",
                latencia: "100ms"
            },
            {
                nome: "Linha Safira",
                status: "Atenção",
                servidores: "2/3",
                incidentes: "9",
                latencia: "120ms"
            },
            {
                nome: "Linha Esmeralda",
                status: "Atenção",
                servidores: "5/5",
                incidentes: "9",
                latencia: "90ms"
            },
            {
                nome: "Linha Diamante",
                status: "Operando",
                servidores: "6/6",
                incidentes: "8",
                latencia: "150ms"
            },
            {
                nome: "Linha Rubi",
                status: "Operando",
                servidores: "6/6",
                incidentes: "7",
                latencia: "75ms"
            }

        ]
    });
}

module.exports = {
    obterDadosVisaoGeral
};