"use strict";
var feed = {
    /*Variáveis Globais*/
    
    /*Elementos Globais*/
    divContainer: null,
    btVoltar2: null,

    /*Eventos Iniciais*/
    inicializar: function () {
      feed.divContainer = app.E("divContainer");

      feed.getFeed();
    },
    getFeed: function () {
      var api = new Api("informacoes");

      api.send(function (res){
        if (!res.error){
          if (res.length){
            app.limpaObj(feed.divContainer);
            for(var i = 0; i < res.length; i++){
              feed.divContainer.appendChild(feed.geraFeed(res[i]));
            }
          }
          else{
            feed.divContainer.innerHTML = "Nenhum Feed Encontrado!";
          }
        }
        else{
          app.Erro(res);
        }
      });
    },
    geraFeed: function (dds){
      var divInf = app.CE("div", {
        class: "informacao"
      }), divImg = app.CE("div", {
        class: "imagem"
      }), Imagem = app.CE("img", {
        class: "w-100"
      }), divTexto = app.CE("div", {
        class: "texto"
      }), h1Title = app.CE("h1"), 
          date = app.CE("span"),
          inft = app.CE("p");


      h1Title.innerHTML = dds.nome;
      date.innerHTML = app.formataData(dds.dt_cadastro, true);
      inft.innerHTML = dds.descricao;

      app.getImgFromApi(dds.imagem, function (res, status){
        Imagem.src = res;
          var viewer = ImageViewer();
          $(Imagem).on("tap click", function () {
              viewer.show(this.src, this.src);
          });
      });


      divImg.appendChild(Imagem);
      divInf.appendChild(divImg);
      divTexto.appendChild(h1Title);
      divTexto.appendChild(date);
      divTexto.appendChild(inft);
      divInf.appendChild(divTexto);

      return divInf;
    }
};