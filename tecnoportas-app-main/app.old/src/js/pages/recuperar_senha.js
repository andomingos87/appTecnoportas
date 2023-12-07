"use strict";
var recuperar_senha = {
    /*Variáveis Globais*/

    /*Elementos Globais*/
    formEsqueciSenha: null,
    btVoltar2: null,

    /*Eventos Iniciais*/
    inicializar: function () {
        this.formEsqueciSenha = app.E("formEsqueciSenha");
        this.btVoltar2 = app.E("btVoltar2");

        this.formEsqueciSenha.addEventListener("submit", this.formEsqueciSenhaSubmit);
        this.btVoltar2.addEventListener("click", app.onBackButtonClick);
    },
    /*Eventos*/
    formEsqueciSenhaSubmit: function (e) {
        e.preventDefault();
        var self = this;
        var usernameES = self.usernameES.value;

        if (usernameES.length <= 0) {
            $(self.usernameES).addClass("is-invalid");
        }
        else {
            Loader.add(btSubmitES);
            var api = new Api("login/alteraSenha", { 'usuarioES': usernameES }, false);
            api.send(function (res) {
                if (res.error) {
                    if (res.error.toLowerCase().indexOf("inválido!")) {
                        $(self.usernameES).addClass('is-invalid');
                    }
                    else {
                        app.Erro(res);
                    }
                }
                else {
                    var msg = new Mensagem("Enviado para o email do usuário!", true);
                    app.abrirPag("login");
                }
                Loader.remove(btSubmitES);
            });
        }

    }
};