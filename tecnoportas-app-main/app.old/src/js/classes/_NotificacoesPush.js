"use strict";
app = app.arrayPush(app, {
    getPushKey: function (fim) {
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
}, false);