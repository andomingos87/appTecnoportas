<div class="row">
    <div class='col-md-4'>
        <div class="row">
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        <?= $title ?>
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul>
                            <li>
                                <strong>Data de Cadastro:</strong>
                                <?php $data = date_create($orcamento['dt_cadastro']);
                                echo date_format($data, 'd/m/Y').' às '.date_format($data, 'H:i');
                                ?>
                            </li>
                            <form method="post" class="form-inline">
                                <li class="mb-1">
                                    <label class="control-label" for="seStatus">
                                        <strong>Status:</strong>
                                    </label>
                                    <select name="status" class="form-control" id="seStatus" onchange="seStatusChange();">
                                        <?php $arrayStatus = array('Cancelado', 'Pendente', 'Concluido');
                                        for ($i = 0; $i < count($arrayStatus); $i++){ ?>
                                            <option value="<?= $i ?>"<?php if ($orcamento['status'] == $i) { echo " selected='selected'"; } ?>><?= $arrayStatus[$i] ?></option>
                                        <?php } ?>
                                    </select>
                                </li>
                                <li id="updateCanceledMotiveCtn" class="mb-1 invisivel">
                                        <label class="control-label" for="motivoCancelamento">
                                            <strong>Motivo:</strong>
                                        </label>
                                        <select id="motivoCancelamento" name="motivo_cancelamento" class="form-control" data-value="<?= $orcamento['motivo_cancelamento']?>" onchange="seStatusChange();">
                                            <option value="">--Selecione--</option>
                                            <option value="1">Prazo</option>
                                            <option value="2">Preço</option>
                                            <option value="3">Atendimento</option>
                                            <option value="4">Outros</option>
                                        </select>
                                </li>
                                <li id="updateStatusCtn" class="mb-1 invisivel">
                                    <button class="btn btn-info" type="submit">
                                        <i class="fa fa-refresh"></i> Atualizar
                                    </button>
                                </li>
                            </form>
                            <?php if (!empty($orcamento['pdf'])) : ?><li><a href="<?= $this->Layout->getLink('files?name='.$orcamento['pdf']); ?>" target="_blank">Abrir PDF</a></li><?php endif; ?>
                        </ul>
                        <h4 class="text-right">Valor Total: <strong>R$: <?=$orcamento['valor_total']?></strong></h4>
                    </div>
                    <script>
                        var seStatus = document.getElementById('seStatus'),
                        ctnStatusUpdate = document.getElementById('updateStatusCtn')
                        motivoCancelamento = document.getElementById('updateCanceledMotiveCtn'),
                        motivoCancelamentoSelect = document.getElementById('motivoCancelamento');
                        var selecao = seStatus.selectedIndex;
                        var motivo =  motivoCancelamentoSelect.dataset.value;

                        function showMotiveSelection(){
                            motivoCancelamento.classList.remove('invisivel');
                            motivoCancelamentoSelect.required = true;
                        }

                        function removeMotiveSelection(){
                            motivoCancelamento.classList.add('invisivel');
                            motivoCancelamentoSelect.required = false;
                        }

                        function seStatusChange () {
                            if(seStatus.value == '0'){
                                showMotiveSelection();
                            }else{
                                removeMotiveSelection();
                            }

                            if (seStatus.selectedIndex != selecao){
                                ctnStatusUpdate.classList.remove('invisivel');
                                return;
                            }
                            else{
                                ctnStatusUpdate.classList.add('invisivel');
                            }

                            if(motivo != motivoCancelamentoSelect.value){
                                ctnStatusUpdate.classList.remove('invisivel');
                                return;
                            }else{
                                ctnStatusUpdate.classList.add('invisivel');
                            }

                        };

                        window.onload = () => {
                            if(seStatus.value == '0'){
                                showMotiveSelection();
                                if(motivo){
                                    motivoCancelamentoSelect.value = motivo;
                                }
                            }
                        };
                    </script>
                </section>
            </div>
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Portão
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul>
                            <li><strong>Nº de Portas:</strong> <?= $orcamento['portas'] ?></li>
                            <li><strong>Largura: (m)</strong> <?= $orcamento['largura'] ?></li>
                            <li><strong>Altura: (m)</strong> <?= $orcamento['altura'] ?></li>
                            <li><strong>Rolo: (m) </strong> <?= $orcamento['largura'] < 8.5 ? 0.60 : 0.90 ?></li>
                            <li><strong>Tipo de instalação: </strong> <?= $orcamento['is_dentro_vao']?></li>
                        </ul>
                    </div>
                    <form id="formOcorrencias" method="post" class="border-top">
                        <textarea class="form-control input-lg p-text-area" rows="3" placeholder="Ocorrências" name="ocorrencias"><?= $orcamento['ocorrencias'] ?></textarea>
                        <footer class="panel-footer">
                            <button class="btn btn-post pull-right">Enviar</button>
                            <ul class="nav nav-pills p-option"></ul>
                        </footer>
                    </form>
                </section>
            </div>
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Serralheiro
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul><?php $tipoP = array('F'=>'Física', 'J'=>'Jurídica'); ?>
                            <li><strong>Nome: </strong><a href="<?= $this->Layout->getLink('serralheiros/detalhes?sid='.$orcamento['se_id']) ?>"><?= $orcamento['se_tipo'] == "F" ? ($orcamento['se_nome'] . " " . $orcamento['se_snome']) : $orcamento['se_snome'] ?></a></li>
                            <li><strong>Tipo:</strong> Pessoa <?= $tipoP[$orcamento['se_tipo']] ?></li>
                            <li><strong>Data de Cadastro:</strong> <?php
                                $data = date_create($orcamento['se_cadastro']);
                                echo date_format($data, 'd/m/Y').' às '.date_format($data, 'H:i');
                            ?></li>
                        </ul>
                    </div>
                </section>
            </div>
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Cliente
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul><?php $tipoP = array('F'=>'Física', 'J'=>'Jurídica'); ?>
                            <li><strong>Nome:</strong> <a href="<?= $this->Layout->getLink('clientes/ver?cid='.$orcamento['cli_id']) ?>"><?= $orcamento['cli_tipo'] == "F" ? $orcamento['cli_nome']." ".$orcamento['cli_snome'] : $orcamento['cli_snome'] ?></a></li>
                            <li><strong>Tipo:</strong> Pessoa <?= $tipoP[$orcamento['cli_tipo']] ?></li>
                            <li><strong>Data de Cadastro:</strong> <?php
                                $data = date_create($orcamento['cli_cadastro']);
                                echo date_format($data, 'd/m/Y').' às '.date_format($data, 'H:i');
                            ?></li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <div class="col-md-8">
        <div class="row">
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Produtos
                        <span class="tools pull-right">
                            <a href="javascript:;" class="fa fa-chevron-down"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <div class="adv-table">
                            <table  class="display table table-bordered table-striped" id="dynamic-table">
                                <thead>
                                    <tr>
                                        <th class="hidden-phone">Imagem</th>
                                        <th>Qtd</th>
                                        <th>Nome</th>
                                        <th>Valor (R$)</th>
                                        <th class="hidden-phone">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($produtos)) : foreach ($produtos as $produto) : $tip = $produto['tipo']; ?>
                                    <tr>
                                        <td class="hidden-phone"><img src="<?= $this->Layout->getLink('files?name='.($produto[$tip == "mot" ? "mto_img" : "imagem"] ? : 'sem-img.jpg')) ?>" alt="<?= $produto['nome'] ?>"/></td>
                                        <td><?= $produto['quantidade'] ?><br/>(<?= $produto['tipo_medida'] ?>)</td>
                                        <td><?= $tip == 'esp' ? "Espessura (".$produto['espessura']." mm)" : $produto['nome'] ?></td>
                                        <td>R$: <?= number_format($produto['preco_unitario'], 2, ',', '.') ?></td>
                                        <td class="hidden-phone"><a href="<?= $this->Layout->getLink(($tip == 'mto' || $tip == 'aut' ? 'motores' : 'portoes') .'/edit'. ( $tip == 'chp' ? 'Chapa?cid='.$produto['chp_id'] : ( $tip == 'esp' ? 'Espessura?eid='.$produto['esp_id'] : ( $tip == 'prf' ? 'Perfil?pid='.$produto['prf_id'] : ( $tip == 'mat' ? 'Material?mid='.$produto['mat_id'] : ( $tip == 'mto' ? 'ar?mid='.$produto['mto_id'] : ( $tip == 'aut' ? 'Automatizador?aid='.$produto['aut_id'] : ( $tip == 'ptr' ? 'Pintura?pid='.$produto['ptr_id'] : 'Componente?cid='.$produto['id'])))))))) ?>">Abrir</a></td>
                                    </tr>
                                    <?php endforeach; endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
