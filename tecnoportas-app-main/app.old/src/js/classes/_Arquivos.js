"use strict";
app = app.arrayPush(app, {
    abrirDocumento: function (res, titulo) {
        app.isFile(res, function (isfl) {
            if (isfl) {
                var opc = {
                    title: titulo,
                    documentView: {
                        closeLabel: "Fechar"
                    },
                    navigationView: {
                        closeLabel: "Fechar"
                    },
                    email: {
                        enabled: true
                    },
                    print: {
                        enabled: false
                    },
                    search: {
                        enabled: true
                    },
                    autoClose: {
                        onPause: false
                    }
                };
                cordova.plugins.SitewaertsDocumentViewer.viewDocument(res, app.getMimeType(res), opc, function () { /*Abriu*/ }, function () { /*Fechou*/ },
                    function (appId, installer) {
                        var msg = new Mensagem("Para abrir esse documento você precisa instalar o visualizador de documentos, gostaria de baixar?");
                        msg.setTitulo("O Visualizador não está Instalado!");
                        msg.setTipo("confirma");
                        msg.setBotoes(["Sim", "Não"]);
                        msg.mostrar(function (res) {
                            if (res == 1) {
                                installer();
                            }
                        });
                    },
                    function (e) {
                        console.log('erro:');
                        console.log(e);
                        /*Erro*/ }
                );
            }
            else {
            }
        });
    },
    b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
    
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
    
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
    
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            var byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
        }
    
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    },
    Blob2Base64: function (blob, retorno) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result;
            retorno(base64data);
        }
    },
    geraB64: function (path, retorno) {
        app.getBlob(path, function (res) {
            app.Blob2Base64(res, function (resu) {
                retorno(resu);
            });
        });
    },
    geraHtmlByTemplate: function (templateUrl, variaveis, retorno, dadosTabelas) {
        if (templateUrl) {
            app.lerArquivo(templateUrl, function (res) {
                var texto = res;
                for (var key in variaveis) {
                    var reg = new RegExp("{{\\s*" + key + "\\s*}}", "g");
                    texto = texto.replace(reg, variaveis[key]);
                }

                if (dadosTabelas) {
                    if (dadosTabelas.thead) {
                        var reg = new RegExp("{{\\s*" + dadosTabelas.thead.var + "\\s*}}", "g");
                        if (reg.test(texto)) {
                            var topo = dadosTabelas.thead, theadData = "";
                            for (var i = 0; i < topo.dados.length; i++) {
                                var td = topo.dados[i];
                                theadData += "<td>" + td + "</td>";
                            }
                            texto = texto.replace(reg, theadData);
                        }
                    }
                    if (dadosTabelas.tbody) {
                        var reg = new RegExp("{{\\s*" + dadosTabelas.tbody.var + "\\s*}}", "g");
                        if (reg.test(texto)) {
                            var body = dadosTabelas.tbody, tbodyData = "";
                            for (var i = 0; i < body.dados.length; i++) {
                                var tr = body.dados[i];
                                tbodyData += "<tr>";
                                for (var j = 0; j < tr.length; j++) {
                                    var td = tr[j];
                                    tbodyData += "<td>" + td + "</td>";
                                }
                                tbodyData += "</tr>";
                            }
                            texto = texto.replace(reg, tbodyData);
                        }
                    }
                }

                var regOutrs = new RegExp("{{\\s*[a-zA-Z0-9_]+\\s*}}", "g");
                texto = texto.replace(regOutrs, "");

                retorno(texto);
            });
        }
        else {
            retorno(false);
        }
    },
    getBlob: function (path, retorno) {
        window.resolveLocalFileSystemURL(path, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    console.log("Successful file read: " + this.result);
                    displayFileData(fileEntry.fullPath + ": " + this.result);
                    var bl = new Blob([this.result], { type: getMimeType(path) });
                    retorno(bl);
                };
                reader.readAsArrayBuffer(file);
    
            }, function (e) { retorno({ error: ArquivoErros[e.code] }); console.log("fileEntry"); });
        }, function (e) { retorno({ error: ArquivoErros[e.code] }); console.log("resolveLocalFileSystemURL"); });
    },
    getMimeType: function (file) {
        var exts = {
            'aac': 'audio/aac', 'abw': 'application/x-abiword',
            'arc': 'application/octet-stream', 'avi': 'video/x-msvideo',
            'azw': 'application/vnd.amazon.ebook', 'bin': 'application/octet-stream',
            'bmp': 'image/bmp', 'bz': 'application/x-bzip', 'bz2': 'application/x-bzip2',
            'csh': 'application/x-csh', 'css': 'text/css', 'csv': 'text/csv',
            'doc': 'application/msword', 'eot': 'application/vnd.ms-fontobject',
            'epub': 'application/epub+zip', 'gif': 'image/gif', 'htm': 'text/html',
            'html': 'text/html', 'ico': 'image/x-icon', 'ics': 'text/calendar',
            'jar': 'application/java-archive', 'jpeg': 'image/jpeg', 'jpg': 'image/jpeg',
            'js': 'application/javascript', 'json': 'application/json', 'mid': 'audio/midi',
            'midi': 'audio/midi', 'mpeg': 'video/mpeg', 'mp2': 'audio/mpeg', 'mp3': 'audio/mpeg3',/* ... */
            'png': 'image/png', 'pdf': 'application/pdf', 'ppt': 'application/vnd.ms-powerpoint',
            'rar': 'application/x-rar-compressed', 'rtf': 'application/rtf',
            'sh': 'application/x-sh', 'svg': 'image/svg+xml', 'swf': 'application/x-shockwave-flash',
            'tar': 'application/x-tar', 'tif': 'image/tiff', 'tiff': 'image/tiff',/* ... */
            'xls': 'application/vnd.ms-excel', 'xlsx': 'application/vnd.ms-excel',
            'xml': 'application/xml', 'xul': 'application/vnd.mozilla.xul+xml', 'zip': 'application/zip',
            '3gp': 'video/3gpp', '3g2': 'video/3gpp2', '7z': 'application/x-7z-compressed'

        }, spl = file.split('.');
        var ext = spl[spl.length - 1];
        var mime = exts[ext];
        if (mime) {
            return mime;
        }
        else {
            return false;
        }
    },
    savebase64AsPDF: function (folderpath,filename,content,contentType, retorno){
        var DataBlob = app.b64toBlob(content,contentType);
        
        window.resolveLocalFileSystemURL(folderpath, function(dir) {
            dir.getFile(filename, {create:true}, function(file) {
                file.createWriter(function(fileWriter) {
                    fileWriter.write(DataBlob);
                    retorno(file.nativeURL);
                }, function(){
                    app.Erro({error:'Impossível salvar arquivo no diretório: ' + folderpath});
                });
            });
        });
    }
}, false);