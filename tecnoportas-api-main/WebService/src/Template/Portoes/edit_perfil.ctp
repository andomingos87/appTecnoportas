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
                        <label for='tbImg'>Icone:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?php if (!empty($perfil['imagem'])) { echo $this->Layout->getLink('files?name='.$perfil['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); } ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='perfil[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='perfil[codigo]' value="<?= $perfil['codigo'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='perfil[nome]' value="<?= $perfil['nome'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3" class="form-control" name='perfil[descricao]'><?= $perfil['descricao'] ?></textarea>
                    </div>
                    <div class="form-group">
                        <label for='tbVu'>Valor por M2: (Metro Quadrado)</label>
                        <input id='tbVu' class="form-control" type='text' name='perfil[valor_unitario]' placeholder="0.00" value="<?= $perfil['valor_unitario'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Peso por M2:</label>
                        <input id='tbNome' class="form-control" type='text' name='perfil[peso_m2]' placeholder="0.000"value="<?= $perfil['peso_m2'] ?>"/>
                    </div>
                    <div class="form-group">
                        <div>
                            <strong>Atributos para esse perfil:</strong>
                        </div>
                        <label>Modelos:</label>
                        <div id="divChp" class="divLig"><?php $ck = " checked='checked'"; ?>
                            <?php if (count($chp)) : $idC = $perfil['chapa_id']; foreach ($chp as $ch) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $ch['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$ch['imagem']) ?>" alt="<?= $ch['nome'] ?>"/>
                                    <div><?= $ch['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $ch['id'] ?>" name="chp" id="ligacoes<?= $ch['id'] ?>"<?= $ch['id'] == $idC ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Perfis:</label>
                        <div id="divPrf" class="divLig">
                            <?php if (count($prf)) : $idP = $perfil['perfil_id']; foreach ($prf as $pr) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $pr['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$pr['imagem']) ?>" alt="<?= $pr['nome'] ?>"/>
                                    <div><?= $pr['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $pr['id'] ?>" name="prf" id="ligacoes<?= $pr['id'] ?>"<?= $pr['id'] == $idP ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Chapas:</label>
                        <div id="divEsp" class="divLig">
                            <?php if (count($esp)) : $idE = $perfil['espessura_id']; foreach ($esp as $es) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $es['id'] ?>">
                                    <div><?= $es['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $es['id'] ?>" name="esp" id="ligacoes<?= $es['id'] ?>"<?= $es['id'] == $idE ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <label>Materiais:</label>
                        <div id="divMat" class="divLig">
                            <?php if (count($mat)) : $idM = $perfil['material_id']; foreach ($mat as $ma) : ?>
                            <label class="radio-inline">
                                <label for="ligacoes<?= $ma['id'] ?>">
                                    <div><?= $ma['nome'] ?></div>
                                </label>
                                <input type="radio" value="<?= $ma['id'] ?>" name="mat" id="ligacoes<?= $ma['id'] ?>"<?= $ma['id'] == $idM ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                    </div>
                    <a href="<?= $this->Layout->getLink('portoes/perfis') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>