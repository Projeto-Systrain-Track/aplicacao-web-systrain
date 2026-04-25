function dashLinhas(req, res) {
    res.json({
        servidoresAtivos: 8,
        statusSistema: "Degradado",
        latenciaMedia: "RBC_0001_SP",
        incidentesAbertos: "15",

        resumo: [
            { nome: "Latência elevada", valor: 2 },
            { nome: "Uso de CPU elevado", valor: 1 },
            { nome: "Pico de RAM", valor: 5 },
            { nome: "Servidor offline", valor: 7 },
        ],

        alertas: [
            { tipo: "Atenção", msg: "Latência elevada" },
            { tipo: "Atenção", msg: "Pico de RAM" },
            { tipo: "Atenção", msg: "Servidor offline" }
        ],

        servidores: [
            { nome: "REC-01", status: "Online", cpu: 80, ram: 40, disco: 50, latencia: "50ms", uptime: "22h" },
            { nome: "REC-02", status: "Online", cpu: 20, ram: 45, disco: 30, latencia: "50ms", uptime: "23h" },
            { nome: "REC-03", status: "Online", cpu: 60, ram: 20, disco: 90, latencia: "50ms", uptime: "21h" }
        ],

        graficoIncidentes: [
            { tempo: "10:00", valor: 10 },
            { tempo: "10:05", valor: 12 },
            { tempo: "10:10", valor: 8 },
            { tempo: "10:15", valor: 5 },
            { tempo: "10:20", valor: 10 },
            { tempo: "10:25", valor: 3 },
            { tempo: "10:30", valor: 1 },
        ]
    });
}

module.exports = {
    dashLinhas
};