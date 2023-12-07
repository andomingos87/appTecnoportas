<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Atributos
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
                                <th>imagem</th>
                                <th>Nome</th>
                                <th class="hidden-phone">Tipo</th>
                                <th><a href="<?= $this->Layout->getLink('atributos/novo') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($atributos)) : foreach ($atributos as $atributo) : ?>
                            <tr>
                                <td><?= $atributo['id'] ?></td>
                                <td><img src='<?= $this->Layout->getLink('files?name='.($atributo['imagem'] ? : 'sem-img.jpg')) ?>' alt='<?= $atributo['nome'] ?>'/></td>
                                <td><?= $atributo['nome'] ?></td>
                                <td class="hidden-phone"><?= $arrayTipos[$atributo['tipo']] ?></td>
                                <td><a href="<?= $this->Layout->getLink('atributos/editar?aid='.$atributo['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a><a href="#" onclick="if (confirm('Excluir Atributo <?= $atributo['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('atributos/excluir?aid='.$atributo['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>