// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../index.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
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