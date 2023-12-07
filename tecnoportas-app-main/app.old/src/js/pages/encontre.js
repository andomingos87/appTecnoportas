var encontre = {
  /*Variáveis Globais1*/
  e: {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceara",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MS": "Mato Grosso",
    "MT": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins"
  },
  platform: null,

  /*Elementos Globais*/
  formEncontre: null,
  seEstado: null,
  seCidade: null,
  btProcurar: null,

  /*Eventos Iniciais*/
  inicializar: function () {
    encontre.formEncontre = app.E("formEncontre");
    encontre.seEstado = app.E("seEstado");
    encontre.seCidade = app.E("seCidade");
    encontre.btProcurar = app.E("btProcurar");
    encontre.platform = cordova.platformId;


    encontre.seEstado.addEventListener("change", encontre.seEstadoChange);
    // encontre.btProcurar.addEventListener("click", encontre.formEncontreSubmit);
    encontre.formEncontre.addEventListener("submit", encontre.formEncontreSubmit);
    
    if(encontre.platform != "browser"){
      cordova.plugins.diagnostic.getLocationMode(function(locationMode){
        switch(locationMode){
            case cordova.plugins.diagnostic.locationMode.HIGH_ACCURACY:
                console.log("High accuracy");
                break;
            case cordova.plugins.diagnostic.locationMode.BATTERY_SAVING:
                console.log("Battery saving");
                break;
            case cordova.plugins.diagnostic.locationMode.DEVICE_ONLY:
                console.log("Device only");
                break;
            case cordova.plugins.diagnostic.locationMode.LOCATION_OFF:
                console.log("Location off");
                encontre.ativaLocalizacao();
                break;
        }
      },function(error){
          console.error("The following error occurred: "+error);
      });
    }

    encontre.getEstados();
  },
  ativaLocalizacao: function(){
    cordova.plugins.locationAccuracy.canRequest(function(canRequest){
      if (canRequest) {
          cordova.plugins.locationAccuracy.request(function () {
                  console.log("Requisição de localização concebida com sucesso");
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
                  }, 3500);

              }, function (error) {
                  app.Erro("Erro na requisição de localização: " + JSON.stringify(error));
                  if (error) {
                      // Android only
                      app.Erro("erro codigo=" + error.code + "; mensagem de erro=" + error.message);
                      if (encontre.platform === "android" && error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                          if (window.confirm("Falha ao ativar o GPS. Você gostaria de tentar ativar manualmente?")) {
                              cordova.plugins.diagnostic.switchToLocationSettings();
                          }
                      }
                  }
              }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
          );
      } else {
          // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
          // On Android, this will occur if the app doesn't have authorization to use location.
          app.Erro("Não foi possível solicitar a sua localização");
      }
    });
  },
  getEstados: function () {
    var api = new Api("representantes/getEstados");

    api.send(function (res) {
      if (!res.error) {
        app.limpaObj(encontre.seEstado, 1);

        if (res.length) {
          for (var i = 0; i < res.length; i++) {
            var op = app.CE("option", { value: res[i].uf });
            op.innerHTML = encontre.e[res[i].uf];

            encontre.seEstado.appendChild(op);
          }
        }
        else {
          var msg = new Mensagem("Nenhum Representante Encontrado no Momento!");
          msg.mostrar(function () {
            app.onBackButtonClick();
          });
        }
      }
      else {
        app.Erro(res);
      }
    });
  },
  getCidades: function (uf) {
    var api = new Api("representantes/getCidades/?uf=" + uf);

    api.send(function (res) {
      if (!res.error) {
        app.limpaObj(encontre.seCidade, 1);

        if (res.length) {
          for (var i = 0; i < res.length; i++) {
            var op = app.CE("option", { value: res[i].cidade });
            op.innerHTML = res[i].cidade;

            encontre.seCidade.appendChild(op);
          }
          encontre.seCidade.disabled = false;
        }
        else {
          var msg = new Mensagem("Nenhuma Cidade Encontrada no Momento!");
          msg.mostrar(function () {
            app.onBackButtonClick();
          });
        }
      }
      else {
        app.Erro(res);
      }
    });
  },
  /*Eventos */
  seEstadoChange: function (){
    if (this.value != 0){
      encontre.getCidades(this.value);
    }
    else{
      encontre.seCidade.value = 0;
      encontre.seCidade.disabled = true;
    }
  },
  formEncontreSubmit: function (e){
    e.preventDefault();

    var oEstado = $('#seEstado').val(),
      oCidade = $('#seCidade').val();
    
    
    var tEstado = oEstado,
      tCidade = oCidade;


    if (tEstado < 1){
      $(oEstado.parentNode).addClass("is-invalid");
    }
    else if (tCidade < 1){
      $(oCidade.parentNode).addClass("is-invalid");
    }
    else{
      var arrayBusca = {
        uf: tEstado,
        cidade: tCidade
      };

      app.abrirPag("encontreList", [arrayBusca]);
    }
  }
}
