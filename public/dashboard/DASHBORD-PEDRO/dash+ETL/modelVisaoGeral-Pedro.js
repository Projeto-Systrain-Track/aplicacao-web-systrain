

const fs = require("fs");

function obterDashboard() {

    const conteudo = fs.readFileSync(
        "./dashboard.json",
        "utf8"
    );

    return JSON.parse(conteudo);
}

module.exports = {
    obterDashboard
};


