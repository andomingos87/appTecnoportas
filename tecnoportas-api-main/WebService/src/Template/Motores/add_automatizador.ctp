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
                <form id='formAutomatizadores' method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbImg'>Foto:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?= $this->Layout->getLink('files?name=sem-img.jpg') ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='automatizador[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='automatizador[codigo]'/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' type='text' class="form-control" name='automatizador[nome]'/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' class="form-control" name='automatizador[descricao]'></textarea>
                    </div>
                    <div class="form-group">
                        <div>
                            <strong>Incluir na categoria:</strong>
                        </div>
                        <?php if (count($categorias)) : foreach ($categorias as $categoria) : ?>
                        <label class="radio-inline">
                            <label for="categoria<?= $categoria['id'] ?>">
                                <img src="<?= $this->Layout->getLink('files?name='.$categoria['imagem']) ?>" class="icone" alt="<?= $categoria['nome'] ?>"/>
                                <div><?= $categoria['nome'] ?></div>
                            </label>
                            <input type="radio" value="<?= $categoria['id'] ?>" name="categorias[]" id="categoria<?= $categoria['id'] ?>">
                        </label>
                        <?php endforeach; else: ?>
                        <strong>Nenhuma categoria cadastrada!</strong>
                        <?php endif; ?>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Valor:</label>
                        <input id='tbVu' class="form-control" type='text' name='automatizador[valor_unitario]' placeholder="0.00"/>
                    </div>
                    <a href="<?= $this->Layout->getLink('motores/automatizadores') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </div>
    </div>
</div>