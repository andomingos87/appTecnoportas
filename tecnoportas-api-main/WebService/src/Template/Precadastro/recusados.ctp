<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Pré - Cadastros Recusados
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
                                <th>Aparelho</th>
                                <th>Aparelho Ativo</th>
                                <th>Data de Cadastro</th>
                                <th>Telefone</th>
                                <th>Localização</th>
                                <th>Nome de Usuário</th>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($precads)) : foreach ($precads as $precad) : $data = date_create($precad['dt_cadastro']) ?>
                            <tr>
                                <td><?= $precad['id'] ?></td>
                                <td><?= $precad['modelo']?></td>
                                <td><?= $precad['is_aprovado'] == 1 ? 'Ativo' : 'Não Ativo' ?></td>
                                <td><?= date_format($data, 'Y/m/d') ?><br/><?= date_format($data, 'H:i') ?></td>
                                <td><?= "(" . $precad['ddd'] . ") " . $precad['numero'] ?></td>
                                <td><?= $precad['cidade'] . "-" . $precad['uf'] ?></td>
                                <td><?= $precad['username'] ?></td>
                                <td><?= $precad['nome'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('serralheiros/detalhes?sid='.$precad['pessoaId']) ?>">Detalhes</a> | <a href="#" onclick="if (confirm('Aprovar usuário <?= $precad['username'] ?>?')) { location.href='<?= $this->Layout->getLink('precadastro/aprova?uid=' . $precad['id'] . '&recusados=true') ?>'; }">Aprovar</a></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <script>
        // console.log('<?= json_encode($precads); ?>');
    </script>
