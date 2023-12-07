"use strict";
app = app.arrayPush(app, {
    E: function (elemId) {
        var res = null, i = elemId.substring(0, 1), id = elemId.substring(1);
        switch (i) {
            case ".": res = document.getElementsByClassName(id); break;
            case "?": res = document.querySelectorAll("input[name='" + id + "']");
                if (res.length == 0) {
                    res = null;
                }
                else if (res.length == 1 && res[0].type != "radio" && res[0].type != "checkbox") {
                    res = res[0];
                }
                else if (res[0].type == "radio" || res[0].type == "checkbox") {
                    var tp = res[0].type;
                    res.value = tp == "radio" ? null : [];
                    res.key = tp == "radio" ? null : [];
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].checked) {
                            if (tp == "radio") {
                                res.value = res[i].value;
                                res.key = i;
                            }
                            else {
                                res.value.push(res[i].value);
                                res.key.push(i);
                            }
                        }
                    }
                }
                break;
            case "#": res = document.getElementById(id); break;
            default: res = document.getElementById(elemId); break;
        }
        return res;
    },
    CE: function (tag, atts) {
        var obj = document.createElement(tag);
        for (var key in atts) {
            obj.setAttribute(key, atts[key]);
        }
        return obj;
    },
    RE: function (elem) {
        if (typeof elem == "string") {
            elem = app.E(elem);
        }
        elem.parentNode.removeChild(elem);
    },
    getRadioChecked: function (formId, name) {
        var rads = $('#' + formId + ' input[name="' + name + '"]');
        for (var i = 0; i < rads.length; i++) {
            if (rads[i].checked) {
                return rads[i];
            }
        }
        return null;
    },
    setValByClass: function(classe, valor) {
        var objs = document.getElementsByClassName(classe);
        for (var i = 0; i < objs.length; i++) {
            objs[i].value = valor;
        }
    },
    limpaObj: function (obj, exceto) {
        var filhos = obj.children.length;
        while (obj.lastChild) {
            if (exceto == filhos) {
                break;
            }
            obj.removeChild(obj.lastChild);
            filhos--;
        }
    }
}, false);