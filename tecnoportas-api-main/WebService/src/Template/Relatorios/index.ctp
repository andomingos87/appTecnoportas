<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                <?= $title ?>
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="form-group">
                    <label class="control-label col-md-4">Filtrar por:</label>
                    <select id="selIdFiltro" name="selFiltro" class="form-control">
                        <option value="0">--Selecione--</option>
                        <option value="1">Cliente</option>
                        <option value="2">Revendedor</option>
                        <option value="3">Vendedor</option>
                    </select>
                </div>
                <div id="selCli" class="form-group invisivel">
                    <label for='seIdCli'>Selecione o Cliente:</label>
                    <select id="seIdCli" name="seCli" class="form-control">
                        <option value="">--Todos--</option>
                        <?php if (count($clientes)) : foreach ($clientes as $cliente) { ?>
                                <option value="<?= $cliente['id'] ?>"> <?= $cliente['nome'] . ' ' . $cliente['sobrenome'] ?> </option>
                            <?php }
                    endif; ?>
                    </select>
                </div>
                <div id="selRev" class="form-group invisivel">
                    <label for='seIdRev'>Selecione o Revendedor:</label>
                    <select id="seIdRev" name="seRev" class="form-control">
                        <option value="">--Todos--</option>
                        <?php if (count($revendedores)) : foreach ($revendedores as $revendedor) { ?>
                                <option value="<?= $revendedor['id'] ?>"> <?= $revendedor['nome'] . ' ' . $revendedor['sobrenome'] ?> </option>
                            <?php }
                    endif; ?>
                    </select>
                </div>
                <div id="selVen" class="form-group invisivel">
                    <label for='seIdVen'>Selecione o Vendedor:</label>
                    <select id="seIdVen" name="seVen" class="form-control">
                        <option value="">--Todos--</option>
                        <?php if (count($vendedores)) : foreach ($vendedores as $vendedor) { ?>
                                <option value="<?= $vendedor['id'] ?>"> <?= $vendedor['nome'] . ' ' . $vendedor['sobrenome'] ?> </option>
                            <?php }
                    endif; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label class="control-label col-md-4">Estado:</label>
                    <select id="selIdEstado" name="selEstado" class="form-control">
                        <option value="0">--Selecione--</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </div>
                <div class="form-group">
                    <div id="divCidade" style="display:none;">
                        <label class="col-sm-2 col-md-1 control-label m-bot15" for="tbCidade">Cidade:</label>
                        <div>
                            <input type="text" name="cidade" id="tbCidade" class="form-control" />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-md-4">Data:</label>
                    <div style="max-width: 300px;">
                        <div class="input-group input-large custom-date-range" data-date="13/07/2013" data-date-format="dd/mm/yyyy">
                            <input type="text" class="form-control dpd1" name="from" autocomplete="off">
                            <span class="input-group-addon">Até</span>
                            <input type="text" class="form-control dpd2" name="to" autocomplete="off">
                        </div>
                        <p style="font-size:11px;">Deixe em branco para ver o mês atual</p>
                        <span class="help-block">Escolha o período</span>
                    </div>
                    <button id="btnFiltra" type="button" class="btn-primary">Filtrar</button>
                </div>
                <br>
                <h4 id="orcQtd">Orçamentos realizados este mês: <?= $orcMes ?></h4>
                <h5 id="vlMedio">Valor médio dos orçamentos: R$ <?= $media[0] ?></h5>
                <div class="Grafs" id="grafPadrao" style="width:70%;">
                    <label id="lblChart" for="myChart">Últimos 5 Meses</label>
                    <canvas id="myChart"></canvas>
                </div>
                <div id="customCtn" class="Grafs" style="width:70%;">
                </div>
            </div>
        </section>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
<script>
    var meses = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var ctx = document.getElementById('myChart').getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'bar',

        data: {
            datasets: [{
                label: 'Orçamentos ultimos 5 meses',

                data: [<?php foreach ($orcData5 as $qtd) {
                            if (isset($qtd['Qtd'])) {
                                echo $qtd['Qtd'] . ', ';
                            }
                        } ?>

                ],
                backgroundColor: ["rgb(255, 20, 20)", "rgb(2, 95, 2)", "rgb(20, 20, 255)", "rgb(0,255,255)", "rgb(255,255,0)"]
            }],

            labels: [<?php
                        foreach ($orcData5 as $data) {
                            if (isset($data['Mes']) and isset($data['Ano'])) {
                                echo 'meses[' . $data['Mes'] . '] + "/" + ' . $data['Ano'] . ',';
                            }
                        }
                        ?>]
        },
        options: {}
    });
