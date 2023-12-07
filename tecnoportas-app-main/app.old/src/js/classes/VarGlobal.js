"use strict";
function VarGlobal(chave) {
    var self = this, Chave = chave;
    /*Funções externas*/
    self.setChave = function (valor) { Chave = valor; };
    self.getChave = function () { return Chave; };
    self.obterSessao = function () {
        return window.sessionStorage.getItem(Chave);
    };
    self.obterLocal = function () {
        return window.localStorage.getItem(Chave);
    };
    self.obterVar = function (todas) {
        var vg = new VarGlobal("$varGlobalVar");
        var dds = vg.obterSessao();
        if (dds) {
            dds = JSON.parse(dds);
        }
        else {
            dds = {};
            vg.salvarSessao(JSON.stringify(dds));
        }
        if (todas) {
            return dds;
        }
        return dds[Chave] ? dds[Chave] : null;
    };
    self.salvarSessao = function (valor) {
        if (valor) {
            window.sessionStorage.setItem(Chave, valor);
        }
        else {
            window.sessionStorage.removeItem(Chave);
        }
        return valor;
    };
    self.salvarLocal = function (valor) {
        if (valor) {
            window.localStorage.setItem(Chave, valor);
        }
        else {
            window.localStorage.removeItem(Chave);
        }
        return valor;
    };
    self.salvarVar = function (valor) {
        var vg = new VarGlobal("$varGlobalVar");
        var dds = vg.obterVar(true);
        if (valor) {
            dds[Chave] = valor;
        }
        else {
            delete dds[Chave];
        }
        vg.salvarSessao(JSON.stringify(dds));
        return valor;
    }
};