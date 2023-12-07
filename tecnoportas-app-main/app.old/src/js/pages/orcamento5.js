"use strict";
var orcamento5 = {
  tipoAciona: null,
  motor: null,
  testeira: null,
  autSelecionado: 0,
  btnAvancar: null,
  btnVoltar: null,
  /*Variáveis Globais*/

  /*Elementos Globais*/

  /*Eventos Iniciais*/
  inicializar: function () {
    app.securityCheck();
    this.btnAvancar = app.E("btnAvancar");
    this.btnVoltar = app.E("btnlVoltar");
    this.motor = 0;
    this.testeira = 0;
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    var tmpLocal = vg.obterLocal();
    this.nTmpLocal = JSON.parse(tmpLocal);
    console.log(this.nTmpLocal);
    this.tipoAciona = app.E("tipoAciona");
    this._pegandoAutomatizadores();
    this.btnAvancar.addEventListener("click", this.btnAvancarClick);
    this.btnVoltar.addEventListener("click", app.onBackButtonClick);
  },
  _pegandoAutomatizadores: function () {
    var mApi = new Api('motores', { 'categoria': orcamento5.nTmpLocal.idCatMotor }, true, true);
    mApi.send(function (res) {
      var tpiDds = orcamento5.nTmpLocal.tipoDeInstalacao;
      var nPortas = app.N(orcamento5.nTmpLocal.quantidadeDePortas);
      var largura = app.N(orcamento5.nTmpLocal.largura);
      var altura = app.N(orcamento5.nTmpLocal.fnAltura);
      var pm2 = app.N(orcamento5.nTmpLocal.porm2);
      if (!res.error) {
        if (res.length > 0) {
          for (var key in res) {
            orcamento5._calcForumlasProd(res[key], largura, altura, nPortas, pm2, orcamento5.nTmpLocal.peso_total, tpiDds, "condicao", function(cback){
              if (cback == true) {
                orcamento5.motor = res[key];
                orcamento5.nTmpLocal.motorDds = orcamento5.motor;
              }
            });
          }
          setTimeout(function(){
            if (orcamento5.motor == 0) {
              var msg = new Mensagem("Não encontramos motores adequados para seu portão!");
              msg.setTipo("confirma");
              msg.setBotoes(["Voltar", "Cancelar"]);
              msg.mostrar(function (res) {
                if (res == 1) {
                  app.onBackButtonClick();
                }
                else {
                  app.abrirPag('home', [], false)
                }
              });
            }
            var tApi = new Api("motores/testeiras", { 'motor_id': orcamento5.motor.id }, true, true);
            tApi.send(function (tRes) {
              if (!tRes.error) {
                if (tRes.length > 0) {
                  orcamento5.testeira = tRes[0];
                  orcamento5.nTmpLocal.testeiraDds = orcamento5.testeira;
                  orcamento5.tipoAciona.innerHTML = "";
                  orcamento5.getAutoms();
                }
                else {
                  var msg = new Mensagem("Não encontramos a testeira adequada para seu portão!");
                  msg.setTipo("confirma");
                  msg.setBotoes(["Voltar", "Cancelar"]);
                  msg.mostrar(function (res) {
                    if (res == 1) {
                      app.onBackButtonClick();
                    }
                    else {
                      app.abrirPag('home', [], false)
                    }
                  });
                }
              }
              else {
                app.Erro(tRes);
              }
            });
          }, 1000)
        }
      }
      
    });
  },

  _calcForumlasProd: function (prod, largura, altura, nPortas, pm2, peso_total, tpiDds, formKey, callback) {
    var attPrfDds, attMatDds, attPrfChecked, attMatChecked, calc;

    calc = prod[formKey ? formKey : "formula"];
    if (calc) {
      attPrfDds = orcamento5.nTmpLocal.perfilID;
      attMatDds = orcamento5.nTmpLocal.modeloID;

      var varsFormula = {
        'ATT': orcamento5.nTmpLocal.altura,
        'LGP': largura,
        'ATP': altura,
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
  
  getAutoms: function () {
    Loader.mostrar();
    var api = new Api('motores/automatizadores', null, true, true);
    api.send(function (res) {
      orcamento5._criandoAutomatizadoresVazio(orcamento5.tipoAciona);
      if (!res.error) {
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            (function (dds) {
              orcamento5._criandoAutomatizadores(dds, orcamento5.tipoAciona);
            })(res[i]);
          }
        }
      }
      else {
        app.Erro(res);
      }
    });
    Loader.remover();
  },

  _criandoAutomatizadores: function (element, divPai) { 
    var imagem = app.CE('img', {'src': 'http://apptecnoportas.com.br/files?name='+element.imagem});
    var opcao = app.CE('div', {'class': 'opcao'});
    var label = app.CE('label', {'class': 'radio-azul'});
    var span = app.CE('span');
    var i = app.CE('i');
    var input = app.CE('input', {
      'value':element.id,
      'type':'radio',
      'class':'form-control cb-portas',
      'name':'modelos',
      'id': element.id,
    });

    span.innerHTML = element.nome;

    orcamento5._inserirAutomatizador(opcao, label, span, input, i, imagem, divPai, element);
  },

  _criandoAutomatizadoresVazio: function (divPai) {
    var imagem = app.CE('img', {'src': 'img/nenhum.png'});
    var opcao = app.CE('div', {'class': 'opcao'});
    var label = app.CE('label', {'class': 'radio-azul'});
    var span = app.CE('span');
    var i = app.CE('i');
    var input = app.CE('input', {
      'value': "0",
      'type':'radio',
      'class':'form-control cb-portas',
      'name':'modelos',
      'id': "nenhum_aut",
    });
    
    span.innerHTML = "Nenhum";
    
    orcamento5._inserirAutomatizador(opcao, label, span, input, i, imagem, divPai, null);
  },
  
  
  _inserirAutomatizador: function (opcao,label,span,input, i, imagem, divPai, dds) {
    
    imagem != null ? label.appendChild(imagem) : false;
    label.appendChild(span);
    label.appendChild(input);
    label.appendChild(i);
    opcao.appendChild(label);
    divPai.appendChild(opcao);

    (function(element,val,dados){
      element.addEventListener("click",function(){
        orcamento5.autSelecionado = val.value;
        orcamento5.nTmpLocal.autDds = dados;
        $('.botoes-form').addClass("-is-active");
      });
    })(label,input,dds);

   },

  btnAvancarClick: function(e){
    e.preventDefault();
    orcamento5.nTmpLocal.automatizador_id = orcamento5.autSelecionado;
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(JSON.stringify(orcamento5.nTmpLocal));
    app.abrirPag("orcamento6", [orcamento5.nTmpLocal]);
  }

};