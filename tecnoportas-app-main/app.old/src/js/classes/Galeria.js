"use strict";
function Galeria(tipoArquivo, tipoRetorno, qualidade) {
    var self = this,
        priv = {},
        pc = navigator.camera,
        Erro = null,
        vidExts = ["mp4", "m4v", "m4a", "mov"];
    /*Variáveis Privadas*/
    priv.tipoArquivo = pc.MediaType.ALLMEDIA; /*2 */
    priv.tipoRetorno = pc.DestinationType.DATA_URL; /*0 */
    priv.imgExtencao = pc.EncodingType.JPEG;
    priv.imgExtTexto = "jpg";
    priv.vidExtencao = VideoEditorOptions.OutputFileType.MPEG4;

    /*Variáveis Públicas*/
    self.qualidade = qualidade ? qualidade : 80;
    self.editar = false;
    self.girar = true;
    self.larguraVideo = 1280;
    self.alturaVideo = 720;
    self.videoBitrate = 1000000;
    self.videoFp2 = 24;
    self.alturaThumb = 320;
    self.larguraThumb = 480;

    if (tipoArquivo) {
        switch (tipoArquivo.toLowerCase()) {
            case "foto":
            case "imagem":
            case "img": priv.tipoArquivo = pc.MediaType.PICTURE; /*0 */
                break;
            case "video":
            case "vid": priv.tipoArquivo = pc.MediaType.VIDEO; /*1 */
                break;
        }
    }
    if (tipoRetorno) {
        switch (tipoRetorno.toLowerCase()) {
            case "file_url":
            case "file_uri":
            case "path":
            case "url": priv.tipoRetorno = pc.DestinationType.FILE_URI; /*1 */
                break;
            case "native_url":
            case "native_uri":
            case "path_nativo":
            case "url_nativa": priv.tipoRetorno = pc.DestinationType.NATIVE_URI; /*2 */
                break;
        }
    }

    /*Funções Internas*/
    var getFl = function (tipoBusca, retorno) {
        if (Erro != null) {
            retorno(Erro);
        }
        else {
            var options = {
                quality: self.qualidade,
                mediaType: priv.tipoArquivo,
                destinationType: priv.tipoRetorno,
                allowEdit: self.editar,
                sourceType: tipoBusca,
                encodingType: priv.imgExtencao,
                correctOrientation: self.girar
            };
            pc.getPicture(function (res) {
                retorno(res, tipoBusca);
            }, function (err) {
                retorno({ "error": err });
            }, options);
        }
    };
    var geraB64 = function (path, retorno) {
        getBlob(path, function (res) {
            Blob2Base64(res, function (resu) {
                retorno(resu);
            });
        });
    };
    var pFile = function (path) {
        if (app.isPlatform("android") && path.indexOf("file://") == -1) {
            return "file://" + path;
        } else if (path.indexOf("file:///private") == -1) {
            return "file:///private" + path;
        }
        return path;
    };
    var tratarArquivo = function (file, tipoBusca, retorno) {
        if (!file["error"]) {
            var ext = file.split(".");
            ext = ext[ext.length - 1].toLowerCase();

            if (priv.tipoRetorno == 0) {
                if (priv.tipoArquivo == 0) {
                    var resu = "data:" + app.getMimeType(priv.imgExtTexto) + ";base64," + file;
                    retorno(resu);
                }
                else {
                    if (priv.tipoArquivo == 1 || vidExts.indexOf(ext) > -1) {
                        file = pFile(file);
                        var nome = file.split("/");
                        nome = nome[nome.length - 1];
                        var vidOpt = {
                            fileUri: file,
                            outputFileName: "ed" + nome,
                            outputFileType: priv.vidExtencao,
                            optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                            saveToLibrary: false,
                            maintainAspectRatio: true,
                            width: self.larguraVideo,
                            height: self.alturaVideo,
                            videoBitrate: self.videoBitrate,
                            fps: self.videoFp2,
                            progress: function (info) { }
                        };

                        VideoEditor.transcodeVideo(function (resVid) {
                            resVid = pFile(resVid);
                            var thbOpt = {
                                fileUri: resVid,
                                outputFileName: "tb" + nome,
                                width: self.alturaThumb,
                                height: self.larguraThumb,
                                quality: self.qualidade
                            };
                            VideoEditor.createThumbnail(function (resThumb) {
                                resThumb = pFile(resThumb);
                                geraB64(resThumb, function (resThumb2) {
                                    geraB64(resVid, function (resVid2) {
                                        var resu = [resVid2, resThumb2];
                                        retorno(resu);
                                    });
                                });
                            }, function (err) {
                                console.log("Erro ao obter a Thumb do vídeo " + err);
                                retorno(resVid);
                            }, thbOpt)

                        }, function (err) {
                            retorno({ "error": err });
                        }, vidOpt);
                    }
                    else {
                        if (tipoBusca == 0 && app.isPlatform("android")) {
                            file = pFile(file);
                            geraB64(file, retorno);
                        }
                        else {
                            var resu = "data:" + app.getMimeType(priv.imgExtTexto) + ";base64," + file;
                            retorno(resu);
                        }
                    }
                }
            }
            else {
                retorno(file);
            }
        }
        else {
            retorno(file);
        }
    };

    /*Funções Externas*/
    self.setImgExtencao = function (ext) {
        switch (ext.toLowerCase()) {
            case "png": priv.imgExtencao = pc.EncodingType.PNG;
                break;
            case "jpg":
            case "jpeg": priv.imgExtencao = pc.EncodingType.JPEG;
                break;
            default: Erro = { "error": "Extenção " + ext + " não reconhecida!" };
                break;
        }
        priv.imgExtTexto = ext.toLowerCase();
    };
    self.setOptions = function (obj) {
        for (var key in obj) {
            self[key] = obj[key];
        }
        return true;
    };
    self.abrirGaleria = function (retorno) {
        getFl(pc.PictureSourceType.PHOTOLIBRARY, function (res, tipoB) {
            tratarArquivo(res, tipoB, retorno);
        });
    };
    self.tirarFoto = function (retorno) {
        getFl(pc.PictureSourceType.CAMERA, function (res, tipoB) {
            tratarArquivo(res, tipoB, retorno);
        });
    };
};