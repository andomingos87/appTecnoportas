"use strict";
var verOrcamento = {
  /*Variáveis Globais*/
  orcData: null,
  arrayStatus: ["Cancelado", "Pendente", "Aprovado"],
  acrescimos: 0,
  valorTotal: 0,
  orcStatus: 1,
  orcamento_id: 0,
  nPortas: 0,
  orc_pdf: null,

  /*Elementos Globais*/
  btnVoltar: null,
  selStatus: null,
  orc_titulo: null,
  orc_dataCad: null,
  orc_valor: null,
  orc_ascDesc: null,
  orc_valorTotal: null,
  orc_numeroPortas: null,
  orc_largura: null,
  orc_altura: null,
  orc_rolo: null,
  orc_dentroVao: null,
  orc_cliNome: null,
  orc_pessoaTipo: null,
  orc_cliDtCadastro: null,
  orc_status: null,
  prodList: null,
  btnPdf: null,
  /*Eventos Iniciais*/
  inicializar: function(dds) {
    app.securityCheck();
    this.btnVoltar = app.E("btnVoltar");
    this.selStatus = app.E("selStatus");
    this.orcData = dds.orcamento;
    this.orc_titulo = app.E("orc_titulo");
    this.orc_dataCad = app.E("orc_data-cad");
    this.orc_valor = app.E("orc_valor");
    this.orc_ascDesc = app.E("orc_asc-desc");
    this.orc_valorTotal = app.E("orc_valor-total");
    this.orc_numeroPortas = app.E("orc_numero-portas");
    this.orc_largura = app.E("orc_largura");
    this.orc_altura = app.E("orc_altura");
    this.orc_rolo = app.E("orc_rolo");
    this.orc_dentroVao = app.E("orc_dentro-vao");
    this.orc_cliNome = app.E("orc_cli-nome");
    this.orc_pessoaTipo = app.E("orc_pessoa-tipo");
    this.orc_cliDtCadastro = app.E("orc_cli-dt-cadastro");
    this.prodList = app.E("prodList");
    this.btnPdf = app.E("btnPdf");
    verOrcamento.orcamento_id = dds.id;
    var api = new Api("orcamentos/abrir", { orcamento_id: dds.id });
    api.send(function(res) {

      if (!res.error) {
        if (res) {
          verOrcamento.preencheDados(res);
        } else {
          var msg = new Mensagem(
            "Ocorreu um erro e o orçamento não foi encontrado",
            true
          );
          app.abrirPag("meusOrcamentos");
        }
      } else {
        app.Erro(res);
      }
    });

    this.btnVoltar.addEventListener("click", app.onBackButtonClick);
    this.btnPdf.addEventListener("click", this.orcGeraPDFClick);
    this.selStatus.addEventListener("change", this.selStatusChange);
  },

  preencheDados: function(dds) {
    var self = this;

    self.orc_titulo.innerHTML = "ORÇAMENTO " + dds.orcamento.id;
    self.orc_dataCad.innerHTML = app.formataData(
      dds.orcamento.dt_cadastro,
      true
    );
    self.orc_valor.innerHTML = "R$ " + dds.orcamento.valor_total;
    self.orc_ascDesc.innerHTML = 0;
    self.orc_valorTotal.innerHTML = 0;
    self.orc_numeroPortas.innerHTML = dds.orcamento.portas;
    self.orc_largura.innerHTML = dds.orcamento.largura;
    self.orc_altura.innerHTML = dds.orcamento.altura;
    self.orc_rolo.innerHTML = dds.orcamento.largura < 8.5 ? 0.6 : 0.9;
    self.orc_dentroVao.innerHTML =
      dds.orcamento.is_dentro_vao == "Dentro do Vão" ? "Sim" : "Não";
    self.orc_cliNome.innerHTML =
      dds.orcamento.cli_nome + " " + dds.orcamento.cli_snome;
    self.orc_pessoaTipo.innerHTML =
      dds.orcamento.cli_tipo == "F" ? "Pessoa Física" : "Pessoa Jurídica";
    self.orc_cliDtCadastro.innerHTML = app.formataData(
      dds.orcamento.cli_cadastro,
      true
    );
    $(self.selStatus).val(dds.orcamento.status);

    self.mudaCorStatus();


    self.orc_pdf = dds.orcamento.pdf;
    self.orc_status = dds.orcamento.status;
    self.nPortas = dds.orcamento.portas;
    self.valorTotal = dds.orcamento.valor_total;
    self.getProdutos(dds.produtos);
  },

  orcGeraPDFClick: function() {
    if (verOrcamento.orcamento_id > 0) {
      if (!verOrcamento.orc_pdf) {
        var pdfTitulo = "orcamento" + verOrcamento.orcamento_id + ".pdf";
        geraOrcamentoPDF(
          verOrcamento.orcamento_id,
          pdfTitulo,
          false,
          false,
          function(b64, url) {
            var upPdf = new Api(
              "orcamentos/upPdf?oid=" + verOrcamento.orcamento_id,
              { arquivo: b64 }
            );
            upPdf.send(function(res) {
              if (res.error) {
                app.Erro(res);
              } else {
                var msg = new Mensagem("PDF do orçamento atualizado", true);
                verOrcamento.orc_pdf = res;
                verOrcamento.orcGeraPDFClick();
              }
            });
          }
        );
      } else {
        var pdfTitulo = "orcamento" + verOrcamento.orcamento_id + ".pdf";
        geraOrcamentoPDF(verOrcamento.orcamento_id, pdfTitulo, false, true);
      }
    }
  },

  getProdutos: function(dds) {
    var size = Object.keys(dds).length;
    if (size) {
      for (var i = 0; i < size; i++) {
        verOrcamento.prodList.appendChild(verOrcamento.geraProdutos(dds[i]));
      }
      verOrcamento.orc_ascDesc.innerHTML =
        "R$ " + app.N(verOrcamento.acrescimos, 2, ",");
      verOrcamento.orc_valorTotal.innerHTML =
        "R$ " +
        app.N(
          app.C(verOrcamento.valorTotal, "+", verOrcamento.acrescimos),
          2,
          ","
        );
    } else {
      var msg = new Mensagem("Erro no recebimento dos dados", true);
      app.abrirPag("meusOrcamentos");
    }
  },

  geraProdutos: function(dds) {
    var produto_listagem = app.CE("div", { class: "produto listagem" }),
      item_img = app.CE("div", { class: "item" }),
      produto_img = app.CE("img", { src: "./img/loader.gif" }),
      item_unidades = app.CE("div", { class: "item" }),
      item_nome = app.CE("div", { class: "item" }),
      item_valor = app.CE("div", { class: "item" });

    app.getImgFromApi(dds.imagem, function(res) {
      if (res) {
        produto_img.src = res;
            var viewer = ImageViewer();
            $(produto_img).on("tap click", function () {
                viewer.show(this.src, this.src);
            });
      } else {
        produto_img.src = "img/nenhum.png";
      }
    });

    item_unidades.innerHTML = dds.quantidade
      ? dds.quantidade
      : verOrcamento.nPortas + ".00";
    item_nome.innerHTML = dds.nome;
    item_valor.innerHTML = dds.preco_unitario + " (" + dds.acrescimo + "%)";
    verOrcamento.acrescimos = app.C(
      app.N(verOrcamento.acrescimos, 2, "."),
      "+",
      app.N(dds.preco_unitario * (dds.acrescimo / 100), 2, ".")
    );
    console.log(verOrcamento.acrescimos);

    item_img.appendChild(produto_img);
    produto_listagem.appendChild(item_img);
    produto_listagem.appendChild(item_unidades);
    produto_listagem.appendChild(item_nome);
    produto_listagem.appendChild(item_valor);

    //verOrcamento.prodList.appendChild(produto_listagem);
    return produto_listagem;
  },
  alteraStatusEmail: function(orcamento_id, status, callback) {
      var erro = true;
      if (status == 2) {
        if (verOrcamento.orc_pdf) {
        var pdfTitulo = "orcamento" + orcamento_id + ".pdf";
        geraOrcamentoPDF(orcamento_id, pdfTitulo, false, false, function(
          b64,
          url
        ) {
          var upPdf = new Api(
            "orcamentos/enviarEmail?oid=" + orcamento_id + "&altStatus=1",
            { pdf: verOrcamento.orc_pdf }
          );
          upPdf.send(function(res) {
            if (res.error) {
              erro = false;
              app.Erro(res);
              $("#selStatus").val(verOrcamento.orc_status);
              verOrcamento.mudaCorStatus();
            } else {
              var msg = new Mensagem(
                "Status alterado e E-mail com pdf enviado ao vendedor!",
                true
              );
              erro = verOrcamento.alteraStatus(orcamento_id, status);
            }
          });
        });
    }else {
        var msg = new Mensagem(
          "Não foi possível enviar o arquivo PDF por email pois o mesmo não foi encontrado em nosso servidor",
          true
        );
      }
    } else {
      erro = verOrcamento.alteraStatus(orcamento_id, status);
    }
    //$("#selStatus").val(verOrcamento.orc_status);
    callback(erro); 

  },
  alteraStatus: function(orcamento_id, status) {
    var erro;
    var api = new Api("orcamentos/abrir", {
      orcamento_id: orcamento_id,
      status: status
    });
    api.send(function(res) {
      if (!res.error) {
        if (res.AltStatus == 1) {
          if (status != 2) {
            var msg = new Mensagem(res.msg, true);
          }
          erro = true;
          verOrcamento.orcStatus = status;
          return erro;
        } else {
          var msg = new Mensagem(res.msg, true);
          $("#selStatus").val(verOrcamento.orc_status);
          erro = false;
          return erro;
        }
      } else {
        var msg = new Mensagem(res.error, true);
        $("#selStatus").val(verOrcamento.orcStatus);
        erro = false;
        return erro;
      }
    });
  },
  /*Eventos */
  selStatusChange: function() {
    if (verOrcamento.orc_status != 2) {
      verOrcamento.orcStatus = $("#selStatus").val();
      var msg = new Mensagem(
        "Deseja alterar o status do orçamento para: " +
          verOrcamento.arrayStatus[$("#selStatus").val()]
      );
      msg.setTipo("confirma");
      msg.setBotoes(["Sim", "Não"]);
      msg.mostrar(function(res) {
        if (res == 1) {
          verOrcamento.altera();
        } else {
          verOrcamento.selStatus.value = verOrcamento.orc_status;
        }
      });
    } else {
      var msg = new Mensagem(
        "Não é possível alterar o status do orçamento após ele ter sido aprovado",
        true
      );
      verOrcamento.selStatus.value = verOrcamento.orc_status;
    }
  },

  altera: function() {
    Loader.mostrar();
    //var status = $("#selStatus").val();
    verOrcamento.alteraStatusEmail(
      verOrcamento.orcamento_id,
      verOrcamento.orcStatus, function(alt){
        if (alt == false) {
          $("#selStatus").val(verOrcamento.orcStatus);
        }
        verOrcamento.mudaCorStatus();
        Loader.remover();
      }
    );
    
  },

  mudaCorStatus: function(){
    var status = $('#selStatus').val();
      var selStatus = document.getElementById("selStatus");
      
      if(status == 0){
          selStatus.style.backgroundColor = "#f72f2f";
          selStatus.style.color = "black";
      }else if(status == 2){
          selStatus.style.backgroundColor ="#8cff6f";
          selStatus.style.color = "black";
      }else{
          selStatus.style.backgroundColor = "#d2d2d2";
          selStatus.style.color = "black";
      }
  }
};
