"use strict";var produtos={descricao:null,prodSelected:null,idSelected:null,btVerMais:null,valor:null,car:null,imagens:null,objRes:null,limite:0,offset:0,indice:0,catSearch:null,usrSearch:null,inicializar:function(){app.securityCheck(),this.descricao=0,this.catSearch="Tudo",this.limite=10,this.prodSelected="",this.idSelected="",this.valor=0,this.car={},this.imagens=[],this.objRes=[],this.btVerMais=app.E("btVerMais"),this.btVerMais.style.display="none",this.middleware(),this.pega(this.catSearch)},pega:function(o,e,i){var a;produtos.btVerMais.style.display="none","Tudo"==o?(a=e?new Api("produtos/buscaprodutos?limit="+produtos.limite+"&offset="+produtos.offset+"&search="+e):new Api("produtos/buscaprodutos?limit="+produtos.limite+"&offset="+produtos.offset),produtos.btVerMais.style.display="block"):"Motores"==o?a=new Api("motores/index"):"Acionadores"==o?a=new Api("motores/automatizadores"):"Entradas"==o?a=new Api("portoes/entradas"):"Pinturas"==o?a=new Api("portoes/pinturas"):"Componentes"==o&&(a=new Api("portoes/componentes")),console.log(e),console.log(a),a.send(function(o){if(console.log(o),!o.error)if(0<o.length){app.E("pnot")&&app.RE("pnot");app.E("notProd")&&app.RE("notProd");for(var e=new Array,a=0;a<o.length;a++)e[a]={unidadeDeMedida:o[a].unNome,id:o[a].id,valor:o[a].valor_unitario,nome:o[a].nome,imagem:o[a].imagem,idProduto:o[a].produto_id,descricao:o[a].descricao};produtos.objRes=e}else{var t;i?(app.E("pnot")&&app.RE("pnot"),(t=app.CE("p",{id:"pnot"})).innerHTML="Não foram encontrados mais produtos",app.E("tblProds").appendChild(t),produtos.objRes=[]):(app.E("notProd")&&app.RE("notProd"),produtos.objRes=[],app.E("tblProds").appendChild="<h2 id='notProd'> Não foram encontrados produtos</h2>")}produtos.gera(produtos.objRes)})},gera:function(o){if(0<o.length){var e=app.E("listaProdutos");e=e||app.CE("div",{id:"listaProdutos",class:"list"}),app.E("tblProds").appendChild(e);for(var a=0;a<o.length;a++){var t=o[a],i=app.CE("div",{id:"linha"+t.id,class:"item itemProd"}),p=(t.imagem||(n=app.CE("img",{src:"./img/nenhum.png"})),app.CE("div",{class:"nome"})),r=app.CE("div",{class:"tipo"}),s=app.CE("div",{class:"preco"}),n=(p.innerHTML=t.nome,r.innerHTML=t.unidadeDeMedida,s.innerHTML="R$ "+t.valor,app.CE("img",{alt:t.nome,src:"./img/loader.gif"}));!function(a,o){app.getImgFromApi(o,function(o,e){a.src=o})}(n,t.imagem),i.appendChild(n),i.appendChild(p),i.appendChild(r),i.appendChild(s),app.E("#listaProdutos").appendChild(i),!function(e){i.addEventListener("click",function(){var o;e.idProduto?(o=e.idProduto,console.log("idProduto="+e.idProduto)):(o=e.id,console.log("idProduto="+e.id)),console.log(e),produtos.abreDesc(o,e.nome,e.imagem,e.valor,e.descricao,e.unidadeDeMedida)})}(t)}app.E("#tblProds").appendChild(app.E("#listaProdutos"))}},middleware:function(){$("#inputSearch").keydown(function(o){13==o.keyCode&&$("#inputSearch").blur()}),app.E("#inputSearch").addEventListener("blur",function(){produtos.filtro()}),app.E("#btVoltar").addEventListener("click",app.onBackButtonClick),app.E("#btnCarrinhoTop").addEventListener("click",function(){app.abrirPag("carrinho",!1,!1)}),app.E("#selectCategoria").addEventListener("change",function(){console.log(app.E("#listaProdutos")),app.E("#listaProdutos")&&app.RE("#listaProdutos"),produtos.catSearch=app.E("#selectCategoria").value,console.log(produtos.catSearch),produtos.pega(app.E("#selectCategoria").value)}),app.E("#inputSearch").addEventListener("keydown",function(o){13==o.KeyCode&&app.E("#inputSearch").blur()}),app.E("#btVerMais").addEventListener("click",function(){produtos.offset+=10;var o=app.E("#inputSearch").value;o?produtos.pega("Tudo",o,!0):produtos.pega("Tudo",null,!0)})},abreDesc:function(o,e,a,t,i,p){console.log("Descrição:"),console.log(i),void 0===i&&(i="ainda não possui descricao"),app.abrirPag("detalhesProduto",[{id:o,nome:e,imagem:a,valor:t,descricao:i,unidadeDeMedida:p}],!1)},filtro:function(){console.log("FILTRO");var o=this;if("Tudo"==o.catSearch)(e=app.E("#inputSearch").value)!=o.usrSearch&&(o.offset=0,console.log("zera offset")),o.usrSearch=e,app.E("#listaProdutos")?(app.RE("#listaProdutos"),console.log("tem prods")):console.log("nao tem prods"),produtos.pega("Tudo",e);else{console.log("else");for(var e=app.E("#inputSearch").value.toUpperCase(),a=app.E(".itemProd"),t=new RegExp(e),i=0;i<a.length;i++){var p=a[i];t.test(p.children[1].textContent)?p.style.display="":p.style.display="none"}}},limpaProd:function(){console.log("limpando")}};