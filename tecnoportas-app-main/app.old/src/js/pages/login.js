"use strict";
var login = {
    /*Variáveis Globais*/

    /*Elementos Globais*/
    formLogin: null,
    lnkEsqueciSenha: null,

    /*Eventos Iniciais*/
    inicializar: function () {
        this.formLogin = app.E("formLogin");
        this.lnkEsqueciSenha = app.E("lnkEsqueciSenha");

        this.formLogin.addEventListener("submit", this.formLoginSubmit);
        this.lnkEsqueciSenha.addEventListener("click", this.lnkEsqueciSenhaClick);


    },
    /*Eventos */
    formLoginSubmit: function (e){
        e.preventDefault();
        var self = this;
        var username = self.username.value,
            senha = self.senha.value;

        if (username.length <= 0 || senha.length <= 0) {
            $(self.username.parentNode.parentNode).addClass('is-invalid');
        }
        else {
            Loader.add(btSubmit);
            btSubmit.classList.add("branco");
            var api = new Api('login', { 'username': username, 'senha': senha, 'nivel' : 0 }, false);

            api.send(function (res) {
                if (res.error) {
                    if (res.error.toLowerCase().indexOf("Inválido!")) {
                        $(self.senha.parentNode.parentNode).addClass('is-invalid');
                    }
                    else {
                        app.Erro(res);
                    }
                    btSubmit.classList.remove("branco");
                    Loader.remove(btSubmit);
                }
                else {
                    var dds = res;
                    var bloq;
                    if(dds[0].is_aprovado != 1){
                        bloq = true;
                    }
                    dds[0].senha = senha;
                    app.setLogin(dds, function (id, old, bloqueado) {
                        btSubmit.classList.remove("branco");
                        Loader.remove(btSubmit);

                        if(bloqueado || bloq){
                            app.checaLogin();
                            app.thisUser[0].is_aprovado = 0;
                            app.abrirPag("home");
                        }else{
                            app.abrirPag("home");
                        }
                    });
                }
            });
        }
    },
    lnkEsqueciSenhaClick: function (){
        app.abrirPag("recuperar_senha");
    }
};