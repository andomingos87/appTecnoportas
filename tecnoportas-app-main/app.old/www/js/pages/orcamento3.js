"use strict";var orcamento3={etapa1:null,etapa2:null,etapa3:null,etapa4:null,informacoesDoFormulario:null,listaDeFotos:null,nTmpLocal:null,perfilDds:null,lista_modelo_etapa_2:null,lista_modelo_etapa_3:null,lista_modelo_etapa_4:null,inicializar:function(a){app.securityCheck(),this._pegandoDadosModelo();var o=new VarGlobal("informacoesGlobaisDeOrcamento").obterLocal();this.nTmpLocal=JSON.parse(o),this.etapa1=app.E("etapa1"),this.etapa2=app.E("etapa2"),this.etapa3=app.E("etapa3"),this.etapa4=app.E("etapa4"),this.lista_modelo_etapa_2=app.E("lista_modelo_etapa_2"),this.lista_modelo_etapa_3=app.E("lista_modelo_etapa_3"),this.lista_modelo_etapa_4=app.E("lista_modelo_etapa_4"),this._adicionaEventoBotoes()},_pegandoDadosModelo:function(){var a=new Api("atributos?tipo=chp",null,!0,!0);orcamento3.listaDeFotos=new Array,a.send(function(a){if(!a.error&&0<a.length){for(var o=new Array,e=0;e<a.length;e++){var p=a[e];o[e]=p,orcamento3._criaModelo(p,"#lista-modelo-etapa-1",1)}orcamento3.listaDeFotos=o}})},_criaModelo:function(a,o){var e,p=app.CE("div",{class:"modelo"}),i=app.CE("div",{class:"opcao"}),n=app.CE("label",{class:"radio-azul"}),t=app.CE("span",{}),r=(t.innerHTML=a.nome,app.CE("img",{id:a.nome,src:"img/nenhum.png"})),l=app.CE("input",{type:"radio",class:"form-control cb-portas",value:a.nome,name:"modelos",id:a.id}),c=app.CE("i",{id:a.id});e=r,a=a.imagem,app.getImgFromApi(a,function(a,o){e.src=a}),orcamento3._inserirModeloNaPagina(p,i,n,t,r,l,c,o)},_inserirModeloNaPagina:function(a,o,e,p,i,n,t,r){e.appendChild(i),e.appendChild(p),e.appendChild(n),e.appendChild(t),o.appendChild(e),a.appendChild(o),app.E(r).appendChild(a)},_pegaDadosPerfil:function(){orcamento3.lista_modelo_etapa_2.innerHTML="";var a=app.getRadioChecked("etapa1","modelos").id;new Api("atributos",{atributo_id:a},!0,!0).send(function(a){if(console.log(a),!a.error&&0<a.length)for(var o=0;o<a.length;o++)console.log(),orcamento3._criaPerfil(a[o],"lista_modelo_etapa_2")})},_criaPerfil:function(a,o){var e,p=app.CE("div",{class:"modelo"}),i=app.CE("div",{class:"opcao"}),n=app.CE("label",{class:"radio-azul"}),t=app.CE("img",{src:"img/nenhum.png"}),r=app.CE("span",{}),l=(r.innerHTML=a.nome,app.CE("input",{value:a.nome,type:"radio",class:"form-control cb-portas",name:"perfil",id:a.id})),c=app.CE("i",{});e=t,a=a.imagem,app.getImgFromApi(a,function(a,o){e.src=a}),orcamento3._inserirPerfil(p,i,n,t,r,l,c,o)},_inserirPerfil:function(a,o,e,p,i,n,t,r){e.appendChild(p),e.appendChild(i),e.appendChild(n),e.appendChild(t),o.appendChild(e),a.appendChild(o),app.E(r).appendChild(a)},_pergarDadosChapas:function(){orcamento3.lista_modelo_etapa_3.innerHTML="";var a=app.getRadioChecked("etapa2","perfil").id;new Api("atributos",{atributo_id:a},!0,!0).send(function(a){if(!a.error&&0<a.length)for(var o=0;o<a.length;o++)console.log(a[o]),orcamento3._criarChapas(a[o],"lista_modelo_etapa_3")})},_criarChapas:function(a,o){var e=app.CE("div",{class:"modelo"}),p=app.CE("div",{class:"opcao"}),i=app.CE("label",{class:"radio-azul"}),n=app.CE("span",{}),a=(n.innerHTML=a.nome,app.CE("input",{value:a.nome,type:"radio",class:"form-control cb-portas",name:"chapas",id:a.id})),t=app.CE("i",{});orcamento3._inserirChapas(e,p,i,n,a,t,o)},_inserirChapas:function(a,o,e,p,i,n,t){e.appendChild(p),e.appendChild(i),e.appendChild(n),o.appendChild(e),a.appendChild(o),app.E(t).appendChild(a)},_pegarDadosMaterial:function(){console.log("quantas vezes?"),orcamento3.lista_modelo_etapa_4.innerHTML="";app.getRadioChecked("etapa3","chapas").id;new Api("atributos?tipo=mat",null,!0,!0).send(function(a){if(!a.error&&0<a.length)for(var o=0;o<a.length;o++)console.log(),orcamento3._criarMaterial(a[o],"lista_modelo_etapa_4")})},_criarMaterial:function(a,o){var e=app.CE("div",{class:"modelo"}),p=app.CE("div",{class:"opcao"}),i=app.CE("label",{class:"radio-azul"}),n=app.CE("span",{}),a=(n.innerHTML=a.nome,app.CE("input",{value:a.nome,type:"radio",class:"form-control cb-portas",name:"material",id:a.id})),t=app.CE("i",{});orcamento3._inserirMaterial(e,p,i,n,a,t,o)},_inserirMaterial:function(a,o,e,p,i,n,t){e.appendChild(p),e.appendChild(i),e.appendChild(n),o.appendChild(e),a.appendChild(o),app.E(t).appendChild(a)},_adicionaEventoBotoes:function(){app.E("#btnAvancar").addEventListener("click",function(){orcamento3._pegaProdutdoPerfil()}),app.E("#btnVoltar").addEventListener("click",app.onBackButtonClick),orcamento3.etapa1.addEventListener("click",orcamento3.etapa1Click),orcamento3.etapa2.addEventListener("click",orcamento3.etapa2Click),orcamento3.etapa3.addEventListener("click",orcamento3.etapa3Click),orcamento3.etapa4.addEventListener("click",orcamento3.etapa4Click)},_pegaProdutdoPerfil:function(){new Api("portoes/perfis",{chapa_id:app.getRadioChecked("etapa1","modelos").id,perfil_id:app.getRadioChecked("etapa2","perfil").id,espessura_id:app.getRadioChecked("etapa3","chapas").id,material_id:app.getRadioChecked("etapa4","material").id},!0,!0).send(function(a){a.error?app.Erro(a):0<a.length?(orcamento3.perfilDds=a[0],console.log("perfilDds >> "),console.log(orcamento3.perfilDds),orcamento3._completa()):((a=new Mensagem("Nenhum Perfil Corresponde a Esses Atributos!\nTente usar outros atributos para continuar seu orçamento.")).setTitulo("Nenhum Perfil Encontrado."),a.mostrar(function(){app.abrirPag("orcamento3",[orcamento3.informacoesDoFormulario],!1)})),Loader.remove(btnAvancar)})},_completa:function(){orcamento3._pegaInformacoesDoFormulario();app.N(orcamento3.nTmpLocal.altura);var a=app.N(orcamento3.nTmpLocal.altura),o=orcamento3.nTmpLocal.fnAltura,a=app.C(app.C(app.C(a,"*",o),"*",2),"*",orcamento3.perfilDds.peso_m2);console.log(orcamento3.informacoesDoFormulario),orcamento3.informacoesDoFormulario.peso_total=a,orcamento3.informacoesDoFormulario.perfilDds=orcamento3.perfilDds,orcamento3.informacoesDoFormulario=Object.assign(orcamento3.informacoesDoFormulario,orcamento3.nTmpLocal),orcamento3._configuraParaVarGlobal(),console.log("infos do form"),app.abrirPag("orcamento4",[orcamento3.informacoesDoFormulario],!1)},_pegaInformacoesDoFormulario:function(){console.log("pegando informacoes testado"),orcamento3.informacoesDoFormulario={modelo:app.getRadioChecked("etapa1","modelos").value,perfil:app.getRadioChecked("etapa2","perfil").value,chapas:app.getRadioChecked("etapa3","chapas").value,material:app.getRadioChecked("etapa4","material").value,modeloID:app.getRadioChecked("etapa1","modelos").id,perfilID:app.getRadioChecked("etapa2","perfil").id,chapasID:app.getRadioChecked("etapa3","chapas").id,materialID:app.getRadioChecked("etapa4","material").id,peso_m2:orcamento3.perfilDds.peso_m2}},_configuraParaVarGlobal:function(){new VarGlobal("informacoesGlobaisDeOrcamento").salvarLocal(JSON.stringify(orcamento3.informacoesDoFormulario))},_semMaterial:function(){},etapa1Click:function(){$("#etapa2").addClass("-is-active"),orcamento3._pegaDadosPerfil()},etapa2Click:function(){$("#etapa3").addClass("-is-active"),orcamento3._pergarDadosChapas()},etapa3Click:function(){$("#etapa4").addClass("-is-active"),orcamento3._pegarDadosMaterial()},etapa4Click:function(){$(".botoes-form").addClass("-is-active")}};