"use strict";var meusOrcamentos={arrayStatus:["Cancelado","Pendente","Concluído"],divOrcamentos:null,inputSearch:null,inicializar:function(){app.securityCheck(),this.divOrcamentos=app.E("divOrcamentos"),this.inputSearch=app.E("inputSearch"),this.getOrcamentos(),this.busca()},getOrcamentos:function(){var i=this;new Api("orcamentos?sid="+app.thisUser[0].pessoa_id).send(function(a){if(a.error)app.Erro(a);else if(0<a.length){app.limpaObj(i.divOrcamentos,1);for(var n=0;n<a.length;n++)i.divOrcamentos.appendChild(i.geraOrcamentos(a[n]))}else{var e=app.CE("div",{classe:"col-12 text-center"});e.innerHTML="Você ainda não fez orçamentos!",i.divOrcamentos.appendChild(e)}})},geraOrcamentos:function(a){var n,e,i=app.CE("div",{class:"col-linha"}),t=app.CE("div",{class:"ul-linha"}),s=app.CE("div",{class:"alinhar"}),p=app.CE("div",{class:"alinhar"}),r=app.CE("div",{class:"alinhar -botoes"}),l=app.CE("li",{class:"li-abr"}),o=app.CE("li",{class:"li-Exc"}),c=app.CE("button",{class:"btn"}),d=app.CE("button",{class:"btn btn-danger"}),u=app.CE("li",{class:"li-cliente"}),h=app.CE("li",{class:"li-data"}),C=app.CE("li",{class:"li-vl"}),m=app.CE("li",{class:"li-status status-"+a.status}),v=app.CE("li",{class:"li-Id"});return c.innerHTML="Abrir",d.innerHTML="Excluir",u.innerHTML="F"==a.tipo?a.nome+" "+a.sobrenome:a.sobrenome,h.innerHTML=app.formataData(a.dt_cadastro),C.innerHTML="R$: "+app.N(a.valor_total,2,","),m.innerHTML=this.arrayStatus[a.status],v.innerHTML=a.id,n=a,c.addEventListener("click",function(){app.abrirPag("verOrcamento",[n])},!1),e=a.id,d.addEventListener("click",function(){var a=new Mensagem("Deseja excluir o orçamento nº "+e);a.setTitulo("Excluir orçamento!"),a.setTipo("confirma"),a.setBotoes(["Sim","Não"]),a.mostrar(function(a){1==a&&new Api("orcamentos/excluir?oid="+e).send(function(a){a.error||("ok"==a?(new Mensagem("Orçamento Excluído!",!0),app.abrirPag("meusOrcamentos")):new Mensagem(a,!0))})})},!1),s.appendChild(v),s.appendChild(h),t.appendChild(s),p.appendChild(u),p.appendChild(m),t.appendChild(p),t.appendChild(C),r.appendChild(l),r.appendChild(o),t.appendChild(r),l.appendChild(c),o.appendChild(d),i.appendChild(t),i},busca:function(){$(inputSearch).on("keyup",function(){var a=$(this).val().toLowerCase();$(".ul-linha").filter(function(){$(this).toggle(-1<$(this).text().toLowerCase().indexOf(a))})})}};