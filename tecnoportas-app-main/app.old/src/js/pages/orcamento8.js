"use strict";
var orcamento8 = {
    /*Variáveis Globais*/
    myInput: null,
    myForm: null,
    option: null,
    opcionais: {},
    quantidades: {},
    tmpDados: null,
    /*Elementos Globais*/
    divOpcoes: null,
    btnAvancar: null,
    btnVoltar: null,
    /*Eventos Iniciais*/
    inicializar: function (dds) {
      app.securityCheck();
      this.tmpDados = dds;

      console.log("dados:");
      console.log(this.tmpDados);

      this.option = app.E("option");
      this.divOpcoes = app.E("divOpcoes");
      this.btnAvancar = app.E("btnAvancar");
      this.btnVoltar = app.E("btnlVoltar");
      this.myInput = app.E("myInput");
      this.myForm = app.E("myForm");

      
      this.getOpcionais();
      this.busca();
      
      this.btnAvancar.addEventListener('click', this.btnAvancarClick);
      this.btnVoltar.addEventListener('click', app.onBackButtonClick);

      $("#myInput").keydown(function (event) {
        if (event.keyCode == 13) {
            $('#myInput').blur();
        }
      });
  
    },
    optionClick: function () {
      $(option).change(function () {
        if ($(this).is(":checked")) {
          $('.quantidade').addClass("-is-active");
        } else {
          $('.quantidade').removeClass("-is-active");
        }
      });
    },

    busca: function () {
      $(myInput).on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $(".opcao").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
      });
  },

  getOpcionais: function() {
    var api = new Api('portoes/componentes', null , true, true);

    api.send(function (res) {
        if (!res.error) {
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    orcamento8._criandoOpcionais(res[i], orcamento8.divOpcoes);
                };
            }
            else {
                orcamento8.divOpcoes.innerHTML = "<h3>Sem opcionais</h3>";
            }
        }
        else {
            if (res.error == 'net') {
                app.Erro(res);
            }
            orcamento8.divOpcoes.innerHTML = "<h3>Sem opcionais</h3>";
        }
    });
  },

  _criandoOpcionais: function (element, divPai) {
    console.log(element);
    var divOpcao = app.CE("div",{class: "opcao"}),
    label = app.CE('label', {'class': 'radio-azul diferenciado','for':'option'+element.id}),
    img = app.CE('img',{src: "./img/loader.gif"}),
    divTexto = app.CE('div',{class: "texto-produto"}),
    span = app.CE('span'),
    divQuantidade = app.CE('div', {class: "quantidade"}),
    labelMedida = app.CE('label', {'class': "lblMedida", 'for':'inputQtd'+element.id}),
    h5 = app.CE('h5', {class: 'cad-title -upper'}),
    inputQtd = app.CE('input', {
      'type':'number',
      'class':'input-default cad-title -grey',
      'id': 'inputQtd'+element.id,
      'value': 1,
      'min': 1
    }),
    input = app.CE('input',{
      'type': 'checkbox',
      'option': '',
      'class': 'form-control cb-portas',
      'name': 'modelos'
    }),
    i = app.CE('i');

    span.innerHTML = element.nome;
    h5.innerHTML = "Quantidade: ";
    labelMedida.innerHTML = element.medida;
    (function (imgObj, imgSrc) {
      app.getImgFromApi(imgSrc, function (url, status) {
        imgObj.src = url;
        var viewer = ImageViewer();
        $(imgObj).on("tap click", function () {
            viewer.show(this.src, this.src);
        });
      });
    })(img, element.imagem);


    (function(obj1,obj2, input,dds){
      obj1.addEventListener("click", function(){
        console.log("clicou");
        if ($(input).is(":checked")) {
          $(obj2).removeClass("-is-active");
          $(input).removeAttr("checked");
          delete orcamento8.opcionais[dds.id];
        } else {
          $(obj2).addClass("-is-active");
          $(input).attr("checked","checked");
          dds.thisInputId = 'inputQtd' + dds.id;
          orcamento8.opcionais[dds.id] = dds;
        }
      });
    })(i, divQuantidade, input, element);

    orcamento8._inserirOpcionais(divOpcao, label, img, divTexto, span, divQuantidade, labelMedida, h5, inputQtd, input, i, divPai);
  },

  _inserirOpcionais: function(divOpcao, label, img, divTexto, span, divQuantidade, labelMedida, h5, inputQtd, input, i, divPai){
    
    divQuantidade.appendChild(h5);
    divQuantidade.appendChild(inputQtd);
    divQuantidade.appendChild(labelMedida);
    divTexto.appendChild(span);
    divTexto.appendChild(divQuantidade);
    label.appendChild(img);
    label.appendChild(divTexto);
    label.appendChild(input);
    label.appendChild(i);
    divOpcao.appendChild(label)
    divPai.appendChild(divOpcao);

  },

  btnAvancarClick: function(e){
    e.preventDefault();
    var opcs = orcamento8.opcionais;
      for(var key in opcs){
        orcamento8.opcionais[key].quantidade = app.E('inputQtd'+opcs[key].id).value;
      }
    console.log(orcamento8.opcionais);
    
    orcamento8.tmpDados.opcionais = orcamento8.opcionais;

    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(JSON.stringify(orcamento8.tmpDados));

    app.abrirPag("orcamento9",[orcamento8.tmpDados]);
  }

};