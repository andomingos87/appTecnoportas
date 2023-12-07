"use strict";
var atendimento = {
    /*Variáveis Globais*/

    /*Elementos Globais*/
    formAtend: null,
    btVoltar2: null,

    /*Eventos Iniciais*/
    inicializar: function () {
        this.formAtend = app.E("formAtend");
        this.btVoltar2 = app.E("btVoltar2");

        this.formAtend.addEventListener("submit", this.formAtendSubmit);
        this.btVoltar2.addEventListener("click", app.onBackButtonClick);

        if (app.thisUser){
            this.formAtend['atendimento[nome]'].value = app.thisUser[0].nome + " " + app.thisUser[0].sobrenome;
            this.formAtend['atendimento[email]'].value = app.thisUser[0].email;

            $(this.formAtend.nome).prop("readonly", true);
            $(this.formAtend.email).prop("readonly", true);
        }
    },
    /*Eventos */
    formAtendSubmit: function (e){
        e.preventDefault();
        var self = this;
        console.log(self);

        var arrayDados = {
            "nome": self['atendimento[nome]'].value,
            "email": self['atendimento[email]'].value,
            "mensagem": self['atendimento[mensagem]'].value
        };

        console.log(arrayDados);
        var api = new Api("atendimento",{atendimento: arrayDados});

        api.send(function(res){
            console.log(res);
            if(!res.error){
                if(res == true){
                    var msg = new Mensagem("E-mail enviado com sucesso, responderemos o mais rápido possível",true);
                    app.abrirPag("home");
                }else{
                    var msg = new Mensagem("Ocorreu um erro no envio da sua solicitação, por favor tente novamente mais tarde",true);
                    app.abrirPag("home");
                }
            }else{
                app.Erro(res);
            }
        });

    }
};