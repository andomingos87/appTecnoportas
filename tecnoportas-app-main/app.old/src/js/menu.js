"use strict";
var menu = {
  /*Variáveis Globais */
  // header: null,

  /*Elementos Globais*/
  liHome: null,
  liLogin: null,
  liNOrcamento: null,
  liCadastro: null,
  liProdutos: null,
  liNoticias: null,
  liMeusOrcs: null,
  liMeusClis: null,
  liCatalogo: null,
  liEncontre: null,
  liAtendimento: null,
  liSobre: null,
  liSair: null,

  inicializar: function () {
    this.liHome = app.E("liHome");
    this.liLogin = app.E("liLogin");
    this.liNOrcamento = app.E("liNOrcamento");
    this.liCadastro = app.E("liCadastro");
    this.liProdutos = app.E("liProdutos");
    this.liNoticias = app.E("liNoticias");
    this.liMeusOrcs = app.E("liMeusOrcs");
    this.liMeusClis = app.E("liMeusClis");
    this.liCatalogo = app.E("liCatalogo");
    this.liEncontre = app.E("liEncontre");
    this.liAtendimento = app.E("liAtendimento");
    this.liSobre = app.E("liSobre");
    this.liSair = app.E("liSair");

    if (!app.thisUser || app.thisUser[0].is_aprovado == 0){
      if(app.thisUser){
        this.liSair.addEventListener("click", this.liSairClick);
        app.RE(this.liLogin);
        app.RE(this.liCadastro);
      }else{
        app.RE(this.liSair);
      }
      
      app.RE(this.liProdutos);
      app.RE(this.liNOrcamento);
      app.RE(this.liMeusOrcs);
      app.RE(this.liMeusClis);
      
      this.liLogin.addEventListener("click", this.liLoginClick);
      this.liCadastro.addEventListener("click", this.liCadastroClick);
    }
    else {
      app.RE(this.liLogin);
      app.RE(this.liCadastro);
      this.liProdutos.addEventListener("click", this.liProdutosClick);
      this.liNOrcamento.addEventListener("click", this.liNOrcamentoClick);
      this.liMeusOrcs.addEventListener("click", this.liMeusOrcsClick);
      this.liMeusClis.addEventListener("click", this.liMeusClisClick);
      this.liSair.addEventListener("click", this.liSairClick);
    }

    this.liHome.addEventListener("click", this.liHomeClick);
    this.liNoticias.addEventListener("click", this.liNoticiasClick);
    this.liCatalogo.addEventListener("click", this.liCatalogoClick);
    this.liEncontre.addEventListener("click", this.liEncontreClick);
    this.liAtendimento.addEventListener("click", this.liAtendimentoClick);
    this.liSobre.addEventListener("click", this.liSobreClick);
  },

  /*Eventos */
  liHomeClick: function () {
    if (app.thisPage().id != "home") {
      app.abrirPag("home");
    }
    header.btMenuToggleClick(false);
  },
  liNOrcamentoClick: function () {
    
    if (app.thisPage().id != "orcamento1") {
      app.abrirPag("orcamento1");
    }

    header.btMenuToggleClick(false);
  },
  liProdutosClick: function () {
    if (app.thisPage().id != "produtos") {
      app.abrirPag("produtos");
    }
    header.btMenuToggleClick(false);
  },
  liMeusOrcsClick: function () {
    if (app.thisPage().id != "meusOrcamentos") {
      app.abrirPag("meusOrcamentos");
    }
    header.btMenuToggleClick(false);
  },
  liMeusClisClick: function () {
    if (app.thisPage().id != "meusClientes") {
      app.abrirPag("meusClientes");
    }
    header.btMenuToggleClick(false);
  },
  liLoginClick: function () {
    if (app.thisPage().id != "login") {
      app.abrirPag("login");
    }
    header.btMenuToggleClick(false);
  },
  liCadastroClick: function () {
    if (app.thisPage().id != "cadastro") {
      app.abrirPag("cadastro");
    }
    header.btMenuToggleClick(false);
  },
  liNoticiasClick: function () {
    if (app.thisPage().id != "feed") {
      app.abrirPag("feed");
    }
    header.btMenuToggleClick(false);
  },
  liCatalogoClick: function () {
    if (app.thisPage().id != "catalogo") {
      app.abrirPag("catalogo");
    }
    header.btMenuToggleClick(false);
  },
  liEncontreClick: function () {
    Loader.mostrar();

    var gps = new app.GPS(false),
      temp = null,
      is_gps = true,
      abrirEBusca = function () {
        Loader.remover();
        if (app.thisPage().id != "encontre") {
          app.abrirPag("encontre");
        }
      };

    if (!app.isPlatform("browser")) {
      gps.getLocal(function (res) {
        if (is_gps) {
          clearInterval(temp);
          var c = res.coords;
          if (c) {
            Loader.remover();

            var arrayBusca = {
              lat: c.latitude,
              lng: c.longitude
            };

            app.abrirPag("encontreList", [arrayBusca]);
          }
          else {
            abrirEBusca();
          }
        }
      });
      temp = setTimeout(function () {
        is_gps = false;
        abrirEBusca();
      }, 2000);
    }
    else {
      abrirEBusca();
    }

    header.btMenuToggleClick(false);
  },
  liAtendimentoClick: function () {
    var num = false;
    if (app.thisUser[0]){
      console.log("numero");
      var ud = app.thisUser[0];
      if (ud.ve_ddd){
        num = ud.ve_ddd + ud.ve_numero;
      }
    }
    if (num){
      cordova.InAppBrowser.open("https://api.whatsapp.com/send?phone=55"+num,"_system");        
    }
    else if (app.thisPage().id != "atendimento"){
     app.abrirPag("atendimento");
    }
    header.btMenuToggleClick(false);
  },
  liSobreClick: function () {
    if (app.thisPage().id != "sobre") {
      app.abrirPag("sobre");
    }
    header.btMenuToggleClick(false);
  },
  liSairClick: function () {
    header.btMenuToggleClick(false);
    app.logout();
  }
};