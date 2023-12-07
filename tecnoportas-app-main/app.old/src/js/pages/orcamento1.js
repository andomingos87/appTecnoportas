"use strict";
var orcamento1 = {
  /*Variáveis Globais*/
  informacoesDoFormulario: null,
  todosOsClientes:  null,
  clienteSelecionado: 0,
  btnVoltar: null,
  clientesAlterados: null,
  origem: null,
  dados: null,
  /*Elementos Globais*/

  /*Eventos Iniciais*/
  inicializar: function (dds) {
    app.securityCheck();
    app.backButtonStatus = true;
    this.informacoesDoFormulario = {};
    this.adicionaEventoBotoes();
    this._pegarClientes();
    this.btnVoltar = app.E("btnVoltar");

    this.tipoF = app.E("tipof");
    this.tipoJ = app.E("tipoj");
    
    this.radTipoChange();
    
    this.tipoF.addEventListener('change', this.radTipoChange);
    this.tipoJ.addEventListener('change', this.radTipoChange);
    this.btnVoltar.addEventListener('click', app.onBackButtonClick);
    // this._verificarCampoVazio();
    // this._removeIsInvalid();
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(null);
    if(dds){
      console.log(dds);
      this.origem = dds.origem;
      this.dados = dds.dados;
      if(this.origem == "carrinho"){
        app.E(".row")[0].style.display = "none";
      }
    }else{
      console.log("nada");
    }
    
  },

  radTipoChange: function () {

    if (tipof.checked) {
      labNome.innerHTML = "Nome: *";
      labSobrenome.innerHTML = "Sobrenome:";
    } else if (tipoj.checked) {
      labNome.innerHTML = "Razão Social: *";
      labSobrenome.innerHTML = "Nome Fantasia:";
    }

  },

  /*Eventos */
  adicionaEventoBotoes: function () {
    app.E('#seMeusClientes').addEventListener('change',  function(){
      console.log(app.E('#seMeusClientes').value)
      orcamento1._checandoUsuarioEscolhido();

    });

    app.E('#formClienteSubmit').addEventListener('submit',  function(e){
      e.preventDefault();
      var ck = true;//orcamento1._verificarCampoVazio();
      if(ck){
        orcamento1.pegaInformacoesDoFormulario();
        if(orcamento1.clienteSelecionado > 0){
          orcamento1.configuraParaVarGlobal();
          orcamento1._checarAlteracaoFormulario();
          if(orcamento1.origem == "carrinho"){
            app.abrirPag('orcamento9', [{'origem': orcamento1.origem, 'dados': {cliDados: orcamento1.todosOsClientes[orcamento1.clienteSelecionado], 'dados': orcamento1.dados} }], false);   
          }else{
            app.abrirPag('orcamento2', [], false);   
          }
          
        }else{

          var arrayDados = {
            'cli': {
              'nome': orcamento1.informacoesDoFormulario.nome,
              'sobrenome': orcamento1.informacoesDoFormulario.sobrenome,
              'email': orcamento1.informacoesDoFormulario.email,
              'ddd': orcamento1.informacoesDoFormulario.ddd,
              'numero': orcamento1.informacoesDoFormulario.telefone,
              'tipo': orcamento1.informacoesDoFormulario.tipoPessoa
            },
            'end': {
              'cidade': orcamento1.informacoesDoFormulario.cidade,
              'uf': orcamento1.informacoesDoFormulario.estado
            }
          }
          arrayDados.serralheiro_id = app.thisUser[0].pessoa_id
          console.log(arrayDados);
          var api = new Api('clientes/novo', arrayDados);
          api.send(function(res){
            if(!res.error){
              if(res){

                var cliDds = {
                    'id': res.cliente_id,
                    'tipoPessoa': arrayDados.cli.tipo,
                    'nome': arrayDados.cli.nome,
                    'sobrenome': arrayDados.cli.sobrenome,
                    'ddd': arrayDados.cli.ddd,
                    'telefone': arrayDados.cli.telefone,
                    'email': arrayDados.cli.email,
                    'estado': arrayDados.end.uf,
                    'cidade': arrayDados.end.cidade
                }
                orcamento1.informacoesDoFormulario.cliDds = cliDds;
                var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
                vg.salvarLocal(JSON.stringify(orcamento1.informacoesDoFormulario));
                if(orcamento1.origem == "carrinho"){
                  app.abrirPag('orcamento9', [{'origem': orcamento1.origem, 'dados': {cliDados: orcamento1.informacoesDoFormulario, 'dados': orcamento1.dados} }], false);   
                }else{
                  app.abrirPag('orcamento2', [orcamento1.informacoesDoFormulario], false);   
                }
                //app.abrirPag('orcamento2', [orcamento1.informacoesDoFormulario], false);
              }
            }
          });
        }
      }
    });
  },
  _editarCliente: function () {
    var NumeroClienteEscolhido = app.E('#seMeusClientes').value;
    var dadosClientes = orcamento1.todosOsClientes[NumeroClienteEscolhido];
    var arrayDados = {
      'cli': {
        'nome': orcamento1.informacoesDoFormulario.nome,
        'sobrenome': orcamento1.informacoesDoFormulario.sobrenome,
        'email': orcamento1.informacoesDoFormulario.email,
        'ddd': orcamento1.informacoesDoFormulario.ddd,
        'numero': orcamento1.informacoesDoFormulario.telefone,
        'tipo': orcamento1.informacoesDoFormulario.tipoPessoa
      },
      'end': {
        'cidade': orcamento1.informacoesDoFormulario.cidade,
        'uf': orcamento1.informacoesDoFormulario.estado
      }
    }
    arrayDados.cliente_id = dadosClientes.id;
    console.log(arrayDados);
    var api = new Api('clientes/editar', arrayDados);
    api.send(function (res) {
      if (!res.error) {
        if (res) {
          orcamento1.configuraParaVarGlobal();
          app.abrirPag('orcamento2', [orcamento1.informacoesDoFormulario], false);
        }
      }
    });

  },

  _checandoUsuarioEscolhido: function(){
    var NumeroClienteEscolhido = app.E('#seMeusClientes').value;
    orcamento1._adicionandoDadosClienteAosCampos(NumeroClienteEscolhido);
    orcamento1.clienteSelecionado = NumeroClienteEscolhido;
  },

  _adicionandoDadosClienteAosCampos: function(NumeroClienteEscolhido){
    var dadosClientes = orcamento1.todosOsClientes[NumeroClienteEscolhido];
    console.log(dadosClientes);
    if(dadosClientes.tipo == "F"){
      app.E('#tipof').checked = true;
    }else{
      app.E('#tipoj').checked = true;
    }
    app.E('#nome').value = dadosClientes.nome;
    app.E('#sobrenome').value = dadosClientes.sobrenome;
    app.E('#ddd').value = dadosClientes.ddd;
    app.E('#telefone').value = dadosClientes.numero;
    app.E('#email').value = dadosClientes.email;
    app.E('#cidade').value = dadosClientes.cidade;
    app.E('#estado').value = dadosClientes.uf;

  },

  configuraParaVarGlobal: function (){
    orcamento1.informacoesDoFormulario.cliDds = orcamento1.todosOsClientes[orcamento1.clienteSelecionado];
    var vg = new VarGlobal('informacoesGlobaisDeOrcamento');
    vg.salvarLocal(JSON.stringify(orcamento1.informacoesDoFormulario));
  },

  pegaInformacoesDoFormulario : function(){

    orcamento1.informacoesDoFormulario = {
      //'meusClientes' : app.E('#seMeusClientes').options[app.E('#seMeusClientes').selectedIndex].text,
      'tipoPessoa': app.E('#tipoj').checked ? app.E('#tipoj').value : app.E('#tipof').value,
      'nome': app.E('#nome').value,
      'sobrenome': app.E('#sobrenome').value,
      'ddd': app.E('#ddd').value ,
      'telefone': app.E('telefone').value,
      'email': app.E('#email').value,
      'estado': app.E('#estado').value,
      'cidade': app.E('#cidade').value
    }

  },

  _checarAlteracaoFormulario: function(){
    orcamento1.pegaInformacoesDoFormulario();
    orcamento1._checandoUsuarioEscolhido();
    var todosOsClientes = orcamento1.todosOsClientes[app.E('#seMeusClientes').value];
    var informacoesDoFormulario = orcamento1.informacoesDoFormulario;
    orcamento1.clientesAlterados  = new Object;
    if (todosOsClientes.nome != informacoesDoFormulario.nome) {
     Object.assign(orcamento1.clientesAlterados, { 'nome': informacoesDoFormulario.nome })
    }
    if (todosOsClientes.sobrenome != informacoesDoFormulario.sobrenome) {
     Object.assign(orcamento1.clientesAlterados, { 'sobrenome': informacoesDoFormulario.sobrenome })
    }
    if (todosOsClientes.ddd != informacoesDoFormulario.ddd) {
     Object.assign(orcamento1.clientesAlterados, { 'ddd': informacoesDoFormulario.ddd })
    }
    if (todosOsClientes.numero != informacoesDoFormulario.telefone) {
     Object.assign(orcamento1.clientesAlterados, { 'numero': informacoesDoFormulario.telefone})
    }
    if (todosOsClientes.email != informacoesDoFormulario.email) {
     Object.assign(orcamento1.clientesAlterados, { 'email': informacoesDoFormulario.email })
    }
    if (todosOsClientes.uf != informacoesDoFormulario.estado){
     Object.assign(orcamento1.clientesAlterados, { 'uf': informacoesDoFormulario.estado })
    }
    if(todosOsClientes.cidade != informacoesDoFormulario.cidade){
     Object.assign(orcamento1.clientesAlterados, { 'cidade': informacoesDoFormulario.cidade })
    }
    if (todosOsClientes.tipo != informacoesDoFormulario.tipoPessoa) {
     Object.assign(orcamento1.clientesAlterados, { 'tipo': informacoesDoFormulario.cidade })
    }
    if(Object.keys(orcamento1.clientesAlterados).length > 0){
      orcamento1._editarCliente();
    }
    console.group()
    console.info(informacoesDoFormulario);
    console.log(todosOsClientes);
    console.log(orcamento1.clientesAlterados);
    console.groupEnd();
  },


  _pegarClientes: function () {
    orcamento1.todosOsClientes = new Array;
    var api = new Api('clientes?sid='+app.thisUser[0].pessoa_id);
    api.send(function (res) {
      if (!res.error) {
        if (res.length > 0) {
          orcamento1.todosOsClientes[0] = {
            cidade: "",
            ddd: "",
            email: "",
            id: "",
            nome: "Novo Cliente",
            numero: "",
            sobrenome: "",
            tipo: "F",
            uf: "Acre"
          }
          orcamento1._criarClientes(orcamento1.todosOsClientes[0], 0, '#seMeusClientes');
          for (var i = 0; i < res.length; i++) {
            var element = res[i];
            orcamento1.todosOsClientes[i+1] = element;
            orcamento1._criarClientes(element, i+1,'#seMeusClientes');
          }
        }
      }
    });
  },

  _criarClientes: function (element, i, divPai) {
   var option = app.CE('option', {'value' : i});
   option.innerHTML = element.nome +" "+element.sobrenome;
   orcamento1._inserirClientes(option, divPai);
  },

  _inserirClientes: function (option, divPai) {
    app.E(divPai).appendChild(option);
  },

  //To do
  // VERIFICA SE O CAMPO ESTÁ EM BRANCO
  _verificarCampoVazio:  function () {
    var inputBox = app.E('.box-input');
    console.log(inputBox.length);
    for (var i = 0; i < inputBox.length; i++) {
      var element = inputBox[i];
      if(element.children[1].children.length == 1 ){
        if (element.children[1].children[0].value == "") { 
          if (!element.classList.contains('is-invalid')) {
            element.classList.add('is-invalid');
            return false;
          }
        }
      }
      if (element.children[1].children.length > 1) {
        for (var index = 0; index < element.children[1].children.length; index++) {
          if(!element.children[1].lastElementChild.lastElementChild){
            if(element.children[1].children[index].nodeName == 'INPUT'){
              if (element.children[1].children[0].value == "") {
                if (!element.classList.contains('is-invalid')) {
                  element.classList.add('is-invalid');
                  return false;
                }
              }
            }
          }
        }
        
      }
    }
    return true;
  },
  // REMOVE ALERTA DE INVALIDEZ
  _removeIsInvalid : function() {
    var inputBox = app.E('.box-input');
    for (var i = 0; i < inputBox.length; i++) {
      inputBox[i].classList.remove('is-invalid');
    }
  },

};