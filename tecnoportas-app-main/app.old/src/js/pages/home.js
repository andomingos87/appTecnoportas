"use strict";
var home = {
    /*Variáveis Globais*/

    /*Elementos Globais*/
    btEntrar: null,
    btNOrcamento: null,
    btCadastro: null,
    btProdutos: null,
    btNoticias: null,
    btOrcamentos: null,
    btClientes: null,
    btCatalogo: null,
    btEncontre: null,
    btAtendimento: null,
    msgAprov: null,

    /*Eventos Iniciais*/
    inicializar: function () {


        var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
        vg.salvarLocal(null);
        var acres = new VarGlobal("acrescimos"),
        inc = new VarGlobal("incrementos"),
        margeSelec = new VarGlobal("margemSelecionada");

        acres.salvarLocal(null);
        inc.salvarLocal(null);
        margeSelec.salvarLocal(null);

        home.btEntrar = app.E("btEntrar");
        home.btNOrcamento = app.E("btNOrcamento");
        home.btCadastro = app.E("btCadastro");
        home.btProdutos = app.E("btProdutos");
        home.btNoticias = app.E("btNoticias");
        home.btOrcamentos = app.E("btOrcamentos");
        home.btClientes = app.E("btClientes");
        home.btCatalogo = app.E("btCatalogo");
        home.btEncontre = app.E("btEncontre");
        home.btAtendimento = app.E("btAtendimento");
        home.msgAprov = app.E("msgAprov");

        $(header.header).removeClass("is-internal");
        if (!app.thisUser || app.thisUser[0].is_aprovado == 0){
            if(app.thisUser){
                app.RE(home.btEntrar);
                app.RE(home.btCadastro);
                home.msgAprov.style.display = "block";
            }
            app.RE(home.btNOrcamento);
            app.RE(home.btProdutos);
            app.RE(home.btOrcamentos);
            app.RE(home.btClientes);
            home.btEntrar.addEventListener("click", menu.liLoginClick);
            home.btCadastro.addEventListener("click", menu.liCadastroClick);
            home.btNoticias.addEventListener("click", menu.liNoticiasClick);
            home.btCatalogo.addEventListener("click", menu.liCatalogoClick);
        }
        else{
            app.RE(home.btEntrar);
            app.RE(home.btCadastro);
            app.RE(home.btNoticias);
            home.btNOrcamento.addEventListener("click", menu.liNOrcamentoClick);
            home.btProdutos.addEventListener("click", menu.liProdutosClick);
            home.btOrcamentos.addEventListener("click", menu.liMeusOrcsClick);
            home.btClientes.addEventListener("click", menu.liMeusClisClick);
            home.btCatalogo.addEventListener("click", menu.liCatalogoClick);
        }

        home.btEncontre.addEventListener("click", menu.liEncontreClick);
        home.btAtendimento.addEventListener("click", menu.liAtendimentoClick);
    },
    /*Eventos */
};