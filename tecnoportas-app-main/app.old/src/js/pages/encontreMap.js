var encontreMap = {
  /*Variáveis Globais 1*/
  dds: null,

  /*Elementos Globais*/
  imgRLogo: null,
  divRazao: null,
  divFant: null,
  divCnpj: null,
  sRua: null,
  sNum: null,
  sBairro: null,
  sVCompl: null,
  sCompl: null,
  sUf: null,
  sPais: null,
  sCep: null,
  divCNome: null,
  sSobrenome: null,
  divRTel: null,
  divREmail: null,
  btAbrirMapa: null,
  divMapa: null,

  /*Eventos Iniciais*/
  inicializar: function (dds) {
    encontreMap.imgRLogo = app.E("imgRLogo");
    encontreMap.divRazao = app.E("divRazao");
    encontreMap.divFant = app.E("divFant");
    encontreMap.divCnpj = app.E("divCnpj");
    encontreMap.sRua = app.E("sRua");
    encontreMap.sNum = app.E("sNum");
    encontreMap.sBairro = app.E("sBairro");
    encontreMap.sVCompl = app.E("sVCompl");
    encontreMap.sCompl = app.E("sCompl");
    encontreMap.sUf = app.E("sUf");
    encontreMap.sPais = app.E("sPais");
    encontreMap.sCep = app.E("sCep");
    encontreMap.divCNome = app.E("divCNome");
    encontreMap.sSobrenome = app.E("sSobrenome");
    encontreMap.divRTel = app.E("divRTel");
    encontreMap.divREmail = app.E("divREmail");
    encontreMap.btAbrirMapa = app.E("btAbrirMapa");
    encontreMap.divMapa = app.E("divMapa");

    encontreMap.dds = dds;

    encontreMap.btAbrirMapa.addEventListener("click", encontreMap.btAbrirMapaClick);

    encontreMap.configDets();
  },
  configDets: function () {
  var dds = encontreMap.dds;
  Loader.mostrar();
  app.getImgFromApi(dds.foto, function (res, status) {
      if (status) {
        Loader.remover();
        encontreMap.imgRLogo.src = res;
        $(encontreMap.imgRLogo).removeClass("loader-cog");
      }
      else {
        Loader.remover();
        app.RE(encontreMap.imgRLogo);
      }
    });

    if (dds.razao_social) {
      encontreMap.divRazao.innerHTML = dds.razao_social;
    }
    else {
      app.RE(encontreMap.divRazao);
    }

    encontreMap.divFant.innerHTML = dds.nome_fantasia;
    if (dds.cnpj) {
      encontreMap.divCnpj.innerHTML = dds.cnpj;
    }
    else {
      app.RE(encontreMap.divCnpj);
    }

    encontreMap.sRua.innerHTML = dds.logradouro;
    encontreMap.sNum.innerHTML = dds.numero;
    encontreMap.sBairro.innerHTML = dds.bairro;
    if (dds.complemento) {
      encontreMap.sCompl.innerHTML = dds.complemento;
    }
    else {
      app.RE(encontreMap.sVCompl);
      app.RE(encontreMap.sCompl);
    }
    encontreMap.sUf.innerHTML = dds.uf;
    encontreMap.sPais.innerHTML = dds.pais;
    encontreMap.sCep.innerHTML = dds.cep;

    encontreMap.divCNome.innerHTML = dds.nome + " " + dds.sobrenome;

    if (dds.ddd) {
      encontreMap.divRTel.innerHTML = "<a href='tel:" + dds.ddd + dds.telefone + "'>" +
          "(" + dds.ddd + ") " + dds.telefone + 
        "</a>";
    }
    else {
      app.RE(encontreMap.divRTel);
    }

    encontreMap.divREmail.innerHTML = "<a href='mailto:" + dds.email + "'>" + dds.email + "</a>";

    /*
    var gm = new GoogleMaps(encontreMap.divMapa, dds.lat, dds.lng, false);
     gm.mostrar(function () {
       gm.addMarcador(dds.lat, dds.lng, dds.razao_social ? dds.razao_social : dds.nome_fantasia);
     });*/
  },
   btAbrirMapaClick: function () {
    var dds = encontreMap.dds;
    var geoDds = dds.lat + "," + dds.lng,
      linkMapa = "";
    if (app.isPlatform("ios")) {
        linkMapa = "maps://?q=" + geoDds;
    }
    else {
        linkMapa = "geo:" + geoDds + "?q=" + geoDds;
    }
    cordova.InAppBrowser.open(linkMapa, "_system");
   }
};