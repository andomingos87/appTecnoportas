<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Produtos Desabilitados
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
                                <th>Valor</th>
                                <th>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($produtos)) : foreach ($produtos as $produto) : ?>
                            <tr>
                                <td class="hidden-phone"><?= $produto['id'] ?></td>
                                <td><?= $produto['nome'] ?></td>
                                <td><?= $produto['valor_unitario'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('produtos/habilitar?pid='.$produto['id']) ?>">Habilitar</a> / <a href="#" onclick="if (confirm('Excluir permanentemente o produto: <?= $produto['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('produtos/deletar?pid='.$produto['id']) ?>'; }">Excluir</a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>