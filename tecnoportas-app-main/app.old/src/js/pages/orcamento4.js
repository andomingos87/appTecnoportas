"use strict";
var orcamento4 = {
  fechar: null,
  tipoMotor: null,
  informacoesDoFormulario: null,
  nTmpLocal: null,
  /*Variáveis Globais*/

  /*Elementos Globais*/
  btnVoltar: null,
  /*Eventos Iniciais*/
  inicializar: function (dados) {
    app.securityCheck();
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    var tmpLocal = vg.obterLocal();
    this.nTmpLocal = JSON.parse(tmpLocal);

    this._pegarTipoDoMotor();

    this.fechar = app.E("fechar");
    this.tipoMotor = app.E("tipoMotor");

    this.fechar.addEventListener("click", this.fecharClick);
    this.tipoMotor.addEventListener("click", this.tipoMotorClick);
    orcamento4.adicionaEventoBotoes();
  },
  _pegarTipoDoMotor: function () {
    var elemento = document.getElementById('lista-de-opcoes');
    while (elemento.firstChild) {
      elemento.removeChild(elemento.firstChild);
    }
    var api = new Api('motores/categorias', null, true, true);
    api.send(function (res) {
      if (!res.error) {
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            (function (dds) {
              console.log(dds);
              orcamento4._criarTipoDoMotor(dds, '#lista-de-opcoes');
            })(res[i]);
          }
        }
      } else {
        orcamento4._semMotores()
      }
    });
  },

  _semMotores: function () {
    orcamento4._criarSemMotores();
    orcamento4._inserirSemMotores();
  },

  _criarSemMotores: function(){
    var divPai ;
    var semMotor = app.CE('div',{'class': 'col-12'});
    semMotor.innerHTML = 'Nenhum tipo de Motor Disponível!';
    orcamento4._inserirSemMotores(semMotor, divPai);
  },

  _inserirSemMotores: function (semMotor, divPai) {
    divPai.appendChild(semMotor);
  },

  _criarTipoDoMotor :  function (element, divPai) {
    var opcao = app.CE('div', {'class': 'opcao'});
    var label = app.CE('label', {'class': 'radio-azul diferenciado'});
    var img = app.CE('img', {});
    var textoProduto = app.CE('div', {'class': 'texto-produto'});
    var spanCodProduto = app.CE('span', {});
    spanCodProduto.innerHTML = element.nome;
    var spanDetalheProduto = app.CE('span', {});
    spanDetalheProduto.innerHTML = element.descricao;
    var input = app.CE('input', {
      'value':element.nome,
      'type':'radio',
      'class':'form-control cb-portas',
      'name':'modelos',
      'id': element.id,
    });
    var i  = app.CE('i', {});
    (function (imgObj, imgSrc) {
      app.getImgFromApi(imgSrc, function (url, status) {
        imgObj.src = url;
      });
    })(img, element.imagem);
    orcamento4._inserirTipoDoMotor(opcao, label, img, textoProduto, spanCodProduto, 
      spanDetalheProduto, input, i, divPai);

  },

  _inserirTipoDoMotor : function (opcao, label, img, textoProduto, spanCodProduto, 
    spanDetalheProduto, input, i, divPai) {

    textoProduto.appendChild(spanCodProduto);
    textoProduto.appendChild(spanDetalheProduto);
    label.appendChild(img);
    label.appendChild(textoProduto);
    label.appendChild(input);
    label.appendChild(i);
    opcao.appendChild(label);
    app.E(divPai).appendChild(opcao);
  },

  adicionaEventoBotoes: function () {

    app.E('#btnlVoltar').addEventListener('click', app.onBackButtonClick);

    app.E('#btnAvancar').addEventListener('click', function () {
      orcamento4.pegaInformacoesDoFormulario();
      orcamento4.informacoesDoFormulario = Object.assign(orcamento4.informacoesDoFormulario, orcamento4.nTmpLocal);
      orcamento4.configuraParaVarGlobal();
      app.abrirPag('orcamento5', [orcamento4.informacoesDoFormulario], false)
    });

  },

  configuraParaVarGlobal: function () {
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(JSON.stringify(orcamento4.informacoesDoFormulario));
  },

  pegaInformacoesDoFormulario: function () {
    orcamento4.informacoesDoFormulario = {
      'tipoCatMotor': app.getRadioChecked('tipoMotor', 'modelos').value,
      'idCatMotor': app.getRadioChecked('tipoMotor', 'modelos').id,
    }

  },

  fecharClick: function () {
    $('.propaganda').addClass("-close");
  },
  
  tipoMotorClick: function () {
    $('input:radio').change(function () {
      if ($(this).is(":checked")) {
        $('.botoes-form').addClass("-is-active");
      }
    });
  }
};