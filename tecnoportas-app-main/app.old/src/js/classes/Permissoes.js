"use strict";
function getPermissoes(arrayPerms, retorno) {
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
};