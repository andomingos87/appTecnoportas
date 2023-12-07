"use strict";
var cadastro = {
    /*Variáveis Globais*/

    /*Elementos Globais*/
    formCadastro: null,
    btVoltar2: null,
    tipoF: null,
    tipoJ: null,
    cadSenha: null,
    cadcSenha: null,

    /*Eventos Iniciais*/
    inicializar: function () {
        this.formCadastro = app.E("formCadastro");
        this.tipoF = app.E("tipoF");
        this.tipoJ = app.E("tipoJ");
        this.cadSenha = app.E("cadSenha");
        this.cadcSenha = app.E("cadcSenha");

        this.tipoF.addEventListener('change', function(){cadastro.radTipoChange("f");});
        this.tipoJ.addEventListener('change', function(){cadastro.radTipoChange("j");});

        this.formCadastro = app.E("formCadastro");
        this.btVoltar2 = app.E("btVoltar2");

        this.formCadastro.addEventListener("submit", this.formCadastroSubmit);
        this.btVoltar2.addEventListener("click", app.onBackButtonClick);

        $(formCadastro.cpf).mask('000.000.000-00', {reverse: true});
        $(formCadastro.rg).mask('00.000.000-0', {reverse: true});
        $(formCadastro.telefone).mask('(00)0000-00000');
        $(formCadastro.cep).mask('00000-000',{reverse: true});
        app.E('tipoJ').checked = true;
        this.radTipoChange('j');

    },

    radTipoChange: function(t) {
        var self = cadastro.formCadastro;
        if (t == "f") {
            labCpf.innerHTML = "CPF: ";
            $(self.cpf).mask('000.000.000-00', {reverse: true});
            self.cpf.value = "";


            labRg.innerHTML = "RG: ";
            $(self.rg).mask('00.000.000-0', {reverse: true});
            self.rg.value = "";

            labNome.innerHTML = "Nome: *";
            labSobrenome.innerHTML = "Sobrenome:";
            cadastro.removerRequired();
            cadastro.removeSinalizaRequired();

        }
        else {
            labCpf.innerHTML = "CNPJ: *";
            $(self.cpf).mask('00.000.000/0000-00', {reverse: true});
            self.cpf.value = "";

            labRg.innerHTML = "IE: *";
            $(self.rg).mask('000.000.000.000', {reverse: true});
            self.rg.value = "";
            
            labNome.innerHTML = "Razão Social: *";
            labSobrenome.innerHTML = "Nome Fantasia: *";
            cadastro.adicionarRequired();
            cadastro.sinalizaRequired();
        }
    },

    formCadastroSubmit: function (e) {
        e.preventDefault();

        var msg = new Mensagem();
        msg.setTipo("confirma");
        msg.setTitulo("Termos de Uso");

        var api = new Api("ajustes/gerais");

        api.send(function(res){
            console.log(res);
            if(res.error){
                app.Erro(res);
            }else{
                if(res){
                    msg.setTexto((res["termos_uso"]));

                    msg.setBotoes(["Concordo","Não Concordo"]);
                    msg.mostrar(function (res) {
                        if (res == 1) {

                            var senha,senha2,tipo;
                            senha = cadastro.formCadastro.cadSenha.value;
                            senha2 = cadastro.formCadastro.cadcSenha.value;
                            tipo = cadastro.formCadastro["tipo[]"].value;
                            if(senha != senha2){
                                var msg = new Mensagem("As duas senhas devem ser iguais",true);
                            }else{

                                var arrayDados = {
                                    'tipo': tipo,
                                    'cpf': cadastro.formCadastro.cpf.value ? cadastro.formCadastro.cpf.value : null,
                                    'rg': cadastro.formCadastro.rg.value ? cadastro.formCadastro.rg.value : null,
                                    'nome': cadastro.formCadastro.nome.value,
                                    'sobrenome': cadastro.formCadastro.sobrenome.value,
                                    'email': cadastro.formCadastro.email.value,
                                    'telefone': cadastro.formCadastro.telefone.value ? cadastro.formCadastro.telefone.value : null,
                                    'endereco': cadastro.formCadastro.endereco.value ? cadastro.formCadastro.endereco.value : null,
                                    'numero': cadastro.formCadastro.numero.value ? cadastro.formCadastro.numero.value : null,
                                    'cep': cadastro.formCadastro.cep.value ? cadastro.formCadastro.cep.value : null,
                                    'cidade': cadastro.formCadastro.cidade.value ? cadastro.formCadastro.cidade.value : null,
                                    'estado': cadastro.formCadastro.estado.value ? cadastro.formCadastro.estado.value : null, 
                                    'senha': senha,
                                    'nomeUsuario': cadastro.formCadastro.nomeUsuario.value
                                }

                                console.log(arrayDados);

                                var api = new Api("usuarios/novo",{user:arrayDados, preCad: true});

                                api.send(function(res){
                                    console.log(res);
                                    if(!res.error){
                                        if(res){
                                            var msg = new Mensagem("Pré-Cadastro realizado com sucesso, você já pode iniciar sessão em nosso aplicativo, mas para ter acesso completo aguarde o contato de nossos administradores",true);
                                            app.abrirPag("home");
                                        }
                                    }else{
                                        app.Erro(res);
                                    }
                                });
                            }
                        }
                    });
                }else{
                    var mensagem = new Mensagem("Ocorreu um problema em nossos servidores, por favor tente novamente mais tarde",true);
                    app.abrirPag("home");
                }
            }
        });
    },
    adicionarRequired: function(){
        app.E('cadCpf').required = true;
        app.E('cadRg').required = true;
        app.E('cadNome').required = true;
        app.E('cadEmail').required = true;
        app.E('cadSobrenome').required = true;
        app.E('cadUsuario').required = true;
        app.E('cadSenha').required = true;
        app.E('cadcSenha').required = true;
        app.E('cadcTelefone').required = true;
        app.E('cadEndereco').required = true;
        app.E('cadNumero').required = true;
        app.E('cadcCep').required = true;
        app.E('cadCidade').required = true;
    },
    removerRequired: function(){
        app.E('cadCpf').required = false;
        app.E('cadRg').required = false;
        app.E('cadNome').required = true;
        app.E('cadEmail').required = true;
        app.E('cadSobrenome').required = false;
        app.E('cadUsuario').required = true;
        app.E('cadSenha').required = false;
        app.E('cadcSenha').required = false;
        app.E('cadcTelefone').required = false;
        app.E('cadEndereco').required = false;
        app.E('cadNumero').required = false;
        app.E('cadcCep').required = false;
        app.E('cadCidade').required = false;
    },
    sinalizaRequired: function(){
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(8) > div > h3').innerHTML = "Telefone: *";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(9) > h3').innerHTML = "Endereço: *";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(10) > div:nth-child(1) > h3').innerHTML = "Número: *";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(10) > div:nth-child(2) > h3').innerHTML = "Cep: *";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(11) > div:nth-child(1) > h3').innerHTML = "Cidade: *";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(11) > div:nth-child(2) > h3').innerHTML = "Estado: *";
    },
    removeSinalizaRequired: function(){

        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(8) > div > h3').innerHTML = "Telefone: ";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(9) > h3').innerHTML = "Endereço: ";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(10) > div:nth-child(1) > h3').innerHTML = "Número: ";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(10) > div:nth-child(2) > h3').innerHTML = "Cep: ";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(11) > div:nth-child(1) > h3').innerHTML = "Cidade: ";
        document.querySelector('#formCadastro > div.cad-pessoa > div:nth-child(11) > div:nth-child(2) > h3').innerHTML = "Estado: ";
    }
};