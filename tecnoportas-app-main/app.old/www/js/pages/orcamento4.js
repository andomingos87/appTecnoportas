"use strict";var orcamento4={fechar:null,tipoMotor:null,informacoesDoFormulario:null,nTmpLocal:null,btnVoltar:null,inicializar:function(o){app.securityCheck();var a=new VarGlobal("informacoesGlobaisDeOrcamento").obterLocal();this.nTmpLocal=JSON.parse(a),this._pegarTipoDoMotor(),this.fechar=app.E("fechar"),this.tipoMotor=app.E("tipoMotor"),this.fechar.addEventListener("click",this.fecharClick),this.tipoMotor.addEventListener("click",this.tipoMotorClick),orcamento4.adicionaEventoBotoes()},_pegarTipoDoMotor:function(){for(var o=document.getElementById("lista-de-opcoes");o.firstChild;)o.removeChild(o.firstChild);new Api("motores/categorias",null,!0,!0).send(function(o){if(o.error)orcamento4._semMotores();else if(0<o.length)for(var a=0;a<o.length;a++)r=o[a],console.log(r),orcamento4._criarTipoDoMotor(r,"#lista-de-opcoes");var r})},_semMotores:function(){orcamento4._criarSemMotores(),orcamento4._inserirSemMotores()},_criarSemMotores:function(){var o=app.CE("div",{class:"col-12"});o.innerHTML="Nenhum tipo de Motor Disponível!",orcamento4._inserirSemMotores(o,void 0)},_inserirSemMotores:function(o,a){a.appendChild(o)},_criarTipoDoMotor:function(o,a){var r,i=app.CE("div",{class:"opcao"}),e=app.CE("label",{class:"radio-azul diferenciado"}),n=app.CE("img",{}),t=app.CE("div",{class:"texto-produto"}),c=app.CE("span",{}),p=(c.innerHTML=o.nome,app.CE("span",{})),l=(p.innerHTML=o.descricao,app.CE("input",{value:o.nome,type:"radio",class:"form-control cb-portas",name:"modelos",id:o.id})),s=app.CE("i",{});r=n,o=o.imagem,app.getImgFromApi(o,function(o,a){r.src=o}),orcamento4._inserirTipoDoMotor(i,e,n,t,c,p,l,s,a)},_inserirTipoDoMotor:function(o,a,r,i,e,n,t,c,p){i.appendChild(e),i.appendChild(n),a.appendChild(r),a.appendChild(i),a.appendChild(t),a.appendChild(c),o.appendChild(a),app.E(p).appendChild(o)},adicionaEventoBotoes:function(){app.E("#btnlVoltar").addEventListener("click",app.onBackButtonClick),app.E("#btnAvancar").addEventListener("click",function(){orcamento4.pegaInformacoesDoFormulario(),orcamento4.informacoesDoFormulario=Object.assign(orcamento4.informacoesDoFormulario,orcamento4.nTmpLocal),orcamento4.configuraParaVarGlobal(),app.abrirPag("orcamento5",[orcamento4.informacoesDoFormulario],!1)})},configuraParaVarGlobal:function(){new VarGlobal("informacoesGlobaisDeOrcamento").salvarLocal(JSON.stringify(orcamento4.informacoesDoFormulario))},pegaInformacoesDoFormulario:function(){orcamento4.informacoesDoFormulario={tipoCatMotor:app.getRadioChecked("tipoMotor","modelos").value,idCatMotor:app.getRadioChecked("tipoMotor","modelos").id}},fecharClick:function(){$(".propaganda").addClass("-close")},tipoMotorClick:function(){$("input:radio").change(function(){$(this).is(":checked")&&$(".botoes-form").addClass("-is-active")})}};