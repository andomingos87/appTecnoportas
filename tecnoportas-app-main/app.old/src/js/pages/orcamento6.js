"use strict";
var orcamento6 = {
  /*Variáveis Globais*/
  enAdc: null,
  divEntradas: null,
  divPosicoes: null,
  dados: null,
  posicao: null,
  tmpDados: null,
  
  /*Elementos Globais*/
  btnAvancar: null,
  btnVoltar: null,
  /*Eventos Iniciais*/
  inicializar: function (dds) {
    app.securityCheck();
    this.btnVoltar = app.E("btnlVoltar");
    this.tmpDados = dds;
    this.divEntradas = app.E("divEntradas");
    this.divPosicoes = app.E("divPosicoes");
    this.btnAvancar = app.E("btnAvancar");
    this.getEntradas();
    
    
    this.btnAvancar.addEventListener("click", this.btnAvancarClick);
    this.btnVoltar.addEventListener("click", app.onBackButtonClick);
    orcamento6.divPosicoes.style.display = "none";

  },

    getEntradas: function() {
        var api = new Api('atributos?tipo=ent');
        api.send(function (res) {
          console.log(res);
          orcamento6.divEntradas.innerHTML = "";
          orcamento6._criandoEntradaVazia(orcamento6.divEntradas);
            if (!res.error) {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        orcamento6._criandoEntradas(res[i], orcamento6.divEntradas, true);
                    }
                }
            }
            else {
                app.Erro(res);
            }
        });
    },

    _criandoEntradas: function (element, divPai, geraFilhos) {
      var img = app.CE('img',{src: "./img/nenhum.png"});
      var label = app.CE('label', {'class': 'radio-azul diferenciado'});
      var span = app.CE('span');
      var i = app.CE('i');
      var input = app.CE('input', {
        'value':element.id,
        'type':'radio',
        'class':'form-control cb-portas',
        'name': geraFilhos ? 'modelos' : 'posicoes',
        'id': element.id,
      });
  
      (function (imgObj, imgSrc) {
        app.getImgFromApi(imgSrc, function (url, status) {
          imgObj.src = url;
        });
      })(img, element.imagem);
      span.innerHTML = element.nome;
      
      if(geraFilhos == true){
        label.addEventListener("click", function(e){
          e.stopPropagation();
          e.preventDefault();
          $('input[name=modelos]').removeAttr("checked");
          input.setAttribute("checked", "");
          orcamento6.dados = element.id;
          orcamento6.posicao = null;
          orcamento6.divPosicoes.innerHTML = "";
          orcamento6.divPosicoes.style.display = "none";
          var api = new Api("atributos", { "atributo_id": element.id });
          api.send(function(res){
            console.log(res);
            if (!res.error) {
              if (res.length > 0) {
                orcamento6.divPosicoes.style.display = "flex";
                for (var i = 0; i < res.length; i++) {
                  $('.botoes-form').removeClass("-is-active");
                  orcamento6._criandoEntradas(res[i], orcamento6.divPosicoes, false);
                }
              }else{
                $('.botoes-form').addClass("-is-active");
              }
            }
          });
        })
      }else{
          label.addEventListener("click", function(e){
          e.stopPropagation();
          e.preventDefault();
          $('input[name=posicoes]').removeAttr("checked");
          input.setAttribute("checked", "");
          orcamento6.posicao = element.id;
          $('.botoes-form').addClass("-is-active");
        });
      }



      orcamento6._inserirEntrada(img, label, span, input, i, divPai);
    },
  
    _criandoEntradaVazia: function (divPai) { 
      var label = app.CE('label', {'class': 'radio-azul diferenciado'});
      var img = app.CE('img',{src: "./img/nenhum.png"});
      var span = app.CE('span');
      var i = app.CE('i');
      var input = app.CE('input', {
        'value': "",
        'type':'radio',
        'class':'form-control cb-portas',
        'name':'modelos',
        'id': "nenhum_aut",
      });
  
      span.innerHTML = "Nenhum";
      label.addEventListener("click",function(){
        $('input[name=modelos]').removeAttr("checked");
        orcamento6.divPosicoes.innerHTML = "";
        orcamento6.divPosicoes.style.display = "none";
        $('.botoes-form').addClass("-is-active");
        orcamento6.dados = null;
        orcamento6.posicao = null;
      });
      
  
      orcamento6._inserirEntrada(img, label, span, input, i, divPai);
    },
  
  
    _inserirEntrada: function (img,label,span,input, i,divPai) {
      label.appendChild(img);
      label.appendChild(span);
      label.appendChild(input);
      label.appendChild(i);
      divPai.appendChild(label);

    },

    btnAvancarClick: function(e){
      var self = this;
      
      e.preventDefault();
        if (orcamento6.dados > 0) {

            var api = new Api("portoes/entradas", {
                "ent_id": orcamento6.dados,
                "pos_id": orcamento6.posicao,
                "chapa_id": orcamento6.tmpDados.modeloID,
                "perfil_id": orcamento6.tmpDados.perfilID,
                "material_id": orcamento6.tmpDados.materialID
            });

            api.send(function (res) {
              console.log(res);
                if (res.error) {
                    app.Erro(res);
                }
                else {
                    if (res.length > 0) {
                        orcamento6.tmpDados.entradaDds = res[0];
                        orcamento6.tmpDados.entradas = {entrada_id: orcamento6.dados, entrada_posicao: orcamento6.posicao}
                      var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
                      vg.salvarLocal(JSON.stringify(orcamento6.tmpDados));

                      app.abrirPag("orcamento7",[orcamento6.tmpDados]);
                    }
                    else {
                        orcamento6.tmpDados.entradaDds = 0;
                        var msg = new Mensagem("Nenhuma Entrada Corresponde a Esses Atributos!\nTente usar outros atributos para continuar seu orçamento.");
                        msg.setTitulo("Nenhum Entrada Encontrada!");
                        msg.mostrar(function () { orcamento6.getEntradas(); });
                        orcamento6.divPosicoes.innerHTML = "";
                        orcamento6.divPosicoes.style.display = "none";
                    }
                }
            });
        }
        else {
          orcamento6.tmpDados.entradas = {entrada_id: orcamento6.dados, entrada_posicao: orcamento6.posicao}
          var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
          vg.salvarLocal(JSON.stringify(orcamento6.tmpDados));

          app.abrirPag("orcamento7",[orcamento6.tmpDados]);
        }
    }

};