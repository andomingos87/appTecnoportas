"use strict";
function Mensagem(texto, auto) {
    var self = this, Tipo = "alerta", Titulo = "Atenção:", Texto = texto, Botoes = ["ok", "cancelar"];
    /*Funções externas*/
    self.setTipo = function (texto) { Tipo = texto; };
    self.setTexto = function (texto) { Texto = texto; };
    self.setTitulo = function (texto) { Titulo = texto; };
    self.setBotoes = function (array) { Botoes = array; };
    self.mostrar = function (Retorno) {
        switch (Tipo) {
            case "confirma": navigator.notification.confirm(Texto, Retorno, Titulo, Botoes);
                break;
            case "texto": navigator.notification.prompt(Texto, Retorno, Titulo, Botoes);
                break;
            case "alerta":
            default: navigator.notification.alert(Texto, Retorno, Titulo, Botoes);
                break;
        }
    };
    /*Construtor*/
    if (auto) { self.mostrar(); }
};