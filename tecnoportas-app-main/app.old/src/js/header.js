"use strict";
var header = {
  /*Variáveis Globais*/
  header: null,
  pageTitle: null,
  sideMenu: null,
  appConfigs: null,

  /*header elementos Globais*/
  btOverlay: null,
  btMenuToggle: null,
  btVoltar: null,
  /*Eventos Iniciais*/
  inicializar: function (id) {
    header.header = app.E("header");
    header.pageTitle = app.E("page_title");
    header.sideMenu = app.E("sideMenu");
    header.btVoltar = app.E("btVoltar");
    header.btTest = app.E('btTest');

    header.btOverlay = app.E("btOverlay");
    header.btMenuToggle = app.E("btMenuToggle");

     header.btMenuToggle.addEventListener("click", header.btMenuToggleClick);
    header.btOverlay.addEventListener("click", header.btMenuToggleClick);
    header.btVoltar.addEventListener("click", app.onBackButtonClick);

    header.configHeader(id);

    $(this.header).addClass("is-internal");
    console.log();
    this.addEventTobtTest();
    
  },
  configHeader: function (id) {
    //Swipe menu
    app.swipedetect(document.body, function (dir) {
      if (dir == "d" || dir == "e") {
        var hc = $(header.header).hasClass('is-active');
        if ((!hc && dir == "d")) {
          header.btMenuToggleClick();
        }
        else if ((hc && dir == "e")) {
          header.btMenuToggleClick();
        }
      }
    });
    var nome = app.nome;
    switch (id) {
      case "qrcode": nome = "QR Code";
      break;
    }
    header.setPageTitle(nome);
  },
  setPageTitle: function (t) {
    header.pageTitle.innerHTML = t;
  },
  //abre menu
  btMenuToggleClick: function (status) {
    var has = $("#header").hasClass("is-active");

    if (status !== has || status == undefined) {
      $(header.header).toggleClass("is-active");
      $(body).toggleClass("is-active");
      if (!has && app.ObjPullToRefresh) {
        removePullToRefresh();
      }
      else if (app.ObjPullToRefresh) {
        addPullToRefresh(IdPullToRefresh, FuPullToRefresh);
      }
    }
  },
  addEventTobtTest: function() {
    header.btTest.addEventListener('click', function(){
      app.abrirPag('home');
    });
  }
};