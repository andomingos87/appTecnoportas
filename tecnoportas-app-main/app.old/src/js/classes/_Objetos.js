"use strict";
app = app.arrayPush(app, {
    arrayRowsToCols: function (data) {
        var arrayResu = {};
    
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if (!arrayResu[key]) {
                    arrayResu[key] = [];
                }
                if (arrayResu[key].indexOf(data[i][key]) <= -1) {
                    arrayResu[key].push(data[i][key]);
                }
            }
        }
        return arrayResu;
    },
    clone: function (obj) {
        return $.extend(true, {}, obj);
    },
    formataData: function (data, isHoras) {
        var dt = new Date(typeof data == "string" ? data.replace(/\s/, 'T') : data);
        var dia = app.ZN(dt.getDate(), 1),
            mes = app.ZN(dt.getMonth() + 1, 1);
    
        if (isHoras) {
            var hora = app.ZN(dt.getHours(), 1),
                minuto = app.ZN(dt.getMinutes(), 1);
    
            return dia + "/" + mes + '/' + dt.getFullYear() + " às " + hora + ":" + minuto;
        }
        return dia + "/" + mes + '/' + dt.getFullYear();
    },
    getRowsByCols: function (data, vals) {
        var arrayResu = data;
        if (typeof vals == "object") {
            if (Object.keys(vals).length) {
                arrayResu = [];
    
                for (var i = 0; i < data.length; i++) {
                    var status = true;
                    for (var key in vals) {
                        if (data[i][key] != vals[key] && typeof data[i][key] != "undefined") {
                            status = false;
                            break;
                        }
                    }
                    if (status) {
                        arrayResu.push(data[i]);
                    }
                }
            }
        }
        return arrayResu;
    },
    getRowByKey: function (array, key, val) {
        if (array[key] == val) {
            return array;
        }
        for (var k in array) {
            if (array[k][key] == val) {
                return array[k];
            }
        }
        return false;
    }
}, false);