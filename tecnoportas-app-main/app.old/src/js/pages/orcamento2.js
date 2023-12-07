"use strict";
var orcamento2 = {
  portas: null,
  calc: null,
  informacoesDoFormulario: null,
  nTmpLocal: null,
  todasAsInstalacoes: null,
  tamanhoDaRespostaInstalacoes: null,

  /*Variáveis Globais*/
  tipoDeInstalacao: null,
  /*Elementos Globais*/
  btVolta: null,

  /*Eventos Iniciais*/
  inicializar: function (dados) {
    app.securityCheck();
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    var tmpLocal = vg.obterLocal();
    this.nTmpLocal = JSON.parse(tmpLocal);
    console.log(this.nTmpLocal);
    this.btVolta = app.E("btnVoltar");

    orcamento2._pegandoInstalacoes();
    this.adicionaEventoBotoes();

    this.portas = app.E("portas");
    this.calc = app.E("calc");

    /* Event */
    this.portas.addEventListener("click", this.portasClick);
    this.calc.addEventListener("keyup", this.calcClick);
    this.btVolta.addEventListener('click', app.onBackButtonClick)
    this.addMascara();

  },
  /*Eventos */

  adicionaEventoBotoes: function () {

    app.E('#btnAvancar').addEventListener('click', function () {
      orcamento2.pegaInformacoesDoFormulario();
      orcamento2.informacoesDoFormulario = Object.assign(orcamento2.informacoesDoFormulario, orcamento2.nTmpLocal);
      orcamento2.configuraParaVarGlobal();
      app.abrirPag('orcamento3', [orcamento2.informacoesDoFormulario], false)
    });
  },

  //FALTA ARRUMAR 
  _pegandoInstalacoes: function () {
    // Removendo todos os nós filhos de um elemento
    var elemento = document.getElementById('lista-opcao');
    while (elemento.firstChild) {
      elemento.removeChild(elemento.firstChild);
    }
    orcamento2.todasAsInstalacoes = new Array;
    var tpApi = new Api('atributos?tipo=tpi', null, true, true);
    tpApi.send(function (res) {
      var msgErr = function () {
        var msg = new Mensagem("Não foi possível obter os tipos de instalação para criar um novo orçamento!");
        msg.setTitulo("Atenção!");
        msg.mostrar(function () {
          app.abrirPag('inicio', [], false);
        });
      }
      if (!res.error) {
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            console.log(res[i]);
            orcamento2._criandoInstalacoes(res[i])
          }
        }
        else {
          msgErr();
        }
      } else {
        msgErr();
      }
    });
  },

  _criandoInstalacoes: function (element) {
    var divPai = '#lista-opcao';
    var opcaoTipo = app.CE('div', { 'class': 'opcao-tipo' });
    var label = app.CE('label', { 'class': 'radio-azul' });
    var spanNome = app.CE('span', {});
    spanNome.innerHTML = element.nome;
    var input = app.CE('input', {
      'id': element.nome,
      'type': 'radio',
      'class': 'form-control cb-portas vlMetros',
      'value': element.id,
      'name': 'instalacao'
    });
    var i = app.CE('i', {});
    orcamento2._inserirInstalacoes(divPai, opcaoTipo, label, spanNome, input, i);
  },

  _inserirInstalacoes: function (divPai, opcaoTipo, label, spanNome, input, i) {
    label.appendChild(spanNome);
    label.appendChild(input);
    label.appendChild(i);
    opcaoTipo.appendChild(label);
    app.E(divPai).appendChild(opcaoTipo);

    opcaoTipo.addEventListener("click", function(){
      orcamento2.tpiClick(input.value);
    });

  },

  pegaInformacoesDoFormulario: function () {
    var qtdPortas = app.getRadioChecked('formPortas', 'portas').value;
    var fnAltura = app.C(app.E('#tbAltura').value, "+", app.N(app.E('tbLargura').value) < 8.5 ? 0.6 : 0.9);

    orcamento2.informacoesDoFormulario = {
      'quantidadeDePortas': qtdPortas,
      'altura': app.E('#tbAltura').value,
      'largura': app.E('#tbLargura').value,
      'fnAltura': fnAltura,
      'tipoDeInstalacao': orcamento2.tipoDeInstalacao,
      'porm2': app.C(fnAltura, "*", app.E('tbLargura').value, 3)
    }

  },

  configuraParaVarGlobal: function () {
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(JSON.stringify(orcamento2.informacoesDoFormulario));
  },
  
  calcClick: function () {
    var inputAltura = app.E('#tbAltura').value;
    var inputLargura = app.E('#tbLargura').value;
    if (inputAltura != '0.000' && inputLargura != '0.000') {
        app.E('#instalacoes').classList.add("-is-active");
        if(orcamento2.tipoDeInstalacao){
          $('.botoes-form').addClass("-is-active");
        }
    }else{
      app.E('#instalacoes').classList.remove("-is-active");
      $('.botoes-form').removeClass("-is-active");
    }
  },

  tpiClick: function(id){
    orcamento2.tipoDeInstalacao = id;
    $('.botoes-form').addClass("-is-active");
  },

  portasClick: function () {
    $('input:radio').change(function () {
      if ($(this).is(":checked")) {
        $('.calculos').addClass("-is-active");
      }
    });
  },

  addMascara: function () {

    $('.vlMetros').mask('0000000000000000000000.000', { reverse: true, maxlength: false });

    $('.vlMetros').on('keyup', function (e) {

      var valor = this.value;
      if (valor.length < 4) {
        this.value = ('0.' + valor);
      } else if (valor.substring(0, 1) == '0') {
        this.value = valor.substring(1);
      }
    });//.trigger('keyup');

  },

};