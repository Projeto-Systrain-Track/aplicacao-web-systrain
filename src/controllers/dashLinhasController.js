function dashLinhas(req, res) {
    res.json({
        servidoresAtivos: 6,
        statusSistema: "Atenção",
        latenciaMedia: "RB_SVR_DELT",
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
            { nome: "RB_SVR_DELT", status: "Online", cpu: 75, ram: 50, disco: 25, latencia: "100ms", uptime: "21h" },
            { nome: "RB_SVR_ALPH", status: "Online", cpu: 80, ram: 40, disco: 50, latencia: "15ms", uptime: "22h" },
            { nome: "SV-PRIM", status: "Online", cpu: 80, ram: 40, disco: 50, latencia: "50ms", uptime: "22h" },
            { nome: "SV-JOKT", status: "Online", cpu: 60, ram: 20, disco: 50, latencia: "25ms", uptime: "21h" },
            { nome: "RB_SVR_BETA", status: "Online", cpu: 20, ram: 45, disco: 30, latencia: "50ms", uptime: "23h" },
            { nome: "SV-MHRT", status: "Online", cpu: 20, ram: 45, disco: 30, latencia: "150ms", uptime: "23h" },
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