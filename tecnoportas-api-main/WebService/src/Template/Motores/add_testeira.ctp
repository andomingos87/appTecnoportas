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
                <form id='formTesteiras' method="POST" enctype="multipart/form-data" onsubmit="return checkTesteiras(event)">
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
                                    <input id='tbImg' type='file' name='testeira[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='testeira[codigo]'/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' type='text' class="form-control" name='testeira[nome]'/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3" class="form-control" name='testeira[descricao]'></textarea>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Valor:</label>
                        <input id='tbVu' class="form-control" type='text' name='testeira[valor_unitario]' placeholder="0.00"/>
                    </div>
                    <div class="form-group">
                        <div>
                            <strong>Incluir motor:</strong>
                        </div>
                        <?php if (count($motores)) : for ($i = 0; $i < count($motores); $i++) : ?>
                        <label class="checkbox-inline">
                            <label for="motor<?= $motores[$i]['id'] ?>">
                                <img src="<?= $this->Layout->getLink('files?name='.$motores[$i]['imagem']) ?>" class="icone" alt="<?= $motores[$i]['nome'] ?>"/>
                                <div><?= $motores[$i]['nome'] ?></div>
                            </label>
                            <input type="checkbox" value="<?= $motores[$i]['id'] ?>" name="motores[]" id="motor<?= $motores[$i]['id'] ?>">
                        </label>
                        <?php endfor; else: ?>
                        <strong>Nenhum motor cadastrada!</strong>
                        <?php endif; ?>
                    </div>
                    <a href="<?= $this->Layout->getLink('motores/testeiras') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>