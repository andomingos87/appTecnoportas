"use strict";
var loaders = {},
    btLoaderCancelar = false;
var Loader = {
    'add': function (obj) {
        if (!loaders[obj.id]) {
            loaders[obj.id] = obj.innerHTML;
            obj.innerHTML = "<img class='loader-cog' src='img/loader.svg'/>";
            obj.disabled = true;
        }
    },
    'remove': function (obj) {
        if (loaders[obj.id]) {
            obj.innerHTML = loaders[obj.id];
            obj.disabled = false;
            delete loaders[obj.id];
        }
    },
    'mostrar': function (remPull) {
        var divLoader = document.getElementById('loader');

        if (!divLoader){
            var btCancel = app.CE("buttom", { id: "btLoaderCancel", class: "btn btn-light mb-3" });

            divLoader = app.CE("div", { id: "loader" });

            divLoader.innerHTML = "<img src='img/loader.svg'><br><p>Carregando</p>";

            btCancel.innerHTML = "Cancelar";
        
            divLoader.appendChild(btCancel);
            document.body.appendChild(divLoader);
        }
        $(divLoader).removeClass('is-loaded');
        if (app.ObjPullToRefresh && remPull !== false) {
            app.removePullToRefresh();
        }
    },
    'remover': function (addPull) {
        var divLoader = document.getElementById('loader');
        if (divLoader) {
            $(divLoader).addClass('is-loaded');
            if (app.IdPullToRefresh && addPull !== false) {
                app.addPullToRefresh(app.IdPullToRefresh, app.FuPullToRefresh);
            }
        }
    },
    'onCancelar': function (evento) {
        if (btLoaderCancelar){
            var btNovo = btLoaderCancelar.cloneNode(true);
            btLoaderCancelar.parentNode.replaceChild(btNovo, btLoaderCancelar);
            btLoaderCancelar.addEventListener('click', evento, false);
        }
    }
};