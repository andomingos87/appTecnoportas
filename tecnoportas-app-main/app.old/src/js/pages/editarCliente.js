"use strict";
var editarCliente = {
    /*Variáveis Globais */

    /*Elementos Globais*/
    tipo: null,
    nomePessoa: null,
    sobrenomePessoa: null,
    ddd: null,
    telefone: null,
    email: null,
    uf: null,
    cidade: null,
    btn_editar: null,
    form_editar_cliente: null,
    pessoa_id: null,

    inicializar: function (dds) {
        app.securityCheck();
        this.nomePessoa = app.E("nome");
        this.sobrenomePessoa = app.E("sobrenome");
        this.ddd = app.E("ddd");
        this.telefone = app.E("telefone");
        this.email = app.E("email");
        this.uf = app.E("estados_brasil");
        this.cidade = app.E("cidade");
        this.btn_editar = app.E("btn_editar");
        this.form_editar_cliente = app.E("form_editar_cliente");
        this.pessoa_id = dds.id;
        this.tipoF = app.E("tipof");
        this.tipoJ = app.E("tipoj");
        this.tipo = dds.tipo;

        // console.log(this.pessoa_id);

        if (this.tipo == 'F') {
            tipof.checked = true;
        }
        else if (this.tipo == 'J') {
            tipoj.checked = true;
        }

        this.getClientes(dds);

        this.radTipoChange();

        this.tipoF.addEventListener('change', this.radTipoChange);
        this.tipoJ.addEventListener('change', this.radTipoChange);
        this.form_editar_cliente.addEventListener("submit", this.submitForm);

    },

    getClientes: function(dds){
        var self = this;
        self.nomePessoa.value = dds.nome;
        self.sobrenomePessoa.value = dds.sobrenome;
        self.ddd.value = dds.ddd == null ? '' :  dds.ddd;
        self.telefone.value = dds.numero == null ? '' :  dds.numero;
        self.email.value = dds.email;
        self.uf.value = dds.uf;
        self.cidade.value = dds.cidade;

    },


    radTipoChange: function() {

        if (tipof.checked) {
            labNome.innerHTML = "Nome: *";
            labSobrenome.innerHTML = "Sobrenome:";
        }
        else if (tipoj.checked) {
            labNome.innerHTML = "Razão Social:";
            labSobrenome.innerHTML = "Nome Fantasia: *";
        }
    },

    /*Eventos */

    submitForm: function (e) {
        e.preventDefault();

        var self = this;

        var tipo = (self.tipof.checked ? 'F' : 'J');
        var nome = self.nome.value;
        var sobrenome = self.sobrenome.value;
        var ddd = self.ddd.value;
        var telefone = self.telefone.value;
        var email = self.email.value;
        var cidade = self.cidade.value;
        var uf = self.estados_brasil.value;


        if (nome.length <= 0 && tipo == 'F') {
            self.nome.parentNode.parentNode.classList.add('is-invalid');
        }
        else if ((sobrenome.length <= 0 && tipo == 'J') || (sobrenome.length <= 0 && tipo == 'F')) {
            self.sobrenome.parentNode.parentNode.classList.add('is-invalid');
        }
        else if (ddd.length <= 0 || telefone.length <= 0) {
            self.telefone.parentNode.parentNode.classList.add('is-invalid');
        }
        else if (email.length <= 0) {
            self.email.parentNode.parentNode.classList.add('is-invalid');
        }
        else if (uf == 0) {
            self.estados_brasil.parentNode.parentNode.classList.add('is-invalid');
        }
        else if (cidade.length <= 0) {
            self.cidade.parentNode.parentNode.classList.add('is-invalid');
        }
        else {

            Loader.add(form_editar_cliente);
            var arrayDados = {
                'cliente_id' : editarCliente.pessoa_id,
                'cli': {
                    'nome': nome,
                    'sobrenome': sobrenome,
                    'email': email,
                    'ddd': ddd,
                    'numero': telefone,
                    'tipo': tipo
                },
                'end': {
                    'cidade': cidade,
                    'uf': uf
                }
            };   

            var api = new Api('clientes/editar', arrayDados);
            console.log('array dados');
            console.log(arrayDados);
            
            api.send(function (res) {
                if (res.error) {
                    app.Erro(res);
                }
                else {
                    var msg = new Mensagem('Cliente Editado com Sucesso!');
                    msg.setTitulo("Tudo certo");
                    msg.mostrar(function () {
                        app.abrirPag("meusClientes");
                    });
                }
                Loader.remove(form_editar_cliente);
            });
        }
    }
};