<div class="row">
    <div class="col-sm-12">
        <section class="panel">
        <form id="formTemplateReprova" method="POST" enctype="multipart/form-data">
            <header class="panel-heading">
                Template Reprovação
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <p>Nota: Utilize <b>$usuario</b> para referênciar o nome do usuário no template de email</p>
                <textarea name="templateEmail"><?= $template['content'] ? $template['content'] : ''?></textarea>
                <div class="form-group slide-toggle">
                    <label for='cbAtivo'>Template Ativo: </label>
                    <input id='cbAtivo' type="checkbox" class="js-switch-blue" name='ativo' value='1' <?= $template['ativo'] ? 'checked=checked' : ''?>/>
                </div>
            </div>
            <footer class="panel-footer">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <div class="col-sm-12 text-right">
                                <button type="button" class="btn btn-default" onclick="location.href='<?= $this->Layout->getLink("precadastro") ?>';">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
            </footer>
            </form>
        </section>
    </div>
</div>
<script src="https://cdn.tiny.cloud/1/o1d8xvajrf1qktpzg1xjap14ediovyfw5301x2qxp280snwq/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
<script>tinymce.init({selector:'textarea'});</script>
    