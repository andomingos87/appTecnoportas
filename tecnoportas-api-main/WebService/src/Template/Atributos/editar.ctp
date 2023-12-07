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
                <form id='formAtributo' role="form" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbImg'>Icone:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?php if (!empty($atributo['imagem'])) { echo $this->Layout->getLink('files?name='.$atributo['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); } ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='atributo[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='seTipo'>Tipo:</label><?php $tp = $atributo['tipo']; $sl = " selected='selected'"; $in = " invisivel"; $ck = " checked='checked'" ?>
                        <select id='seTipo' class="form-control" type='text' onchange="seTipoChange(this)" name='atributo[tipo]'>
                            <?php foreach($arrayTipos as $key => $tip) : ?>
                            <option value="<?= $key ?>"<?= $tp == $key ? $sl : "" ?>><?= $tip ?></option>
                            <?php endforeach; ?>
                        </select>
                        <script>
                            function seTipoChange(el){
                                $('.divLig').addClass('invisivel'); 
                                $('#divLigs').removeClass('invisivel');
                                switch (el.value) {
                                    case 'chp' : $('#divPrf').removeClass('invisivel'); break;
                                    case 'prf' : $('#divEsp').removeClass('invisivel'); break;
                                    case 'esp': $('#divMat').removeClass('invisivel'); break;
                                    case "ent" : $('#divEntr').removeClass("invisivel"); break;
                                    default: $('#divLigs').addClass('invisivel'); 
                                    break; 
                                }
                            }
                        </script>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='atributo[nome]' value="<?= $atributo['nome'] ?>"/>
                    </div>
                    <div id="divLigs" class="form-group<?= $tp == 'mat' ||  $tp == 'cor' ||  $tp == 'pos' || $tp == 'tpi' ? $in : "" ?>">
                        <div>
                            <strong>Ligações para esse atributo:</strong>
                        </div>
                        <div id="divPrf" class="divLig<?= $tp != 'chp' ? $in : "" ?>">
                            <?php if (count($prf)) : foreach ($prf as $pr) : ?>
                            <label class="checkbox-inline">
                                <label for="ligacoes<?= $pr['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$pr['imagem']) ?>" alt="<?= $pr['nome'] ?>"/>
                                    <div><?= $pr['nome'] ?></div>
                                </label>
                                <input type="checkbox" value="<?= $pr['id'] ?>" name="ligacoes[]" id="ligacoes<?= $pr['id'] ?>"<?= in_array($pr['id'],$ligacoes) ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <div id="divEsp" class="divLig<?= $tp != 'prf' ? $in : "" ?>">
                            <?php if (count($esp)) : foreach ($esp as $es) : ?>
                            <label class="checkbox-inline">
                                <label for="ligacoes<?= $es['id'] ?>">
                                    <div><?= $es['nome'] ?></div>
                                </label>
                                <input type="checkbox" value="<?= $es['id'] ?>" name="ligacoes[]" id="ligacoes<?= $es['id'] ?>"<?= in_array($es['id'],$ligacoes) ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <div id="divMat" class="divLig<?= $tp != 'esp' ? $in : "" ?>">
                            <?php if (count($mat)) : foreach ($mat as $ma) : ?>
                            <label class="checkbox-inline">
                                <label for="ligacoes<?= $ma['id'] ?>">
                                    <div><?= $ma['nome'] ?></div>
                                </label>
                                <input type="checkbox" value="<?= $ma['id'] ?>" name="ligacoes[]" id="ligacoes<?= $ma['id'] ?>"<?= in_array($ma['id'],$ligacoes) ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                        <div id="divEntr" class="divLig<?= $tp != 'ent' ? $in : "" ?>">
                            <?php if (count($pos)) : foreach ($pos as $po) : ?>
                            <label class="checkbox-inline">
                                <label for="ligacoes<?= $po['id'] ?>">
                                    <img class="icone" src="<?= $this->Layout->getLink('files?name='.$po['imagem']) ?>" alt="<?= $po['nome'] ?>"/>
                                    <div><?= $po['nome'] ?></div>
                                </label>
                                <input type="checkbox" value="<?= $po['id'] ?>" name="ligacoes[]" id="ligacoes<?= $po['id'] ?>"<?= in_array($po['id'],$ligacoes) ? $ck : "" ?>>
                            </label>
                            <?php endforeach; else: ?>
                            <strong>Nenhuma ligação cadastrada!</strong>
                            <?php endif; ?>
                        </div>
                    </div>
                    <a href="<?= $this->Layout->getLink('atributos') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </div>
    </div>
</div>