"use strict";var sobre={divContainer:null,btVoltar2:null,texto:null,inicializar:function(){sobre.divContainer=app.E("divContainer"),sobre.texto=app.E("texto"),new Api("ajustes/gerais").send(function(n){sobre.texto.innerHTML=n.sobre_nos})}};