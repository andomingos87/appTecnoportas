var adicionarClientes = {
    /*Variáveis Globais */

    /*Elementos Globais*/
    nomePessoa: null,
    sobrenomePessoa: null,
    ddd: null,
    telefone: null,
    email: null,
    uf: null,
    cidade: null,
    btn_adicionar: null,
    form_adicionar_cliente: null,

    inicializar: function () {
        app.securityCheck();
        this.nomePessoa = app.E("nome");
        this.sobrenomePessoa = app.E("sobrenome");
        this.ddd = app.E("ddd");
        this.telefone = app.E("telefone");
        this.email = app.E("email");
        this.uf = app.E("estados_brasil");
        this.cidade = app.E("cidade");
        this.btn_adicionar = app.E("btn_adicionar");
        this.form_adicionar_cliente = app.E("form_adicionar_cliente");
        this.tipoF = app.E("tipof");
        this.tipoJ = app.E("tipoj");

        this.radTipoChange();

        this.tipoF.addEventListener('change', this.radTipoChange);
        this.tipoJ.addEventListener('change', this.radTipoChange);
        this.form_adicionar_cliente.addEventListener("submit", this.submitForm);

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
            console.log("nome vazio");
        }
        else if (nome.length <= 0 && tipo == 'J') {
            self.nome.parentNode.parentNode.classList.add('is-invalid');
            console.log("nome vazio com pessoa juridica");
        }
        else if ((sobrenome.length <= 0 && tipo == 'J') || (sobrenome.length <= 0 && tipo == 'F')) {
            self.sobrenome.parentNode.parentNode.classList.add('is-invalid');
            console.log("sobrenome vazio");
        }
        else if (ddd.length <= 0 || telefone.length <= 0) {
            self.telefone.parentNode.parentNode.classList.add('is-invalid');
            console.log("telefone vazio");
        }
        else if (email.length <= 0) {
            self.email.parentNode.parentNode.classList.add('is-invalid');
            console.log("email vazio");
        }
        else if (uf == 0) {
            self.estados_brasil.parentNode.parentNode.classList.add('is-invalid');
            console.log("estado vazio");
        }
        else if (cidade.length <= 0) {
            self.cidade.parentNode.parentNode.classList.add('is-invalid');
            console.log("cidade vazio");
        }
        else {

            Loader.add(form_adicionar_cliente);
            var arrayDados = {
                'serralheiro_id': app.thisUser[0].pessoa_id,
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
            
            var api = new Api('clientes/novo', arrayDados);

            api.send(function (res) {
                if (res.error) {
                    app.Erro(res);
                    console.log(res);
                }
                else {
                    var msg = new Mensagem('Cliente Adicionado com Sucesso!');
                    msg.setTitulo("Tudo certo");
                    msg.mostrar(function () {
                        app.abrirPag("meusClientes");
                    });
                }
                Loader.remove(form_adicionar_cliente);
            });
        }
    }
};