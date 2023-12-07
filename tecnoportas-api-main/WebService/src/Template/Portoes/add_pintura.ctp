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
                <form id='formPinturas' method="POST" enctype="multipart/form-data">
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
                                    <input id='tbImg' type='file' name='pintura[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='pintura[codigo]'/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='pintura[nome]'/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3"  class="form-control" name='pintura[descricao]'></textarea>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Valor por M2: (Metro Quadrado)</label>
                        <input id='tbVu' class="form-control" type='text' name='pintura[valor_unitario]' placeholder="0.00"/>
                    </div>
                    <div class="form-group">
                        <label>Cor da Fita PVC:</label>
                        <?php if (count($fitas)) : foreach ($fitas as $fita) : ?>
                        <label class="radio-inline">
                            <label for="fita<?= $fita['cor_id'] ?>">
                                <div><?= $fita['cor_nome'] ?></div>
                            </label>
                            <input type="radio" value="<?= $fita['cor_id'] ?>" name="fitas" id="fita<?= $fita['cor_id'] ?>">
                        </label>
                        <?php endforeach; else: ?>
                        <strong>Nenhuma fita cadastrada!</strong>
                        <?php endif; ?>
                    </div>
                    <div class="form-group">
                        <label for='tbGrupo'>Número do Grupo: </label>
                        <input id='tbGrupo' class="form-control" type='number' name='grupo'/>
                    </div>
                    <a href="<?= $this->Layout->getLink('portoes/pinturas') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>