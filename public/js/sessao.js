/*
// sessão

function limparSessao() {
    sessionStorage.clear();
    window.location = "../index.html";
}

// sessao usuario

function validarSessaoUsuario() {
    var nomeUser = sessionStorage.NOME_USUARIO
    var emailUser = sessionStorage.EMAIL_USUARIO
    var idUser = sessionStorage.ID_USUARIO

    if (nomeUser != null && emailUser != null && idUser != null) {
        var identificacao = document.getElementById("nome_user");
        var identificacaoMobile = document.getElementById("nome_user_m");

        if (identificacao != null) {
            identificacao.innerHTML = nomeUser;
        }
        if (identificacaoMobile != null) {
            identificacaoMobile.innerHTML =  nomeUser;
        }

    }else {
        window.location = "../loginUsuario.html";
    }

}

// sessão adm
function iniciarSessaoAdm(nome, email, nivel) {
    sessionStorage.NOME_ADM = nome
    sessionStorage.EMAIL_ADM = email
    sessionStorage.NIVEL_ADM = nivel
}

function validarSessaoAdm() {
    var nomeAdm = sessionStorage.NOME_ADM;
    var emailAdm = sessionStorage.EMAIL_ADM;
    var nivelAdm = sessionStorage.NIVEL_ADM;

    if (nomeAdm != null && emailAdm != null && nivelAdm != null) {
        var identificacao = document.getElementById("nome_adm");
        var identificacaoMobile = document.getElementById("nome_adm_m");
        if (identificacao != null) {
            identificacao.innerHTML = nomeAdm + " | N" + nivelAdm;
        }
        if (identificacaoMobile != null) {
            identificacaoMobile.innerHTML = nomeAdm + " | N" + nivelAdm;
        }
    } else {
        window.location = "../loginUsuario.html";
    }
}
function limparDuvida() {
    input_mensagem.value = "";
    input_emailContato.value = "";
}
    */