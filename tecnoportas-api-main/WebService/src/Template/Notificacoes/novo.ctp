<div class="row">
    <div class='col-md-12'>
        <section class="panel">
            <header class="panel-heading">
                <?= $title ?>
                <span class="tools pull-right">
                    <a class="fa fa-chevron-down" href="javascript:;"></a>
                </span>
            </header>
            <div class="panel-body">
                <form id='formNotificacao' method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbTitulo'>Título:</label>
                        <input id='tbTitulo' class="form-control" type='text' name='notificacao[titulo]'/>
                    </div>
                    <div class="form-group">
                        <label for='tbMsg'>Mensagem:</label>
                        <textarea id='tbMsg' type='text' class="form-control" name='notificacao[mensagem]' rows="4"></textarea>
                    </div>
                    <a href="<?= $this->Layout->getLink('notificacoes') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Publicar</button>
                </form>
            </div>
        </section>
    </div>
</div>