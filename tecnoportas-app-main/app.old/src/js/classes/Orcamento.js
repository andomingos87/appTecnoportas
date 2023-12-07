"use strict";
var thisUser = app.thisUser;

function Orcamento(dds) {
    var self = this,
        orcData = null,
        orcDds = null,
        prodsDds = null;

    /*Funções Internas*/
    var checkDds = function (dds) {
        if (typeof dds == "object") {
            orcData = dds;
            return true;
        }
        return false;
    };
    var geraPDF = function (dds, retorno, opts) {
        var ud = thisUser[0];
        var opts = !opts ? {
            documentSize: 'A4',
            type: 'base64'
        } : opts,
            img = cordova.file.applicationDirectory + "www/images/centro.png",
            validade = new Date(),
            hj = new Date(orcDds.dt_cadastro.replace(/\s/, 'T')),
            calcVlTotal = 0,
            userNumero = ud.tel_num,
            texto_cpf = orcDds.cli_tipo == "J" ? "CNPJ" : "CPF",
            texto_rg = orcDds.cli_tipo == "J" ? "IE" : "RG",
            m2 = app.N(app.C(orcDds.altura, "*", orcDds.largura), 2, "."),
            rolo = app.N(orcDds.largura) < 8.5 ? 0.60 : 0.90,
            produtos = [];

        var alt = app.N(app.C(orcDds.altura, "-", rolo), 3, ".");
        validade.setDate(hj.getDate() + 30);
    
        if (userNumero) {
            userNumero = userNumero.substring(userNumero.length - 4);
            userNumero = "(" + ud.ddd + ") " + ud.tel_num.replace(userNumero, "") + "-" + userNumero;
        }
        else {
            userNumero = "";
        }

        for (var i = 0; i < prodsDds.length; i++) {
            var prod = prodsDds[i],
                item = produtos.length + 1,
                pid, pPUnit, pPTotal,
                pNome = prod.nome;

            switch (prod.tipo) {
                case 'mto': pid = prod.mto_id; pNome = "Motor " + prod.nome; break;
                case 'aut': pid = prod.aut_id; break;
                case 'ptr': pid = prod.ptr_id; pNome = "Pintura " + prod.nome; break;
                default: pid = prod.id; break;
            }
            var op;

            if (app.N(prod.acrescimo) >= 0) {
                op = "+";
            }
            else {
                op = "-";
            }
            if (app.N(prod.preco_unitario) == 0) {
                pPTotal = app.C(prod.preco_unitario, "+", prod.acrescimo);
            }
            else {
                pPTotal = app.C(
                    app.C(prod.preco_unitario, "*", app.C(prod.acrescimo, "/", 100)),
                    op,
                    prod.preco_unitario
                );
            }

            if (op == "-") {
                pPTotal = pPTotal * -1;
            }
            pPUnit = app.C(pPTotal, "/", prod.quantidade);
            calcVlTotal = app.C(pPTotal, "+", calcVlTotal);
            produtos.push([
                item,
                prod.codigo ? prod.codigo : pid,
                pNome,
                prod.medida,
                prod.quantidade,
                app.N(pPUnit, 2, ","),
                app.N(pPTotal, 2, ",")
            ]);
        }
        var dadosTab = {
            thead: {
                var: "colunas_tabela",
                dados: ["Item", "Código", "Discrição das Mercadorias", "Und", "Qtd", "Unitário", "Total"]
            },
            tbody: {
                var: "dados_tabela",
                dados: produtos
            }
        };

        app.getImgFromApi(ud.foto, function (res, status) {
            if (status) {
                img = res;
            }
    
            var vars = {
                orcamento_id: orcDds.id,
                orcamento_data: app.formataData(hj, true),
                validade_orc: app.formataData(validade),
                prev_entrega: app.formataData(validade),
                logo_src: img,
                nome_fantasia: ud.tipo == "J" ? ud.sobrenome : ud.nome,
                razao_social: ud.tipo == "J" ? ud.nome : ud.nome + " " + ud.sobrenome,
                texto_cnpj: ud.cnpj ? (ud.tipo == "J" ? "CNPJ:" : "CPF:") : "CNPJ:",
                cnpj: ud.cnpj ? ud.cnpj : "08.944.971/0001-00",
                texto_ie: ud.ie ? (ud.tipo == "J" ? "IE:" : "RG:") : "",
                ie: ud.ie ? ud.ie : "",
                email: ud.email,
                end_logradouro: ud.logradouro,
                end_numero: ud.numero,
                end_bairro: ud.bairro,
                end_cep: ud.cep,
                end_cidade: ud.cidade,
                end_uf: ud.uf,
                end_tel: userNumero,
                cli_nome: orcDds.cli_tipo == "J" ? orcDds.cli_nome : orcDds.cli_nome + " " + orcDds.cli_snome,
                cli_tel: "(" + orcDds.telefone_ddd + ") " + orcDds.telefone_num,
                cli_cidade: orcDds.cidade,
                cli_uf: orcDds.estado,
                cli_email: orcDds.email,
                td_endereco: orcDds.logradouro == null ? "<td>&nbsp</td><td colspan='3'></td>" : "<td class='text-right'>Endere&ccedil;o:</td><td colspan='3'>" + orcDds.logradouro + "</td>",
                td_cel: orcDds.celular == null ? "<td></td><td></td>" : "<td class='text-right'>Celular:</td><td>" + orcDds.celular + "</td>",
                td_bairro: orcDds.bairro == null ? "<td class='text-right'>Cidade:</td><td class='text-uppercase'>" + orcDds.cidade + " - " + orcDds.estado + "</td><td></td><td></td>" : "<td class='text-right'>Bairro:</td><td>" + orcDds.bairro + "</td>",
                td_numImovel: orcDds.num == null ? "<td colspan='2'></td>" : "  <td class='text-right'>N&uacute;mero Im&oacute;vel:</td><td>" + orcDds.numero + "</td>",
                td_cep: orcDds.cep == null ? "<td colspan='2'></td>" : "<td class='text-right'>CEP:</td><td>" + orcDds.cep + "</td>",
                td_cpfRg: orcDds.cpf == null ? (orcDds.rg == null ? "<td colspan='4'>&nbsp</td>" : "<td class='text-right>" + texto_rg + "</td><td>" + orcDds.rg + "</td><td colspan='2'></td> ") : "<td class='text-right'>" + texto_cpf + "</td><td>" + orcDds.cpf + "</td>",
                solicitante: orcDds.cli_nome,
                frete: "Destinat&aacute;rio (Fob)",
                ve_nome: ud.ct_nome == null ? (ud.nome + " " + ud.sobrenome) : ud.ct_nome + " " + ud.ct_snome,
                ve_email: ud.email,
                num_portas: orcDds.portas,
                largura: orcDds.largura,
                altura: orcDds.altura,
                vao: orcDds.tpi_id == 25 ? "Dentro" : "Fora",
                m2old: (orcDds.altura * orcDds.largura) * 2,
                valor_total: app.N(calcVlTotal, 2, ","),
                observacoes: orcDds.ocorrencias ? orcDds.ocorrencias : "",
                infoPortas: orcDds.portas == null ? "" : "<div class='row border border-dark text-center'><div class='col-2 border-right border-dark p-1'><span>Quantidade: " + orcDds.portas + "</span></div><div class='col-2 border-right border-dark p-1'><span>Comprimento: " + orcDds.largura + "</span></div>",
                infoPortas2: orcDds.portas == null ? "" : "<div class='col-2 border-right border-dark p-1'><span>Altura: " + alt + "</span></div><div class='col-2 border-right border-dark p-1'><span>Rolo: " + rolo + "</span></div><div class='col-2 border-right border-dark p-1'><span>" + (orcDds.tpi_id == 25 ? "Dentro" : "Fora") + " do v&atilde;o</span></div><div class='col-2 p-1'><span>M2: " + m2 + "</span></div></div>"
            };
            app.geraHtmlByTemplate("pdf/orcamento-template.html", vars, function (res) {
                pdf.fromData(res, opts).then(function (base64) {
                    pdfB64 = "application/pdf;base64," + base64;
                    app.savebase64AsPDF(local, pdfTitulo, base64, "application/pdf", retorno);
                }).catch(function (err){
                    console.log(err);
                });
            }, dadosTab);
        });
    };

    
    /*Funções externas*/
    self.getOrcamento = function (id, retorno) {
        var api = new Api('orcamentos/abrir', { 'orcamento_id': id });
        api.send(function (res) {
            if (!res.error) {
                orcData = res;
                orcDds = res.orcamento;
                prodsDds = res.produtos;
                if (typeof retorno == "function") {
                    retorno(res);
                }
            }
            else {
                app.Erro(res);
            }
        });
    };
    self.getPDF = function (dds) {
        if (!checkDds(dds)) {
            self.getOrcamento(dds, function (res) {
                geraPDF(res);
            });
        }
        else {
            geraPDF(dds);
        }
    };

    /*Construtor*/
    checkDds(dds);
};