</script>

<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<script>
    $(function() {

        $('input[name="from"]').datepicker({
            dateFormat: "dd-mm-yy",
            changeMonth: true,
            changeYear: true,
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            maxDate: new Date()
        });
        $('input[name="to"]').datepicker({
            dateFormat: "dd-mm-yy",
            changeMonth: true,
            changeYear: true,
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            minDate: new Date()

        });



        $('#selIdFiltro').change(function() {
            var $select = $('#selIdFiltro').val();
            switch ($select) {
                case "0":
                    limpaSelects();
                    break;
                case "1":
                    setaCliente();
                    break;
                case "2":
                    setaRevendedor();
                    break;
                case "3":
                    setaVendedor();
                    break;
            }
        });

        $('#selIdEstado').change(function() {
            var $sel = $('#selIdEstado').val();
            if ($sel == 0) {
                $('#tbCidade').val("");
                $('#divCidade').hide();
            } else {
                $('#divCidade').show();
            }
        });

        function limpaSelects() {
            $('#seIdCli').val("");
            $('#seIdRev').val("");
            $('#seIdVen').val("");
            $('#selCli').hide();
            $('#selRev').hide();
            $('#selVen').hide();
        };

        function setaCliente() {
            limpaSelects();
            $('#selCli').show();
        };

        function setaRevendedor() {
            limpaSelects();
            $('#selRev').show();
        };

        function setaVendedor() {
            limpaSelects();
            $('#selVen').show();
        };

        function dynamicColors() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };

        $("#btnFiltra").click(function() {
            $('#grafPadrao').fadeOut();
            var $de, $para, $sid, $cid, $vid, $estado, $cidade;
            $de = $(".dpd1").val();
            $para = $(".dpd2").val();
            $sid = $('#seIdRev').val();
            $cid = $('#seIdCli').val();
            $vid = $('#seIdVen').val();
            $estado = $('#selIdEstado').val();
            $cidade = $('#tbCidade').val();


            if ($de == "" && $para == "") {
                $texto = 'Mês atual';
            } else {
                $texto = 'Período selecionado';
            }
            console.log($estado);
            console.log($cidade);
            var api = new Api('relatorios', {
                "de": $de,
                "para": $para,
                "sid": $sid,
                "cid": $cid,
                "vid": $vid,
                "est": $estado,
                "cidade": $cidade
            })
            api.send(function(res) {
                if (!res.error) {
                    if (res.orcMes) {
                        $("#orcQtd").html('Orçamentos realizados no ' + $texto + ': ' + res.orcMes);
                    } else {
                        $("#orcQtd").html('Nenhum Orçamento encontrado no ' + $texto);
                    }
                    if (res.media[0] != null) {
                        $("#vlMedio").html('Valor médio dos orçamentos: R$ ' + res.media[0]);
                    } else {
                        $("#vlMedio").html('');
                    }
                    if (res.orcData.length > 0) {
                        document.getElementById("customCtn").innerHTML = '<label for="myCustomChart">' + $texto + '</label><canvas id="myCustomChart"></canvas>';
                        var meses = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                        var i;
                        var dataQtd = [];
                        for (i = 0; i < res.orcData.length; i++) {
                            dataQtd[i] = res.orcData[i]['Qtd'];
                        }

                        var dataLabel = [];
                        for (i = 0; i < res.orcData.length; i++) {
                            dataLabel[i] = meses[res.orcData[i]['Mes']] + "/" + res.orcData[i]['Ano'];
                        }

                        var dataCor = [];
                        for (i = 0; i < res.orcData.length; i++) {
                            dataCor[i] = dynamicColors();
                        }

                        var meses = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                        let ctx = document.getElementById('myCustomChart').getContext('2d');
                        let myPieChart = new Chart(ctx, {
                            type: 'bar',

                            data: {
                                datasets: [{
                                    label: 'Orçamentos do período',

                                    data: dataQtd,

                                    backgroundColor: dataCor
                                }],

                                labels: dataLabel
                            },
                            options: {}
                        });
                    } else {
                        document.getElementById("customCtn").innerHTML = '<label for="myCustomChart"></label><canvas id="myCustomChart"></canvas>';
                    }
                } else {
                    Erro(res);
                }
            });
        });
    });
</script>