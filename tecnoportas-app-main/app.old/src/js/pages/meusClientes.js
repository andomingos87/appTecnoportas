var meusClientes = {
    /*Variáveis Globais */
    /*Elementos Globais*/
    aAdicionar: null,
    divClientes: null,
    inputSearch: null,

    inicializar: function () {
        app.securityCheck();
        this.aAdicionar = app.E("aAdicionar");
        this.divClientes = app.E("divClientes");
        this.inputSearch = app.E("inputSearch");

        this.aAdicionar.addEventListener("click", this.aAdicionarClick);

        this.getClientes();
        this.busca();
    },

    getClientes: function () {
        var self = this;
        var api = new Api('clientes?sid='+app.thisUser[0].pessoa_id);

        api.send(function (res){
            if (!res.error){
                if (res.length > 0) {
                    app.limpaObj(self.divClientes, 1);
                    for (var i = 0; i < res.length; i++) {
                        self.divClientes.appendChild(self.geraClientes(res[i]));
                    }
                }
                else {
                    var divCol = app.CE('div', { 'classe': 'col-12 text-center'});
                    divCol.innerHTML = "Você ainda não tem clientes!";
                    self.divClientes.appendChild(divCol);
                }
            }
            else{
                app.Erro(res);
            }
        });
    },

    geraClientes: function(dds) {

        var divCol = app.CE('div', { 
            class: 'col-12 col-linha' 
        }), ulLinha = app.CE('ul', { 
            class: 'ul-linha'
        }), liInfo = app.CE('div', {
            class: 'alinhar'
        }), liBotoes = app.CE('div', {
            class: 'alinhar mg -tp-lg'
        }), divTel = app.CE('div', {
            class: 'alinhar -tel'
        }), btAbrir = app.CE('button', {
            class: 'btn'
        }), btExcluir = app.CE('button', {
            class: 'btn btn-danger'
        }), liNome = app.CE('li', {
            class: 'li-cliente'
        }), liTipo = app.CE('li', {
            class: 'li-tipo'
        }), liTel = app.CE('li', {
            class: 'li-tel'
        }), liUf = app.CE('li', {
            class: 'li-uf'
        }), liEmail = app.CE('li', {
            class: 'li-email'
        });

        btAbrir.innerHTML   = "Editar";
        btExcluir.innerHTML = "Excluir";
        liNome.innerHTML    = dds.nome + " " + dds.sobrenome;
        liTel.innerHTML     = dds.ddd + " " + dds.numero;
        liUf.innerHTML      = dds.uf;
        liEmail.innerHTML   = dds.email;
        liTipo.innerHTML    = dds.tipo == "F" ? "PESSOA FÍSICA" : "PESSOA JURÍDICA";

        (function (dds, elemento) {
            elemento.addEventListener('click', function () {
                app.abrirPag("editarCliente", [dds]);
            }, false);
        })(dds, btAbrir);


        (function (id, elemento) {
            elemento.addEventListener('click', function () {
                var msg = new Mensagem("Deseja excluir o cliente " + id);
                msg.setTitulo("Excluir cliente!");
                msg.setTipo("confirma");
                msg.setBotoes(["Sim", "Não"]);
                msg.mostrar(function (res) {
                    if (res == 1) {
                        var api = new Api("clientes/excluir", {'id': id});
                        api.send(function (res) {
                            if (!res.error) {
                                if (res.deleta == true) {
                                    var msg = new Mensagem("Cliente Excluído!");
                                    msg.mostrar(function () {
                                        app.abrirPag("meusClientes");
                                    });
                                } else {
                                    var msg = new Mensagem(res.error, true);
                                }
                            } else {
                                var mensagem = res.error;
                                var msg = new Mensagem(mensagem, true);
                            }
                        });
                    }
                });

            }, false);
        })(dds.id, btExcluir);



        liInfo.appendChild(liNome);
        liInfo.appendChild(liTipo);
        ulLinha.appendChild(liInfo);
        divTel.appendChild(liTel);
        divTel.appendChild(liUf);
        ulLinha.appendChild(divTel);
        ulLinha.appendChild(liEmail);
        liBotoes.appendChild(btAbrir);
        liBotoes.appendChild(btExcluir);
        ulLinha.appendChild(liBotoes);
        divCol.appendChild(ulLinha);
        return divCol;
    },

    /*Eventos */
    aAdicionarClick: function () {
        if (app.thisPage().id != "adicionarClientes") {
            app.abrirPag("adicionarClientes");
          }
          header.btMenuToggleClick(false);
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