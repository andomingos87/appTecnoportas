"use strict";var app={nome:"Tecnoportas",corPadrao:"3F439C",Servidor:"http://apptecnoportas.com.br/",classes:["Api","VarGlobal","Loader","Galeria","Mensagem","Orcamento","Permissoes","Gps","Pdf","CalcFormula"],bibliotecas:["Arquivos","Calculos","Dispositivo","Elementos","Gerais","Objetos"],scripts:[],historico:[],_classes:[],_scripts:[],_bibliotecas:[],backButtonStatus:!0,thisUser:!1,ObjPullToRefresh:null,IdPullToRefresh:null,FuPullToRefresh:null,PullToRefreshStatus:null,divApp:null,pageTitle:null,inicializar:function(){document.addEventListener("deviceready",app.onDeviceReady.bind(app))},onDeviceReady:function(){function e(){Servidor=app.Servidor,app.receivedEvent("deviceready")}function o(){app.classes.length?app.addClasses(app.classes,function(){e()}):e()}app.bibliotecas.length?app.addBibliotecas(app.bibliotecas,function(){o()}):o()},receivedEvent:function(e){app.divApp=app.E("divApp"),app.pageTitle=app.E("page_title"),document.addEventListener("backbutton",app.onBackButtonClick),app.isPlatform("android")&&(navigator.app.overrideButton("menubutton",!0),document.addEventListener("menubutton",app.onMenuButtonClick,!1)),cordova.getAppVersion.getVersionNumber(function(e){console.log(e);var o=new VarGlobal("version"),a=e.replace(/[.,]/g,"");o.salvarLocal(a),document.querySelector("#ver-number>p").innerHTML="Ver. "+e}),app.setPushKey(),app.thisUser=app.isLogado(),app.abrirPag("home")},setPushKey:function(){app.getPushKey(function(e,o){o&&new Api("notificacoes/atualizaKey",{pushkey:o}).send(function(e){e.error||console.log("pushKey Atualizada")})})},_AoIniciar:function(){$("a, img").on("dragstart",function(e){e.preventDefault()}),$("input").on("blur",app.onInputBlur),$("select").on("blur",app.onInputBlur),$('input[type="radio"]').on("click",app.onInputBlur),$('input[type="checkbox"]').on("click",app.onInputBlur)},addBibliotecas:function(o,a){function n(){var e;i<o.length?(e=o[i],i++,-1==app._bibliotecas.indexOf(e)?app.addScript("js/classes/_"+e+".js",function(){app._bibliotecas.push(e),n()},!0):n()):a(!0)}var a="function"==typeof a?a:function(e){},i=("string"==typeof o&&(o=[o]),0);n()},addClasses:function(o,a){function n(){var e;i<o.length?(e=o[i],i++,-1==app._classes.indexOf(e)?app.addScript("js/classes/"+e+".js",function(){app._classes.push(e),n()},!0):n()):a(!0)}var a="function"==typeof a?a:function(e){},i=("string"==typeof o&&(o=[o]),0);n()},addScript:function(o,a,e){a="function"==typeof a?a:function(e){};(e=!0===e)&&-1!=app._scripts.indexOf(o)?a(!1):app.isFile(o,function(e){e?$.getScript(o,function(){app._scripts.push(o),a(!0)}):(a(!1),console.log("Script "+o+" não encontrado!"))})},remPagFiles:function(e){"object"==typeof e.pullToRefresh&&removePullToRefresh()},abrirPost:function(e,o){console.log("Abrir Post"),console.log(o);function a(o){"p"==o.tipo||"n"==o.tipo?0!=o.id?app.abrirPag("post",[o]):app.abrirPag("cemanos",[o]):"t"==o.tipo?"0"==o.layout?app.abrirPag("dicas",[o],!1,!0,{id:"listaDicas",function:"getPosts",args:[o.id]}):"1"==o.layout&&(console.log("licatalogos"),app.abrirPag("licatalogos",[o],!1,!0,{id:"lista-catalogos",function:"getPosts",args:[o.id]})):"f"==o.tipo&&(app.isPlatform("browser")?cordova.InAppBrowser.open(Servidor+"files?name="+o.arquivo,"_system"):(Loader.mostrar(),new Api("files?name="+o.arquivo,null,!1).download(function(e){e.error?app.Erro(e):cordova.plugins.fileOpener2.open(e,app.getMimeType(e),{success:function(){Loader.remover()},error:function(){Loader.remover();new Mensagem("Erro desconhecido ao abrir "+o.nome,!0)}})})))}o?a(o):0!=e?app.getData("posts?id="+e,function(e){e.length?a(e[0]):new Mensagem("O Post não foi encontrado!",!0)}):a(null)},abrirPag:function(pag,args,onLoad,addHeader,pullToRefresh,statusBar){console.log("teste"),app.checaLogin(!0);var onLoad="function"==typeof onLoad?onLoad:function(e){};app.addClasses("Loader",function(){Loader.mostrar(!1);var erro=function(e){Loader.remover(!1)},pf={js:"js/pages/"+pag+".js",html:"pages/"+pag+".html"},hf=!1,tHeader="string"==typeof addHeader?addHeader:"header",includeScripts=(!1!==addHeader&&(hf={js:"js/"+tHeader+".js",html:tHeader+".html"}),function(){var init=function(){var e={id:pag,args:args,addHeader:addHeader,pullToRefresh:pullToRefresh,statusBar:statusBar};app.historico.push(e),statusBar=statusBar||{cor:app.corPadrao,overlay:!1},app.statusBar(statusBar.cor,statusBar.overlay),app._AoIniciar(),app.animateCSS(app.divApp,"fadeInRight",function(){"function"==typeof onLoad&&onLoad(!0),Loader.remover(!1)},"faster")},fin=function(){"object"==typeof pullToRefresh&&app.addPullToRefresh(pullToRefresh.id,function(){var tArgs="";if(pullToRefresh.args)for(var i=0;i<pullToRefresh.args.length;i++)tArgs+="pullToRefresh.args["+i+"]",pullToRefresh.args[i+1]&&(tArgs+=", ");eval(pag+"."+pullToRefresh.function+"("+tArgs+");")}),init()},addPs=function(){app.addScript(pf.js,function(){var tArgs="";if(args)for(var i=0;i<args.length;i++)tArgs+="args["+i+"]",args[i+1]&&(tArgs+=", ");eval(pag+".inicializar("+tArgs+");"),fin()})},addHs=function(){!1!==hf?app.addScript(hf.js,function(){eval(tHeader+".inicializar(pag);"),addPs()}):addPs()},s,i,ads;0<app.scripts.length?(s=app.scripts,i=0,ads=function(e){e<s.length?app.addScript(s[e],function(){ads(++i)}):addHs()},ads(i)):addHs()}),addIc=function(){app.includeHTML(function(res){var i,ks,len,ads;0<Object.keys(res).length?(i=0,ks=Object.keys(res),len=ks.length,ads=function(c){var nm,nm;c<len?(nm=ks[c].split("/"),nm=nm[nm.length-1],app.addScript("js/"+ks[c]+".js",function(){eval(nm+".inicializar();"),ads(++i)})):includeScripts()},ads(i)):includeScripts()})},includePag=function(){app.includeHTML(function(e){e.error?erro("Erro ao incluir a Página"):addIc()},app.divApp,pf.html)},includeHeader=function(){app.isFile(hf.html,function(e){e?app.includeHTML(function(e){e.error?erro("Erro ao incluir o Header!"):includePag()},app.divApp,hf.html):erro("Header não encontrado!")})},remPagAntFiles=function(){var e=app.historico.length;0<e&&(e=app.historico[e-1],app.remPagFiles(e))};app.isFile(pf.html,function(e){e?app.animateCSS(app.divApp,"fadeInRight",function(){remPagAntFiles(),app.divApp.innerHTML="",(!1!==hf?includeHeader:includePag)()},"faster"):erro("Página não encontrada!")})})},voltarPag:function(o){var e,a,n=app.historico.length;return 1<n?(e=app.historico[n-2],a=!1,"orcamento9"==e.id&&(a=!0,e.id="home",e.args=void 0),app.abrirPag(e.id,e.args,function(){var e;a?(app.historico.splice(n-(e=n-(n-1)),e),app.setThisPagIni()):app.historico.splice(n-2,2),"function"==typeof o&&o(!0)},e.addHeader,e.pullToRefresh,e.statusBar),!0):("function"==typeof o&&o(!1),!1)},thisPage:function(){var e=app.historico.length;return app.historico[e-1]},setThisPagIni:function(){var e=app.historico.length,e=app.historico[e-1];app.historico=[e]},statusBar:function(e,o){o=!0===o,e="string"==typeof e?e:app.corPadrao,app.isPlatform("android")&&(StatusBar.overlaysWebView(o),StatusBar.backgroundColorByHexString(e))},arrayPush:function(e,o,a){if("object"!=typeof e||typeof e!=typeof o)return!1;var n,i,t=(a=!1!==a)?[]:{};for(n in e)a?t.push(e[n]):t[n]=e[n];for(i in o)a?t.push(o[i]):t[i]=o[i];return t},fechar:function(){app.isPlatform("windows")?window.close():app.isPlatform("android")?navigator.app.exitApp():console.log("Não é possível fechar")},getUrlParameter:function(o,e){var a,n=null,i=location.href;return(i=e?e:i).substr(i.indexOf("?")+1).split("&").forEach(function(e){(a=e.split("="))[0]===o&&(n=decodeURIComponent(a[1]))}),n},addPullToRefresh:function(e,o){app.PullToRefreshStatus||app.addScript("js/pulltorefresh.min.js",function(){app.IdPullToRefresh=e,app.FuPullToRefresh=o,app.ObjPullToRefresh=PullToRefresh.init({mainElement:"#"+app.IdPullToRefresh,onRefresh:function(){app.FuPullToRefresh()},distThreshold:50,instructionsPullToRefresh:"Puxe para Atualizar",instructionsReleaseToRefresh:"Solte para Atualizar",instructionsRefreshing:"Atualizando"}),app.PullToRefreshStatus=!0},!0)},removePullToRefresh:function(){app.PullToRefreshStatus&&(app.ObjPullToRefresh.destroy(),app.PullToRefreshStatus=!1)},getImgFromApi:function(e,o){var a;e?(a="files?name="+e,0===e.indexOf("http")&&(a=e),new Api(a,null,!1).download(function(e){e.error?(o("./img/sem-img.jpg",0),console.log(e)):o(e,1)})):o("img/sem-img.jpg",0)},includeHTML:function(n,i,t){function r(o){var e,a;p<u?!(e=t||o.getAttribute("include-html"))||(a=e.split(".")[0],c[a]&&c[a].pai==o)?r(s[++p]):(c[a]={arquivo:e,pai:o},app.lerArquivo(e,function(e){e.error?n(e):(o.innerHTML=(i?o.innerHTML:"")+e,r(s[++p]))}),i||o.removeAttribute("include-html")):n(c)}var s=[],p=0,c={},u=(i?s.push(i):s=document.body.getElementsByTagName("*"),s.length);r(s[p])},lerArquivo:function(o,a,n){n=n||"text",o?app.isFile(o,function(e){e?$.ajax({url:o,dataType:n,success:function(e){a(e)}}):a({error:"arquivo não encontrado!"})}):a({error:"nenhum dado recebido!"})},Erro:function(e,o,a){var e=e.error,n=new Mensagem;n.setTitulo("Algo deu errado!"),"net"==e?n.setTexto("Você precisa estar conectado à internet para continuar."):n.setTexto(e),o&&(1<o.length&&n.setTipo("confirma"),n.setBotoes(o)),n.mostrar(a)},isFile:function(o,a){window.resolveLocalFileSystemURL(o,function(){a(!0)},function(e){$.ajax({type:"HEAD",url:o,success:function(){a(!0)},error:function(){a(!1)}})})},cleanLocalData:function(e){for(var o=0;o<e.length;o++)new VarGlobal(e[o]).salvarLocal(null);return!0},isLogado:function(){var e=new VarGlobal("thisUser");return!!e.obterLocal()&&JSON.parse(e.obterLocal())},checaLogin:function(n){console.log("checaLogin!"),app.thisUser&&(console.log(app.thisUser),app.IsConectado()&&(Loader.mostrar(),new Api("login",{username:app.thisUser[0].username,senha:app.thisUser[0].senha,nivel:0},!1).send(function(e){e.error?app.logout():((e=e)[0].senha=app.thisUser[0].senha,app.setLogin(e,function(e,o,a){a&&!n?(new Mensagem("Detectamos que o seu usuário não foi autenticado neste aparelho, por favor entre em contato com os administradores para solicitar a liberação do dispositivo",!0),app.checaLogin(!0)):a&&n&&app.abrirPag("home"),Loader.remover()}))})))},setLogin:function(e,a){var n=e,e={modelo:device.model,plataforma:device.platform,uuid:device.uuid,versao:device.version,fabricante:device.manufacturer,is_virtual:device.isVirtual,serial:device.serial};new Api("login/aparelho",{userid:n[0].id,aparelho:JSON.stringify(e)},!1).send(function(e){var o;e.error?app.Erro(e):(o=new VarGlobal("thisUser"),n[0].aparelho_id||(n[0].aparelho_id=e.id),o.salvarLocal(JSON.stringify(n)),app.thisUser=n,app.getPushKey(function(e,o){new Api("notificacoes/atualizaKey",{userId:n[0].id,pushkey:o},!1).send(function(e){e.error||console.log("Pushkey Atualizada com sucesso")})}),e.bloqueado&&new Mensagem("Detectamos que o seu usuário não foi autenticado neste aparelho, por favor entre em contato com os administradores para solicitar a liberação do dispositivo",!0),a&&a(e.id,e.old,e.bloqueado))})},logout:function(){new VarGlobal("thisUser").salvarLocal(null),location.href="index.html"},onMenuButtonClick:function(){},onBackButtonClick:function(){app.backButtonStatus&&(app.backButtonStatus=!1,app.voltarPag(function(e){e||((e=new Mensagem("Deseja mesmo sair de "+app.nome+"?")).setTipo("confirma"),e.setTitulo("Sair..."),e.setBotoes(["Sim","Não"]),e.mostrar(function(e){1==e&&app.fechar()})),app.backButtonStatus=!0}))},onInputBlur:function(){this&&($(this).hasClass("is-invalid")?$(this).removeClass("is-invalid"):$(this.parentNode).hasClass("is-invalid")?$(this.parentNode).removeClass("is-invalid"):$(this.parentNode.parentNode).hasClass("is-invalid")&&$(this.parentNode.parentNode).removeClass("is-invalid"))},swipedetect:function(e,o){var a,n,i,t,r,s,p=o||function(e){};e.addEventListener("touchstart",function(e){e=e.changedTouches[0];a="none",n=e.pageX,i=e.pageY,s=(new Date).getTime()},!1),e.addEventListener("touchend",function(e){e=e.changedTouches[0];t=e.pageX-n,r=e.pageY-i,(new Date).getTime()-s<=300&&(100<=Math.abs(t)&&Math.abs(r)<=100?a=t<0?"e":"d":100<=Math.abs(r)&&Math.abs(t)<=100&&(a=r<0?"c":"b")),p(a)},!1)},animateCSS:function(e,o,a,n){var i=e;(i="string"==typeof e?document.querySelector(e):i).classList.add("animated",o,n),i.addEventListener("animationend",function e(){i.classList.remove("animated",o,n),i.removeEventListener("animationend",e),"function"==typeof a&&a()})},GPS:function(o){function a(e){o&&new Mensagem("Não foi possível obter sua localização atual!",!0),console.log(e)}var n=this,i=navigator.geolocation;o=!1!==o;n.getPermissao=function(o){app.getPermissoes(["ACCESS_FINE_LOCATION","ACCESS_COARSE_LOCATION"],function(e){e.status?"function"==typeof o&&o():a("Sem Permissão")})},n.getLocal=function(e){n.getPermissao(function(){i.getCurrentPosition(e,a)})}},getPermissoes:function(n,i){var t={},r=!0;if(app.isPlatform("android")){for(var s=0;s<n.length;s++){var o=n[s];cordova.plugins.permissions.checkPermission(cordova.plugins.permissions[o],function(e){e.hasPermission?t[o]=!0:t[o]=!1})}var p=function(e){function o(){++s<n.length?p(s):i({status:r,perms:t})}var a=n[e];t[a]?o():cordova.plugins.permissions.requestPermission(cordova.plugins.permissions[a],function(e){e.hasPermission?t[a]=!0:r=!(t[a]={error:{code:0,message:"Erro desconhecido!"}}),o()},function(){r=!(t[a]={error:{code:1,message:"Permissão não concedida!"}}),o()})};p(s=0)}else i({status:r,perms:t})},securityCheck:function(){app.thisUser&&"1"==app.thisUser[0].is_aprovado||(new Mensagem("Acesso não autorizado!!",!0),app.abrirPag("home"))},getPushPermissao:function(){app.isPlatform("browser")&&(window.FirebasePlugin.hasPermission(function(e){e.isEnabled?console.log("Push Permission already granted"):window.FirebasePlugin.grantPermission(function(){console.log("Push Permission granted",e.isEnabled)},function(e){console.error("unable to grant Push permission",e)})},function(e){console.log("Push hasPermission failed",e)}),window.FirebasePlugin.getToken(function(e){console.log("Firebase Push Token from cordova: "+e)},function(e){console.error("unable to create Push token",e)}))},getPushKey:function(o){var a;app.isPlatform("browser")?o(!0,null):(a=0,app.getPushKeyReal(function(e){"string"==typeof e?o(!0,e):"net"==e.error?(Erro(e),o(!1,null)):"Token nulo"==e.error&&a<3?(a++,app.getPushKey(o)):((e=new Mensagem("O que isso significa?\nVocê não receberá notificações de push quando novos posts forem adicionados, porem ainda poderá visualiza-los ao acessar o app.")).setTitulo("Não foi possível obter sua chave de notificação!"),e.setTipo("confirma"),e.setBotoes(["Tentar Novamente","Continuar"]),e.mostrar(function(e){1==e?app.getPushKey(o):o(!0,null)}))}))},getPushKeyReal:function(o){app.IsConectado()?window.FirebasePlugin.getToken(function(e){o(e||{error:"Token nulo"})},function(e){o({error:"Erro no plugin"})}):o({error:"net"})}};$(document).ready(app.inicializar);