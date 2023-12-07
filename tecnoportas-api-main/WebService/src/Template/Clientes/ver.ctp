<div class="row">
    <div class='col-md-4'>
        <div class="row">
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Cliente <?= $cliente['id'] ?>
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul><?php $arrayTipos = array('F'=>'Pessoa Física', 'J'=>'Pessoa Jurídica'); ?>
                            <li><strong>Nome: </strong><?= $cliente['nome'].' '.$cliente['sobrenome'] ?></li>
                            <li><strong>Tipo: </strong><?= $arrayTipos[$cliente['tipo']] ?></li>
                            <li><strong>Documento: </strong><?= $cliente['cnpj']?></li>
                            <li><strong>E-mail: </strong><a href='mailto:<?= $cliente['email'] ?>'><?= $cliente['email'] ?></a></li>
                            <li><strong>Telefone: </strong><a href='tel:<?= $cliente['ddd'].$cliente['numero'] ?>'>(<?= $cliente['ddd'] ?>) <?= $cliente['numero'] ?></a></li>
                            <li><strong>Localização: </strong><?= $cliente['cidade'].'-'.$cliente['uf'] ?></li>
                            <li><strong>Logradouro: </strong><?= $cliente['logradouro'] ?></li>
                            <li><strong>Número: </strong><?= $cliente['endNumero'] ?></li>
                            <li><strong>Complemento: </strong><?= $cliente['referencia'] ?></li>
                            <li><strong>País: </strong><?= $cliente['pais'] ?></li>
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
                        Orçamentos de <?= $cliente['nome'].' '.$cliente['sobrenome'] ?>
                        <span class="tools pull-right">
                            <a href="javascript:;" class="fa fa-chevron-down"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <div class="adv-table">
                            <table  class="display table table-bordered table-striped" id="dynamic-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Status</th>
                                        <th>Valor Total</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (count($orcamentos)) : $arrayStatus = array('Cancelado', 'Pendente', 'Concluido'); foreach ($orcamentos as $orcamento) : ?>
                                    <tr>
                                        <td><?= $orcamento['dt_cadastro'] ?></td>
                                        <td><?= $arrayStatus[$orcamento['status']] ?></td>
                                        <td><?= $orcamento['valor_total'] ?></td>
                                        <td><a href="<?= $this->Layout->getLink('orcamentos/abrir?oid='.$orcamento['id']) ?>">Abrir</a></td>
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
