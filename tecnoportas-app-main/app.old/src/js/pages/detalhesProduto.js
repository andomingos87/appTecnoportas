"use strict";
var detalhesProduto = {
    /*Variáveis Globais*/

    /*Elementos Globais*/
    prod_nome: null,
    prod_id: null,
    prod_preco: null,
    prod_desc: null,
    prod_qtd: null,
    btnVoltar: null,
    addCarrinho: null,
    prod: null,

    /*Eventos Iniciais*/
    inicializar: function (dds) {
        app.securityCheck();
        this.prod = dds;
        this.btnVoltar = app.E("btnVoltar");
        this.addCarrinho = app.E("addCarrinho");
        this.prod_nome = app.E("prod_nome");
        this.prod_id = app.E("prod_id");
        this.prod_preco = app.E("prod_preco");
        this.prod_desc = app.E("prod_desc");
        this.prod_qtd = app.E("prod_qtd");
        this.prod_img = app.E("prod_img");

        this.btnVoltar.addEventListener("click", app.onBackButtonClick);
        this.addCarrinho.addEventListener("click", function(){
            detalhesProduto.addCarrinhoClick(detalhesProduto.prod);
        });
        this.setProdDados(dds);
    },

    setProdDados: function(dds){
        detalhesProduto.prod_id.innerHTML = dds.id;
        detalhesProduto.prod_nome.innerHTML = dds.nome;
        detalhesProduto.prod_preco.innerHTML = dds.valor;
        detalhesProduto.prod_desc.innerHTML = dds.descricao;

        if(dds.imagem != null){
            detalhesProduto.prod_img.src = "./img/loader.gif";
            app.getImgFromApi(dds.imagem, function (res){
                detalhesProduto.prod_img.src = res;
                var viewer = ImageViewer();
                $(detalhesProduto.prod_img).on("tap click", function () {
                    viewer.show(this.src, this.src);
                });
            });
        }
    },

    addCarrinhoClick: function(dds){
        
        var idSelected = dds.id,
            prodSelected = dds.nome,
            valor = dds.valor,
            unidade_medida = dds.unidadeDeMedida,
            img = dds.imagem,
            car = {};

        var quantidade = $(detalhesProduto.prod_qtd).val();
                    if(quantidade > 0){
                        var vg = new VarGlobal('carrinho');
                        var carrinho = vg.obterLocal();
                        
                        if(carrinho == null){
                        carrinho = new Array();
                        car.id = idSelected;
                        car.nome = prodSelected;
                        car.valor_unitario = valor;
                        car.quantidade = quantidade;
                        car.unidade_medida = unidade_medida;
                        car.img = img;
                        carrinho.push(car);
                        vg.salvarLocal(JSON.stringify(carrinho));
                        console.log(carrinho);
                        var msg = new Mensagem(prodSelected + ' Adicionado ao carrinho', true);
                        app.abrirPag("produtos");
                        }else{
                            if(carrinho.indexOf('"id":"'+idSelected+'"') == -1){
                                carrinho = JSON.parse(vg.obterLocal());  
                                car.id = idSelected;
                                car.nome = prodSelected;
                                car.valor_unitario = valor;
                                car.quantidade = quantidade;
                                car.unidade_medida = unidade_medida;
                                car.img = img;
                                carrinho.push(car);
                                vg.salvarLocal(JSON.stringify(carrinho));
                                console.log(carrinho);
                                var msg = new Mensagem(prodSelected + ' Adicionado ao carrinho', true);
                                app.abrirPag("produtos");
                                
                            }else{
                                var msg = new Mensagem('Produto já adicionado ao carrinho',true);
                            }
                        }
                    }else{
                        var msg = new Mensagem('Por favor informe a quantidade desejada de produtos',true);

                    }   
    }
};