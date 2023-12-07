<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Notificações
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Titulo</th>
                                <th>Mensagem</th>
                                <th><a href="<?= $this->Layout->getLink('notificacoes/novo') ?>">+ Novo</a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($notificacoes)) : foreach ($notificacoes as $notificacao) : ?>
                            <tr>
                                <td><?= $notificacao['id']?></td>
                                <td><?= $notificacao['titulo'] ?></td>
                                <td><?= $notificacao['mensagem'] ?></td>
                                <td></td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>