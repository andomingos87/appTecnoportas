var encontreList={lat:null,lng:null,uf:null,cidade:null,btVoltar:null,btEscolha:null,divLista:null,inicializar:function(e){encontreList.btEscolha=app.E("btEscolha"),encontreList.divLista=app.E("divLista"),encontreList.btVoltar=app.E("btVoltar"),console.log(e),e.lat?(encontreList.lat=e.lat,encontreList.lng=e.lng):e.uf&&(encontreList.uf=e.uf,encontreList.cidade=e.cidade),encontreList.btEscolha.addEventListener("click",encontreList.btEscolhaClick),encontreList.btVoltar.addEventListener("click",app.onBackButtonClick),encontreList.getRepres()},getRepres:function(){var e="representantes";encontreList.lat?e="representantes/?lat="+encontreList.lat+"&lng="+encontreList.lng:encontreList.uf&&(e="representantes/?uf="+encontreList.uf+"&cidade="+encontreList.cidade),new Api(e).send(function(e){if(e.error)app.Erro(e);else if(app.limpaObj(encontreList.divLista),e.length)for(var n=0;n<e.length;n++)encontreList.divLista.appendChild(encontreList.geraRepres(e[n]));else encontreList.divLista.innerHTML="<p style='color:black'>Nenhum Representante Encontrado na sua Região!</p>"})},geraRepres:function(e){var n,t=app.CE("div",{class:"item"}),a=app.CE("div",{class:"nome"}),i=app.CE("div",{class:"nome"}),r=app.CE("div",{class:"nome -contato"}),o=app.CE("div",{class:"nome -tel"}),s=e.razao_social||e.nome_fantasia;return a.innerHTML=s,i.innerHTML=e.nome+" "+e.sobrenome,o.innerHTML=e.ddd+" "+e.telefone,r.innerHTML=e.bairro,n=e,t.addEventListener("click",function(){app.abrirPag("encontreMap",[n])}),t.appendChild(a),t.appendChild(i),t.appendChild(o),t.appendChild(r),t},btEscolhaClick:function(){app.abrirPag("encontre")}};