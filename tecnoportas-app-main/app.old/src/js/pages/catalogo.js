"use strict";
var catalogo = {
    /*Variáveis Globais*/
    lista_catalogos: null,
    /*Elementos Globais*/
    divContainer: null,
    btVoltar2: null,

    /*Eventos Iniciais*/
    inicializar: function () {
      catalogo.lista_catalogos = app.E("divContainer");

      var api = new Api("ajustes/gerais");

      Loader.add(catalogo.lista_catalogos);
      api.send(function(res) {
        var catId = res.catalogo;
        catalogo.getPosts(catId);
      });
  
    },
    
  getPosts: function(id) {
    var api = new Api("arquivos?t_id=" + id);

    api.send(function(res) {
      if (!res.error) {
        app.limpaObj(catalogo.lista_catalogos);
        if (res.length) {
          for (var i = 0; i < res.length; i++) {
            catalogo.lista_catalogos.appendChild(
              catalogo.geraPosts(res[i])
            );
          }
          Loader.remove(catalogo.lista_catalogos);
        } else {
          Loader.remove(catalogo.lista_catalogos);
          catalogo.lista_catalogos.innerHTML = "Nenhum arquivo de catálogo encontrado :/";
        }
      } else {
        app.Erro(res);
      }
    });
  },

  geraPosts: function(dds) {
    var a = app.CE("a", {
        href: "#",
        class: "link",
        id: "post" + dds.id
      }),
      div = app.CE("div", {
        class: "catalogos w-100"
      }),
      i = app.CE("i", {
        class: "fas fa-file-download icone-catalogo"
      }),
      p = app.CE("p");

    p.innerHTML = dds.nome;

    (function(a, dds) {
      a.addEventListener("click", function() {
        app.abrirPost(dds.id, dds);
      });
    })(a, dds);

    div.appendChild(i);
    div.appendChild(p);
    a.appendChild(div);

    return a;
  },
};