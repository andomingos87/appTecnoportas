"use strict";app=app.arrayPush(app,{abrirDocumento:function(a,i){app.isFile(a,function(e){e&&(e={title:i,documentView:{closeLabel:"Fechar"},navigationView:{closeLabel:"Fechar"},email:{enabled:!0},print:{enabled:!1},search:{enabled:!0},autoClose:{onPause:!1}},cordova.plugins.SitewaertsDocumentViewer.viewDocument(a,app.getMimeType(a),e,function(){},function(){},function(e,a){var i=new Mensagem("Para abrir esse documento você precisa instalar o visualizador de documentos, gostaria de baixar?");i.setTitulo("O Visualizador não está Instalado!"),i.setTipo("confirma"),i.setBotoes(["Sim","Não"]),i.mostrar(function(e){1==e&&a()})},function(e){console.log("erro:"),console.log(e)}))})},b64toBlob:function(e,a,i){a=a||"",i=i||512;for(var o=atob(e),t=[],n=0;n<o.length;n+=i){for(var r=o.slice(n,n+i),p=new Array(r.length),l=0;l<r.length;l++)p[l]=r.charCodeAt(l);var c=new Uint8Array(p);t.push(c)}return new Blob(t,{type:a})},Blob2Base64:function(e,a){var i=new FileReader;i.readAsDataURL(e),i.onloadend=function(){var e=i.result;a(e)}},geraB64:function(e,a){app.getBlob(e,function(e){app.Blob2Base64(e,function(e){a(e)})})},geraHtmlByTemplate:function(e,d,u,f){e?app.lerArquivo(e,function(e){var a,i=e;for(a in d)var o=new RegExp("{{\\s*"+a+"\\s*}}","g"),i=i.replace(o,d[a]);if(f){if(f.thead)if((o=new RegExp("{{\\s*"+f.thead.var+"\\s*}}","g")).test(i)){for(var t=f.thead,n="",r=0;r<t.dados.length;r++)n+="<td>"+t.dados[r]+"</td>";i=i.replace(o,n)}if(f.tbody)if((o=new RegExp("{{\\s*"+f.tbody.var+"\\s*}}","g")).test(i)){for(var p=f.tbody,l="",r=0;r<p.dados.length;r++){var c=p.dados[r];l+="<tr>";for(var s=0;s<c.length;s++)l+="<td>"+c[s]+"</td>";l+="</tr>"}i=i.replace(o,l)}}e=new RegExp("{{\\s*[a-zA-Z0-9_]+\\s*}}","g");i=i.replace(e,""),u(i)}):u(!1)},getBlob:function(o,t){window.resolveLocalFileSystemURL(o,function(i){i.file(function(e){var a=new FileReader;a.onloadend=function(){console.log("Successful file read: "+this.result),displayFileData(i.fullPath+": "+this.result);var e=new Blob([this.result],{type:getMimeType(o)});t(e)},a.readAsArrayBuffer(e)},function(e){t({error:ArquivoErros[e.code]}),console.log("fileEntry")})},function(e){t({error:ArquivoErros[e.code]}),console.log("resolveLocalFileSystemURL")})},getMimeType:function(e){e=e.split("."),e={aac:"audio/aac",abw:"application/x-abiword",arc:"application/octet-stream",avi:"video/x-msvideo",azw:"application/vnd.amazon.ebook",bin:"application/octet-stream",bmp:"image/bmp",bz:"application/x-bzip",bz2:"application/x-bzip2",csh:"application/x-csh",css:"text/css",csv:"text/csv",doc:"application/msword",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jar:"application/java-archive",jpeg:"image/jpeg",jpg:"image/jpeg",js:"application/javascript",json:"application/json",mid:"audio/midi",midi:"audio/midi",mpeg:"video/mpeg",mp2:"audio/mpeg",mp3:"audio/mpeg3",png:"image/png",pdf:"application/pdf",ppt:"application/vnd.ms-powerpoint",rar:"application/x-rar-compressed",rtf:"application/rtf",sh:"application/x-sh",svg:"image/svg+xml",swf:"application/x-shockwave-flash",tar:"application/x-tar",tif:"image/tiff",tiff:"image/tiff",xls:"application/vnd.ms-excel",xlsx:"application/vnd.ms-excel",xml:"application/xml",xul:"application/vnd.mozilla.xul+xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2","7z":"application/x-7z-compressed"}[e[e.length-1]];return e||!1},savebase64AsPDF:function(i,a,e,o,t){var n=app.b64toBlob(e,o);window.resolveLocalFileSystemURL(i,function(e){e.getFile(a,{create:!0},function(a){a.createWriter(function(e){e.write(n),t(a.nativeURL)},function(){app.Erro({error:"Impossível salvar arquivo no diretório: "+i})})})})}},!1);