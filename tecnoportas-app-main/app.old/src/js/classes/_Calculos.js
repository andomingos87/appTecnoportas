"use strict";
app = app.arrayPush(app, {
    N: function (num, dec, ponto) {
        var n = num, p = ponto;
        dec = dec ? dec : 0;
        if (n === null || n === false || n === undefined) { return false; }
        if (isNaN(n)) {
            n = n.replace(",", ".");
            if (isNaN(n)) { return false; }
        }
        var res = Number(n);
        if (dec > 0) { res = res.toFixed(dec); }
        else { res = res.toString(); }
        if (res.indexOf("-0") > -1) { res = res.replace("-", ""); }
        if (res.indexOf("e") > -1) { var ss = res.split("e"); res = ss[0]; }
        if (p) { res = res.replace(".", p); }
        else if (!isNaN(res)) { res = Number(res); }
        else { return false; }
        return res;
    },
    C: function (num1, operacao, num2, decimais) {
        var ND = decimais ? decimais : 0, OP = operacao ? operacao : "+", res;
        var N1 = app.N(num1), N2 = app.N(num2);
        switch (OP) {
            case "+": res = N1 + N2; break;
            case "-": res = N1 - N2; break;
            case "*": res = N1 * N2; break;
            case "/": res = N1 / N2; break;
        }
        return app.N(res, ND);
    },
    ZN: function (num, zeros) {
        if (!zeros || isNaN(zeros)) {
            zeros = 0;
        }
        var g0 = function (sub) {
            sub = sub ? sub : 0;
            var resu = "", zr = zeros - sub;
            for (var i = 0; i < zr; i++) {
                resu += "0";
            }
            return resu;
        }
        if (num < 10) {
            return g0() + num;
        }
        else if (num < 100) {
            return g0(1) + num;
        }
        else if (num < 1000) {
            return g0(2) + num;
        }
        return num;
    }
}, false);