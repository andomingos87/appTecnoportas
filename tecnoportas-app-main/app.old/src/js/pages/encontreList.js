var encontreList = {
    /*Variáveis Globais1*/
    lat: null,
    lng: null,
    uf: null,
    cidade: null,
    btVoltar: null,
  
    /*Elementos Globais*/
    btEscolha: null,
    divLista: null,
  
    /*Eventos Iniciais*/
    inicializar: function (dds) {
      encontreList.btEscolha = app.E("btEscolha");
      encontreList.divLista = app.E("divLista");
      encontreList.btVoltar = app.E("btVoltar");
  
      console.log(dds);
      if (dds.lat){
        encontreList.lat = dds.lat;
        encontreList.lng = dds.lng;
      }
      else if (dds.uf){
        encontreList.uf = dds.uf;
        encontreList.cidade = dds.cidade;
      }
  
      encontreList.btEscolha.addEventListener("click", encontreList.btEscolhaClick);
      encontreList.btVoltar.addEventListener("click", app.onBackButtonClick);
      encontreList.getRepres();
    },
  
    getRepres: function () {
      var tBusca = "representantes";
  
      if (encontreList.lat){
        tBusca = "representantes/?lat=" + encontreList.lat + "&lng=" + encontreList.lng;
      }
      else if (encontreList.uf){
        tBusca = "representantes/?uf=" + encontreList.uf + "&cidade=" + encontreList.cidade;
      }
  
      var api = new Api(tBusca);
  
      api.send(function (res) {
        if (!res.error) {
          app.limpaObj(encontreList.divLista);
  
          if (res.length) {
            for (var i = 0; i < res.length; i++) {
              encontreList.divLista.appendChild(encontreList.geraRepres(res[i]));
            }
          }
          else {
            encontreList.divLista.innerHTML = "<p style='color:black'>Nenhum Representante Encontrado na sua Região!</p>";
          }
        }
        else {
          app.Erro(res);
        }
      });
    },
    geraRepres: function (dds) {
      var divItem = app.CE("div", { class: "item" }),
        divNome = app.CE("div", { class: "nome" }),
        divRep = app.CE("div", { class: "nome" }),
        divCont = app.CE("div", { class: "nome -contato" }),
        divTel = app.CE("div", { class: "nome -tel" });
  
      var nome = dds.razao_social ? dds.razao_social : dds.nome_fantasia;
  
      divNome.innerHTML = nome;
      divRep.innerHTML = dds.nome + " " + dds.sobrenome;
      divTel.innerHTML = dds.ddd + " " + dds.telefone;
      divCont.innerHTML = dds.bairro;
  
      (function (div, dds) {
        div.addEventListener("click", function () {
          app.abrirPag("encontreMap", [dds]);
        });
      })(divItem, dds);
  
      divItem.appendChild(divNome);
      divItem.appendChild(divRep);
      divItem.appendChild(divTel);
      divItem.appendChild(divCont);
  
      return divItem;
    },
    /*Eventos */
    btEscolhaClick: function () {
      app.abrirPag("encontre");
    }
  };
