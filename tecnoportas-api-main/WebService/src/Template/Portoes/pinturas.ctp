<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Pinturas
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Código</th>
                                <th>Imagem</th>
                                <th class="hidden-phone">Nome</th>
                                <th>Valor (R$)</th>
                                <th><a href="<?= $this->Layout->getLink('portoes/addPintura') ?>">+ Nova</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($pinturas)) : foreach ($pinturas as $pintura) : ?>
                            <tr>
                                <td><?= $pintura['id'] ?></td>
                                <td><?= $pintura['codigo'] ?></td>
                                <td><img src='<?= $this->Layout->getLink('files?name='.$pintura['imagem']) ?>' alt='<?= $pintura['nome'] ?>'/></td>
                                <td><?= $pintura['nome'] ?></td>
                                <td><?= $pintura['valor_unitario'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('portoes/editPintura?pid='.$pintura['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir Pintura <?= $pintura['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('portoes/delPintura?pid='.$pintura['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>