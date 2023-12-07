"use strict";
var Servidor = "",
    thisUser = app.thisUser,
    getUrlParameter = app.getUrlParameter;
function Api(url, dados, isLoader, cache) {
    var self = this, IsLoader = true, vgCache;
    /*Variáveis Públicas*/
    self.url = url;
    self.sUrl = Servidor + self.url;

    if (self.url.indexOf("http") === 0){
        self.sUrl = self.url;
    }

    self.dados = dados ? dados : {};
    self.isTemporario = true;
    self.cacheHash = null;

    self.dados.retorno = 'json';
    if (thisUser) {
        self.dados.serralheiro_id = thisUser[0].pessoa_id;
    }
    self.cacheHash = app.MD5(self.sUrl + JSON.stringify(self.dados));
    vgCache = new VarGlobal(self.cacheHash);

    if (isLoader === false) {
        IsLoader = false;
    }
    /*Funções Internas*/
    var criaArquivo = function (nome, retorno, falha) {
        var tipos = [window.TEMPORARY, window.PERSISTENT], tipo = 0;
        var flEr = function (cod) { falha(ArquivoErros[cod.code]); console.log(cod); };
        if (self.isTemporario == false) { tipo = 1; }
        window.requestFileSystem(tipos[tipo], 5 * 1024 * 1024, function (fs) {
            fs.root.getFile(nome, { create: true, exclusive: false }, retorno, flEr);
        }, flEr);
    };
    /*Funções Externas*/
    self.send = function (retorno) {
        var isInCache = false;
        isInCache = vgCache.obterVar();
        if (!cache && isInCache) {
            vgCache.salvarVar(null);
            isInCache = false;
        }
        if (!isInCache) {
            if (app.IsConectado()) {
                if (IsLoader) {
                    Loader.mostrar();
                }
                var abortou = false;
                var ajaxObj = $.ajax({
                    cache: false,
                    method: "POST",
                    url: self.sUrl,
                    data: self.dados,
                    dataType: "json",
                    success: function (res) {
                        vgCache.salvarVar(JSON.stringify(res));
                        retorno(res);
                        if (IsLoader) {
                            Loader.remover();
                        }
                    },
                    error: function (Xhr, Exception) {
                        if (!abortou) {
                            var msg = lib.AjaxErros[Xhr.status];
                            if (!msg) { msg = lib.AjaxErros[Exception]; }
                            if (!msg) { msg = Xhr.responseText; }
                            retorno({ 'error': msg + "Motivo " + Xhr.responseText });
                        }
                        if (IsLoader) {
                            Loader.remover();
                        }
                    }
                });
                if (IsLoader) {
                    Loader.onCancelar(function () {
                        abortou = true;
                        ajaxObj.abort();
                    });
                }
            }
            else {
                retorno({ 'error': 'net' });
            }
        }
        else {
            console.log(self.url + " obtido Pelo Cache");
            isInCache = JSON.parse(isInCache);
            retorno(isInCache);
        }
    };
    self.download = function (retorno, loader) {
        var nomeArquivo = getUrlParameter('name', self.url),
            vg = new VarGlobal(self.url),
            baixar = function () {
                if (app.IsConectado()) {
                    var ReAjax = new XMLHttpRequest();
                    ReAjax.responseType = "blob";
                    ReAjax.onprogress = function (pe) {
                        if (pe.lengthComputable && loader) {
                            loader.value = (pe.loaded / pe.total);
                        }
                    };
                    ReAjax.onerror = function (error) {
                        retorno({ 'error': error.message });
                        console.log(error.message);
                    };
                    ReAjax.onabort = function () {
                        retorno({ 'error': 'Download Abortado' });
                        console.log("Download abortado");
                    };
                    ReAjax.onload = function (r) {
                        criaArquivo(nomeArquivo, function (file) {
                            var obj = r.srcElement.response;
                            var fullPath = file.nativeURL;
                            if (fullPath) {
                                file.createWriter(function (fileWriter) {
                                    var written = 0;
                                    var BLOCK_SIZE = 1 * 1024 * 1024;
                                    var filesize = obj.size;
                                    fileWriter.onwrite = function (evt) {
                                        if (written < filesize) {
                                            fileWriter.doWrite();
                                        } else {
                                            vg.salvarLocal(fullPath);
                                            retorno(fullPath);
                                        }
                                    };
                                    fileWriter.doWrite = function () {
                                        var sz = Math.min(BLOCK_SIZE, filesize - written);
                                        var sub = obj.slice(written, written + sz);
                                        written += sz;
                                        fileWriter.write(sub);
                                    };
                                    fileWriter.doWrite();
                                });
                            }
                            else {
                                retorno(self.sUrl);
                            }
                        }, function (erro) { retorno({ 'error': erro }); console.log(erro); });
                    };
                    ReAjax.open("POST", self.sUrl, true);
                    ReAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    ReAjax.send('retorno=json');
                }
                else {
                    retorno({ 'error': 'net' });
                }
            };
        if (vg.obterLocal()) {
            app.isFile(vg.obterLocal(), function (res) {
                if (res) {
                    retorno(vg.obterLocal());
                }
                else {
                    baixar();
                }
            });
        }
        else {
            baixar();
        }
    };
};