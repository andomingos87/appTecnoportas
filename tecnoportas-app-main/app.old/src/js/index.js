"use strict";

var app = {
  /*Variáveis do App */
  nome: "Tecnoportas",
  corPadrao: "3F439C",
  Servidor: "http://apptecnoportas.com.br/",

  /*Padrões */
  classes: [
    /*Classes Padrão */
    "Api",
    "VarGlobal",
    "Loader",
    "Galeria",
    "Mensagem",
    "Orcamento",
    "Permissoes",
    "Gps",
    "Pdf",
    "CalcFormula"
  ],
  bibliotecas: [
    /*Bibliotecas Padrão */
    "Arquivos",
    "Calculos",
    "Dispositivo",
    "Elementos",
    "Gerais",
    "Objetos"
  ],
  scripts: [
    /*Scripts Padrão */
  ],

  /*Históricos */
  historico: [],
  _classes: [],
  _scripts: [],
  _bibliotecas: [],

  /*Variáveis Globais*/
  backButtonStatus: true,
  thisUser: false,
  ObjPullToRefresh: null,
  IdPullToRefresh: null,
  FuPullToRefresh: null,
  PullToRefreshStatus: null,

  /*Elementos Globais*/
  divApp: null,
  pageTitle: null,
  /*Eventos Iniciais*/
  inicializar: function () {
    document.addEventListener('deviceready', app.onDeviceReady.bind(app));

  },

  onDeviceReady: function () {
    var init = function () {
      Servidor = app.Servidor;

      app.receivedEvent('deviceready');
    };
    var addC = function () {
      if (app.classes.length) {
        app.addClasses(app.classes, function () {
          init();
        });
      }
      else {
        init();
      }
    };
    if (app.bibliotecas.length) {
      app.addBibliotecas(app.bibliotecas, function () {
        addC();
      });
    }
    else {
      addC();
    }
  },
  receivedEvent: function (id) {
    app.divApp = app.E("divApp");
    app.pageTitle = app.E("page_title");

    document.addEventListener("backbutton", app.onBackButtonClick);
    
    if (app.isPlatform("android")) {
      navigator.app.overrideButton("menubutton", true);
      document.addEventListener("menubutton", app.onMenuButtonClick, false);
    }

    cordova.getAppVersion.getVersionNumber(function (version) {
      console.log(version);
      var vg = new VarGlobal('version');
      var numver = version.replace(/[.,]/g, '');
      vg.salvarLocal(numver);
      document.querySelector('#ver-number>p').innerHTML = "Ver. " + version;
    });

    app.setPushKey();
    app.thisUser = app.isLogado();
    app.abrirPag("home");

  },

  setPushKey: function (){
    app.getPushKey(function (res, key) {
      if(key){
        var api = new Api('notificacoes/atualizaKey', { 'pushkey': key });
        api.send(function(res){
          if(!res.error){
            console.log("pushKey Atualizada");
          }
        })
      }
    });
  },

  _AoIniciar: function () {
    /*Bloqueia Drag Drop*/
    $('a, img').on('dragstart', function (event) { event.preventDefault(); });

    /*Remove Is Invalid*/
    $('input').on('blur', app.onInputBlur);
    $('select').on('blur', app.onInputBlur);
    $('input[type="radio"]').on('click', app.onInputBlur);
    $('input[type="checkbox"]').on('click', app.onInputBlur);
  },

  /*Funções */

  /*Inclusão */
  addBibliotecas: function (bibliotecas, onLoad) {
    var onLoad = typeof onLoad == "function" ? onLoad : function (status) { };

    if (typeof bibliotecas == "string") {
      bibliotecas = [bibliotecas];
    }

    var i = 0;
    var add = function () {
      if (i < bibliotecas.length) {
        var biblioteca = bibliotecas[i]; i++;

        if (app._bibliotecas.indexOf(biblioteca) == -1) {
          app.addScript("js/classes/_" + biblioteca + ".js", function () {
            app._bibliotecas.push(biblioteca);
            add();
          }, true);
        }
        else {
          add();
        }
      }
      else {
        onLoad(true);
      }
    };
    add();
  },
  addClasses: function (classes, onLoad) {
    var onLoad = typeof onLoad == "function" ? onLoad : function (status) { };

    if (typeof classes == "string") {
      classes = [classes];
    }

    var i = 0;
    var add = function () {
      if (i < classes.length) {
        var classe = classes[i]; i++;
        if (app._classes.indexOf(classe) == -1) {
          app.addScript("js/classes/" + classe + ".js", function () {
            app._classes.push(classe);
            add();
          }, true);
        }
        else {
          add();
        }
      }
      else {
        onLoad(true);
      }
    };
    add();
  },
  addScript: function (src, onLoad, isUnica) {
    isUnica = isUnica === true ? true : false;
    var onLoad = typeof onLoad == "function" ? onLoad : function (status) { },
      add = function () {
        app.isFile(src, function (res) {
          if (res) {
            $.getScript(src, function () {
              app._scripts.push(src);
              onLoad(true);
            });
          }
          else {
            onLoad(false);
            console.log("Script " + src + " não encontrado!");
          }
        });
      };
    if (!isUnica || app._scripts.indexOf(src) == -1) {
      add();
    }
    else {
      onLoad(false);
    }
  },

  /*Páginas*/
  remPagFiles: function (pagData) {
    var pd = pagData;

    if (typeof pd.pullToRefresh == "object") {
      removePullToRefresh();
    }
  },
  abrirPost: function (id, dds) {
    console.log("Abrir Post");
    console.log(dds);
    var pData = dds,
        destDdds = null,
        destid = 0;


    var ap = function (dds) {
        if (dds.tipo == "p" || dds.tipo == "n") {
            if (dds.id != destid){
                app.abrirPag("post", [dds]);
            }
            else{
                app.abrirPag("cemanos", [dds]);
            }
        }
        else if (dds.tipo == "t") {
            if (dds.layout == "0"){
                app.abrirPag("dicas", [dds], false, true, {
                    id: "listaDicas",
                    function: "getPosts",
                    args: [dds.id]
                });
            }else if (dds.layout == "1") {
                console.log("licatalogos");
               app.abrirPag("licatalogos", [dds], false, true, {
                   id: "lista-catalogos",
                   function: "getPosts",
                    args: [dds.id]
                });
            }
        }

         

        else if (dds.tipo == "f") {
            if (app.isPlatform("browser")) {
                var ref = cordova.InAppBrowser.open(Servidor + "files?name=" + dds.arquivo, "_system");
            }
            else {
                Loader.mostrar();
                var api = new Api("files?name=" + dds.arquivo, null, false);
                api.download(function (res) {
                    if (!res.error) {
                        cordova.plugins.fileOpener2.open(
                            res, app.getMimeType(res), {
                                success: function () {
                                    Loader.remover();
                                },
                                error: function () {
                                    Loader.remover();
                                    var msg = new Mensagem("Erro desconhecido ao abrir " + dds.nome, true);
                                }
                            }
                        );
                    }
                    else {
                        app.Erro(res);
                    }
                });
            }
        }
    };
    if (!pData) {
        if (id != destid){
            app.getData("posts?id=" + id, function (res){
                if (res.length){
                    ap(res[0]);
                }
                else{
                    var msg = new Mensagem("O Post não foi encontrado!", true);
                }
            });
        }
        else{
            ap(destDdds);
        }
    }
    else {
        ap(pData);
    }
  },
  abrirPag: function (pag, args, onLoad, addHeader, pullToRefresh, statusBar) {
    console.log('teste');
    app.checaLogin(true);
    var onLoad = typeof onLoad == "function" ? onLoad : function (status) { };
    app.addClasses("Loader", function () {
      Loader.mostrar(false);

      var erro = function (mot) {
        Loader.remover(false);
      }, pf = {
        js: "js/pages/" + pag + ".js",
        html: "pages/" + pag + ".html"
      },
        hf = false,
        tHeader = typeof addHeader == "string" ? addHeader : "header";

      if (addHeader !== false) {
        hf = {
          js: "js/" + tHeader + ".js",
          html: tHeader + ".html"
        };
      }

      var includeScripts = function () {
        var init = function () {
          var pagData = {
            "id": pag,
            "args": args,
            "addHeader": addHeader,
            "pullToRefresh": pullToRefresh,
            "statusBar": statusBar
          };

          app.historico.push(pagData);

          if (!statusBar) {
            statusBar = { cor: app.corPadrao, overlay: false };
          }
          app.statusBar(statusBar.cor, statusBar.overlay);

          app._AoIniciar();
          app.animateCSS(app.divApp, "fadeInRight", function () {
            if (typeof onLoad == "function") {
              onLoad(true);
            }
            Loader.remover(false);
          }, "faster");
        };
        var fin = function () {
          if (typeof pullToRefresh == "object") {
            app.addPullToRefresh(pullToRefresh.id, function () {
              var tArgs = "";
              if (pullToRefresh.args) {
                for (var i = 0; i < pullToRefresh.args.length; i++) {
                  tArgs += "pullToRefresh.args[" + i + "]";
                  if (pullToRefresh.args[i + 1]) {
                    tArgs += ", ";
                  }
                }
              }
              eval(pag + "." + pullToRefresh.function + "(" + tArgs + ");");
            });
            init();
          }
          else {
            init();
          }
        };
        var addPs = function () {
          app.addScript(pf.js, function () {
            var tArgs = "";
            if (args) {
              for (var i = 0; i < args.length; i++) {
                tArgs += "args[" + i + "]";
                if (args[i + 1]) {
                  tArgs += ", ";
                }
              }
            }
            eval(pag + ".inicializar(" + tArgs + ");");
            fin();
          });
        };
        var addHs = function () {
          if (hf !== false) {
            app.addScript(hf.js, function () {
              eval(tHeader + ".inicializar(pag);");
              addPs();
            });
          } else {
            addPs();
          }
        };
        if (app.scripts.length > 0) {
          var s = app.scripts,
            i = 0;
          var ads = function (c) {
            if (c < s.length) {
              app.addScript(s[c], function () {
                ads(++i);
              });
            } else {
              addHs();
            }
          };
          ads(i);
        } else {
          addHs();
        }
      };
      var addIc = function () {
        app.includeHTML(function (res) {
          if (Object.keys(res).length > 0) {
            var i = 0,
              ks = Object.keys(res);
            var len = ks.length;
            var ads = function (c) {
              if (c < len) {
                var nm = ks[c].split("/");
                nm = nm[nm.length - 1];
                app.addScript("js/" + ks[c] + ".js", function () {
                  eval(nm + ".inicializar();");
                  ads(++i);
                });
              } else {
                includeScripts();
              }
            };
            ads(i);
          } else {
            includeScripts();
          }
        });
      };
      var includePag = function () {
        app.includeHTML(function (res) {
          if (!res.error) {
            addIc();
          } else {
            erro("Erro ao incluir a Página");
          }
        }, app.divApp, pf.html);
      };
      var includeHeader = function () {
        app.isFile(hf.html, function (res) {
          if (res) {
            app.includeHTML(function (res) {
              if (!res.error) {
                includePag();
              } else {
                erro("Erro ao incluir o Header!");
              }
            }, app.divApp, hf.html);
          } else {
            erro("Header não encontrado!");
          }
        });
      };
      var remPagAntFiles = function () {
        var le = app.historico.length;
        if (le > 0) {
          var pd = app.historico[le - 1];

          app.remPagFiles(pd);
        }
      };
      app.isFile(pf.html, function (res) {
        if (res) {
          app.animateCSS(app.divApp, "fadeInRight", function () {
            // app.divApp.style.opacity = "0";
            remPagAntFiles();
            app.divApp.innerHTML = "";
            if (hf !== false) {
              includeHeader();
            } else {
              includePag();
            }
          }, "faster");
        } else {
          erro("Página não encontrada!");
        }
      });
    });
  },
  voltarPag: function (retorno) {
    var le = app.historico.length;
    if (le > 1) {
      var pagAnt = app.historico[le - 2];
      var orcamento9 = false;
      if(pagAnt.id == "orcamento9"){
        //app.abrirPag("home", undefined, undefined, undefined, undefined, undefined);
        orcamento9 = true;
        pagAnt.id = "home";
        pagAnt.args = undefined;
      }

      app.abrirPag(pagAnt.id, pagAnt.args, function () {
        if(orcamento9){
          var aux = le - (le - 1);
          app.historico.splice(le - aux, aux);
          app.setThisPagIni();  
        }else{
          app.historico.splice(le - 2, 2);
        }
        if (typeof retorno == "function") {
          retorno(true);
        }
      }, pagAnt.addHeader, pagAnt.pullToRefresh, pagAnt.statusBar);
      return true;
    }
    else if (typeof retorno == "function") {
      retorno(false);
    }
    return false;
  },
  thisPage: function () {
    var l = app.historico.length;
    return app.historico[l - 1];
  },
  setThisPagIni: function () {
    var u = app.historico.length;
    var pg = app.historico[u - 1];
    app.historico = [pg];
  },

  /* Básico */
  statusBar: function (cor, overlay) {
    overlay = overlay === true ? true : false;
    cor = typeof cor == "string" ? cor : app.corPadrao;
    if (app.isPlatform('android')) {
      StatusBar.overlaysWebView(overlay);
      StatusBar.backgroundColorByHexString(cor);
    }
  },
  arrayPush: function (array1, array2, is_array) {
    if (typeof array1 == "object" && typeof array1 == typeof array2) {
      is_array = is_array === false ? false : true;
      var array = is_array ? [] : {};
      for (var key in array1) {
        if (is_array) {
          array.push(array1[key]);
        }
        else {
          array[key] = array1[key];
        }
      }
      for (var key2 in array2) {
        if (is_array) {
          array.push(array2[key2]);
        }
        else {
          array[key2] = array2[key2];
        }
      }
      return array;
    }
    return false;
  },
  fechar: function () {
    if (app.isPlatform("windows")) {
      window.close();
    }
    else if (app.isPlatform("android")) {
      navigator.app.exitApp();
    }
    else {
      console.log("Não é possível fechar");
    }
  },
  getUrlParameter: function (nome, link) {
    var res = null, tmp = [], url = location.href;
    if (link) { url = link; }
    url.substr(url.indexOf("?") + 1).split("&").forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === nome) { res = decodeURIComponent(tmp[1]); }
    });
    return res;
  },

  /*PullToRefresh */
  addPullToRefresh: function (id, func) {
    if (!app.PullToRefreshStatus) {
      app.addScript("js/pulltorefresh.min.js", function () {
        app.IdPullToRefresh = id;
        app.FuPullToRefresh = func;
        app.ObjPullToRefresh = PullToRefresh.init({
          mainElement: '#' + app.IdPullToRefresh,
          onRefresh: function () {
            app.FuPullToRefresh();
          },
          distThreshold: 50,
          instructionsPullToRefresh: "Puxe para Atualizar",
          instructionsReleaseToRefresh: "Solte para Atualizar",
          instructionsRefreshing: "Atualizando"
        });
        app.PullToRefreshStatus = true;
      }, true);
    }
  },
  removePullToRefresh: function () {
    if (app.PullToRefreshStatus) {
      app.ObjPullToRefresh.destroy();
      app.PullToRefreshStatus = false;
    }
  },

  /*Api */
  getImgFromApi: function (url, retorno) {
    if (url) {
      var sUrl = "files?name=" + url;

      if (url.indexOf("http") === 0) {
        sUrl = url;
      }

      var api = new Api(sUrl, null, false);
      api.download(function (res) {
        if (res.error) {
          retorno("./img/sem-img.jpg", 0);
          console.log(res);
        }
        else {
          retorno(res, 1);
        }
      });
    }
    else {
      retorno("img/sem-img.jpg", 0);
    }
  },

  /*Arquivos */
  includeHTML: function (retorno, elemento, url) {
    var z = [], i = 0, arrayArquivos = {};
    if (!elemento) {
      z = document.body.getElementsByTagName("*");
    }
    else {
      z.push(elemento);
    }
    var len = z.length;
    var varrerTags = function (elmnt) {
      if (i < len) {
        var file = url ? url : elmnt.getAttribute("include-html");
        if (file) {
          var fNome = file.split(".")[0];
          if (!arrayArquivos[fNome] || arrayArquivos[fNome].pai != elmnt) {
            arrayArquivos[fNome] = {
              arquivo: file,
              pai: elmnt
            };

            app.lerArquivo(file, function (res) {
              if (!res.error) {
                elmnt.innerHTML = (elemento ? elmnt.innerHTML : "") + res;
                i++;
                varrerTags(z[i]);
              }
              else {
                retorno(res);
              }
            });
            if (!elemento) {
              elmnt.removeAttribute("include-html");
            }
          }
          else {
            i++;
            varrerTags(z[i]);
          }
        }
        else {
          i++;
          varrerTags(z[i]);
        }
      }
      else {
        retorno(arrayArquivos);
      }
    };
    varrerTags(z[i]);
  },
  lerArquivo: function (arquivo, retorno, tipo) {
    tipo = tipo ? tipo : "text";
    if (arquivo) {
      app.isFile(arquivo, function (res) {
        if (res) {
          $.ajax({
            url: arquivo, dataType: tipo, success: function (result) {
              var res = result;
              retorno(res);
            }
          });
        }
        else {
          retorno({
            "error": "arquivo não encontrado!"
          });
        }
      });
    }
    else {
      retorno({
        "error": "nenhum dado recebido!"
      });
    }
  },

  /*Outros */
  Erro: function (dados, msgBts, retorno) {
    var erro = dados.error;
    var msg = new Mensagem();
    msg.setTitulo("Algo deu errado!");
    if (erro == 'net') {
      msg.setTexto('Você precisa estar conectado à internet para continuar.');
    }
    else {
      msg.setTexto(erro);
    }
    if (msgBts) {
      if (msgBts.length > 1) {
        msg.setTipo('confirma');
      }
      msg.setBotoes(msgBts);
    }
    msg.mostrar(retorno);
  },
  isFile: function (path, retorno) {
    window.resolveLocalFileSystemURL(path, function () {
      retorno(true);
    }, function (e) {
      $.ajax({
        type: 'HEAD',
        url: path,
        success: function () {
          retorno(true);
        },
        error: function () {
          retorno(false);
        }
      });
    });
  },
  cleanLocalData: function (keys) {
    for (var i = 0; i < keys.length; i++) {
      var vg = new VarGlobal(keys[i]);
      vg.salvarLocal(null);
    }
    return true;
  },
  isLogado: function () {
    var vg = new VarGlobal('thisUser');
    if (vg.obterLocal()) {
      return JSON.parse(vg.obterLocal());
    }
    else {
      return false;
    }
  },
  checaLogin: function (retorno) {
    console.log("checaLogin!");
    if(app.thisUser){
      console.log(app.thisUser);
      if (app.IsConectado()) {
        Loader.mostrar();
        var api = new Api('login', { 'username': app.thisUser[0].username, 'senha': app.thisUser[0].senha, 'nivel': 0 }, false);
        api.send(function (res) {
          if (res.error) {
            app.logout();
          }
          else {
            var dds = res;
            dds[0].senha = app.thisUser[0].senha;
            app.setLogin(dds, function (id,old,bloqueado) {
              if(bloqueado && !retorno){
                var msg = new Mensagem("Detectamos que o seu usuário não foi autenticado neste aparelho, por favor entre em contato com os administradores para solicitar a liberação do dispositivo",true);
                app.checaLogin(true);
              }else if(bloqueado && retorno){
                app.abrirPag("home");
              }
              Loader.remover();
            });
          }
        });
      }
    }
  },
  setLogin: function (data, retorno) {
    var jsonLogin = data;
    var aparelhoData = {
      'modelo': device.model,
      'plataforma': device.platform,
      'uuid': device.uuid,
      'versao': device.version,
      'fabricante': device.manufacturer,
      'is_virtual': device.isVirtual,
      'serial': device.serial
    };

    var api = new Api('login/aparelho', { 'userid': jsonLogin[0].id, 'aparelho': JSON.stringify(aparelhoData) }, false);
    api.send(function (res) {
      if (res.error) { app.Erro(res); }
      else {
          var vg = new VarGlobal('thisUser');
          if (!jsonLogin[0].aparelho_id) {
            jsonLogin[0].aparelho_id = res.id;
          }
          vg.salvarLocal(JSON.stringify(jsonLogin));
          app.thisUser = jsonLogin;

          app.getPushKey(function(res, key){
            var apiPush = new Api('notificacoes/atualizaKey', { 'userId': jsonLogin[0].id, 'pushkey': key }, false);
            apiPush.send(function(res){
              if(!res.error){
                console.log("Pushkey Atualizada com sucesso");
              }
            });
          })

          if(res.bloqueado){
            var msg = new Mensagem("Detectamos que o seu usuário não foi autenticado neste aparelho, por favor entre em contato com os administradores para solicitar a liberação do dispositivo", true);
          }

          if (retorno) {
            retorno(res.id, res.old, res.bloqueado);
          }
        
      }
    });


  },
  logout: function () {
    var vg = new VarGlobal('thisUser');
    vg.salvarLocal(null);
    location.href = "index.html";
  },

  /*Eventos Globais */
  onMenuButtonClick: function () {

  },
  onBackButtonClick: function () {
    if (app.backButtonStatus) {
      app.backButtonStatus = false;
      var vt = function () {
        app.voltarPag(function (res) {
          if (!res) {
            var msg = new Mensagem("Deseja mesmo sair de " + app.nome + "?");
            msg.setTipo("confirma");
            msg.setTitulo("Sair...");
            msg.setBotoes(["Sim", "Não"]);
            msg.mostrar(function (res) {
              if (res == 1) {
                app.fechar();
              }
            });
          }
          app.backButtonStatus = true;
        });
      }
      vt();
    }
  },
  onInputBlur: function () {
    if (this) {
      if ($(this).hasClass('is-invalid')) {
        $(this).removeClass('is-invalid');
      }
      else if ($(this.parentNode).hasClass('is-invalid')) {
        $(this.parentNode).removeClass('is-invalid');
      }
      else if ($(this.parentNode.parentNode).hasClass('is-invalid')) {
        $(this.parentNode.parentNode).removeClass('is-invalid');
      }
    }
  },
  swipedetect: function (el, callback) {
    var touchsurface = el,
      swipedir, dist, startX, startY, distX, distY,
      threshold = 100, //required min distance traveled to be considered swipe
      restraint = 100, // maximum distance allowed at the same time in perpendicular direction
      allowedTime = 300, // maximum time allowed to travel that distance
      elapsedTime, startTime, handleswipe = callback || function (swipedir) { };
    touchsurface.addEventListener('touchstart', function (e) {
      var touchobj = e.changedTouches[0];
      swipedir = 'none';
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();// record time when finger first makes contact with surface
    }, false);
    touchsurface.addEventListener('touchend', function (e) {
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) { // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
          swipedir = (distX < 0) ? 'e' : 'd'; // if dist traveled is negative, it indicates left swipe
        }
        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
          swipedir = (distY < 0) ? 'c' : 'b'; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
    }, false);
  },
  /* Animations */
  animateCSS: function (element, animationName, callback, speed) {
    var node = element;
    if (typeof element == "string") {
      node = document.querySelector(element);
    }
    node.classList.add('animated', animationName, speed);

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName, speed);
      node.removeEventListener('animationend', handleAnimationEnd);

      if (typeof callback === 'function') { callback(); }
    }
    node.addEventListener('animationend', handleAnimationEnd);
  },
  GPS: function (is_msgs) {
    var self = this,
      obj = navigator.geolocation;

    is_msgs = is_msgs === false ? false : true;

    /*Variáveis Internas*/
    var err = function (mot) {
      if (is_msgs) {
        var msg = new Mensagem("Não foi possível obter sua localização atual!", true);
      }
      console.log(mot);
    };
    /*Funções externas*/
    self.getPermissao = function (retorno) {
      app.getPermissoes(["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"], function (res) {
        if (!res.status) {
          err("Sem Permissão");
        }
        else {
          if (typeof retorno == "function") {
            retorno();
          }
        }
      });
    };
    self.getLocal = function (retorno) {
      var gl = function () {
        obj.getCurrentPosition(retorno, err);
      };
      self.getPermissao(gl);
    };
  },
  getPermissoes: function (arrayPerms, retorno) {
    var perms = {}, status = true;
    if (app.isPlatform("android")) {
      for (var i = 0; i < arrayPerms.length; i++) {
        var per = arrayPerms[i];
        cordova.plugins.permissions.checkPermission(cordova.plugins.permissions[per], function (res) {
          if (!res.hasPermission) {
            perms[per] = false;
          }
          else {
            perms[per] = true;
          }
        });
      }
      var i = 0;
      var getPerm = function (num) {
        var pp = function () {
          i++;
          if (i < arrayPerms.length) {
            getPerm(i);
          }
          else {
            retorno({ "status": status, "perms": perms });
          }
        };
        var per = arrayPerms[num];
        if (!perms[per]) {
          cordova.plugins.permissions.requestPermission(cordova.plugins.permissions[per], function (res) {
            if (!res.hasPermission) {
              perms[per] = { "error": { "code": 0, "message": "Erro desconhecido!" } };
              status = false;
            }
            else {
              perms[per] = true;
            }
            pp();
          }, function () {
            perms[per] = { "error": { "code": 1, "message": "Permissão não concedida!" } };
            status = false;
            pp();
          });
        }
        else {
          pp();
        }
      };
      getPerm(i);
    }
    else {
      retorno({ "status": status, "perms": perms });
    }
  },

  securityCheck: function(){
    if(app.thisUser){
      if(app.thisUser[0].is_aprovado != "1"){
        var msg = new Mensagem("Acesso não autorizado!!", true);
        app.abrirPag("home");
      }
    }else{
      var msg = new Mensagem("Acesso não autorizado!!", true);
      app.abrirPag("home");
    }
    
  },

  getPushPermissao: function() {
    if (app.isPlatform("browser")) {
        window.FirebasePlugin.hasPermission(function (data) {
            if (data.isEnabled) {
                console.log("Push Permission already granted");
            }
            else {
                window.FirebasePlugin.grantPermission(function () {
                    console.log("Push Permission granted", data.isEnabled);
                }, function (error) {
                    console.error("unable to grant Push permission", error);
                });
            }
        }, function (error) {
            console.log("Push hasPermission failed", error);
        });

        window.FirebasePlugin.getToken(function (token) {
            console.log('Firebase Push Token from cordova: ' + token);
        }, function (error) {
            console.error("unable to create Push token", error);
        });
    }
  },

  getPushKey: function (fim) {
    if (!app.isPlatform("browser")) {
        var ttoken = 0;
        app.getPushKeyReal(function (key) {
            if (typeof key == "string") {
                fim(true, key);
            }
            else if (key.error == "net") {
                Erro(key);
                fim(false, null);
            }
            else if (key.error == "Token nulo" && ttoken < 3) {
                ttoken++;
                app.getPushKey(fim);
            }
            else {
                var msg = new Mensagem('O que isso significa?\nVocê não receberá notificações de push quando novos posts forem adicionados, porem ainda poderá visualiza-los ao acessar o app.');
                msg.setTitulo('Não foi possível obter sua chave de notificação!');
                msg.setTipo('confirma');
                msg.setBotoes(['Tentar Novamente', 'Continuar']);
                msg.mostrar(function (bt) {
                    if (bt == 1) {
                        app.getPushKey(fim);
                    }
                    else {
                        fim(true, null);
                    }
                });
            }
        });
    }
    else {
        fim(true, null);
    }
  },

  getPushKeyReal: function(fim) {
    if (app.IsConectado()) {
        window.FirebasePlugin.getToken(function (token) {
            if (token) {
                fim(token);
            }
            else {
                fim({ 'error': 'Token nulo' });
            }
        }, function (error) { fim({ 'error': 'Erro no plugin' }); });
    }
    else {
        fim({ 'error': 'net' });
    }
  }

};
$(document).ready(app.inicializar);