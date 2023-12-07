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
                <form id='formFitas' method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbImg'>Icone:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?= $this->Layout->getLink('files?name=sem-img.jpg') ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='fita[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='fita[codigo]'/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='fita[nome]'/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3"  class="form-control" name='fita[descricao]'></textarea>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Preço do Rolo: </label>
                        <input id='tbVu' class="form-control" type='text' name='fita[valor_unitario]' placeholder="0.00"/>
                    </div>
                    <div class="form-group">
                        <label for='tbForm'>Fórmula de exibição: </label>
                        <input id='tbForm' class="form-control formula" type='text' name='fita[formula]' data-submit="btSubmit" required/>
                    </div>
                    <div class="form-group">
                        <label>Cor: </label>
                        <?php if (count($atributos)) : foreach ($atributos as $atributo) : ?>
                        <label class="radio-inline">
                            <label for="cor<?= $atributo['id'] ?>">
                                <div><?= $atributo['nome'] ?></div>
                            </label>
                            <input type="radio" value="<?= $atributo['id'] ?>" name="fita[cor]" id="atributo<?= $atributo['id'] ?>">
                        </label>
                        <?php endforeach; else: ?>
                        <strong>Nenhuma cor cadastrada!</strong>
                        <?php endif; ?>
                    </div>
                    <a href="<?= $this->Layout->getLink('portoes/fitaPvc') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>