<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Aparelhos
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
                                <th>Nome de Usuário</th>
                                <th>Aparelho</th>
                                <th>UUID</th>
                                <th>Status do aparelho</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($aparelhos)) : foreach ($aparelhos as $aparelho) : ?>
                            <tr>
                                <td><?= $aparelho['id'] ?></td>
                                <td><?= $aparelho['nome'] ." ".$aparelho['sobrenome'] ?></td>
                                <td><?= $aparelho['username'] ?></td>
                                <td><?= $aparelho['modelo'] ?></td>
                                <td><?= $aparelho['uuid']?></td>
                                <td><?= $aparelho['is_aprovado'] == 1 ? 'Aprovado' : 'Não Aprovado' ?></td>
                                <td class="hidden-phone"><a href="<?= $this->Layout->getLink('serralheiros/detalhes?sid='.$aparelho['id']) ?>">Detalhes</a> | <?php if ($aparelho['is_aprovado'] == 0) : ?><a href="#" onclick="if (confirm('Ativar Aparelho <?= $aparelho['nome'] ?>?')) { location.href='<?= $this->Layout->getLink('aparelhos/ativa?aid='.$aparelho['apId']) ?>'; }">Ativar</a><?php else : ?><a href="#" onclick="if (confirm('Desativar Aparelho <?= $aparelho['nome']?>?')) { location.href='<?= $this->Layout->getLink('aparelhos/desativa?aid='.$aparelho['apId']) ?>'; }">Desativar</a><?php endif; ?></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>