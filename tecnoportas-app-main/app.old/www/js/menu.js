"use strict";var menu={liHome:null,liLogin:null,liNOrcamento:null,liCadastro:null,liProdutos:null,liNoticias:null,liMeusOrcs:null,liMeusClis:null,liCatalogo:null,liEncontre:null,liAtendimento:null,liSobre:null,liSair:null,inicializar:function(){this.liHome=app.E("liHome"),this.liLogin=app.E("liLogin"),this.liNOrcamento=app.E("liNOrcamento"),this.liCadastro=app.E("liCadastro"),this.liProdutos=app.E("liProdutos"),this.liNoticias=app.E("liNoticias"),this.liMeusOrcs=app.E("liMeusOrcs"),this.liMeusClis=app.E("liMeusClis"),this.liCatalogo=app.E("liCatalogo"),this.liEncontre=app.E("liEncontre"),this.liAtendimento=app.E("liAtendimento"),this.liSobre=app.E("liSobre"),this.liSair=app.E("liSair"),app.thisUser&&0!=app.thisUser[0].is_aprovado?(app.RE(this.liLogin),app.RE(this.liCadastro),this.liProdutos.addEventListener("click",this.liProdutosClick),this.liNOrcamento.addEventListener("click",this.liNOrcamentoClick),this.liMeusOrcs.addEventListener("click",this.liMeusOrcsClick),this.liMeusClis.addEventListener("click",this.liMeusClisClick),this.liSair.addEventListener("click",this.liSairClick)):(app.thisUser?(this.liSair.addEventListener("click",this.liSairClick),app.RE(this.liLogin),app.RE(this.liCadastro)):app.RE(this.liSair),app.RE(this.liProdutos),app.RE(this.liNOrcamento),app.RE(this.liMeusOrcs),app.RE(this.liMeusClis),this.liLogin.addEventListener("click",this.liLoginClick),this.liCadastro.addEventListener("click",this.liCadastroClick)),this.liHome.addEventListener("click",this.liHomeClick),this.liNoticias.addEventListener("click",this.liNoticiasClick),this.liCatalogo.addEventListener("click",this.liCatalogoClick),this.liEncontre.addEventListener("click",this.liEncontreClick),this.liAtendimento.addEventListener("click",this.liAtendimentoClick),this.liSobre.addEventListener("click",this.liSobreClick)},liHomeClick:function(){"home"!=app.thisPage().id&&app.abrirPag("home"),header.btMenuToggleClick(!1)},liNOrcamentoClick:function(){"orcamento1"!=app.thisPage().id&&app.abrirPag("orcamento1"),header.btMenuToggleClick(!1)},liProdutosClick:function(){"produtos"!=app.thisPage().id&&app.abrirPag("produtos"),header.btMenuToggleClick(!1)},liMeusOrcsClick:function(){"meusOrcamentos"!=app.thisPage().id&&app.abrirPag("meusOrcamentos"),header.btMenuToggleClick(!1)},liMeusClisClick:function(){"meusClientes"!=app.thisPage().id&&app.abrirPag("meusClientes"),header.btMenuToggleClick(!1)},liLoginClick:function(){"login"!=app.thisPage().id&&app.abrirPag("login"),header.btMenuToggleClick(!1)},liCadastroClick:function(){"cadastro"!=app.thisPage().id&&app.abrirPag("cadastro"),header.btMenuToggleClick(!1)},liNoticiasClick:function(){"feed"!=app.thisPage().id&&app.abrirPag("feed"),header.btMenuToggleClick(!1)},liCatalogoClick:function(){"catalogo"!=app.thisPage().id&&app.abrirPag("catalogo"),header.btMenuToggleClick(!1)},liEncontreClick:function(){Loader.mostrar();function e(){Loader.remover(),"encontre"!=app.thisPage().id&&app.abrirPag("encontre")}var i=new app.GPS(!1),l=null,t=!0;app.isPlatform("browser")?e():(i.getLocal(function(i){t&&(clearInterval(l),(i=i.coords)?(Loader.remover(),i={lat:i.latitude,lng:i.longitude},app.abrirPag("encontreList",[i])):e())}),l=setTimeout(function(){t=!1,e()},2e3)),header.btMenuToggleClick(!1)},liAtendimentoClick:function(){var i,e=!1;app.thisUser[0]&&(console.log("numero"),(i=app.thisUser[0]).ve_ddd&&(e=i.ve_ddd+i.ve_numero)),e?cordova.InAppBrowser.open("https://api.whatsapp.com/send?phone=55"+e,"_system"):"atendimento"!=app.thisPage().id&&app.abrirPag("atendimento"),header.btMenuToggleClick(!1)},liSobreClick:function(){"sobre"!=app.thisPage().id&&app.abrirPag("sobre"),header.btMenuToggleClick(!1)},liSairClick:function(){header.btMenuToggleClick(!1),app.logout()}};