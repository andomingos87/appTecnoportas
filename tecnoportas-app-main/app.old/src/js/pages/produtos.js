"use strict";
var produtos = {
  // variáveis globais.
  descricao: null,
  prodSelected: null,
  idSelected: null,
  btVerMais: null,
  valor: null,
  car: null,
  imagens: null,
  objRes: null,
  limite: 0,
  offset: 0,
  indice: 0,
  catSearch: null,
  usrSearch: null,

  inicializar: function () {
    app.securityCheck();
    this.descricao = 0;
    this.catSearch = "Tudo";
    this.limite = 10;
    this.prodSelected = '';
    this.idSelected = '';
    this.valor = 0.00;
    this.car = {};
    this.imagens=[];
    this.objRes=[];
    this.btVerMais = app.E("btVerMais");
    this.btVerMais.style.display = "none";
    this.middleware();
    this.pega(this.catSearch);

       
  },
  pega: function (categoria, search, limita) {
    produtos.btVerMais.style.display = "none";
    if (categoria == 'Tudo') {
      if(search){
        var api = new Api('produtos/buscaprodutos?limit='+produtos.limite+'&offset='+produtos.offset+'&search='+search);
        produtos.btVerMais.style.display = "block";
      }else{
        var api = new Api('produtos/buscaprodutos?limit='+produtos.limite+'&offset='+produtos.offset);
        produtos.btVerMais.style.display = "block";
      }
    } else if (categoria == 'Motores') {
      var api = new Api('motores/index');
    } else if (categoria == 'Acionadores') {
      var api = new Api('motores/automatizadores');
    } else if (categoria == 'Entradas') {
      var api = new Api('portoes/entradas');
    } else if (categoria == 'Pinturas') {
      var api = new Api('portoes/pinturas');
    } else if (categoria == 'Componentes') {
      var api = new Api('portoes/componentes');
    }

    console.log(search);
    console.log(api);
    api.send(function (res) {
      console.log(res);
      if (!res.error) {
        if (res.length > 0) {
          var pnot = app.E("pnot");
          if(pnot){
            app.RE("pnot");
          }
          var notProd = app.E("notProd");
          if(notProd){
            app.RE("notProd");
          }
          var obj = new Array();
          for (var i = 0; i < res.length; i++) {
            obj[i] = {
              'unidadeDeMedida': res[i].unNome, 
              'id': res[i].id, 
              'valor': res[i].valor_unitario, 
              'nome': res[i].nome, 
              'imagem': res[i].imagem, 
              'idProduto': res[i].produto_id,
              'descricao': res[i].descricao
            };
          }
            produtos.objRes = obj;
        }else{
         
          if(limita){
            var pnot = app.E("pnot");
            if(pnot){
              app.RE("pnot");
            }
            var p = app.CE("p",{id: 'pnot'});
            p.innerHTML = "Não foram encontrados mais produtos"
            app.E('tblProds').appendChild(p);
            produtos.objRes = [];
          }else{
            var notProd = app.E("notProd");
            if(notProd){
              app.RE("notProd");
            }
            
            produtos.objRes = [];
            app.E('tblProds').appendChild = "<h2 id='notProd'> Não foram encontrados produtos</h2>";
          }
          
        }
      }
      produtos.gera(produtos.objRes); 
    });
  },
  gera: function (objRes) {
            
    if(objRes.length > 0){
      var lst = app.E('listaProdutos');
      if(!lst){
        var lst = app.CE('div', {'id': 'listaProdutos', 'class' : 'list'})
      }
      app.E('tblProds').appendChild(lst);
      for (var index = 0; index < objRes.length; index++) {
        var element = objRes[index];
        var row = app.CE('div', { 
          'id': 'linha' + element.id, 
          'class': 'item itemProd' 
        });

        if(!element.imagem){
          var img = app.CE('img', { 'src': './img/nenhum.png' });
        }
        var nome = app.CE('div', {'class': 'nome'});
        var tipo = app.CE('div', {'class': 'tipo'});
        var preco = app.CE('div', {'class': 'preco'});
        
        nome.innerHTML = element.nome;
        tipo.innerHTML = element.unidadeDeMedida;
        preco.innerHTML = 'R$ ' + element.valor;

        var img = app.CE('img', { 
          'alt': element.nome,
          'src' : './img/loader.gif'
        });
        (function (imgObj, imgSrc) {
          app.getImgFromApi(imgSrc, function (url, status) {
            imgObj.src= url;
        });
      })(img, element.imagem);
        
        row.appendChild(img);
        row.appendChild(nome);
        row.appendChild(tipo);
        row.appendChild(preco);
        app.E('#listaProdutos').appendChild(row);

      (function(obj,dados){
        obj.addEventListener('click', function(){
          var idRes;
          if (dados.idProduto) {
            idRes = dados.idProduto;
            console.log('idProduto='+dados.idProduto);
          } else {
            idRes = dados.id;
            console.log('idProduto='+dados.id);
          }
          console.log(dados);
          produtos.abreDesc(idRes, 
            dados.nome,
            dados.imagem, 
            dados.valor,
            dados.descricao, 
            dados.unidadeDeMedida);
        })
      })(row,element);

        
       /* app.E('linha' + element.id).addEventListener('click', function () {
          produtos.limpaProd();
          var idRes;
          if (element.idProduto) {
            idRes = element.idProduto;
            console.log('idProduto='+element.idProduto);
          } else {
            idRes = element.id;
            console.log('idProduto='+element.id);
          }
          console.log("imagem: "+element.imagem);
          produtos.abreDesc(idRes, 
            element.nome,
            element.imagem, 
            element.valor,
            element.descricao, 
            element.unidadeDeMedida);
        });*/
      }
      app.E('#tblProds').appendChild(app.E('#listaProdutos'));
    }
  },
  middleware: function () {

    $("#inputSearch").keydown(function (event) {
      if (event.keyCode == 13) {
          $('#inputSearch').blur();
      }
    });

    app.E('#inputSearch').addEventListener('blur', function(){
      produtos.filtro()
    }); 

    app.E('#btVoltar').addEventListener('click',app.onBackButtonClick );

    app.E('#btnCarrinhoTop').addEventListener('click', function(){
      app.abrirPag('carrinho',false,false);
    });

    app.E('#selectCategoria').addEventListener("change", function () {
      console.log(app.E('#listaProdutos'));
      var lprod = app.E('#listaProdutos');
      if(lprod){
        app.RE('#listaProdutos');
      }
      produtos.catSearch = app.E('#selectCategoria').value;
      console.log(produtos.catSearch);
      produtos.pega(app.E('#selectCategoria').value);
    });

    app.E('#inputSearch').addEventListener("keydown", function(event){
      if(event.KeyCode == 13) {
        app.E('#inputSearch').blur();
      }     
    });

    app.E("#btVerMais").addEventListener("click", function(){
      produtos.offset += 10;
      var typeBusca = app.E('#inputSearch').value;
      if(typeBusca){
        produtos.pega('Tudo',typeBusca,true);
      }else{
        produtos.pega('Tudo', null, true);
      }
      
    });

  },
  abreDesc: function (idRes,nome, imagem, valor, descricao, unidadeDeMedida) {
    //var imagem = app.E('linha'+idRes).children[0].src
    console.log("Descrição:");
    console.log(descricao);
    if(typeof descricao === 'undefined'){
      descricao = 'ainda não possui descricao';
    }

    var informacoesProduto = [{'id': idRes, 'nome': nome, 
      'imagem': imagem, 'valor': valor, 'descricao': descricao, 
      'unidadeDeMedida': unidadeDeMedida}];
      app.abrirPag('detalhesProduto', informacoesProduto, false);
  },
  filtro: function(){
    console.log("FILTRO");
    var self = this;
    if(self.catSearch == "Tudo"){
        var typeBusca = app.E('#inputSearch').value;

        

          if(typeBusca != self.usrSearch){
            self.offset = 0;
            console.log("zera offset");
          }

        self.usrSearch = typeBusca;

        var lprod = app.E('#listaProdutos')
        if(lprod)  {
          app.RE('#listaProdutos');
          console.log("tem prods");
        }else{
          console.log("nao tem prods");
        }
        produtos.pega("Tudo",typeBusca);
    }else{
      console.log("else");
        var typeBusca = app.E('#inputSearch').value.toUpperCase()
        var linha = app.E('.itemProd');
        var regex = new RegExp(typeBusca);
        
        for (var index = 0; index < linha.length; index++) {
          var element = linha[index];
          if (regex.test(element.children[1].textContent)) {
            element.style.display = '';
          }else{
            element.style.display = 'none';
          }
          
        }
    }
  },
  limpaProd: function () {
    console.log('limpando');
    
    // app.RE('#lblProdNome');
    // app.RE('#lblProdNome2');
    // app.RE('#imgProd');
    // app.RE('#lblProdId');
    // app.RE('#lblPreco');
    // app.RE('#lblDescri');
    // app.RE('#lblUnidadeMedida');
  }
};