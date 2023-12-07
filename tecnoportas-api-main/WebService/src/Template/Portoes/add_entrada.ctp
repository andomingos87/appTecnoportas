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
                <form id='formEntradas' method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbImg'>Imagem:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?= $this->Layout->getLink('files?name=sem-img.jpg') ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='entrada[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='entrada[codigo]'/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='entrada[nome]'/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' class="form-control" name='entrada[descricao]'></textarea>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Valor:</label>
                        <input id='tbVu' class="form-control" type='text' name='entrada[valor_unitario]' placeholder="0.00"/>
                    </div>
                    <div class="form-group">
                        <div>
                            <strong>Atributos para essa entrada:</strong>
                        </div>
                        <label>Tipos de Entrada:</label>
                        <div id="divEnt" class="divLig">
                            <?php if (count($ent)) : foreach ($ent as $en) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $en['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$en['imagem']) ?>" alt="<?= $en['nome'] ?>"/>
                                    <div><?= $en['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $en['id'] ?>" name="ent" id="ligacoes<?= $en['id'] ?>">
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Posições da Entrada:</label>
                        <div id="divPos" class="divLig">
                            <?php if (count($pos)) : foreach ($pos as $po) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $po['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$po['imagem']) ?>" alt="<?= $po['nome'] ?>"/>
                                    <div><?= $po['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $po['id'] ?>" name="pos" id="ligacoes<?= $po['id'] ?>">
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Modelos:</label>
                        <div id="divChp" class="divLig">
                            <?php if (count($chp)) : foreach ($chp as $ch) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $ch['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$ch['imagem']) ?>" alt="<?= $ch['nome'] ?>"/>
                                    <div><?= $ch['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $ch['id'] ?>" name="chp" id="ligacoes<?= $ch['id'] ?>">
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Perfis:</label>
                        <div id="divPrf" class="divLig">
                            <?php if (count($prf)) : foreach ($prf as $pr) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $pr['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$pr['imagem']) ?>" alt="<?= $pr['nome'] ?>"/>
                                    <div><?= $pr['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $pr['id'] ?>" name="prf" id="ligacoes<?= $pr['id'] ?>">
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Materiais:</label>
                        <div id="divMat" class="divLig">
                            <?php if (count($mat)) : foreach ($mat as $ma) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $ma['id'] ?>">
                                    <div><?= $ma['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $ma['id'] ?>" name="mat" id="ligacoes<?= $ma['id'] ?>">
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                    </div>
                    <a href="<?= $this->Layout->getLink('portoes/entradas') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>