"use strict";
var orcamento9 = {
    /*Variáveis Globais*/
    origem: null,
    dados: null,
    prods: null,
    valores: {}, 
    tmpValores: {},
    acrescimos: {},
    incrementos: {opcionais:{}},
    quantidades: {},
    listaProds: null,
    vlTotal: 0,
    tmpVlTotal: 0,
    orcamento_id: null,
    valor_total: null,
    tmpDados: null,
    margemSelecionada: 0,
    enviado: false,
    calculado: false,
    nivelModal: 0,
    vlTeste: 0,
    isFromCarrinho: null,
    /*Elementos Globais*/
    navFinal: null,
    botaoOverlay: null,
    btTroca: null,
    btMargem: null,
    btExcluir: null,
    btQtd: null,
    btVlr: null,
    btHome: null,
    btNovo: null,
    btnEnvia: null,
    btnVoltar: null,
    btnsFinal: null,
    divModal:null,
    btVoltarProd: null,
    listaTrocaItem: null,
    listaTrocaMargem: null,
    listaExcluirSim: null,
    listaExcluirNao: null,
    listaInputQtd: null,
    listaInputVlr: null,
    btnQtdOk: null,
    btnVlrOk: null,
    tblProds: null,
    selecMargem: null,
    btSalvarPdf: null,
    btCompartPdf: null,
    switchLucro: false,
    pdf_aberto: false,

    /*Eventos Iniciais*/
    inicializar: function (dds) {
        app.securityCheck();
        if(this.nivelModal > 0){
            this.removeModal();
        }
        this.tblProds = app.E("tblProds");
        
        this.criaModal();
        document.getElementById("loader-final").classList.remove("is-loaded");        
    /*Variáveis Locais*/
    if(dds){
        this.tmpDados = dds;
    }else{
        var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
        this.tmpDados = vg.obterLocal();
        this.tmpDados = JSON.parse(this.tmpDados);

    }

    var inc = new VarGlobal("incrementos");
    if(inc.obterLocal()){
        this.incrementos = inc.obterLocal();
        this.incrementos = JSON.parse(this.incrementos);
    }
    
    var acres = new VarGlobal("acrescimos");
    if(acres.obterLocal()){
        this.acrescimos = acres.obterLocal();
        this.acrescimos = JSON.parse(this.acrescimos);
    }
    
    var margeSelec = new VarGlobal("margemSelecionada");
    if(margeSelec.obterLocal()){
        this.margemSelecionada = margeSelec.obterLocal();
        this.margemSelecionada = JSON.parse(this.margemSelecionada);
    }

    //* Fim Variáveis Locais */
    this.btTroca = app.E("btTroca");
    this.btMargem = app.E("btMargem");
    this.btExcluir = app.E("btExcluir");
    this.btQtd = app.E("btQtd");
    this.btVlr = app.E("btVlr");
    this.btHome = app.E("btHome");
    this.btNovo = app.E("btNovo");
    this.listaProds = app.E("listaProds");
    this.btnEnvia = app.E("btnEnvia");
    this.btnVoltar = app.E("btnlVoltar");
    this.valor_total = app.E("valor_total");
    this.btnsFinal = app.E("btnsFinal");
    this.divModal = app.E("divModal");
    this.btVoltarProd = app.E("btVoltarProd");
    this.listaTrocaItem = app.E("listaTrocaItem");
    this.listaTrocaMargem = app.E("listaTrocaMargem");
    this.listaExcluirSim = app.E("listaExcluirSim");
    this.listaExcluirNao = app.E("listaExcluirNao"),
    this.listaInputQtd = app.E("listaInputQtd"),
    this.listaInputVlr = app.E("listaInputVlr"),
    this.btnQtdOk = app.E("btnQtdOk");
    this.btnVlrOk = app.E("btnVlrOk");
    this.navFinal = app.E("navFinal");
    this.selecMargem = app.E("selecMargem");
    this.btSalvarPdf = app.E("btSalvarPdf");
    this.btCompartPdf = app.E("btCompartPdf");
    this.botaoOverlay = app.E("botaoOverlay");


    
    this.btTroca.addEventListener('click', this.btTrocaClick);
    this.btMargem.addEventListener('click', this.btMargemClick);
    this.btQtd.addEventListener('click', this.btQtdClick);
    this.btExcluir.addEventListener('click', this.btExcluirClick);
    this.btVlr.addEventListener('click', this.btVlrClick);
    this.btHome.addEventListener('click', this.btHomeClick);
    this.btNovo.addEventListener('click', this.btNovoClick);
    this.btnEnvia.addEventListener('click', this.geraOrc);
    this.btVoltarProd.addEventListener('click',this.fechaModalClick);
    this.btnVoltar.addEventListener('click', app.onBackButtonClick);
    this.btSalvarPdf.addEventListener('click', this.GeraPDFClick);
    this.btCompartPdf.addEventListener('click', this.btCompartOrcClick);
    this.botaoOverlay.addEventListener('click', function(){
        $('.modal').removeClass( "is-active" );

        $('.list-options').addClass( "-is-active");
        $('.list-trocaItem').removeClass( "-is-active");
        $('.list-excluir').removeClass( "-is-active");
        $('.list-trocaMargem').removeClass( "-is-active");
        $('.box-search').removeClass( "-is-active");
        $('.list-quantidade').removeClass( "-is-active");
        $('.list-valor').removeClass( "-is-active");

    });

    if(dds){
      this.origem = dds.origem;
      this.dados = dds.dados;
    }

    if(this.origem){
      if(this.origem == "carrinho"){
        app.E('btnEnvia').style.display = 'none';
        app.E(".row")[0].style.display = "none";  
       if(dds){
            this.prods = dds.dados.dados;
            var aux = {};
            for(var key in this.prods){
                aux[this.prods[key].id] = this.prods[key];
            }
            console.log(aux);
            this.prods = aux;
        }else{
           this.prods = this.isFromCarrinho;
        }
        this.isFromCarrinho = this.prods;
        this.setProdutosCarrinho();
      }
    }else{
      this.calcFinal();
      this.setaMargemGeral();

    }

    this.busca();
    while(this.valor_total == "0.00" || this.valor_total <= 0){
        console.log("while");
        this.checaBtFinal();
    }
    var divTotal = document.querySelector('#divApp > section > div > form > div > div.total');
    var mostraLucro = function(){
        if (!divTotal.classList.contains('is-active')) {
            divTotal.classList.add('is-active');
            if(document.getElementsByClassName('pequeno')){
                orcamento9.alterDescontValue();
            }else{
                orcamento9.insertDescont();
            }
        }else{
            divTotal.classList.remove('is-active');
        }
    }

    if(!orcamento9.switchLucro){
        divTotal.addEventListener('click', mostraLucro);
        orcamento9.switchLucro = true;
    }


    },

    criaModal: function(){
        var self = this;
        self.nivelModal++;
        var modal = app.CE("div",{id:'modalId'});
        modal.innerHTML = '<div id="divModal" class="modal"><div class="heading-opcao"><button id="btVoltarProd" class="voltar"> <svg class="icon"><use xlink:href="icon.svg#icon-chevron-left"></use></svg></button>'+
        '<div class="opcao"><h2 id="modalProdNome" class="nome">Nome produto</h2></div></div><div class="box-search">'+
        '<input id="inputSearch" class="input-default" type="search" name="" placeholder="Buscar" ><svg class="icon">'+
        '<use xlink:href="icon.svg#icon-search"></use></svg></div><ul class="list-options -is-active"><li class="option" id="btTroca">'+
        '<svg class="icon"><use xlink:href="icon.svg#icon-exchange"></use></svg><span class="nome">Trocar item</span>'+
        '</li><li class="option" id="btQtd"><svg class="icon"><use xlink:href="icon.svg#icon-plus"></use></svg>'+
        '<span class="nome">Quantidade</span></li><li class="option" id="btVlr"><svg class="icon"><use xlink:href="icon.svg#icon-money"></use>'+
        '</svg><span class="nome">Inserir Valor</span></li><li class="option" id="btMargem"><svg class="icon">'+
        '<use xlink:href="icon.svg#icon-percent"></use></svg><span class="nome">margem</span></li><li class="option" id="btExcluir">'+
        '<svg class="icon deletar"><use xlink:href="icon.svg#icon-trash-o"></use></svg><span class="nome deletar">Excluir item</span>'+
        '</li></ul><ul id="listaTrocaItem" class="list-trocaItem"><li class="option"><span class="nome">Motor tm ac 600</span>'+
        '</li><li class="option"><span class="nome">teste</span></li><li class="option"><span class="nome">Motor tm ac 600</span>'+
        '</li><li class="option"><span class="nome">Motor tm ac 600</span></li></ul><ul id="listaTrocaMargem" class="list-trocaMargem">'+
        '<li class="option"><span class="nome">+ 25%</span></li><li class="option"><span class="nome">+ 20%</span>'+
        '</li><li class="option"><span class="nome">+ 15%</span></li><li class="option"> <span class="nome">+ 10%</span>'+
        '</li><li class="option"><span class="nome">+ 5%</span></li><li class="option"><span class="nome"> 0</span>'+
        '</li><li class="option"><span class="nome">- 5%</span></li><li class="option"> <span class="nome">- 10%</span>'+
        '</li><li class="option"><span class="nome">- 15%</span></li><li class="option"> <span class="nome">- 20%</span>'+
        '</li><li class="option"><span class="nome">- 25%</span></li></ul><ul class="list-excluir"><li id="listaExcluirSim" class="option">Sim</li>'+
        '<li id="listaExcluirNao" class="option">Não</li></ul><ul class="list-quantidade"><span class="nome">Quantidade: </span>'+
        '<input id="listaInputQtd" class="input-default" type="number" name="" placeholder="UN" ></ul>'+
        '<ul class="list-quantidade"><button type="button" class="btn btn-default" id="btnQtdOk">OK</button></ul>'+
        '<ul class="list-valor"><span class="nome">Adicione Valor: </span>'+
        '<input id="listaInputVlr" class="input-default" type="number" name="" placeholder="0"></ul>'+
        '<ul class="list-valor"><button type="button" class="btn btn-default" id="btnVlrOk">OK</button></ul></div>'+
        '<div class="overlay" id="botaoOverlay"></div>';
        self.tblProds.appendChild(modal);
    },

    removeModal: function(){
        app.E("modalId").parentNode.removeChild(app.E("modalId"));
    },

    geraOrc: function() {
     var self = this;
    if(orcamento9.origem && orcamento9.origem == "carrinho"){    
    //   var compsPadrao = orcamento9.prods;
    //   var opcionais = {};
  
    //   if (compsPadrao.length > 0) {
    //       for (var key in compsPadrao) {
    //           opcionais[compsPadrao[key].id] = compsPadrao[key];
    //       }
    //   }
  
    //   if (Object.keys(opcionais).length > 0) {
    //       orcamento9.valores['opcionais'] = {};
    //       orcamento9.tmpValores['opcionais'] = {};
    //       orcamento9.quantidades['opcionais'] = {};
    //       for (var key in opcionais) {
    //           var calc = opcionais[key].formula, valorOpc;
    //           if (calc) {
    //               var cf = new CalcFormula(calc, { 'ATP': altura, 'LGP': largura, 'KM2': perfilDds.peso_m2, 'VLP': perfilDds.valor_unitario, 'PM2': pm2, 'PKG': (pm2 * perfilDds.peso_m2), 'PTP': nPortas, 'ESP': espDds.medida, 'VL': opcionais[key].valor_unitario });
    //               valorOpc = app.C(cf.calcula(), "*", opcionais[key].valor_unitario);
    //           }
    //           else {
    //               valorOpc = app.N(opcionais[key].valor_unitario);
    //           }
    //           var ID = opcionais[key].id;
    //           var opQtd = opcionais[ID].quantidade;
    //           if (opcionais[key].thisInputId) {
    //               if (!orcamento9.quantidades.opcionais) {
    //                 orcamento9.quantidades.opcionais = {};
    //               }
    //               opQtd = app.N($("#tbQuant_" + opcionais[key].thisInputId).val());
    //               orcamento9.quantidades.opcionais[key] = opQtd;
    //           }
    //           orcamento9.valores.opcionais[key] = app.C(valorOpc, "*", opQtd, 2);
    //           orcamento9.quantidades.opcionais[key] = opcionais[ID].quantidade;
    //       }
    //   }
  
      var arrayDados = {
          'serralheiro_id': app.thisUser[0].pessoa_id,
          'cliente_id': orcamento9.dados.cliDados.id,
          'orc': {
              'opcionais': JSON.stringify(orcamento9.prods),
              'valor_total': orcamento9.vlTotal,
              'valores': JSON.stringify(orcamento9.valores),
              'quantidades': JSON.stringify(orcamento9.quantidades),
              'acrescimos': JSON.stringify(orcamento9.acrescimos)
          }
      };
      
    }else{
        var vg = new VarGlobal('version');
        var version = "";

        if(vg.obterLocal()){
            version = vg.obterLocal();
        }

        var arrayDados = {
            'serralheiro_id': app.thisUser[0].pessoa_id,
            'cliente_id': orcamento9.tmpDados.cliDds.id,
            'orc': {
                'portas': orcamento9.tmpDados.quantidadeDePortas,
                'altura': orcamento9.tmpDados.fnAltura,
                'largura': orcamento9.tmpDados.largura,
                'tpi': orcamento9.tmpDados.tipoDeInstalacao,
                'perfil': orcamento9.tmpDados.perfilDds ? orcamento9.tmpDados.perfilDds.id : null,
                'motor': orcamento9.tmpDados.motorDds ? orcamento9.tmpDados.motorDds.id : null,
                'testeira': orcamento9.tmpDados.testeiraDds ? orcamento9.tmpDados.testeiraDds.id : null,
                'automatizador': orcamento9.tmpDados.automatizador_id,
                'entrada': orcamento9.tmpDados.entradaDds ? orcamento9.tmpDados.entradaDds.id : null,
                'pintura': orcamento9.tmpDados.pintura,
                'fita': orcamento9.tmpDados.fitaDds ? orcamento9.tmpDados.fitaDds.id : null,
                'opcionais': JSON.stringify(orcamento9.tmpDados.opcionais),
                'valor_total': orcamento9.tmpVlTotal,
                'valores': JSON.stringify(orcamento9.valores),
                'quantidades': JSON.stringify(orcamento9.quantidades),
                'acrescimos': JSON.stringify(orcamento9.acrescimos)
            },
            'appVer': version
        };

        console.log(arrayDados);
    }
  
      var api = new Api('orcamentos/novo', arrayDados);
  
      api.send(function (res) {
          if (res.error) {
              app.Erro(res);
          }
          else {
                var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
                vg.salvarLocal(null);
                var acres = new VarGlobal("acrescimos"),
                inc = new VarGlobal("incrementos"),
                margeSelec = new VarGlobal("margemSelecionada");

                acres.salvarLocal(null);
                inc.salvarLocal(null);
                margeSelec.salvarLocal(null);

                var car = new VarGlobal('carrinho');
                car.salvarLocal(null);

              orcamento9.orcamento_id = res.orcamento_data.id;
              var pdfTitulo = 'orcamento' + orcamento9.orcamento_id + '.pdf';
              geraOrcamentoPDF(orcamento9.orcamento_id, pdfTitulo, false, false, function (b64, url) {
                  var upPdf = new Api("orcamentos/upPdf?oid=" + orcamento9.orcamento_id, { "arquivo": b64 });
                  upPdf.send(function(res){
                      var pdf = res;
                      if (res.error) {
                          app.Erro(res);
                      }
                      else {
                        var teste = document.querySelector('#divModal2');
                        teste.classList.add('is-active');
                        var btnSim = document.querySelector('#listaExcluirSimo9');
                        btnSim.addEventListener('click', function(){
                            if(!orcamento9.pdf_aberto){
                                geraOrcamentoPDF(orcamento9.orcamento_id, pdfTitulo);
                                orcamento9.pdf_aberto = true;
                                orcamento9.enviaEmail(orcamento9.orcamento_id, pdf);
                            }
                        });

                        var btnNao = document.querySelector('#listaExcluirNaoo9');                        
                        btnNao.addEventListener('click', function(){
                            orcamento9.pdf_aberto = true;
                            orcamento9.enviaEmail(orcamento9.orcamento_id, pdf);
                        });

                        // var msg = new Mensagem("Orçamento realizado com sucesso, deseja visualizar o arquivo PDF?");
                        // msg.setTitulo("Visualizar PDF");
                        // msg.setTipo("confirma");
                        // msg.setBotoes(["Sim", "Não"]);
                        // msg.mostrar(function (res){
                        // });
                        // if(res == 1){
                        //     geraOrcamentoPDF(orcamento9.orcamento_id, pdfTitulo);
                        //     orcamento9.enviaEmail(orcamento9.orcamento_id, pdf);
                        // }else{
                        // orcamento9.enviaEmail(orcamento9.orcamento_id, pdf);
                        // }
                      }
                  });
              });
          }
      });
    },

    enviaEmail: function(orcamento_id,pdf){
    //   var msg = new Mensagem("Deseja enviar um email com o arquivo PDF para o cliente?");
    //   msg.setTitulo("Enviar PDF");
    //   msg.setTipo("confirma");
    //   msg.setBotoes(["Sim", "Não"]);
    document.querySelector('#modalProdNomeO9').innerHTML = "Enviar PDF";
    document.querySelector('#pzinho').innerHTML = 'Deseja enviar um email com o arquivo PDF para o cliente ?';
    document.querySelector('#opcaoo9').insertAdjacentHTML('beforeend', '')
    var teste = document.querySelector('#divModal2');
    teste.classList.add('is-active');
    var btnSim = document.querySelector('#listaExcluirSimo9');
    btnSim.addEventListener('click', function(){
        var envEmail = new Api("orcamentos/enviarEmail?oid=" + orcamento_id,{"pdf":pdf});
        envEmail.send(function (res) {
            if (res.error) {
                app.Erro(res);
            }
            else {
                var msg = new Mensagem("Seu orçamento foi gerado e enviado para seu cliente por e-mail. Obrigado por orçar conosco!");
                msg.setTitulo("Orçamento realizado com Sucesso!");
                msg.mostrar(function () {
                    orcamento9.enviado = true;
                    orcamento9.btnsFinal.style.display = "none";
                    orcamento9.navFinal.style.display = "block";
                    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
                    vg.salvarLocal(null);

                    var acres = new VarGlobal("acrescimos"),
                        inc = new VarGlobal("incrementos"),
                        margeSelec = new VarGlobal("margemSelecionada");

                    acres.salvarLocal(null);
                    inc.salvarLocal(null);
                    margeSelec.salvarLocal(null);
                    
                    var car = new VarGlobal('carrinho');
                    car.salvarLocal(null);
                });
            }
        });
        teste.classList.remove('is-active');
    });

    var btnNao = document.querySelector('#listaExcluirNaoo9');                        
    btnNao.addEventListener('click', function(){
        orcamento9.enviado = true;
        orcamento9.btnsFinal.style.display = "none";
        orcamento9.navFinal.style.display = "block";
        var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
        vg.salvarLocal(null);

        var acres = new VarGlobal("acrescimos"),
        inc = new VarGlobal("incrementos"),
        margeSelec = new VarGlobal("margemSelecionada");

        acres.salvarLocal(null);
        inc.salvarLocal(null);
        margeSelec.salvarLocal(null);

        var car = new VarGlobal('carrinho');
        car.salvarLocal(null); 

        teste.classList.remove('is-active');
    });


    },

    calcFinal: function(){
        app.E('btnEnvia').style.display = 'none';
        Loader.mostrar();
        /*Reset*/
      var self = this;
      self.vlTotal = 0;
      self.tmpVlTotal = 0;
      if(!self.acrescimos){
        self.acrescimos = {};
      }
      if(!self.quantidades){
        self.quantidades = {};
      }
      self.orcamento_id = 0;
      var api = new Api('portoes/componentes', { 'is_padrao': '1' });
      api.send(function (res) {
          if (!res.error) {
            var compsPadrao;
            console.log(self.calculado);
              if(self.calculado){
                compsPadrao = orcamento9.tmpDados.opcionais; 
              }else{
                compsPadrao = res;
              }
              
              self.listaProds.innerHTML = "";

              self.tmpDados.porm2 = app.C(self.tmpDados.fnAltura, "*", app.N(self.tmpDados.largura), 3);

              var nPortas = self.tmpDados.quantidadeDePortas,
                  largura = app.N(self.tmpDados.largura),
                  altura = self.tmpDados.fnAltura,
                  pm2 = self.tmpDados.porm2,
                  perfilDds = self.tmpDados.perfilDds,
                  motorDds = self.tmpDados.motorDds,
                  testeiraDds = self.tmpDados.testeiraDds,
                  fitaDds = self.tmpDados.fitaDds;

              var fnTpi, pintDds, autDds;

              var fnTpi = self.tmpDados.tipoDeInstalacao;

              self.quantidades.perfil = self.quantidades.perfil ? self.quantidades.perfil : app.C(pm2, "*", nPortas);
              
              if(self.tmpDados.perfilDds){
                if(self.quantidades.perfil){
                    self.valores.perfil = app.C(perfilDds.valor_unitario, "*", self.quantidades.perfil, 2);
                }else{
                    self.valores.perfil = app.C(perfilDds.valor_unitario, "*", pm2, 2);
                }
                

                var perfilVl;
                perfilVl = self.valores.perfil; 

                
                if(self.acrescimos.perfil){
                    var porcentagem = perfilVl * (self.acrescimos.perfil / 100);//app.C(perfilVl, "*", (app.C(self.acrescimos.perfil, "/", 100)));
                    self.tmpValores.perfil = app.C(perfilVl, "+", porcentagem, 2);
                }else{
                    self.tmpValores.perfil = perfilVl;//padrao caso nao haja alteração
                }
                Loader.mostrar();
                self.listaProds.appendChild(self.geraProdutosOrcamento('perfil', self.quantidades.perfil, perfilDds, self.valores.perfil, self.tmpValores.perfil));
              }
              //  ******* fim perfil ********
              if(self.tmpDados.motorDds){
                
                if(self.quantidades.motor){
                    self.valores.motor = app.C(motorDds.valor_unitario, "*", self.quantidades.motor, 2);
                }else{
                    self.valores.motor = app.C(motorDds.valor_unitario, "*", nPortas, 2);
                }

                self.quantidades.motor = self.quantidades.motor ? self.quantidades.motor : nPortas;

                var motorVl;
                motorVl = self.valores.motor;
                
                if(self.acrescimos.motor){
                    var porcentagem = motorVl * (self.acrescimos.motor / 100);
                    self.tmpValores.motor = app.C(motorVl, "+", porcentagem, 2);
                }else{
                    self.tmpValores.motor = motorVl;//padrao caso nao haja alteração

                }
                Loader.mostrar();
                self.listaProds.appendChild(self.geraProdutosOrcamento('motor', self.quantidades.motor, motorDds, self.valores.motor, self.tmpValores.motor));
              }
              // ************* fim motor **********

              if(self.tmpDados.testeiraDds){

                if(self.quantidades.testeira){
                    self.valores.testeira = app.C(testeiraDds.valor_unitario, "*", self.quantidades.testeira, 2);
                }else{
                    self.valores.testeira = app.C(testeiraDds.valor_unitario, "*", nPortas, 2);
                }

                self.quantidades.testeira = self.quantidades.testeira ? self.quantidades.testeira : nPortas;

                var testeiraVl;
                testeiraVl = self.valores.testeira;
                
                if(self.acrescimos.testeira){
                    var porcentagem = testeiraVl  * (self.acrescimos.testeira / 100);//app.C(testeiraVl, "*", (app.C(self.acrescimos.testeira, "/", 100)));
                    self.tmpValores.testeira = app.C(testeiraVl, "+", porcentagem, 2);
                }else{
                    self.tmpValores.testeira = testeiraVl;//padrao caso nao haja alteração

                }

                // self.valores.testeira = app.C(testeiraDds.valor_unitario, "*", nPortas, 2);
                // self.tmpValores.testeira = app.C(testeiraDds.valor_unitario, "*", nPortas, 2);

                // self.quantidades.testeira = self.quantidades.testeira ? self.quantidades.testeira : nPortas;
                Loader.mostrar();
                self.listaProds.appendChild(self.geraProdutosOrcamento('testeira', self.quantidades.testeira, testeiraDds, self.valores.testeira, self.tmpValores.testeira));    

              }
              // fim testeira
              if(self.tmpDados.fitaDds){

                if(self.quantidades.fita){
                    self.valores.fita = app.C(fitaDds.valor_unitario, "*", self.quantidades.fita, 2);
                }else{
                    self.valores.fita = app.C(fitaDds.valor_unitario, "*", nPortas, 2);
                }

                self.quantidades.fita = self.quantidades.fita ? self.quantidades.fita : nPortas;

                var fitaVl;
                fitaVl = self.valores.fita;
                
                if(self.acrescimos.fita){
                    var porcentagem = fitaVl * (self.acrescimos.fita / 100);//app.C(fitaVl, "*", (app.C(self.acrescimos.fita, "/", 100)));
                    self.tmpValores.fita = app.C(fitaVl, "+", porcentagem, 2);
                }else{
                    self.tmpValores.fita = fitaVl;//padrao caso nao haja alteração

                }

            //   self.valores.fita = app.C(fitaDds.valor_unitario, "*", nPortas, 2);
            //   self.tmpValores.fita = app.C(fitaDds.valor_unitario, "*", nPortas, 2);

            //   self.quantidades.fita = self.quantidades.fita ? self.quantidades.fita : nPortas;
                Loader.mostrar();
               self.listaProds.appendChild(self.geraProdutosOrcamento('fita', self.quantidades.fita, fitaDds, self.valores.fita, self.tmpValores.fita));

              }

              if (self.tmpDados.automatizador_id > 0) {
                  autDds = self.tmpDados.autDds;
                  if (autDds.id > 0) {

                    if(self.quantidades.automatizador){
                        self.valores.automatizador = app.C(autDds.valor_unitario, "*", self.quantidades.automatizador, 2);
                    }else{
                        self.valores.automatizador = app.C(autDds.valor_unitario, "*", nPortas, 2);
                    }
    
                    self.quantidades.automatizador = self.quantidades.automatizador ? self.quantidades.automatizador : nPortas;
    
                    var automatizadorVl;
                    automatizadorVl = self.valores.automatizador;
                    
                    if(self.acrescimos.automatizador){
                        var porcentagem = automatizadorVl * (self.acrescimos.automatizador / 100);//app.C(automatizadorVl, "*", (app.C(self.acrescimos.automatizador, "/", 100)));
                        self.tmpValores.automatizador = app.C(automatizadorVl, "+", porcentagem, 2);
                    }else{
                        self.tmpValores.automatizador = automatizadorVl;//padrao caso nao haja alteração
                    }

                    //   self.valores.automatizador = app.C(autDds.valor_unitario, "*", nPortas, 2);
                    //   self.tmpValores.automatizador = app.C(autDds.valor_unitario, "*", nPortas, 2);

                    //   self.quantidades.automatizador = self.quantidades.automatizador ? self.quantidades.automatizador : nPortas;
                    Loader.mostrar();
                      self.listaProds.appendChild(self.geraProdutosOrcamento('automatizador', self.quantidades.automatizador, autDds, self.valores.automatizador, self.tmpValores.automatizador));
                  }
              }
              
              if (self.tmpDados.entradas && self.tmpDados.entradas.entrada_id > 0) {

                var entradaDds = self.tmpDados.entradaDds;

                if(self.quantidades.entrada){
                    self.valores.entrada = app.C(entradaDds.valor_unitario, "*", self.quantidades.entrada, 2);
                }else{
                    self.valores.entrada = app.C(entradaDds.valor_unitario, "*", nPortas, 2);
                }

                self.quantidades.entrada = self.quantidades.entrada ? self.quantidades.entrada : nPortas;

                var entradaVl;
                entradaVl = self.valores.entrada;
                
                console.log("entradaVl:"+entradaVl);

                if(self.acrescimos.entrada){
                    var porcentagem = entradaVl * (self.acrescimos.entrada / 100);//app.C(entradaVl, "*", (app.C(self.acrescimos.entrada, "/", 100)));
                    console.log("entradaVl:"+porcentagem);
                    self.tmpValores.entrada = app.C(entradaVl, "+", porcentagem, 2);
                }else{
                    self.tmpValores.entrada = entradaVl;//padrao caso nao haja alteração
                }


                //   self.valores.entrada = app.C(entradaDds.valor_unitario, "*", nPortas, 2);
                //   self.tmpValores.entrada = app.C(entradaDds.valor_unitario, "*", nPortas, 2);

                //   self.quantidades.entrada = self.quantidades.entrada ? self.quantidades.entrada : nPortas;
                Loader.mostrar();
                self.listaProds.appendChild(self.geraProdutosOrcamento('entrada', self.quantidades.entrada, entradaDds, self.valores.entrada, self.tmpValores.entrada));
              }


              if (self.tmpDados.pintura > 0) {
                  pintDds = self.tmpDados.pinturaDds;
                  if (pintDds.id > 0) {

                    if(self.quantidades.pintura){
                        self.valores.pintura =  app.C(pintDds.valor_unitario, "*", self.quantidades.pintura, 2);
                    }else{
                        self.valores.pintura = app.C(pintDds.valor_unitario, "*", app.C(pm2, "*", nPortas), 2);
                    }
    
                    self.quantidades.pintura = self.quantidades.pintura ? self.quantidades.pintura : app.C(pm2, "*", nPortas);
    
                    var pinturaVl;
                    pinturaVl = self.valores.pintura;
                    
                    if(self.acrescimos.pintura){
                        var porcentagem = pinturaVl * (self.acrescimos.pintura / 100);//app.C(pinturaVl, "*", (app.C(self.acrescimos.pintura, "/", 100)));
                        self.tmpValores.pintura = app.C(pinturaVl, "+", porcentagem, 2);
                    }else{
                        self.tmpValores.pintura = pinturaVl;//padrao caso nao haja alteração
                    }

                    
                    //   self.valores.pintura = app.C(app.C(pintDds.valor_unitario, "*", pm2), "*", nPortas, 2);
                    //   self.tmpValores.pintura = app.C(app.C(pintDds.valor_unitario, "*", pm2), "*", nPortas, 2);

                    //   self.quantidades.pintura = self.quantidades.pintura ? self.quantidades.pintura : app.C(pm2, "*", nPortas);
                    Loader.mostrar();
                      self.listaProds.appendChild(self.geraProdutosOrcamento('pintura', self.quantidades.pintura, pintDds, self.valores.pintura, self.tmpValores.pintura));
                  }
              }
              
           
              if (compsPadrao.length > 0) {
                  for (var key in compsPadrao) {
                      var resu = self.calcForumlasProd(compsPadrao[key], largura, altura, nPortas, pm2, self.tmpDados.peso_total, fnTpi, "condicao");
                      if (resu > 0 || resu === compsPadrao[key].condicao) {
                          compsPadrao[key].tipo = false;
                          compsPadrao[key].remove = false;
                          self.tmpDados.opcionais[compsPadrao[key].id] = compsPadrao[key];
                      }
                  }
                  self.calculado = true;
              }
              Loader.mostrar();
              self.geraProdutoOrcamentoOpcional(self.tmpDados.opcionais, largura, altura, nPortas, pm2, self.tmpDados.peso_total, fnTpi);
              
              if($('.item-orc').length == 0){
                self.valor_total = "0.00"
                self.btnEnvia.style.display = "none";
              }else{
                self.btnEnvia.style.display = "flex";
                document.getElementById("loader-final").classList.add("is-loaded");
              }
            console.log("final func");
            orcamento9.insertDescont();
          }
      });
    },

    checaBtFinal: function(){
        if(self.valor_total == "0.00"){
            Loader.mostrar();
            app.E('btnEnvia').style.display = 'none';
        }else{
            Loader.remover();
            app.E('btnEnvia').style.display = 'flex';
            document.getElementById("loader-final").classList.add("is-loaded");
        }

    },

    setProdutosCarrinho: function(){

      this.listaProds.innerHTML = "";
      this.vlTotal = 0;
      if(this.prods){
        //   for(var i = 0; i < this.dados.dados.length; i++){
        //       this.listaProds.appendChild(this.geraProdutosCarrinho(this.dados.dados[i]));
        //   }
          this.geraProdutoOrcamentoOpcional(this.prods);
          app.E("valor_total").innerHTML = orcamento9.vlTotal;
      }else{
          this.listaProds.innerHTML = "<h3>Nenhum produto encontrado</h3>";
      }
      
      if($('.item-orc').length == 0){
        self.valor_total = "0.00"
        self.btnEnvia.style.display = "none";
      }
      app.E('btnEnvia').style.display = 'flex';
      document.getElementById("loader-final").classList.add("is-loaded");
    },

    geraProdutosOrcamento: function(tipoProd, quantidade, dados, valor, valorTmp){

        if(!valorTmp){
            valorTmp = valor;
        }
         if(!dados.medida){
             if(dados.unidade_medida){
                 dados.medida = dados.unidade_medida;
             }
         }
      var item,imageProduto,nome,tipo,nome,preco,editar,self = this;
      if(dados.medida == 'Un' || dados.medida == 'PAR' || dados.unidade == 'PC' || dados.medida == 'RL'){
        quantidade = Math.ceil(quantidade);
      }
        if(!isNaN(tipoProd)){
            if(self.quantidades.opcionais != undefined){
                self.quantidades.opcionais[dados.id] = quantidade;
                valor = app.C(quantidade, "*", valor, 2);
                valorTmp = app.C(quantidade, "*", valorTmp, 2);
                self.valores.opcionais[dados.id] = valor;
                self.tmpValores.opcionais[dados.id] = valorTmp;
                if(self.acrescimos.opcionais[dados.id]){
                    var acrescimo = valor * (self.acrescimos.opcionais[dados.id] / 100);//app.C(valor, "*", (self.acrescimos.opcionais[dados.id] / 100));
                    valorTmp = app.C(valor, "+", acrescimo);
                    self.tmpValores.opcionais[dados.id] = valorTmp;
                }
            }
        }
          item = app.CE("div",{id: 'prod'+dados.id, class: "item item-orc"});
          imageProduto = app.CE("img",{src: "./img/loader.gif", alt: dados.nome});
          nome = app.CE("div",{class: "nome"});
          tipo = app.CE("div",{class: "tipo"});
          preco = app.CE("div",{class: "preco"});
          editar = app.CE("div",{id: 'editar'});
          editar.innerHTML = "<svg class='icon'><use xlink:href='icon.svg#icon-ellipsis-v'></use></svg>";

          orcamento9.vlTotal = (parseFloat(orcamento9.vlTotal) + (parseFloat(valorTmp)) ).toFixed(2);
          orcamento9.tmpVlTotal = (parseFloat(orcamento9.tmpVlTotal) + (parseFloat(valor)) ).toFixed(2);

            if(dados.imagem != null){
                app.getImgFromApi(dados.imagem, function (res){
                    imageProduto.src = res;
                });
            }else if(dados.img != null){
                app.getImgFromApi(dados.img, function (res){
                    imageProduto.src = res;
                });           
            }else{
                imageProduto.src = "./img/nenhum.png"
            }

          valor = valorTmp ? valorTmp : valor;
          console.log(valor);
          nome.innerHTML = dados.nome;
          tipo.innerHTML = app.N(quantidade,2) + "<br/>("+dados.medida+")";
          preco.innerHTML = "R$ "+valor.toFixed(2);

          (function(obj,dados,tipo){
            obj.addEventListener("click",function(){
                if(orcamento9.enviado == false){
                    orcamento9.divModal.classList.add("is-active");
                    app.E("modalProdNome").innerHTML = dados.nome;
                    orcamento9.setaComponentesModal(tipo,dados);
                }
            });
          })(item,dados,tipoProd);

          item.appendChild(imageProduto);
          item.appendChild(nome);
          item.appendChild(tipo);
          item.appendChild(preco);
          item.appendChild(editar);

          orcamento9.valor_total.innerHTML = "R$ "+orcamento9.vlTotal;

          return item;
    },

    geraProdutoOrcamentoOpcional: function(opcionais, largura, altura, nPortas, pm2, peso_total, tpiDds) {
         if(!nPortas){
             largura = 1,
             altura = 1,
             nPortas = 1,
             pm2 = 1;
         }

        var self = this;
        if (Object.keys(opcionais).length > 0) {

            
            if (!self.valores['opcionais']) {
                self.valores['opcionais'] = {};
                self.tmpValores['opcionais'] = {};
            }
            if (!self.acrescimos['opcionais']) {
                self.acrescimos['opcionais'] = {};
            }
    
            var rodape = [];
    
            for (var key in opcionais) {
                console.log(opcionais[key]);
                if (opcionais[key].is_rodape == "0" || !opcionais[key].is_rodape) {
                    var opQtd = self.calcForumlasProd(opcionais[key], largura, altura, nPortas, pm2, self.tmpDados.peso_total, tpiDds),
                        valorOpc = 0;
                    
                    opQtd = opQtd * nPortas;

                    if (!opQtd) {
                        opQtd = nPortas;
                    }
                    valorOpc = app.N(opcionais[key].valor_unitario);

                    if (self.quantidades.opcionais == null) {
                        self.quantidades.opcionais = {};
                    }
                    
                    if(!self.quantidades.opcionais[key]){
                        if (opcionais[key].quantidade) {
                            self.quantidades.opcionais[key] = opcionais[key].quantidade;
                        }else{
                            self.quantidades.opcionais[key] = opQtd;
                        }

                    }
                   
                    self.valores.opcionais[key] = valorOpc;
                    self.tmpValores.opcionais[key] = valorOpc;
                    if(self.incrementos.opcionais[key]){
                        self.valores.opcionais[key] += self.incrementos.opcionais[key];
                        self.tmpValores.opcionais[key] += self.incrementos.opcionais[key];
                    }
                    var tipo = opcionais[key].tipo;
                    if (tipo === undefined) { tipo = "opc"; }
                    console.log("Quantidade:");
                    console.log(self.quantidades.opcionais[key]);
                    self.listaProds.appendChild(self.geraProdutosOrcamento(key, self.quantidades.opcionais[key], opcionais[key], self.valores.opcionais[key]));
                }
                else {
                    rodape.push(opcionais[key]);
                }
            }
            for (var key in rodape) {
                var opQtd = self.calcForumlasProd(rodape[key], largura, altura, nPortas, pm2, self.tmpDados.peso_total, tpiDds),
                    valorOpc = 0;
    
                    opQtd = opQtd * nPortas;

                    if (!opQtd) {
                        opQtd = nPortas;
                    }
                    valorOpc = app.N(opcionais[rodape[key].id].valor_unitario);

                    if (self.quantidades.opcionais == null) {
                        self.quantidades.opcionais = {};
                    }


                    if(!self.quantidades.opcionais[rodape[key].id]){
                        if (opcionais[rodape[key].id].quantidade) {
                            self.quantidades.opcionais[rodape[key].id] = opcionais[rodape[key].id].quantidade;
                        }else{
                            self.quantidades.opcionais[rodape[key].id] = opQtd;
                        }

                    }
                   
                    
                    self.valores.opcionais[rodape[key].id] = valorOpc;
                    self.tmpValores.opcionais[rodape[key].id] = valorOpc;

                    if(self.incrementos.opcionais[rodape[key].id]){
                        self.valores.opcionais[rodape[key].id] += self.incrementos.opcionais[rodape[key].id];
                        self.tmpValores.opcionais[rodape[key].id] += self.incrementos.opcionais[rodape[key].id];
                    }

                    var tipo = rodape[key].tipo;
                    if (tipo === undefined) { tipo = "opc"; }

                self.listaProds.appendChild(self.geraProdutosOrcamento(rodape[key].id, self.quantidades.opcionais[rodape[key].id], rodape[key], self.valores.opcionais[rodape[key].id]));
    
            }
            orcamento9.valor_total.innerHTML = "R$ "+orcamento9.vlTotal;
        }
    },

    geraProdutosCarrinho: function(dds){
      var list_table,imageProduto,nome,tipo,preco,svgLixo;

          list_table = app.CE("div",{class: 'list-table', id: 'prod'+dds.id});
          imageProduto = app.CE("img",{src: "./img/loader.gif", alt: dds.nome, class: 'w-100'});
          nome = app.CE("div",{class: "nome"});
          tipo = app.CE("div",{class: "tipo"});
          preco = app.CE("div",{class: "preco"});
          svgLixo = app.CE("div",{id: 'divLixo'});
          svgLixo.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='icon w-100 mg -bm-md' viewBox='0 0 24 28'><path fill='white' d='M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z' style='width: 25px;height: 25px;'></path></svg>";

          orcamento9.vlTotal = (parseFloat(orcamento9.vlTotal) + (parseFloat(dds.valor_unitario) * parseInt(dds.quantidade)) ).toFixed(2);

          if(dds.img != null){
              app.getImgFromApi(dds.img, function (res){
                  imageProduto.src = res;
              });
          }else{
              imageProduto.src = "./img/nenhum.png"
          }

          nome.innerHTML = dds.nome;
          tipo.innerHTML = dds.quantidade + "<br/>("+dds.unidade_medida+")";
          preco.innerHTML = "R$ "+dds.valor_unitario;

          (function(obj,dados){
              obj.addEventListener("click",function(){
                  orcamento9.removeCart(dados.id,dados.nome);
              });
          })(svgLixo,dds);

          list_table.appendChild(imageProduto);
          list_table.appendChild(nome);
          list_table.appendChild(tipo);
          list_table.appendChild(preco);
          list_table.appendChild(svgLixo);

          return list_table;
    },

    calcForumlasProd: function(prod, largura, altura, nPortas, pm2, peso_total, tpiDds, formKey) {
        var self = this;
        var attPrfDds, attMatDds, attPrfChecked, attMatChecked, calc;
    
        calc = prod[formKey ? formKey : "formula"];
        if (calc) {
            var varsFormula = {
                'ATT': self.tmpDados.altura,
                'LGP': largura,
                'ATP': altura,
                'PTP': nPortas,
                'PM2': pm2,
                'PKG': peso_total,
                'PRF': self.tmpDados.perfilID,
                'MAT': self.tmpDados.materialID,
                'TPI': self.tmpDados.tipoDeInstalacao,
                'VL': prod.valor_unitario
            };
            
            var cf = new CalcFormula(calc, varsFormula);
            return cf.calcula();
        }
        return calc;
    },

    setaComponentesModal: function(tipo,antigo) {
        var api,self = this;
        self.btTroca.style.display = "flex";
        self.btVlr.style.display = "flex";
        if(antigo.valor_unitario > 0){
            self.btVlr.style.display = "none";
        }
        if(tipo == 'motor'){
            api = new Api("motores", null, true, true);
            self.listaInputQtd.value = self.quantidades.motor;
        }else if(tipo == 'testeira'){
            api = new Api("motores/testeiras", null, true, true);
            self.listaInputQtd.value = self.quantidades.testeira;
        }else if(tipo == 'fita'){
            api = new Api('portoes/fitaPVC', null, true, true);
            self.listaInputQtd.value = self.quantidades.fita;
        }else if(tipo == 'automatizador'){
            api = new Api('motores/automatizadores', null, true, true);
            self.listaInputQtd.value = self.quantidades.automatizador;
        }else if(tipo == 'entrada'){
            api = new Api('portoes/entradas', null, true, true);
            self.listaInputQtd.value = self.quantidades.entrada;
        }else if(tipo == 'pintura'){
            api = new Api('portoes/pinturas', null, true, true);
            self.listaInputQtd.value = self.quantidades.pintura;
        }else if(tipo == 'perfil'){
            self.btTroca.style.display = "none";
            self.listaInputQtd.value = self.quantidades.perfil;
        }else{
            tipo="opcional"
            self.listaInputQtd.value = self.quantidades.opcionais[antigo.id];
            api = new Api('portoes/componentes', null , true, true);
        }
        if(api){
            api.send(function(res){
                self.listaTrocaItem.innerHTML = "";
                if(!res.error){
                    if(res.length > 0 ){
                        for(var i = 0; i < res.length; i++){
                            self.listaTrocaItem.appendChild(self.geraComponenteModal(res[i],antigo,tipo));
                        }
                    }
                }else{
                    app.Erro(res);
                }
            });
        }

        self.listaTrocaMargem.innerHTML = "";
        
        var acresMax = app.thisUser[0].acrecimo_max;

        for(var i = parseInt(acresMax); i > 0; i -= 5){
            var obj = app.CE("li",{class: 'option'});
            var span = app.CE("span",{class: 'nome'})
            span.innerHTML = i+"%";

            obj.appendChild(span);

            (function(objeto, valor){
                objeto.addEventListener("click", function(){
                    orcamento9.salvarParaGlobal(orcamento9.tmpDados);
                    var acres = new VarGlobal("acrescimos");
                    if(tipo == 'motor'){
                        orcamento9.acrescimos.motor = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'testeira'){
                        orcamento9.acrescimos.testeira = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'fita'){
                        orcamento9.acrescimos.fita = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'automatizador'){
                        orcamento9.acrescimos.automatizador = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'entrada'){
                        orcamento9.acrescimos.entrada = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'pintura'){
                        orcamento9.acrescimos.pintura = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'perfil'){
                        orcamento9.acrescimos.perfil = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else{
                        orcamento9.acrescimos.opcionais[antigo.id] = valor;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }
                });
            })(obj, i)

            self.listaTrocaMargem.appendChild(obj);

        }

        var obj = app.CE("li",{class: 'option'});
        var span = app.CE("span",{class: 'nome'})
        span.innerHTML = "0%";

        obj.appendChild(span);

        obj.addEventListener("click", function(){
            orcamento9.salvarParaGlobal(orcamento9.tmpDados);
            var acres = new VarGlobal("acrescimos");
            if(tipo == 'motor'){
                self.acrescimos.motor = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else if(tipo == 'testeira'){
                self.acrescimos.testeira = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else if(tipo == 'fita'){
                self.acrescimos.fita = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else if(tipo == 'automatizador'){
                self.acrescimos.automatizador = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else if(tipo == 'entrada'){
                self.acrescimos.entrada = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else if(tipo == 'pintura'){
                self.acrescimos.pintura = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else if(tipo == 'perfil'){
                self.acrescimos.perfil = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }else{
                self.acrescimos.opcionais[antigo.id] = 0;
                acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                self.inicializar();
            }
        });

        self.listaTrocaMargem.appendChild(obj);
        
        var descMax = app.thisUser[0].desconto_max;
        var descontoSeletivo = app.thisUser[0].desconto_seletivo;

        if(descontoSeletivo == 1){
            switch(tipo){
                case 'motor':
                    descMax = app.thisUser[0].desconto_mto;
                    break;
                case 'testeira':
                    descMax = app.thisUser[0].desconto_tst;
                    break;
                case 'fita':
                    descMax = app.thisUser[0].desconto_opc;
                    break;
                case 'automatizador':
                    descMax = app.thisUser[0].desconto_aut;
                    break;
                case 'entrada':
                    descMax = app.thisUser[0].desconto_ent;
                    break;
                case 'pintura':
                    descMax = app.thisUser[0].desconto_ptr;
                    break;
                case 'perfil':
                    descMax = app.thisUser[0].desconto_prf;
                    break;
                default:
                    descMax = app.thisUser[0].desconto_opc;
                    break;
            }
        }

        for(var i = 5; i <= descMax; i += 5){
            var obj = app.CE("li",{class: 'option'});
            var span = app.CE("span",{class: 'nome'})
            span.innerHTML = "-"+i+"%";

            obj.appendChild(span);
            
            (function(objeto, valor){
                objeto.addEventListener("click", function(){
                    var acres = new VarGlobal("acrescimos");
                    orcamento9.salvarParaGlobal(orcamento9.tmpDados);
                    if(tipo == 'motor'){
                        orcamento9.acrescimos.motor = (valor * -1) ;
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'testeira'){
                        orcamento9.acrescimos.testeira = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'fita'){
                        orcamento9.acrescimos.fita = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'automatizador'){
                        orcamento9.acrescimos.automatizador = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'entrada'){
                        orcamento9.acrescimos.entrada = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'pintura'){
                        orcamento9.acrescimos.pintura = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else if(tipo == 'perfil'){
                        orcamento9.acrescimos.perfil = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }else{
                        orcamento9.acrescimos.opcionais[antigo.id] = (valor * -1);
                        acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));
                        orcamento9.inicializar();
                    }
                });
            })(obj, i)

            self.listaTrocaMargem.appendChild(obj);
        }

        self.listaExcluirSim.addEventListener("click",function(){
            self.removeProd(tipo,antigo)
        });

        self.listaExcluirNao.addEventListener("click",function(){
            self.fechaModalClick();
        });


        var funcQtd = function(){
            self.setaQtd(tipo, self.listaInputQtd.value, antigo.id);
        };

        var funcAddVlr = function(){
            self.incrementaVlr(tipo, self.listaInputVlr.value, antigo.id);
        };

        self.btnQtdOk.addEventListener("click", funcQtd);
        self.btnVlrOk.addEventListener("click", funcAddVlr);

    },

    removeProd: function(tipo,dds){
        var self = this;
        if(tipo == 'motor'){
            delete self.tmpDados.motorDds;
            delete self.valores.motor;
            delete self.quantidades.motor;
        }else if(tipo == 'testeira'){
            delete self.tmpDados.testeiraDds;
            delete self.valores.testeira;
            delete self.quantidades.testeira;
        }else if(tipo == 'fita'){
            delete self.tmpDados.fitaDds;
            delete self.valores.fita;
            delete self.quantidades.fita;
        }else if(tipo == 'automatizador'){
            delete self.tmpDados.automatizador_id;
            delete self.tmpDados.autDds;
            delete self.valores.automatizador;
            delete self.quantidades.automatizador;
        }else if(tipo == 'entrada'){
            delete self.tmpDados.entradaDds;
            delete self.tmpDados.entradas;
            delete self.valores.entrada;
            delete self.quantidades.entrada;
        }else if(tipo == 'pintura'){
            delete self.tmpDados.pintura;
            delete self.tmpDados.pinturaDds;
            delete self.valores.pintura;
            delete self.quantidades.pintura;
        }else if(tipo == 'perfil'){
            delete self.tmpDados.perfil;
            delete self.tmpDados.perfilDds;
            delete self.tmpDados.perfilID;
            delete self.valores.perfil;
            delete self.quantidades.perfil;
        }else{
            if(self.tmpDados.opcionais){
                delete self.tmpDados.opcionais[dds.id];
            }else{
                delete self.prods[dds.id];
            }
            delete self.valores.opcionais[dds.id];
            delete self.quantidades.opcionais[dds.id];
        }

        orcamento9.salvarParaGlobal(orcamento9.tmpDados);
        self.fechaModalClick();
        self.inicializar();
    },

    setaQtd: function(tipo,valor,opcId){
        var self = this;
            if(tipo != "opcional"){
                if(tipo == 'perfil'){
                    self.quantidades.perfil = valor;
                }else{
                    self.quantidades[tipo] = valor;
                }
            }else{
                    self.quantidades.opcionais[opcId] = valor;
                    console.log(self.quantidades.opcionais[opcId]);
                    console.log(self.quantidades.opcionais);
            }

            orcamento9.salvarParaGlobal(orcamento9.tmpDados);
            self.fechaModalClick();
            self.inicializar();
    },

    setaMargemGeral: function(){

        var acresMax = app.thisUser[0].acrecimo_max;
        var descMax = app.thisUser[0].desconto_max;
        var descontoSeletivo = app.thisUser[0].desconto_seletivo;

        var todosDescontos = [];

        if(descontoSeletivo == 1){
            todosDescontos.push(parseInt(app.thisUser[0].desconto_aut));
            todosDescontos.push(parseInt(app.thisUser[0].desconto_ent));
            todosDescontos.push(parseInt(app.thisUser[0].desconto_mto));
            todosDescontos.push(parseInt(app.thisUser[0].desconto_opc));
            todosDescontos.push(parseInt(app.thisUser[0].desconto_prf));
            todosDescontos.push(parseInt(app.thisUser[0].desconto_ptr));
            todosDescontos.push(parseInt(app.thisUser[0].desconto_tst));
            console.log(todosDescontos);

            todosDescontos.sort(function(a, b) {
                return a - b;
              });

            console.log(todosDescontos);
            descMax = todosDescontos[0];
        }

        var select = app.CE("select",{class: "select-desc"});
        
        for(var i = parseInt(acresMax); i > 0; i -= 5){
            var obj = app.CE("option");
            obj.innerHTML = i+"%";
            obj.value = i;

            select.appendChild(obj);
        }

        var obj = app.CE("option",{selected: "selected"});
            obj.innerHTML = "0%";
            obj.value = 0;

            select.appendChild(obj);

        for(var i = 5; i <= descMax; i += 5){
            var obj = app.CE("option");
            obj.innerHTML = "-"+i+"%";
            obj.value = (i * -1);

            select.appendChild(obj);
        }

            select.addEventListener("change", function(){
                    var valor = $(select).val();
                    console.log("change");
                    console.log(valor);
                    orcamento9.acrescimos.motor = valor;
                    orcamento9.acrescimos.testeira = valor;
                    orcamento9.acrescimos.fita = valor;
                    orcamento9.acrescimos.automatizador = valor;
                    orcamento9.acrescimos.entrada = valor;
                    orcamento9.acrescimos.pintura = valor;
                    orcamento9.acrescimos.perfil = valor;
                    for(var keys in orcamento9.valores.opcionais){
                        if(keys == 100 || keys == 552){
                            orcamento9.acrescimos.opcionais[keys] = 0;
                        }else{  
                            orcamento9.acrescimos.opcionais[keys] = valor;
                        }
                    }
                    orcamento9.margemSelecionada = valor;
                    var acres = new VarGlobal("acrescimos"),
                    margeSelec = new VarGlobal("margemSelecionada");

                    margeSelec.salvarLocal(orcamento9.margemSelecionada);

                    acres.salvarLocal(JSON.stringify(orcamento9.acrescimos));

                    orcamento9.salvarParaGlobal(orcamento9.tmpDados);
                    orcamento9.inicializar();
            });

        if(orcamento9.margemSelecionada != 0){
            $(select).val(orcamento9.margemSelecionada);
        }
        self.selecMargem.innerHTML = "";
        self.selecMargem.appendChild(select);


    },

    incrementaVlr: function(tipo, valor,opcId){
        orcamento9.incrementos.opcionais[opcId] = valor;
        var inc = new VarGlobal("incrementos");
        inc.salvarLocal(JSON.stringify(orcamento9.incrementos));
        orcamento9.salvarParaGlobal(orcamento9.tmpDados);
        orcamento9.inicializar();
    },

    geraComponenteModal: function(dds,antigo,tipo){
        var li, span;
        li = app.CE("li",{class: "option"});
        span = app.CE("span", {class: "nome"});
        span.innerHTML = dds.nome;

        (function(obj, dados, antigo, tipo){
            obj.addEventListener("click",function(){
                if(tipo == 'motor'){
                    orcamento9.tmpDados.motorDds = dados;
                } else if(tipo == 'testeira'){
                    orcamento9.tmpDados.testeiraDds = dados;
                }else if(tipo == 'fita'){
                    orcamento9.tmpDados.fitaDds = dados;
                }else if(tipo == 'automatizador'){
                    orcamento9.tmpDados.autDds = dados;
                }else if(tipo == 'entrada'){
                    orcamento9.tmpDados.entradaDds = dados;
                }else if(tipo == 'pintura'){
                    orcamento9.tmpDados.pintura = dados.id;
                    orcamento9.tmpDados.pinturaDds = dados;
                }else{
                    console.log(antigo);
                    if(orcamento9.tmpDados.opcionais){
                        delete orcamento9.tmpDados.opcionais[antigo.id];
                        orcamento9.tmpDados.opcionais[dados.id] = dados;
                    }else{
                        delete orcamento9.prods[antigo.id];
                        orcamento9.prods[dados.id] = dados;
                    }
                }
                console.log("TROCOU POR: "+dados.nome);
                orcamento9.salvarParaGlobal(orcamento9.tmpDados);
                orcamento9.fechaModalClick();
                orcamento9.inicializar();
            });
        })(li,dds,antigo,tipo);

        li.appendChild(span);

        return li;

    },

    salvarParaGlobal: function (dds){
        var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
        vg.salvarLocal(JSON.stringify(dds));
    },

    /*btEditarClick: function () {
      $(btEditar).click(function() {
        $('.modal').toggleClass( "is-active" );
      });

      $(botaoOverlay).click(function() {
        $('.modal').removeClass( "is-active" );

        $('.list-options').addClass( "-is-active");
        $('.list-trocaItem').removeClass( "-is-active");
        $('.list-excluir').removeClass( "-is-active");
        $('.list-trocaMargem').removeClass( "-is-active");
        $('.box-search').removeClass( "-is-active");
        $('.list-quantidade').removeClass( "-is-active");
      });
    },*/

    btTrocaClick: function () {
      $('.list-options').removeClass( "-is-active");
      $('.list-trocaItem').addClass( "-is-active");
      $('.box-search').addClass( "-is-active");
    },

    btMargemClick: function () {
      $('.list-options').removeClass( "-is-active");
      $('.list-trocaMargem').addClass( "-is-active");
    },

    btExcluirClick: function () {
      $('.list-options').removeClass( "-is-active");
      $('.list-excluir').addClass( "-is-active");
    },

    btQtdClick: function () {
      $('.list-options').removeClass( "-is-active");
      $('.list-quantidade').addClass( "-is-active");
    },
    
    btVlrClick: function () {
      $('.list-options').removeClass( "-is-active");
      $('.list-valor').addClass( "-is-active");
    },

    btHomeClick: function () {
      if (app.thisPage().id != "home") {
        app.abrirPag("home");
      }
    },

    btNovoClick: function () {
      if (app.thisPage().id != "orcamento1") {
        app.abrirPag("orcamento1");
      }
    },
    fechaModalClick: function (e) {
        if(e){
            e.preventDefault();
        }
        console.log($('.list-options').hasClass("-is-active"));
        if($('.list-options').hasClass("-is-active")){
            $('.modal').removeClass( "is-active" );

            
            $('.list-trocaItem').removeClass( "-is-active");
            $('.list-excluir').removeClass( "-is-active");
            $('.list-trocaMargem').removeClass( "-is-active");
            $('.box-search').removeClass( "-is-active");
            $('.list-quantidade').removeClass( "-is-active");
            $('.list-valor').removeClass( "-is-active");
        }else{
            $('.list-options').addClass( "-is-active");
                        
            $('.list-trocaItem').removeClass( "-is-active");
            $('.list-excluir').removeClass( "-is-active");
            $('.list-trocaMargem').removeClass( "-is-active");
            $('.box-search').removeClass( "-is-active");
            $('.list-quantidade').removeClass( "-is-active");
            $('.list-valor').removeClass( "-is-active");
        }
        
    },

    busca: function () {
      $(inputSearch).on("keyup", function() {
          var value = $(this).val().toLowerCase();
          $(".list-trocaItem .option").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
      });
    },

    isEmptyObj: function(obj){
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    GeraPDFClick: function() {
        var pdfTitulo = 'orcamento' + orcamento9.orcamento_id + '.pdf';
        geraOrcamentoPDF(orcamento9.orcamento_id, pdfTitulo);
    },

    btCompartOrcClick: function() {
        var pdfTitulo = 'orcamento' + orcamento9.orcamento_id + '.pdf';
        geraOrcamentoPDF(orcamento9.orcamento_id, pdfTitulo, true, false);
    },
    insertDescont: function(){
        var divTotal = document.querySelector('#divApp > section > div > form > div > div.total');
        divTotal.insertAdjacentHTML('beforeend', '<div class="pequeno"></div>');
        orcamento9.alterDescontValue();
        // divTotal.addEventListener('click', function(){});

    },
    alterDescontValue: function(){
        var descountMax = app.thisUser[0].desconto_max;
        var frete;
        orcamento9.incrementos.opcionais[100] != null ? frete = orcamento9.incrementos.opcionais[100] : frete = 0;
        var custoDeInstalacao;
        orcamento9.incrementos.opcionais[552] != null ? custoDeInstalacao = orcamento9.incrementos.opcionais[552] : custoDeInstalacao =  0;

        frete = parseFloat(frete);
        custoDeInstalacao = parseFloat(custoDeInstalacao);

        var valorBase = orcamento9.tmpVlTotal;
        valorBase = parseFloat(valorBase);

        var valorDescontado = orcamento9.vlTotal;
        valorDescontado = parseFloat(valorDescontado);

        var margem = orcamento9.margemSelecionada;
        margem = parseInt(margem);

        var totalMenosFrete = (valorBase - (frete + custoDeInstalacao));

        if(margem < 0){
            margem = margem * -1;
        }

        var totalMenosFreteDescontado = (valorDescontado - ( frete  + custoDeInstalacao ));

        var custoDoMaterial = (totalMenosFrete - (totalMenosFrete * (descountMax / 100)));

        var lucroNoMaterial = parseFloat(totalMenosFreteDescontado - custoDoMaterial);
        var maoDeObra = (frete + custoDeInstalacao);
        var lucroTotal = (lucroNoMaterial + maoDeObra);
        var pequeno = document.getElementsByClassName('pequeno');
        
        // var aux = (orcamento9.tmpVlTotal - ((descountMax/100) * orcamento9.tmpVlTotal));
        pequeno[0].innerHTML = '<span>Custo do Material: R$ '+ custoDoMaterial.toFixed(2) +'</span><span>Lucro no Material: R$ '+ lucroNoMaterial.toFixed(2) +'</span><span>Ganhos Mão de Obra: R$ '+ maoDeObra.toFixed(2)+'</span><span>Lucro Total: R$ '+ lucroTotal.toFixed(2) +'</span>';
    }
};
