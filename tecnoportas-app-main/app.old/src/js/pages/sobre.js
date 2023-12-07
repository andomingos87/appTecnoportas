"use strict";
var sobre = {
    /*Variáveis Globais*/
    
    /*Elementos Globais*/
    divContainer: null,
    btVoltar2: null,
    texto: null,

    /*Eventos Iniciais*/
    inicializar: function () {
      sobre.divContainer = app.E("divContainer");
      sobre.texto = app.E("texto");

      var api = new Api("ajustes/gerais");

      api.send(function(res){
        sobre.texto.innerHTML = res["sobre_nos"];
      });
    },

};