<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Componentes
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Código</th>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th class="hidden-phone">Padrão</th>
                                <th>Valor (R$)</th>
                                <th><a href="<?= $this->Layout->getLink('portoes/addComponente') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($componentes)) : foreach ($componentes as $componente) : ?>
                            <tr>
                                <td><?= $componente['id'] ?></td>
                                <td><?= $componente['codigo'] ?></td>
                                <td><img src='<?= $this->Layout->getLink('files?name='.($componente['imagem'] ? : 'sem-img.jpg')) ?>' alt='<?= $componente['nome'] ?>'/></td>
                                <td><?= $componente['nome'] ?></td>
                                <td class="hidden-phone"><?= $componente['is_padrao'] ? 'Sim' : 'Não' ?></td>
                                <td><?= $componente['valor_unitario'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('portoes/editComponente?cid='.$componente['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir Componente <?= $componente['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('portoes/delComponente?cid='.$componente['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>