<div class="row">
    <!-- <pre><span style="display:none"><?=var_dump($orcamentos)?></span></pre> -->
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Orçamentos 
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th class="hidden-phone">ID</th>
                                <th>Data</th>
                                <th>Status Orçamento</th>
                                <th class="hidden-phone">Cliente</th>
                                <th class="hidden-phone">Revendedor</th>
                                <th>Valor (R$)</th>
                                <th class="hidden-phone">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($orcamentos)) : $arrayStatus = array('Cancelado', 'Pendente', 'Concluido'); foreach ($orcamentos as $orcamento) : $data = date_create($orcamento['dt_cadastro']); ?>
                            <tr>
                                <td class="hidden-phone"><?= $orcamento['id'] ?></td>
                                <td><?= date_format($data, 'Y/m/d') ?><br/><?= date_format($data, 'H:i') ?></td>
                                <td><?= $arrayStatus[$orcamento['status']] ?></td>
                                <?php $nome = $orcamento['nome'] . " " . $orcamento['sobrenome']?>
                                <td class="hidden-phone"><?= strlen($nome) > 40 ? substr($nome,0,40) : $nome ?></td>
                                <td><?= $orcamento['revendedor']?></td>
                                <td>R$: <?= number_format($orcamento['valor_total'], 2, ',', '.') ?></td>
                                <td class="hidden-phone"><a href="<?= $this->Layout->getLink('orcamentos/abrir?oid='.$orcamento['id']) ?>"><button class="btn btn-info"><i class="fa fa-eye"></i></button></a> <a href="#" onclick="if (confirm('Excluir Orçamento <?= $orcamento['id'] ?>?')) { location.href='<?= $this->Layout->getLink('orcamentos/excluir?oid='.$orcamento['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>