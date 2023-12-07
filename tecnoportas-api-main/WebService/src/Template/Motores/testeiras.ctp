<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Testeiras
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
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Valor (R$)</th>
                                <th><a href="<?= $this->Layout->getLink('motores/addTesteira') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($testeiras)) : foreach ($testeiras as $testeira) : ?>
                            <tr>
                                <td><?= $testeira['id']?></td>
                                <td><img src='<?php if (!empty($testeira['imagem'])) { echo $this->Layout->getLink('files?name='.$testeira['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); } ?>' alt='<?= $testeira['nome'] ?>'/></td>
                                <td><?= $testeira['codigo'] ?></td>
                                <td><?= $testeira['nome'] ?></td>
                                <td><?= $testeira['valor_unitario'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('motores/editTesteira?tid='.$testeira['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir Testeira <?= $testeira['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('motores/delTesteira?tid='.$testeira['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>