<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Unidades de Medida
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
                                <th>Nome</th>
                                <th><a href="<?= $this->Layout->getLink('medidas/nova') ?>">+ Nova</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                            <tr>
                                <td class="hidden-phone"><?= $medida['id'] ?></td>
                                <td><?= $medida['nome'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('medidas/editar?mid='.$medida['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir a Unidade de Medida <?= $medida['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('medidas/deleta?mid='.$medida['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>