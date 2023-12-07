 "use strict";
var orcamento3 = {
  etapa1: null,
  etapa2: null,
  etapa3: null,
  etapa4: null,
  informacoesDoFormulario: null,
  listaDeFotos: null,
  nTmpLocal: null,
  perfilDds: null,
  lista_modelo_etapa_2: null,
  lista_modelo_etapa_3: null,
  lista_modelo_etapa_4: null,
  /*Variáveis Globais*/

  /*Elementos Globais*/


  /*Eventos Iniciais*/
  inicializar: function (dados) {
    app.securityCheck();
    //console.log('inicializando orcamento 3');
    this._pegandoDadosModelo();
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    var tmpLocal = vg.obterLocal();
    this.nTmpLocal = JSON.parse(tmpLocal);

    //console.log(this.nTmpLocal);
    this.etapa1 = app.E("etapa1");
    this.etapa2 = app.E("etapa2");
    this.etapa3 = app.E("etapa3");
    this.etapa4 = app.E("etapa4");
    this.lista_modelo_etapa_2 = app.E("lista_modelo_etapa_2");
    this.lista_modelo_etapa_3 = app.E("lista_modelo_etapa_3");
    this.lista_modelo_etapa_4 = app.E("lista_modelo_etapa_4");
    this._adicionaEventoBotoes();


    /* Event */
  },
  // MODELO
  _pegandoDadosModelo: function () {
    var api = new Api('atributos?tipo=chp', null, true, true);
    orcamento3.listaDeFotos = new Array;
    api.send(function (res) {
      if (!res.error) {
        if (res.length > 0) {
          var obj = new Array;
          for (var index = 0; index < res.length; index++) {
            var element = res[index];
            obj[index] = element;
            //console.log(element);
            orcamento3._criaModelo(element, '#lista-modelo-etapa-1', 1);
          }
          orcamento3.listaDeFotos = obj;
        }
      }
    });
  },

  _criaModelo: function (element, divPai) {
    var modelo = app.CE('div', { 'class': 'modelo' });
    var opcao = app.CE('div', { 'class': 'opcao' });
    var label = app.CE('label', { 'class': 'radio-azul' });
    var span = app.CE('span', {});
    span.innerHTML = element.nome;
    var imagem = app.CE('img', { 'id': element.nome, 'src': 'img/nenhum.png' });
    var radio = app.CE('input',
      {
        'type': 'radio',
        'class': 'form-control cb-portas',
        'value': element.nome,
        'name': 'modelos',
        'id': element.id
      });
    var i = app.CE('i', {'id' : element.id});
    (function (imgObj, imgSrc) {
      app.getImgFromApi(imgSrc, function (url, status) {
        imgObj.src = url;
      });
    })(imagem, element.imagem);
    orcamento3._inserirModeloNaPagina(modelo, opcao, label, span, imagem, radio, i, divPai);
  },

  _inserirModeloNaPagina: function (modelo, opcao, label, span, imagem, radio, i, divPai) {
    label.appendChild(imagem);
    label.appendChild(span);
    label.appendChild(radio);
    label.appendChild(i);
    opcao.appendChild(label);
    modelo.appendChild(opcao);
    app.E(divPai).appendChild(modelo);
  },

  // PERFIL
  _pegaDadosPerfil: function () {
    orcamento3.lista_modelo_etapa_2.innerHTML = "";
    var id  = app.getRadioChecked('etapa1', 'modelos').id;
    var api = new Api('atributos', { "atributo_id": id }, true, true);
    api.send(function (res) {
      console.log(res);
      if (!res.error) {
        if (res.length > 0) {
           for (var i = 0; i < res.length; i++) {
              console.log();
              orcamento3._criaPerfil(res[i], 'lista_modelo_etapa_2');
           }
        }
      }
    });
  },

  _criaPerfil: function (element, divPai) {
    var modelo = app.CE('div', {'class': 'modelo'});
    var opcao = app.CE('div', {'class': 'opcao'});
    var label = app.CE('label', {'class': 'radio-azul'});
    var img = app.CE('img', {'src': 'img/nenhum.png'});
    var span = app.CE('span', {});
    span.innerHTML = element.nome;
    var input = app.CE('input', {
      'value': element.nome, 
      'type' : 'radio', 
      'class': 'form-control cb-portas',
      'name': 'perfil',
      'id': element.id
    });
    var i = app.CE('i', {});
    (function (imgObj, imgSrc) {
      app.getImgFromApi(imgSrc, function (url, status) {
        imgObj.src = url;
      });
    })(img, element.imagem);
    orcamento3._inserirPerfil(modelo, opcao, label, img, span, input, i, divPai);
  },
  
  _inserirPerfil: function (modelo, opcao, label, img, span, input, i, divPai) {
    label.appendChild(img);
    label.appendChild(span);
    label.appendChild(input);
    label.appendChild(i);
    opcao.appendChild(label);
    modelo.appendChild(opcao);
    app.E(divPai).appendChild(modelo);

  },
  
  //Chapas
  _pergarDadosChapas: function () {
    // var elemento = document.getElementById('lista-modelo-etapa-3');
    // while (elemento.firstChild) {
    //   elemento.removeChild(elemento.firstChil1);
    // }

    orcamento3.lista_modelo_etapa_3.innerHTML = "";

    var id  = app.getRadioChecked('etapa2', 'perfil').id;

    var api = new Api('atributos', { "atributo_id": id }, true, true);
    api.send(function (res) {
      if (!res.error) {
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
              console.log(res[i]);
              orcamento3._criarChapas(res[i], 'lista_modelo_etapa_3');
          }
        }
      }
    });

  },

  _criarChapas: function (element, divPai) {
    var modelo = app.CE('div', {'class': 'modelo'});
    var opcao = app.CE('div', {'class': 'opcao'});
    var label = app.CE('label', {'class': 'radio-azul'});
    var span = app.CE('span', {});
    span.innerHTML = element.nome;
    var input = app.CE('input', {
      'value': element.nome, 
      'type' : 'radio', 
      'class': 'form-control cb-portas',
      'name': 'chapas',
      'id': element.id
    });
    var i = app.CE('i', {});
    orcamento3._inserirChapas(modelo, opcao, label, span, input, i, divPai);
  },

  _inserirChapas: function (modelo, opcao, label, span, input, i, divPai) {
    label.appendChild(span);
    label.appendChild(input);
    label.appendChild(i);
    opcao.appendChild(label);
    modelo.appendChild(opcao);
    app.E(divPai).appendChild(modelo);
  },

  //Material
  _pegarDadosMaterial: function () {
    console.log("quantas vezes?");
    // var elemento = document.getElementById('lista_modelo_etapa_4');
    // while (elemento.firstChild) {
    //   elemento.removeChild(elemento.firstChild);
    // }

    orcamento3.lista_modelo_etapa_4.innerHTML = "";

    var id  = app.getRadioChecked('etapa3', 'chapas').id;
    var api = new Api('atributos?tipo=mat', null, true, true);
    api.send(function (res) {
      if (!res.error) {
        if (res.length > 0) {
          for (var i = 0; i < res.length; i++) {
            console.log()
              orcamento3._criarMaterial(res[i], 'lista_modelo_etapa_4');
              // console.log(dados);
          }
        }
      }
    });
  },

  _criarMaterial: function (element, divPai) {
    
    var modelo = app.CE('div', {'class': 'modelo'});
    var opcao = app.CE('div', {'class': 'opcao'});
    var label = app.CE('label', {'class': 'radio-azul'});
    var span = app.CE('span', {});
    span.innerHTML = element.nome;
    var input = app.CE('input', {
      'value': element.nome, 
      'type' : 'radio', 
      'class': 'form-control cb-portas',
      'name': 'material',
      'id': element.id
    });
    var i = app.CE('i', {});
    orcamento3._inserirMaterial(modelo, opcao, label, span, input, i, divPai);
  },

  _inserirMaterial: function (modelo, opcao, label, span, input, i, divPai) {
    label.appendChild(span);
    label.appendChild(input);
    label.appendChild(i);
    opcao.appendChild(label);
    modelo.appendChild(opcao);
    app.E(divPai).appendChild(modelo);
  },
  
  //EVENTOS DOS BOTOES
  _adicionaEventoBotoes: function () {
    app.E('#btnAvancar').addEventListener("click", function () {
      orcamento3._pegaProdutdoPerfil();
      //app.abrirPag('orcamento4', [orcamento3.informacoesDoFormulario], false);
    });
    app.E('#btnVoltar').addEventListener("click", app.onBackButtonClick);

    orcamento3.etapa1.addEventListener("click", orcamento3.etapa1Click);
    orcamento3.etapa2.addEventListener("click", orcamento3.etapa2Click);
    orcamento3.etapa3.addEventListener("click", orcamento3.etapa3Click);
    orcamento3.etapa4.addEventListener("click", orcamento3.etapa4Click);
  },

  // VERIFICA SE EXISTE EXISTEM MOTORES COMPATÍVEIS
  _pegaProdutdoPerfil : function () {
    var api = new Api("portoes/perfis", {
      "chapa_id": app.getRadioChecked('etapa1', 'modelos').id,
      "perfil_id": app.getRadioChecked('etapa2', 'perfil').id,
      "espessura_id": app.getRadioChecked('etapa3', 'chapas').id,
      "material_id": app.getRadioChecked('etapa4', 'material').id
    }, true, true);
    api.send(function (res) {
      if (res.error) {
        app.Erro(res);
      }
      else {
        if (res.length > 0) {
          orcamento3.perfilDds = res[0];
          console.log('perfilDds >> ');
          console.log(orcamento3.perfilDds);
          orcamento3._completa();
        }
        else {
          var msg = new Mensagem("Nenhum Perfil Corresponde a Esses Atributos!\nTente usar outros atributos para continuar seu orçamento.");
          msg.setTitulo("Nenhum Perfil Encontrado.");
          msg.mostrar(function () {
            app.abrirPag('orcamento3', [orcamento3.informacoesDoFormulario], false);  
          });
        }
      }
      Loader.remove(btnAvancar);
    });

  },

  _completa: function (){
    orcamento3._pegaInformacoesDoFormulario();
    var altura = app.N(orcamento3.nTmpLocal.altura), largura = app.N(orcamento3.nTmpLocal.altura);
    var fnAltura = orcamento3.nTmpLocal.fnAltura;
    var peso_total = app.C(app.C(app.C(largura, "*", fnAltura), "*", 2), "*", orcamento3.perfilDds.peso_m2);
    console.log(orcamento3.informacoesDoFormulario);

    orcamento3.informacoesDoFormulario.peso_total = peso_total;
    orcamento3.informacoesDoFormulario.perfilDds = orcamento3.perfilDds;

    orcamento3.informacoesDoFormulario = Object.assign(orcamento3.informacoesDoFormulario, orcamento3.nTmpLocal);
    orcamento3._configuraParaVarGlobal();
    console.log("infos do form");
    app.abrirPag('orcamento4', [orcamento3.informacoesDoFormulario], false);

  },
  _pegaInformacoesDoFormulario: function () {

    //console.log(orcamento3.perfilDds.peso_m2);
    console.log('pegando informacoes testado');
    orcamento3.informacoesDoFormulario = {
      'modelo': app.getRadioChecked('etapa1', 'modelos').value,
      'perfil': app.getRadioChecked('etapa2', 'perfil').value,
      'chapas': app.getRadioChecked('etapa3', 'chapas').value,
      'material': app.getRadioChecked('etapa4', 'material').value,
      'modeloID' : app.getRadioChecked('etapa1', 'modelos').id,
      'perfilID' : app.getRadioChecked('etapa2', 'perfil').id,
      'chapasID' : app.getRadioChecked('etapa3', 'chapas').id,
      'materialID' : app.getRadioChecked('etapa4', 'material').id,
      'peso_m2': orcamento3.perfilDds.peso_m2,
    }

  },

  _configuraParaVarGlobal: function () {
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(JSON.stringify(orcamento3.informacoesDoFormulario));
  },

  _semMaterial: function(){

  },
  /*Eventos */
  etapa1Click: function () {
        $('#etapa2').addClass("-is-active");
        orcamento3._pegaDadosPerfil();
  },
  etapa2Click: function () {
        $('#etapa3').addClass("-is-active");
        orcamento3._pergarDadosChapas();
  },

  etapa3Click: function () {
        $('#etapa4').addClass("-is-active");
        orcamento3._pegarDadosMaterial();
  },

  etapa4Click: function () {
        $('.botoes-form').addClass("-is-active");
  }

};