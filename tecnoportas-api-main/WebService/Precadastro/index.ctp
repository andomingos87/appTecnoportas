<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Pré - Cadastros / Aparelhos
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id Usuário</th>
                                <th>Nome</th>
                                <th>Nome de Usuário</th>
                                <th>Pré - Cadastro</th>
                                <th>Recusado</th>
                                <th>Aparelho</th>
                                <th>Ativo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($precads)) : foreach ($precads as $precad) : ?>
                            <tr>
                                <td><?= $precad['id'] ?></td>
                                <td><?= $precad['username'] ?></td>
                                <td><?= $precad['nome'] ?></td>
                                <td><?= $precad['preCad'] == 1 ? 'Sim' : 'Não' ?></td>
                                <td><?= $precad['recusado'] == 1 ? 'Sim' : 'Não' ?></td>
                                <td><?= $precad['modelo']?></td>
                                <td><?= $precad['is_aprovado'] == 1 ? 'Ativo' : 'Não Ativo' ?></td>
                                <td class="hidden-phone"><a href="<?= $this->Layout->getLink('serralheiros/detalhes?sid='.$precad['id']) ?>">Detalhes</a> | <a href="#" onclick="if (confirm('Aprovar usuário <?= $precad['username'] ?>?')) { location.href='<?= $this->Layout->getLink('precadastro/aprova?uid='.$precad['id']) ?>'; }">Aprovar</a> / <a href="#" onclick="if (confirm('Recusar Usuário <?= $precad['username']?>?')) { location.href='<?= $this->Layout->getLink('precadastro/reprova?uid='. $precad['apId']) ?>'; }">Recusar</a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>