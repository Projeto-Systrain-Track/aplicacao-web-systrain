function dashLinhas(req, res) {
    res.json({
        servidoresAtivos: 8,
        statusSistema: "Degradado",
        latenciaMedia: "RBC_0001_SP",
        picoLatencia: "280ms",

        resumo: [
            { nome: "Swap lento", valor: 7 }
        ],

        alertas: [
            { tipo: "Atenção", msg: "Latência elevada" }
        ],

        servidores: [
            { nome: "REC-01", status: "Online", cpu: 80, ram: 40, disco: 50, latencia: "50ms", uptime: "22h" },
            { nome: "REC-02", status: "Online", cpu: 20, ram: 45, disco: 30, latencia: "50ms", uptime: "23h" },
            { nome: "REC-03", status: "Online", cpu: 60, ram: 20, disco: 90, latencia: "50ms", uptime: "21h" }
        ],

        graficoLatencia: [
            { tempo: "10:00", valor: 80 },
            { tempo: "10:05", valor: 120 },
            { tempo: "10:10", valor: 80 },
            { tempo: "10:15", valor: 70 },
            { tempo: "10:20", valor: 65 },
            { tempo: "10:25", valor: 100 },
            { tempo: "10:30", valor: 120 },
        ]
    });
}

module.exports = {
    dashLinhas
};