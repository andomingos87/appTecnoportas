"use strict";
function GPS(is_msgs) {
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
        getPermissoes(["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"], function (res) {
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
};
function GoogleMaps(div, latitude, longitude, isScroll) {
    /*Variáveis Privadas*/
    var self = this, mapa = null,
        mWidth = "100%", mHeight = "25rem",
        latLng = { lat: app.N(latitude), lng: app.N(longitude) },
        libUrl = "",
        apiKey = "AIzaSyAkmrxwFZF3G501QkvNPD1wOoNK3Qy8YrQ";

    libUrl = "https://maps.googleapis.com/maps/api/js?key=" + apiKey;

    isScroll = isScroll === false ? false : true;
    /*Funções Internas */
    var addScript = function (retorno) {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
            app.addScript(libUrl, retorno);
        }
        else {
            retorno();
        }
    };
    var mostrarMapa = function (retorno) {
        addScript(function () {
            div.style.display = "block";
            div.style.width = mWidth;
            div.style.height = mHeight;

            mapa = new google.maps.Map(div, {
                zoom: 17,
                center: latLng,
                scrollwheel: isScroll
            });
            if (typeof retorno == "function") {
                retorno();
            }
        });
    };
    /*Funções Externas */
    self.setTamanho = function (width, height) {
        mWidth = width;
        mHeight = height;
        if (mapa) {
            div.style.width = mWidth;
            div.style.height = mHeight;
        }
    };
    self.mostrar = function (retorno) {
        if (app.IsConectado()) {
            if (!mapa) {
                mostrarMapa(retorno);
            }
            return mapa;
        }
        else {
            return {
                error: "net"
            };
        }
    };
    self.addMarcador = function (lat, lng, titulo) {
        if (mapa) {
            var latLng = {
                lat: app.N(lat),
                lng: app.N(lng)
            };
            var mk = new google.maps.Marker({
                position: latLng,
                map: mapa,
                title: titulo
            });
            return mk;
        }
        return false;
    };
};