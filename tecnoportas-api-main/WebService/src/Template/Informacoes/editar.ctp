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
                <form id='formPerfis' method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbImg'>Imagem:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?php if (!empty($info['imagem'])) { echo $this->Layout->getLink('files?name='.$info['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); } ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='info[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='info[nome]' value="<?= $info['nome'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3" class="form-control" name='info[descricao]'><?= $info['descricao'] ?></textarea>
                    </div>
                    <a href="<?= $this->Layout->getLink('portoes/perfis') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></button>
                </form>
            </div>
        </section>
    </div>
</div>