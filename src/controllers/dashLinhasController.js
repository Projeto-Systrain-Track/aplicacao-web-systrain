function dashLinhas(req, res) {
    res.json({
        servidoresAtivos: "5/6",
        statusSistema: "Operação parada",
        latenciaMedia: "RB_SRV_MIK",
        incidentesAbertos: "15",

        resumo: [
            { nome: "Latência elevada", valor: 4 },
            { nome: "Uso de CPU elevado", valor: 1 },
            { nome: "Pico de RAM", valor: 3 },
            { nome: "Servidor offline", valor: 1 },
        ],

        alertas: [
            { tipo: "Crítico", msg: "Servidor RB_SRV_MIK - Offline" },
            { tipo: "Atenção", msg: "Servidor RB_SRV_ALF - RAM em 95%" },
            { tipo: "Atenção", msg: "Servidor RB_SVR_DELT - CPU em 92%" }
        ],

        servidores: [
            { nome: "RB_SVR_MIK", status: "Offline", cpu: '', ram: '', disco: '', latencia: "0ms", uptime: "0h" },
            { nome: "RB_SVR_DELT", status: "Online", cpu: 92, ram: 91, disco: 25, latencia: "100ms", uptime: "21h" },
            { nome: "RB_SVR_ALPH", status: "Online", cpu: 62, ram: 88, disco: 50, latencia: "98ms", uptime: "22h" },
            { nome: "SV-PRIM", status: "Online", cpu: 60, ram: 87, disco: 50, latencia: "95ms", uptime: "22h" },
            { nome: "SV-JOKT", status: "Online", cpu: 60, ram: 20, disco: 50, latencia: "90ms", uptime: "21h" },
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