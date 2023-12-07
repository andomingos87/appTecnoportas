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
                <form id='formPosts' action="<?= $this->Layout->getLink('arquivos/editar?id='.$id.'&t='.$t) ?>" method="POST" enctype="multipart/form-data">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for='tbImg'>Imagem:</label>
                            <div class="fileupload fileupload-new" data-provides="fileupload">
                                <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                    <label for='tbImg'><img src="<?= $this->Layout->getLink('files?name='.($post['imagem'] ? : 'sem-img.jpg')) ?>" alt="Enviar uma imagem" /></label>
                                </div>
                                <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                                <div>
                                    <span class="btn btn-default btn-file">
                                        <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                        <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                        <input id='tbImg' type='file' name='post[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                    </span>
                                    <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                                </div>
                            </div>
                        </div>
                        <?php if ($t == "p") : ?><
                        <div class="form-group col-md-6">
                            <label for='tbIco'>Ícone:</label>
                            <div class="fileupload fileupload-new" data-provides="fileupload">
                                <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                    <label for='tbIco'><img src="<?= $this->Layout->getLink('files?name='.($post['icone'] ? : 'sem-img.jpg')) ?>" alt="Enviar um Ícone" /></label>
                                </div>
                                <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                                <div>
                                    <span class="btn btn-default btn-file">
                                        <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar um Ícone</span>
                                        <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar o Ícone</span>
                                        <input id='tbIco' type='file' name='post[icone]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                    </span>
                                    <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                                </div>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>
                    <?php if ($t == "f") : ?>
                    <div class="form-group">
                        <label class="control-label">Arquivo</label>
                            <div class="controls">
                                <div class="fileupload fileupload-new" data-provides="fileupload">
                                    <span class="btn btn-default btn-file">
                                        <span class="fileupload-new">
                                            <i class="fa fa-paper-clip"></i>
                                            Enviar Arquivo 
                                        </span>
                                        <span class="fileupload-exists">
                                            <i class="fa fa-undo"></i> Alterar Arquivo
                                        </span>
                                        <input type="file" name="post[arquivo]" accept='.png, .jpg, .jpeg, .gif, .svg, .pdf' class="default">
                                    </span>
                                    <span class="fileupload-preview" style="margin-left:5px;">
                                        <?php if (!empty($post["f_id"])) : ?>
                                        <a href="<?= $this->Layout->getLink("files?name=" . $post["arquivo"]) ?>" target="_blank"><?= $post["f_nome"] ?></a>
                                        <?php endif; ?>
                                    </span>
                                </div>
                            </div>
                        </label>
                    </div>
                    <?php endif; ?>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='post[nome]' value="<?= $post["nome"] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbDesc'>Descrição:</label>
                        <textarea id="tbDesc" class="wysihtml5 form-control" name="post[descricao]" rows="9"><?= $post["descricao"] ?></textarea>
                    </div>
                    <?php if ($t == "t") : ?>
                    <div class="form-group">
                        <label for='sePai'><?= $l["nome"][0] ?> Pai:</label>
                        <select id="sePai" class="form-control" name="post[pai_id]">
                            <option value="0">-- Selecione --</option>
                            <?php foreach($posts as $key => $pp) : if($pp["id"] != $post["id"]) : ?>
                            <option value="<?= $pp["id"] ?>"<?= $pp["id"] == $post["post_pai_id"] ? " 'selected' " : "" ?>><?= $pp["nome"] ?></option>
                            <?php endif; endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for='seLayout'>Layout:</label><?php $ly = $post["layout"]; $sl = " selected='selected'" ?>
                        <select id="seLayout" class="form-control" name="post[layout]">
                            <option value="0"<?= $ly == 0 ? $sl : "" ?>>Feed Padrão</option>
                            <!--<option value="1"<?= $ly == 1 ? $sl : "" ?>>Catálogo</option>-->
                        </select>
                    </div>
                    <?php endif; ?>
                    <?php if ($t == "n" || $t == "f") : ?>
                    <div class="form-group">
                        <label for='sePosts'>Categorias:</label>
                        <select id="sePosts" name="taxonomias[ids][]" multiple="" class="multi-select">
                        <?php foreach($posts as $ptax) : ?>
                            <option value="<?= $ptax["id"] ?>"><?= (!empty($ptax["pai"]) ? $ptax["pai"]["nome"] . " > " : "") . $ptax["nome"] ?></option>
                        <?php endforeach; ?>
                        </select>
                        <script>
                           
                        </script>
                    </div>
                    <?php endif; ?>
                    <div class="form-group">
                        <label>Outros:</label><br/>
                        <input id="inMenu" type="checkbox" name="post[is_menu]" value="1"<?= $post["is_menu"] ? " checked='checked'" : "" ?>>
                        <label for="inMenu">&nbsp;Mostrar esse post no app?</label>
                    </div>
                    <div class="form-group">
                        <label for='tbOrdem'>Ordem:</label>
                        <input id='tbOrdem' class="form-control" type='number' name='post[ordem]' value="<?= $post["ordem"] ?>"/>
                    </div>
                    <a href="<?= $this->Layout->getLink('posts?t='.$t) ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>
<script>
    setInterval(function(){
        $("#sePosts").multiSelect(geraMultSelect);
                            <?php if (count($pts)) : ?>
                            var se = [
                                <?php foreach ($pts as $key => $pt) : ?><?= "'".$pt."'" . (isset($pts[$key + 1]) ? "," : "") ?><?php endforeach; ?>
                            ];
                            $("#sePosts").multiSelect("select", se);
                            <?php endif; ?>
         }, 1000);
</script>