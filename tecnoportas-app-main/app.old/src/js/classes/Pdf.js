"use strict";
function geraOrcamentoPDF(orcamento_id, pdfTitulo, compartilhar, abrir, retorno){
    var local = cordova.file.documentsDirectory, pdfB64 = null;
    Loader.mostrar();
    if (abrir === undefined || abrir === null){
        abrir = true;
    }
    if (app.isPlatform('android')){
        local = cordova.file.externalDataDirectory;
    }
    var abrirDoc = function (e) {
        var url = local + pdfTitulo;
        console.log(url);
        if (e) { url = e; }
        window.setTimeout(function () {
            if (compartilhar === true){
                window.plugins.socialsharing.share(null, pdfTitulo, [url]);
            }
            if (abrir === true){
                app.abrirDocumento(url, pdfTitulo);
            }
            if (retorno){    
                if(pdfB64 == null){
                    console.log("PDF vazio?");
                }
                retorno(pdfB64, url);
            }
            Loader.remover();
        }, 100);
    };

    var bxDdsPdf = function (img) {
        var api = new Api('orcamentos/geraPDF', { 'orcamento_id': orcamento_id });
        api.send(function (orcData) {
            if (orcData.error) {
                app.Erro(orcData);
            }
            else {
                var orc_dds = orcData.orcamento_data, prods = orcData.produtos;
                var validade = new Date(), hj = new Date(orc_dds.dt_cadastro.replace(/\s/, 'T')), calcVlTotal = 0;
                validade.setDate(hj.getDate() + 30);
                var userNumero = app.thisUser[0].tel_num;
                if (userNumero){
                    userNumero = userNumero.substring(userNumero.length - 4);
                    userNumero = "(" + app.thisUser[0].ddd + ") " + app.thisUser[0].tel_num.replace(userNumero, "") + "-" + userNumero;
                }
                else{
                    userNumero = "";
                }
                var texto_cpf =  orc_dds.cli_tipo == "J" ? "CNPJ" : "CPF";
                var texto_rg  = orc_dds.cli_tipo == "J" ? "IE" : "RG";
                var opts = {
                    documentSize: 'A4',
                    type: 'base64'
                };
                var produtos = [];
                for (var i = 0; i < prods.length; i++){
                    var prod = prods[i], item = produtos.length + 1, pid, pNome = prod.nome, pPUnit, pPTotal;
                    switch (prod.tipo){
                        case 'mto': pid = prod.mto_id; pNome = "Motor " + prod.nome; break;
                        case 'aut': pid = prod.aut_id; break;
                        case 'ptr': pid = prod.ptr_id; pNome = "Pintura " + prod.nome; break;
                        default: pid = prod.id; break;
                    }
                    var op;

                    if (app.N(prod.acrescimo) >=0) {
                        op = "+";
                    }
                    else{
                        op = "-";                          
                    }
                    if (app.N(prod.preco_unitario) == 0){
                        pPTotal = app.C(prod.preco_unitario, "+", prod.acrescimo);
                    }else{
                        pPTotal = app.C(app.C(prod.preco_unitario, "*", app.C(prod.acrescimo, "/", 100)), op, prod.preco_unitario);
                    }

                    if (op == "-") { pPTotal = pPTotal * -1; } 
                    pPUnit = app.C(pPTotal, "/", prod.quantidade);
                    calcVlTotal = app.C(pPTotal, "+", calcVlTotal);
                    produtos.push([item, prod.codigo ? prod.codigo : pid, pNome, prod.medida, prod.quantidade, app.N(pPUnit,2, ","), app.N(pPTotal,2, ",")]);
                }
                var dadosTab = {
                    thead : {
                        var: "colunas_tabela",
                        dados: ["Item", "Código", "Discrição das Mercadorias", "Und", "Qtd", "Unitário", "Total"]
                    },
                    tbody : {
                        var: "dados_tabela",
                        dados: produtos
                    }
                };
                var m2 = app.N((orc_dds.altura * orc_dds.largura), 2 ,"."),
                rolo = app.N(orc_dds.largura) < 8.5 ? 0.60 : 0.90,
                alt = app.N(app.C(orc_dds.altura,"-", rolo), 3, ".");
                
                var api = new Api("ajustes/gerais");

                api.send(function(res){
                    console.log(res);
                    var nome_empresa = null;
                    if(res.error){
                        app.Erro(res);
                    }else{
                        nome_empresa = res['nome_empresa'];
                    }
                    
                    var vars = {
                        orcamento_id: orc_dds.id,
                        orcamento_data: app.formataData(hj, true),
                        validade_orc: app.formataData(validade),
                        prev_entrega: app.formataData(validade),
                        logo_src: img ? img : cordova.file.applicationDirectory + "www/images/centro.png",
                        nome_fantasia: app.thisUser[0].tipo == "J" ? app.thisUser[0].sobrenome : app.thisUser[0].nome,
                        razao_social: app.thisUser[0].tipo == "J" ? app.thisUser[0].nome : app.thisUser[0].nome + " " + app.thisUser[0].sobrenome,
                        texto_cnpj: app.thisUser[0].cnpj ? (app.thisUser[0].tipo == "J" ? "CNPJ:" : "CPF:") : "CNPJ:",
                        cnpj: app.thisUser[0].cnpj ? app.thisUser[0].cnpj : "08.944.971/0001-00",
                        texto_ie: app.thisUser[0].ie ? (app.thisUser[0].tipo == "J" ? "IE:" : "RG:") : "", 
                        ie: app.thisUser[0].ie ? app.thisUser[0].ie : "",
                        email: app.thisUser[0].email,
                        end_logradouro: app.thisUser[0].logradouro,
                        end_numero: app.thisUser[0].numero,
                        end_bairro: app.thisUser[0].bairro,
                        end_cep: app.thisUser[0].cep,
                        end_cidade: app.thisUser[0].cidade,
                        end_uf: app.thisUser[0].uf,
                        end_tel: userNumero,
                        cli_nome: orc_dds.cli_tipo == "J" ? orc_dds.cli_nome : orc_dds.cli_nome + " " + orc_dds.cli_snome,
                        cli_tel: "(" + orc_dds.telefone_ddd + ") " + orc_dds.telefone_num,
                        cli_cidade: orc_dds.cidade,
                        cli_uf: orc_dds.estado,
                        cli_email: orc_dds.email,
                        td_endereco: orc_dds.logradouro == null ? "<td>&nbsp</td><td colspan='3'></td>" : "<td class='text-right'>Endere&ccedil;o:</td><td colspan='3'>"+orc_dds.logradouro+"</td>",
                        td_cel: orc_dds.celular == null ? "<td></td><td></td>" : "<td class='text-right'>Celular:</td><td>" + orc_dds.celular +"</td>",
                        td_bairro: orc_dds.bairro == null ? "<td class='text-right'>Cidade:</td><td class='text-uppercase'>"+ orc_dds.cidade +" - " + orc_dds.estado + "</td><td></td><td></td>" : "<td class='text-right'>Bairro:</td><td>"+orc_dds.bairro+"</td>",// + "<td>Cidade:</td><td class='text-uppercase'>"+ cli_cidade +" - " + cli_uf + "</td>",
                        td_numImovel: orc_dds.num == null ? "<td colspan='2'></td>" : "  <td class='text-right'>N&uacute;mero Im&oacute;vel:</td><td>"+orc_dds.numero+"</td>",
                        td_cep: orc_dds.cep == null ? "<td colspan='2'></td>" : "<td class='text-right'>CEP:</td><td>"+orc_dds.cep+"</td>",
                        td_cpfRg: orc_dds.cpf == null ? (orc_dds.rg == null ? "<td colspan='4'>&nbsp</td>" : "<td class='text-right>"+texto_rg+"</td><td>"+orc_dds.rg+"</td><td colspan='2'></td> ") : "<td class='text-right'>"+texto_cpf+"</td><td>"+orc_dds.cpf+"</td>",
                        solicitante: orc_dds.cli_nome,
                        frete: "Destinat&aacute;rio (Fob)",
                        ve_nome: app.thisUser[0].ct_nome == null ? (app.thisUser[0].nome + " " + app.thisUser[0].sobrenome) : app.thisUser[0].ct_nome + " " + app.thisUser[0].ct_snome,
                        ve_email: app.thisUser[0].email,
                        num_portas: orc_dds.portas,
                        largura: orc_dds.largura,
                        altura: orc_dds.altura,
                        vao: orc_dds.tpi_id == 25 ? "Dentro" : "Fora",
                        m2old: (orc_dds.altura * orc_dds.largura) * 2,
                        valor_total: app.N(calcVlTotal, 2, ","),
                        observacoes: orc_dds.ocorrencias ? orc_dds.ocorrencias : "",
                        infoPortas: orc_dds.portas == null ? "" : "<div class='row border border-dark text-center'><div class='col-2 border-right border-dark p-1'><span>Quantidade: "+orc_dds.portas+"</span></div><div class='col-2 border-right border-dark p-1'><span>Comprimento: "+orc_dds.largura+"</span></div>",
                        infoPortas2: orc_dds.portas == null ? "" : "<div class='col-2 border-right border-dark p-1'><span>Altura: "+alt+"</span></div><div class='col-2 border-right border-dark p-1'><span>Rolo: "+rolo+"</span></div><div class='col-2 border-right border-dark p-1'><span>"+(orc_dds.tpi_id == 25 ? "Dentro" : "Fora")+" do v&atilde;o</span></div><div class='col-2 p-1'><span>M2: "+m2+"</span></div></div>",
                        nome_empresa: nome_empresa ? nome_empresa : "TECNOPORTAS"
                    }

                    console.log(rolo);
                    console.log(orc_dds.altura);
                    console.log(vars.altura);
                    console.log(vars);
                    app.geraHtmlByTemplate("pdf/orcamento-template.html", vars, function (res) {
                        pdf.fromData(res, opts).then(function (base64) {
                            pdfB64 = "application/pdf;base64," + base64;
                            app.savebase64AsPDF(local, pdfTitulo, base64, "application/pdf", abrirDoc);
                        }).catch(function (err){
                            console.log(err);
                        });
                    }, dadosTab);

                });
            }
        });
    };
    var gPdf = function (img){
        app.isFile(local + pdfTitulo, function (res) {
            if (res && abrir != false){
                abrirDoc();
            }
            else{
                bxDdsPdf(img);
            }
        });    
    };
    if (app.thisUser[0].foto){
        var api = new Api("files?name=" + app.thisUser[0].foto);
        api.download(function (res) {
            if (!res.error) {
                gPdf(res);
            }
            else{
                gPdf();
            }
        });
    }
    else{
        gPdf();
    }
};