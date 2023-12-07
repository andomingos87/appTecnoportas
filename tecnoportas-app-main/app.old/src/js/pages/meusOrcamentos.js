"use strict";
var meusOrcamentos = {
    /*Variáveis Globais*/
    arrayStatus: [
        'Cancelado',
        'Pendente',
        'Concluído'
    ],

    /*Elementos Globais*/
    divOrcamentos: null,
    inputSearch: null,

    /*Eventos Iniciais*/
    inicializar: function () {
        app.securityCheck();
        this.divOrcamentos = app.E("divOrcamentos");
        this.inputSearch = app.E("inputSearch");

        this.getOrcamentos();
        this.busca();
    },
    getOrcamentos: function () {
        var self = this,
            api = new Api('orcamentos?sid='+app.thisUser[0].pessoa_id);

        api.send(function (res) {
            if (!res.error) {
                if (res.length > 0) {
                    app.limpaObj(self.divOrcamentos, 1);
                    for (var i = 0; i < res.length; i++) {
                        self.divOrcamentos.appendChild(self.geraOrcamentos(res[i]));
                    }
                }
                else {
                    var divCol = app.CE('div', { 'classe': 'col-12 text-center'});
                    divCol.innerHTML = "Você ainda não fez orçamentos!";
                    self.divOrcamentos.appendChild(divCol);
                }
            }
            else {
                app.Erro(res);
            }
        });
    },
    geraOrcamentos: function (dds){
        var self = this;
        
        var divCol = app.CE('div', { 
                class: 'col-linha' 
            }), ulLinha = app.CE('div', { 
                class: 'ul-linha'
            }), divTopo = app.CE("div", {
                class: "alinhar"
            }), divMeio = app.CE("div", {
                class: "alinhar"
            }), divBotao = app.CE("div", {
                class: "alinhar -botoes"
            }), liAbr = app.CE('li', {
                class: 'li-abr'
            }), liExc = app.CE('li', {
                class: 'li-Exc'
            }), btAbrir = app.CE('button', {
                class: 'btn'
            }), btExcluir = app.CE('button', {
                class: 'btn btn-danger'
            }), liCli = app.CE('li', {
                class: 'li-cliente'
            }), liData = app.CE('li', {
                class: 'li-data'
            }), liVl = app.CE('li', {
                class: 'li-vl'
            }), liStatus = app.CE('li', {
                class: 'li-status status-' + dds.status
            }), liId = app.CE('li', {
                class: 'li-Id'
            });
        
        btAbrir.innerHTML = "Abrir";
        btExcluir.innerHTML = "Excluir";

        liCli.innerHTML = dds.tipo == 'F' ? dds.nome + " " + dds.sobrenome : dds.sobrenome;
        liData.innerHTML = app.formataData(dds.dt_cadastro);
        liVl.innerHTML = "R$: " + app.N(dds.valor_total, 2, ",");
        liStatus.innerHTML = self.arrayStatus[dds.status];
        liId.innerHTML = dds.id;

        (function (dds, elemento) {
            elemento.addEventListener('click', function () {
                app.abrirPag("verOrcamento", [dds]);
            }, false);
        })(dds, btAbrir);


        (function (id, elemento) {
            elemento.addEventListener('click', function () {
                var msg = new Mensagem("Deseja excluir o orçamento nº " + id);
                msg.setTitulo("Excluir orçamento!");
                msg.setTipo("confirma");
                msg.setBotoes(["Sim", "Não"]);
                msg.mostrar(function (res) {
                    if (res == 1) {
                        var api = new Api("orcamentos/excluir?oid=" + id);
                        api.send(function (res) {
                            if (!res.error) {
                                if (res == "ok") {
                                    var msg = new Mensagem("Orçamento Excluído!", true);
                                    app.abrirPag("meusOrcamentos");
                                } else {
                                    var msg = new Mensagem(res, true);
                                }
                            }
                        });
                    }
                });

            }, false);
        })(dds.id, btExcluir);

        divTopo.appendChild(liId);
        divTopo.appendChild(liData);
        ulLinha.appendChild(divTopo);
        divMeio.appendChild(liCli);
        divMeio.appendChild(liStatus);
        ulLinha.appendChild(divMeio);
        ulLinha.appendChild(liVl);
        divBotao.appendChild(liAbr);
        divBotao.appendChild(liExc);
        ulLinha.appendChild(divBotao);
        liAbr.appendChild(btAbrir);
        liExc.appendChild(btExcluir);
        divCol.appendChild(ulLinha);
        return divCol;
    },
    busca: function () {
        $(inputSearch).on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $(".ul-linha").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }
};