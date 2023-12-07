<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Informações
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
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th>Data</th>
                                <th><a href="<?= $this->Layout->getLink('informacoes/nova') ?>">+ Nova</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($infos)) : foreach ($infos as $info) : $data = date_create($info['dt_cadastro']); ?>
                            <tr>
                                <td><?= $info['id'] ?></td>
                                <td><img src='<?= $this->Layout->getLink('files?name='.($info['imagem'] ? : 'sem-img.jpg')) ?>' alt='<?= $info['nome'] ?>'/></td>
                                <td><?= $info['nome'] ?></td>
                                <td><?= date_format($data, 'Y/m/d') ?><br/><?= date_format($data, 'H:i') ?></td>
                                <td><a href="<?= $this->Layout->getLink('informacoes/editar?iid='.$info['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir Informação <?= $info['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('informacoes/excluir?iid='.$info['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>