var encontre={e:{AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceara",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MS:"Mato Grosso",MT:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"},platform:null,formEncontre:null,seEstado:null,seCidade:null,btProcurar:null,inicializar:function(){encontre.formEncontre=app.E("formEncontre"),encontre.seEstado=app.E("seEstado"),encontre.seCidade=app.E("seCidade"),encontre.btProcurar=app.E("btProcurar"),encontre.platform=cordova.platformId,encontre.seEstado.addEventListener("change",encontre.seEstadoChange),encontre.formEncontre.addEventListener("submit",encontre.formEncontreSubmit),"browser"!=encontre.platform&&cordova.plugins.diagnostic.getLocationMode(function(o){switch(o){case cordova.plugins.diagnostic.locationMode.HIGH_ACCURACY:console.log("High accuracy");break;case cordova.plugins.diagnostic.locationMode.BATTERY_SAVING:console.log("Battery saving");break;case cordova.plugins.diagnostic.locationMode.DEVICE_ONLY:console.log("Device only");break;case cordova.plugins.diagnostic.locationMode.LOCATION_OFF:console.log("Location off"),encontre.ativaLocalizacao()}},function(o){console.error("The following error occurred: "+o)}),encontre.getEstados()},ativaLocalizacao:function(){cordova.plugins.locationAccuracy.canRequest(function(o){o?cordova.plugins.locationAccuracy.request(function(){console.log("Requisição de localização concebida com sucesso"),Loader.mostrar();function e(){Loader.remover(),"encontre"!=app.thisPage().id&&app.abrirPag("encontre")}var o=new app.GPS(!1),a=null,n=!0;o.getLocal(function(o){n&&(clearInterval(a),(o=o.coords)?(Loader.remover(),o={lat:o.latitude,lng:o.longitude},app.abrirPag("encontreList",[o])):e())}),a=setTimeout(function(){n=!1,e()},3500)},function(o){app.Erro("Erro na requisição de localização: "+JSON.stringify(o)),o&&(app.Erro("erro codigo="+o.code+"; mensagem de erro="+o.message),"android"===encontre.platform&&o.code!==cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED&&window.confirm("Falha ao ativar o GPS. Você gostaria de tentar ativar manualmente?")&&cordova.plugins.diagnostic.switchToLocationSettings())},cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY):app.Erro("Não foi possível solicitar a sua localização")})},getEstados:function(){new Api("representantes/getEstados").send(function(o){if(o.error)app.Erro(o);else if(app.limpaObj(encontre.seEstado,1),o.length)for(var e=0;e<o.length;e++){var a=app.CE("option",{value:o[e].uf});a.innerHTML=encontre.e[o[e].uf],encontre.seEstado.appendChild(a)}else new Mensagem("Nenhum Representante Encontrado no Momento!").mostrar(function(){app.onBackButtonClick()})})},getCidades:function(o){new Api("representantes/getCidades/?uf="+o).send(function(o){if(o.error)app.Erro(o);else if(app.limpaObj(encontre.seCidade,1),o.length){for(var e=0;e<o.length;e++){var a=app.CE("option",{value:o[e].cidade});a.innerHTML=o[e].cidade,encontre.seCidade.appendChild(a)}encontre.seCidade.disabled=!1}else new Mensagem("Nenhuma Cidade Encontrada no Momento!").mostrar(function(){app.onBackButtonClick()})})},seEstadoChange:function(){0!=this.value?encontre.getCidades(this.value):(encontre.seCidade.value=0,encontre.seCidade.disabled=!0)},formEncontreSubmit:function(o){o.preventDefault();var o=$("#seEstado").val(),e=$("#seCidade").val(),a=o,n=e;a<1?$(o.parentNode).addClass("is-invalid"):n<1?$(e.parentNode).addClass("is-invalid"):app.abrirPag("encontreList",[{uf:a,cidade:n}])}};