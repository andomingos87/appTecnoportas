"use strict";
var aps_is_sandbox = true,
    thisUser = app.thisUser;
function ApiPagSeguro() {
    var self = this,
        ud = thisUser,
        _thisApiUrl = "pagar?metodo=pagseguro",
        _url = "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js",
        _sUrl = "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js",
        _recRecUrl = "https://pagseguro.uol.com.br/v2/pre-approvals/request.html?code=",
        _sRecRecUrl = "https://sandbox.pagseguro.uol.com.br/v2/pre-approvals/request.html?code=",
        _apsUrl = "https://stc.pagseguro.uol.com.br",
        _sessao = null,
        _senderHash = null,
        _cardToken = null,
        _planId = null,
        aPeriodos = {
            "SEMANAL": "WEEKLY",
            "MENSAL": "MONTHLY",
            "BIMESTRAL": "BIMONTHLY",
            "TRIMESTRAL": "TRIMONTHLY",
            "SEMESTRAL": "SEMIANNUALLY",
            "ANUAL": "YEARLY"
        }, aSDias = {
            "SEGUNDA": "MONDAY",
            "TERCA": "TUESDAY",
            "QUARTA": "WEDNESDAY",
            "QUINTA": "THURSDAY",
            "SEXTA": "FRIDAY",
            "SABADO": "SATURDAY",
            "DOMINGO" : "SUNDAY"
        };

    var vg_sessao = new VarGlobal("aps_sessao");
    _sessao = vg_sessao.obterSessao();

    if (ud) {
        ud = ud[0];
    }

    /*Funções Internas */
    var getSenderHash = function () {
        PagSeguroDirectPayment.onSenderHashReady(function (res) {
            if (res.status == "error") {
                console.log(res.message);
            }
            else {
                _senderHash = res.senderHash;
            }
        });
    };
    var setSessao = function (retorno) {
        if (!vg_sessao.obterSessao()) {
            PagSeguroDirectPayment.setSessionId(_sessao);
            vg_sessao.salvarSessao(_sessao);
            getSenderHash();
        }
        if (typeof retorno == "function") {
            retorno(_sessao);
        }
    };
    var getApsScripts = function (retorno) {
        var url = aps_is_sandbox ? _sUrl : _url;

        if (typeof PagSeguroDirectPayment == "undefined") {
            app.addScript(url, function () {
                setSessao(retorno);
            });
        }
        else {
            setSessao(retorno);
        }
    };

    /*Funções externas */
    self.init = function (retorno) {
        if (!_sessao) {
            var api = new Api(_thisApiUrl + "&acao=getsessao");
            api.send(function (res) {
                if (!res.error) {
                    _sessao = res.sessao.id;
                    getApsScripts(retorno);
                }
                else {
                    app.Erro(res);
                }
            });
        }
        else {
            getApsScripts(retorno);
        }
    };
    self.getApsUrl = function () {
        return _apsUrl;
    }
    self.getPaymentMethods = function (valor, retorno) {
        self.init(function () {
            valor = N(valor);
            var options = {
                complete: retorno
            };
            if (valor) {
                options.amount = valor;
            }
            PagSeguroDirectPayment.getPaymentMethods(options);
        });
    };
    self.getBrand = function (bin, retorno) {
        if (bin) {
            bin = String(bin);
            if (bin.length >= 6) {
                bin = bin.substring(0, 6);

                self.init(function () {
                    PagSeguroDirectPayment.getBrand({
                        cardBin: bin,
                        complete: retorno
                    });
                });
            }
            else {
                retorno({ error: "Bin Inválido!" });
            }
        }
        else {
            retorno({ error: "Bin Não Recebido!" });
        }
    };
    self.getInstallments = function (valor, retorno, bin, semJuros) {
        valor = N(valor);
        if (valor) {
            self.init(function () {
                var getParcs = function (bin) {
                    var options = {
                        amount: valor,
                        complete: retorno
                    };
                    if (N(semJuros) >= 2) {
                        options.maxInstallmentNoInterest = N(semJuros);
                    }
                    if (bin) {
                        options.brand = bin;
                    }
                    PagSeguroDirectPayment.getInstallments(options);
                };
                if (N(bin)) {
                    self.getBrand(bin, function (res) {
                        var bn;
                        if (res.brand) {
                            bn = res.brand.name;
                        }
                        getParcs(bn);
                    });
                }
                else {
                    getParcs(bin);
                }
            });
        }
        else {
            retorno({ error: "Valor Inválido!" });
        }
    };
    self.getCardToken = function (numCartao, bandeira, cvv, mesExpira, anoExpira, retorno) {
        if (numCartao, bandeira) {
            self.init(function () {
                var options = {
                    complete: function (res) {
                        if (!res.error) {
                            _cardToken = res.card.token;
                        }
                        retorno(res);
                    },
                    cardNumber: String(numCartao),
                    brand: bandeira
                };
                if (cvv) {
                    options.cvv = String(cvv);
                }
                if (mesExpira) {
                    options.expirationMonth = String(mesExpira);
                }
                if (anoExpira) {
                    options.expirationYear = String(anoExpira);
                }
                PagSeguroDirectPayment.createCardToken(options);
            });
        }
        else {
            retorno({ error: "Dados Incompletos!" });
        }
    };
    self.pagar = function (metodo, arrayItens, enderecoData, metodoData, compradorData, retorno, freteData, urlRedireciona) {
        if (_senderHash) {
            var compData = {},
                endData = { endereco: {}, enderecoFat: {} };

            if (compradorData) {
                compData = compradorData;
            }
            else if (ud) {
                var telefone = ud.celWhats.replace(/[^0-9]/g, "");
                var ddd = telefone.substring(0, 2),
                    telNum = telefone.substring(2),
                    tpd = ud.tipoCad == "pf" ? "CPF" : "CNPJ",
                    docn = (ud.tipoCad == "pf" ? ud.cpf : ud.cnpj).replace(/[^0-9]/g, "");

                compData = {
                    nome: ud.nome + " " + ud.sobrenome,
                    email: ud.emailContato,
                    ddd: ddd,
                    tel: telNum,
                    tipoDoc: tpd,
                    doc: docn
                };
            }
            else {
                app.Erro({ error: "Dados do comprador não recebidos!" });
                return false;
            }

            compData.senderHash = _senderHash;

            if (enderecoData) {
                endData.endereco = enderecoData.endereco;
                endData.enderecoFat = enderecoData.enderecoFat;

                if (!endData.endereco) {
                    if (enderecoData.logradouro) {
                        endData.endereco = enderecoData;
                        endData.enderecoFat = enderecoData;
                    }
                }
            }
            else if (ud.logradouro) {
                endData.endereco = {
                    rua: ud.logradouro,
                    numero: ud.numero,
                    /*complemento: null,*/
                    bairro: ud.bairro,
                    cidade: ud.cidade,
                    estado: ud.estado,
                    cep: ud.cep
                };
                endData.enderecoFat = endData.endereco;
            }
            else {
                app.Erro({ error: "Endereço do comprador não recebidos!" });
                return false;
            }

            var pagData = {
                metodoPag: metodo,
                referencia: app.nome + "-" + MD5(new Date().getTime()),
                requerEntrega: enderecoData ? true : false,
                comprador: compData,
                itens: arrayItens,
                endereco: endData.endereco,
                enderecoFat: endData.enderecoFat
            };

            if (freteData) {
                pagData.tipoFrete = freteData.tipo;
                pagData.totalFrete = freteData.total;
            }

            if (metodoData && metodo == "creditCard" && _cardToken) {
                pagData.cartaoCredito = {
                    "token": _cardToken,
                    "parcelas": metodoData.parcelas,
                    "valorParcelas": metodoData.valorParcelas,
                    "nome": metodoData.nome, /*Nome impresso no cartão*/
                    "tipoDoc": metodoData.tipoDoc,
                    "doc": metodoData.doc,
                    "dataNasc": metodoData.dataNasc, /*dd/mm/yyyy*/
                };
                if (metodoData.parcelasSemJuros >= 2) {
                    pagData.cartaoCredito.parcelasSemJuros = metodoData.parcelasSemJuros;
                }
            }
            else if (metodoData && metodo == "eft") {
                pagData.banco = {
                    nome: metodoData.nomeBanco
                };
            }
            else if (metodo == "eft" || metodo == "creditCard") {
                app.Erro({ error: "Os dados obrigatórios para o metodo não foram recebidos!" });
                return false;
            }
            if (urlRedireciona){
                pagData.urlRedireciona = urlRedireciona;
            }

            var api = new Api(_thisApiUrl + "&acao=setpag", {
                dados: pagData
            });

            api.send(function (res) {
                retorno(res);
                /*
{
   "date":"2019-04-15T22:33:14.000-03:00",
   "code":"FC4EDEC6-250D-41FF-99A1-3C508D83A330",
   "reference":"Lumary-d41d8cd98f00b204e9800998ecf8427e",
   "type":"1",
   "status":"1",
   "lastEventDate":"2019-04-15T22:33:14.000-03:00",
   "paymentMethod":{
      "type":"1",
      "code":"101"
   },
   "grossAmount":"1.00",
   "discountAmount":"0.00",
   "feeAmount":"0.45",
   "netAmount":"0.55",
   "extraAmount":"0.00",
   "installmentCount":"1",
   "itemCount":"1",
   "items":{
      "item":{
         "id":"0001",
         "description":"Item teste",
         "quantity":"1",
         "amount":"1.00"
      }
   },
   "sender":{
      "name":"Guilherme Cristino",
      "email":"c76145423640993564610@sandbox.pagseguro.com.br",
      "phone":{
         "areaCode":"11",
         "number":"957191704"
      },
      "documents":{
         "document":{
            "type":"CPF",
            "value":"44992891810"
         }
      }
   },
   "shipping":{
      "address":{
         "street":"Rua Almirante Alexandrino",
         "number":"75",
         "complement":[

         ],
         "district":"Santa Teresa",
         "city":"Rio de Janeiro",
         "state":"RJ",
         "country":"BRA",
         "postalCode":"20241264"
      },
      "type":"3",
      "cost":"0.00"
   },
   "gatewaySystem":{
      "type":"cielo",
      "rawCode":[

      ],
      "rawMessage":[

      ],
      "normalizedCode":[

      ],
      "normalizedMessage":[

      ],
      "authorizationCode":"0",
      "nsu":"0",
      "tid":"0",
      "establishmentCode":"1056784170",
      "acquirerName":"CIELO"
   }
}
                */
            });
        }
        else {
            app.Erro({ error: (!_cardToken ? "Tokem do cartão" : "Hash do usuário") + " não recebido!" });
            return false;
        }
    };
    self.getPlano = function (tipo, periodo, arrayPlano, compradorData, retorno, enderecoData, urlRedireciona) {
        var compData = {},
            endData = {};

        if (compradorData) {
            compData = compradorData;
        }
        else if (ud) {
            var telefone = ud.celWhats.replace(/[^0-9]/g, "");
            var ddd = telefone.substring(0, 2),
                telNum = telefone.substring(2);

            compData = {
                nome: ud.nome + " " + ud.sobrenome,
                email: ud.emailContato,
                ddd: ddd,
                tel: telNum
            };
        }
        else {
            app.Erro({ error: "Dados do comprador não recebidos!" });
            return false;
        }
        if (enderecoData){
            endData = enderecoData;
        }
        else if (ud.logradouro) {
            endData = {
                rua: ud.logradouro,
                numero: ud.numero,
                /*complemento: null,*/
                bairro: ud.bairro,
                cidade: ud.cidade,
                estado: ud.estado,
                cep: ud.cep
            };
        }
        else {
            app.Erro({ error: "Endereço do comprador não recebidos!" });
            return false;
        }

        var planoData = {
            tipo: tipo,
            nome: arrayPlano.nome,
            detalhes: arrayPlano.detalhes,
            valor: N(arrayPlano.valor, 2, "."),
            periodo: aPeriodos[periodo.toUpperCase()],
            maxValorPeriodo: N(arrayPlano.maxValorPeriodo, 2, "."),
            dataInicial: arrayPlano.dataInicial,
            dataFinal: arrayPlano.dataFinal,
            valorTotalMaximo: N(arrayPlano.valorTotalMaximo, 2, "."),
            referencia: app.nome + "-" + MD5(new Date().getTime()),
            comprador: compData,
            endereco: endData
        };
        if (arrayPlano.diaDoAno){
            planoData.diaDoAno = arrayPlano.diaDoAno;
        }
        if (arrayPlano.diaDaSemana){
            planoData.diaDaSemana = aSDias[arrayPlano.diaDaSemana.toUpperCase()];
        }
        if (arrayPlano.diaDoMes){
            planoData.diaDoMes = arrayPlano.diaDoMes;
        }

        if (arrayPlano.taxaAdesao){
            planoData.taxaAdesao = N(arrayPlano.taxaAdesao, 2, ".");
        }
        if (arrayPlano.maxValor){
            planoData.maxValor = N(arrayPlano.maxValor, 2, ".");
        }
        if (arrayPlano.maxCobrancasPeriodo){
            planoData.maxCobrancasPeriodo = N(arrayPlano.maxCobrancasPeriodo, 2, ".");
        }
        if (urlRedireciona){
            planoData.urlRedireciona = urlRedireciona;
        }
        
        var api = new Api(_thisApiUrl + "&acao=getPlano", {
            dados: planoData
        });

        api.send(function (res) {
            if (!res.error){
                _planId = res.code;
                res.url = (aps_is_sandbox ? _sRecRecUrl : _recRecUrl) + _planId;
            }
            retorno(res);
            /*
            {
                "code": "2A2F2F09DEDE60ACC4451FA4D9527E3C",
                "date": "2019-04-20T16:06:04-03:00"
            }
            */
        });
    };
    self.setPlano = function (cartaoData, compradorData, retorno, enderecoData, urlRedireciona) {
        if (_senderHash && _cardToken && _planId) {
            var compData = {},
                endData = { endereco: {}, enderecoFat: {} };

            if (compradorData) {
                compData = compradorData;
            }
            else if (ud) {
                var telefone = ud.celWhats.replace(/[^0-9]/g, "");
                var ddd = telefone.substring(0, 2),
                    telNum = telefone.substring(2),
                    tpd = ud.tipoCad == "pf" ? "CPF" : "CNPJ",
                    docn = (ud.tipoCad == "pf" ? ud.cpf : ud.cnpj).replace(/[^0-9]/g, "");

                compData = {
                    nome: ud.nome + " " + ud.sobrenome,
                    email: ud.emailContato,
                    ddd: ddd,
                    tel: telNum,
                    tipoDoc: tpd,
                    doc: docn
                };
            }
            else {
                app.Erro({ error: "Dados do comprador não recebidos!" });
                return false;
            }

            compData.senderHash = _senderHash;

            if (enderecoData) {
                endData.endereco = enderecoData.endereco;
                endData.enderecoFat = enderecoData.enderecoFat;

                if (!endData.endereco) {
                    if (enderecoData.logradouro) {
                        endData.endereco = enderecoData;
                        endData.enderecoFat = enderecoData;
                    }
                }
            }
            else if (ud.logradouro) {
                endData.endereco = {
                    rua: ud.logradouro,
                    numero: ud.numero,
                    /*complemento: null,*/
                    bairro: ud.bairro,
                    cidade: ud.cidade,
                    estado: ud.estado,
                    cep: ud.cep
                };
                endData.enderecoFat = endData.endereco;
            }
            else {
                app.Erro({ error: "Endereço do comprador não recebidos!" });
                return false;
            }

            var planoData = {
                planoId: _planId,
                referencia: app.nome + "-" + MD5(new Date().getTime()),
                comprador: compData,
                endereco: endData.endereco,
                enderecoFat: endData.enderecoFat
            };

            if (cartaoData && _cardToken) {
                planoData.cartaoCredito = {
                    "token": _cardToken,
                    "nome": cartaoData.nome, /*Nome impresso no cartão*/
                    "tipoDoc": cartaoData.tipoDoc,
                    "doc": cartaoData.doc,
                    "dataNasc": cartaoData.dataNasc, /*dd/mm/yyyy*/
                };
            }

            if (urlRedireciona){
                planoData.urlRedireciona = urlRedireciona;
            }

            var api = new Api(_thisApiUrl + "&acao=setplano", {
                dados: planoData
            });

            api.send(function (res) {
                retorno(res);
            });
        }
        else {
            app.Erro({ error: (!_cardToken ? "Tokem do cartão" : (!_senderHash ? "Hash do usuário" : "Id do plano")) + " não recebido!" });
            return false;
        }
    };

    /*Construtor */
};