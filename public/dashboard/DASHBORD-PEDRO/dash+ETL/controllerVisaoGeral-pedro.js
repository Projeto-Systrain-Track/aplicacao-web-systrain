

const model =
    require("./modelVisaoGeral-Pedro");

function obterDadosVisaoGeral(req, res) {

    try {

        const dados =
            model.obterDashboard();

        res.json(dados);

    } catch (erro) {

        console.error(erro);

        res.status(500).json(erro);
    }
}