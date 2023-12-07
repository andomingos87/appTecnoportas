<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Categorias
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
                                <th>Imagem</th>
                                <th class="hidden-phone">Nome</th>
                                <th><a href="<?= $this->Layout->getLink('motores/addCategoria') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($categorias)) : foreach ($categorias as $categoria) : ?>
                            <tr>
                                <td><?= $categoria['id']?></td>
                                <td><img src='<?= $this->Layout->getLink('files?name='.$categoria['imagem']) ?>' alt='<?= $categoria['nome'] ?>'/></td>
                                <td class="hidden-phone"><?= $categoria['nome'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('motores/editCategoria?cid='.$categoria['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir a Categoria de Motor <?= $categoria['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('motores/delCategoria?cid='.$categoria['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>