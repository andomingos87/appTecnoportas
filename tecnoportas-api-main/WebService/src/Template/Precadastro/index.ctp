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
                <div><label>Emails: </label><a href="<?= $this->Layout->getLink('precadastro/templateAprova')?>"><button type="button" class="btn btn-primary">Template Aprovação</button></a><a href="<?= $this->Layout->getLink('precadastro/templateReprova')?>"><button class="btn btn-primary" type="button" style="margin-left:2rem;">Template Reprovação</button></a></div>

                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome de Usuário</th>
                                <th>Nome</th>
                                <!-- <th>Pré - Cadastro</th> -->
                                <!-- <th>Recusado</th> -->
                                <th>Telefone</th> 
                                <th>Localização</th>
                                <th>Aparelho</th>
                                <th>Aparelho Ativo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($precads)) : foreach ($precads as $precad) : ?>
                            <tr>
                                <td><?= $precad['id'] ?></td>
                                <td><?= $precad['username'] ?></td>
                                <td><?= $precad['nome'] ?></td>
                                <td><?= "(" . $precad['ddd'] . ") " . $precad['numero'] ?></td>
                                <td><?= $precad['cidade'] . "-" . $precad['uf'] ?></td>
                                <!-- <td><?= $precad['preCad'] == 1 ? 'Sim' : 'Não' ?></td> -->
                                <!-- <td><?= $precad['recusado'] > 0 ? 'Sim </br> '.$precad['recusado'] . ' Vez(es) ' : 'Não' ?></td> -->
                                <td><?= $precad['modelo']?></td>
                                <td><?= $precad['is_aprovado'] == 1 ? 'Ativo' : 'Não Ativo' ?></td>
                                <td><a href="<?= $this->Layout->getLink('serralheiros/detalhes?sid='.$precad['pessoaId']) ?>">Detalhes</a> | <a href="#" onclick="if (confirm('Aprovar usuário <?= $precad['username'] ?>?')) { location.href='<?= $this->Layout->getLink('precadastro/aprova?uid='.$precad['id']) ?>'; }">Aprovar</a> / <a href="#" onclick="if (confirm('Recusar Usuário <?= $precad['username']?>?')) { location.href='<?= $this->Layout->getLink('precadastro/recusar?uid='. $precad['id']) ?>'; }">Recusar</a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <script>
        console.log('<?= json_encode($precads); ?>');
    </script>