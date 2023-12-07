"use strict";
var orcamento7 = {
  
  /*Variáveis Globais*/
  pintura: null,
  tmpDados: null,
  /*Elementos Globais*/
  opcSim: null,
  opcNao: null,
  divPinturas: null,
  btnAvancar: null,
  fita: null,
  btnVoltar: null,
  /*Eventos Iniciais*/
  inicializar: function (dds) {
    app.securityCheck(); 
    console.log(dds);
    this.tmpDados = dds;
    this.divPinturas = app.E("divPinturas");
    this.opcSim = app.E("opcSim");
    this.opcNao = app.E("opcNao");
    this.btnAvancar = app.E("btnAvancar");
    this.btnVoltar = app.E("btnlVoltar");

    this.opcSim.addEventListener("click", this.opcSimClick);
    this.opcNao.addEventListener("click", this.opcNaoClick);
    this.btnAvancar.addEventListener("click", this.btnAvancarClick);
    this.btnVoltar.addEventListener("click", app.onBackButtonClick);
  },

  getPinturas: function() {
    var self = this;
    var api = new Api('portoes/pinturas');
    api.send(function (res) {
        self.divPinturas.innerHTML = "";
        if (!res.error) {
            if (res.length > 0) {
                console.log(res.length);
                for (var i = 0; i < res.length; i++) {
                  self._criandoPinturas(res[i], self.divPinturas)
                };
            }
            else {
                self.divPinturas.innerHTML = "<h3>Sem pinturas</h3>";
            }
        }
        else {
          app.Erro(res);
          semPinturas();
        }
    });
  },

  _criandoPinturas: function (element, divPai) {
    var divOpcao = app.CE(),
    label = app.CE('label', {'class': 'radio-azul diferenciado'}),
    input = app.CE('input', {
      'value':element.id,
      'type':'radio',
      'class':'form-control cb-portas',
      'name': 'cor',
      'id': element.id,
    }),
    i = app.CE('i'),
    figure = app.CE('figure'),
    img = app.CE('img',{src: "./img/loader.gif"}),
    span = app.CE('span',{class: "span"}),
    littleSpan = app.CE('span',{class: "span -little"});
    

    (function(obj, dados){
      obj.addEventListener("click", function(){
          orcamento7.pintura = dados.id;
          orcamento7.tmpDados.pinturaDds = dados;
          $('.botoes-form').addClass("-is-active");
      });
    })(label, element);

    (function (imgObj, imgSrc) {
      app.getImgFromApi(imgSrc, function (url, status) {
        imgObj.src = url;
      });
    })(img, element.imagem);

    span.innerHTML = element.nome;
    littleSpan.innerHTML = element.descricao;
    
    orcamento7._inserirPintura(label, input, i, figure, img, span, littleSpan, divPai);
  },
  
  _inserirPintura: function (label, input, i,figure, img, span, littleSpan, divPai) {
    label.appendChild(input);
    label.appendChild(i);
    figure.appendChild(img);
    label.appendChild(figure);
    label.appendChild(span);
    label.appendChild(littleSpan);
    divPai.appendChild(label);
  },

  getFita: function(retorno){
      var tpiDds = orcamento7.tmpDados.tipoDeInstalacao,
      largura = orcamento7.tmpDados.largura,
      nPortas = orcamento7.tmpDados.quantidadeDePortas,
      altura = orcamento7.tmpDados.fnAltura,
      pm2 = orcamento7.tmpDados.porm2,
      peso_total = orcamento7.tmpDados.peso_total;
  if(orcamento7.pintura){
      var api = new Api('portoes/fitaPVC', {'pintura_id': orcamento7.pintura });
      api.send(function (res) {
          if (!res.error) {
              if (res.length > 0) {
                  for (var key in res) {
                      orcamento7.calcForumlasProd(res[key], largura, altura, nPortas, pm2, peso_total, tpiDds, orcamento7.tmpDados.perfilID , orcamento7.tmpDados.modeloID, "condicao", function(callback){
                        console.log(callback);
                        if (callback == true) {
                          orcamento7.tmpDados.fitaDds = res[key];
                          retorno(res[key]);
                      }
                      });
                      
                  }
              }else{
                  var api2 = new Api('portoes/fitaPadrao');
                  api2.send(function (res) {
                      if (!res.error) {
                          if (res.length > 0) {
                              for (var key in res) {
                                  orcamento7.calcForumlasProd(res[key], largura, altura, nPortas, pm2, peso_total, tpiDds, orcamento7.tmpDados.perfilID , orcamento7.tmpDados.modeloID, "condicao", function(callback){
                                    console.log(callback);
                                    if (callback == true) {
                                      orcamento7.tmpDados.fitaDds = res[key];
                                      retorno(res[key]);
                                  }
                                  });
                                  
                              }
                          }
                      }else {
                          app.Erro(res);
                      }
                  });
              }
          }
          else {
              app.Erro(res);
          }
      });
  }else{
      var api2 = new Api('portoes/fitaPadrao');
      api2.send(function (res) {
          if (!res.error) {
              if (res.length > 0) {
                  for (var key in res) {
                      orcamento7.calcForumlasProd(res[key], largura, altura, nPortas, pm2, peso_total, tpiDds, orcamento7.tmpDados.perfilID , orcamento7.tmpDados.modeloID, "condicao", function(callback){
                        console.log(callback);
                        if (callback == true) {
                          console.log(res[key]);
                          orcamento7.tmpDados.fitaDds = res[key];
                          retorno(res[key]);
                      }
                      });
                      
                  }
              }
          }else {
              app.Erro(res);
          }
      });
    }
  },

  calcForumlasProd: function (prod, largura, altura, nPortas, pm2, peso_total, tpiDds, perfil, modelo, formKey, callback) {
    var attPrfDds, attMatDds, attPrfChecked, attMatChecked, calc;

    calc = prod[formKey ? formKey : "formula"];
    if (calc) {
      attPrfDds = perfil;
      attMatDds = modelo;

      var varsFormula = {
        'ATT': altura,
        'LGP': largura,
        'ATP': orcamento7.tmpDados.fnAltura,
        'PTP': nPortas,
        'PM2': pm2,
        'PKG': peso_total,
        'PRF': attPrfDds,
        'MAT': attMatDds,
        'TPI': tpiDds,
        'VL': prod.valor_unitario
      };
      app.addClasses('CalcFormula', function () {
        var cf = new CalcFormula(calc, varsFormula);
        callback(cf.calcula());
      });
    }
    callback(calc);
    
  },

  opcSimClick: function(){
    $('.botoes-form').removeClass("-is-active");
    orcamento7.getPinturas();
  },
  
  opcNaoClick: function(){
    orcamento7.pintura = null;
    orcamento7.divPinturas.innerHTML = "";
    $('.botoes-form').addClass("-is-active");
  },

  btnAvancarClick: function(e){
    e.preventDefault();
    orcamento7.getFita(function(res){
      orcamento7.fita = res;
      orcamento7.tmpDados.pintura = orcamento7.pintura;
      orcamento7.tmpDados.fita = orcamento7.fita;
      
      var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
      vg.salvarLocal(JSON.stringify(orcamento7.tmpDados));
      
      console.log(orcamento7.tmpDados);
      app.abrirPag("orcamento8",[orcamento7.tmpDados]);

    });
    
  }

};