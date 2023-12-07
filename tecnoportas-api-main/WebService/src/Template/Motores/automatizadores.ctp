<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Acionamentos
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
                                <th class="hidden-phone">Ref</th>
                                <th>Nome</th>
                                <th>Valor (R$)</th>
                                <th><a href="<?= $this->Layout->getLink('motores/addAutomatizador') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($automatizadores)) : foreach ($automatizadores as $automatizador) : ?>
                            <tr>
                                <td><?= $automatizador['id'] ?></td>
                                <td><img src='<?php if (!empty($automatizador['imagem'])) { echo $this->Layout->getLink('files?name='.$automatizador['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); }?>' alt='<?= $automatizador['nome'] ?>'/></td>
                                <td><?= $automatizador['codigo'] ?></td>
                                <td class="hidden-phone"><?= !empty($automatizador['codigo']) ? $automatizador['codigo'] : $automatizador['id'] ?></td>
                                <td><?= $automatizador['nome'] ?></td>
                                <td><?= $automatizador['valor_unitario'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('motores/editAutomatizador?&aid='.$automatizador['id']) ?>"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a> <a href="#" onclick="if (confirm('Excluir Automatizador <?= $automatizador['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('motores/delAutomatizador?aid='.$automatizador['id']) ?>'; }"><button class="btn btn-warning"><i class="fa fa-trash-o"></i></button></a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>