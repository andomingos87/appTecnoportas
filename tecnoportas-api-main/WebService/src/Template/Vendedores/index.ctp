<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Vendedores
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
                                <th>Nome</th>
                                <th>Usuário</th>
                                <th class="hidden-phone">E-mail</th>
                                <th>Telefone</th>
                                <th class="hidden-phone"><a href="<?= $this->Layout->getLink('vendedores/novo') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($vendedores)) : foreach ($vendedores as $vendedor) : ?>
                            <tr>
                                <td><?= $vendedor['id'] ?></td>
                                <td><?= $vendedor['nome'] . " " . $vendedor['sobrenome'] ?></td>
                                <td><?= $vendedor['usuario'] ?></td>
                                <td class="hidden-phone"><?= $vendedor['email'] ?></td>
                                <td><?= "(" . $vendedor['ddd'] . ") " . $vendedor['numero'] ?></td>
                                <td class="hidden-phone"><a href="<?= $this->Layout->getLink('vendedores/editar?vid='.$vendedor['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir Vendedor <?= $vendedor['nome'] . ' ' . $vendedor['sobrenome'] ?>?')) { location.href='<?= $this->Layout->getLink('vendedores/deleta?vid='.$vendedor['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>