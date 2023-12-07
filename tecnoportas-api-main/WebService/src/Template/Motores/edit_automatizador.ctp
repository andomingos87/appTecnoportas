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
                                <label for='tbImg'><img src="<?php if (!empty($automatizador['imagem'])) { echo $this->Layout->getLink('files?name='.$automatizador['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); } ?>" alt="Enviar uma imagem" /></label>
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
                        <input id='tbCod' class="form-control" type='text' name='automatizador[codigo]' value="<?= $automatizador['codigo'] ?>"/>
                    </div>    
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' type='text' class="form-control" name='automatizador[nome]' value="<?= $automatizador['nome'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' class="form-control" name='automatizador[descricao]'><?= $automatizador['descricao'] ?></textarea>
                    </div>
                    <div class="form-group">
                        <div>
                            <strong>Incluir na categoria:</strong>
                        </div>
                        <?php if (count($categorias)) : for ($i = 0; $i < count($categorias); $i++) : ?>
                        <label class="radio-inline">
                            <label for="categoria<?= $categorias[$i]['id'] ?>">
                                <img src="<?= $this->Layout->getLink('files?name='.$categorias[$i]['imagem']) ?>" class="icone" alt="<?= $categorias[$i]['nome'] ?>"/>
                                <div><?= $categorias[$i]['nome'] ?></div>
                            </label>
                            <input type="radio" value="<?= $categorias[$i]['id'] ?>" name="categorias[]" id="categoria<?= $categorias[$i]['id'] ?>"<?= $categorias[$i]['id'] == $automatizador['catmotor_id'] ? " checked='checked'" : "" ?>>
                        </label>
                        <?php endfor; else: ?>
                        <strong>Nenhuma categoria cadastrada!</strong>
                        <?php endif; ?>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Valor:</label>
                        <input id='tbVu' class="form-control" type='text' name='automatizador[valor_unitario]' placeholder="0.00" value="<?= $automatizador['valor_unitario'] ?>"/>
                    </div>
                    <a href="<?= $this->Layout->getLink('motores/automatizadores') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>