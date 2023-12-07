<div class="row">
    <div class='col-md-12'>
        <form id='formSerralheiros' method="POST" enctype="multipart/form-data">
            <section class="panel">
                <header class="panel-heading">
                    <?= $title ?>
                    <span class="tools pull-right">
                        <a class="fa fa-chevron-down" href="javascript:;"></a>
                    </span>
                </header>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-sm-12 form-titulo">
                            <h4>Dados do Vendedor</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label for='tbImg'>Foto:</label>
                            <div class="fileupload fileupload-new" data-provides="fileupload">
                                <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                    <label for='tbImg'><img src="<?php if (!empty($vendedor['foto'])) { echo $this->Layout->getLink('files?name='.$vendedor['foto']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); }?>" alt="Enviar uma imagem" /></label>
                                </div>
                                <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                                <div>
                                    <span class="btn btn-default btn-file">
                                        <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                        <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                        <input id='tbImg' type='file' name='pessoa[foto]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                    </span>
                                    <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                                </div>
                            </div>
                            <label class="col-sm-2 control-label m-t m-bot15 label-pessoa-nome" for="tbNome">Nome *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="pessoa[nome]" id="tbNome" class="form-control" value="<?=$vendedor['nome'] ?>" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15 label-pessoa-snome" for="tbSNome">Sobrenome</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="pessoa[sobrenome]" id="tbSNome" class="form-control" value="<?=$vendedor['sobrenome'] ?>" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbDesc">Desc.&nbsp;Máx.&nbsp;(%) *</label>
                            <div class="col-sm-10 col-md-4 m-bot15">
                                <input type="text" name="pessoa[desconto_max]" id="tbDesc" class="form-control" placeholder="0.00" value="<?=$vendedor['desconto_max'] ?>" />
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbAcre">Acrésc.&nbsp;Máx.&nbsp;(%) *</label>
                            <div class="col-sm-10 col-md-4 m-bot15">
                                <input type="text" name="pessoa[acrecimo_max]" id="tbAcre" class="form-control" placeholder="0.00" value="<?=$vendedor['acrecimo_max'] ?>"/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 form-titulo">
                            <h4>Dados de Contato</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-2 control-label m-bot15" for="tbEmail">E-mail *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="email" name="vendedor[email]" id="tbEmail" class="form-control" value="<?= $vendedor['email'] ?>" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbTel">Telefone</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="tel" name="vendedor[telefone]" id="tbTel" data-mask="(99)9999-9999?9" class="form-control" value="<?= $vendedor['ddd'] ? "(".$vendedor['ddd'].")".$vendedor['tel_num'] : "" ?>"/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 form-titulo">
                            <h4>Endere&ccedil;o</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-2 control-label m-bot15" for="tbCep">CEP</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="end[cep]" id="tbCep" data-mask="99999-999" class="form-control" value="<?=$vendedor['cep'] ?>" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbEnd">Endere&ccedil;o</label>
                            <div class="col-sm-10 col-md-7 m-bot15">
                                <input type="text" name="end[logradouro]" id="tbEnd" class="form-control" value="<?=$vendedor['logradouro'] ?>" required/>
                            </div>
                            <label class="col-sm-2 col-md-1 control-label m-bot15" for="tbNum">N&uacute;mero</label>
                            <div class="col-sm-10 col-md-2 m-bot15">
                                <input type="text" name="end[numero]" id="tbNum" class="form-control" value="<?=$vendedor['numero'] ?>" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbCompl">Complemento</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="end[complemento]" id="tbCompl" class="form-control" value="<?=$vendedor['complemento'] ?>"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbBairro">Bairro</label>
                            <div class="col-sm-10 col-md-3 m-bot15">
                                <input type="text" name="end[bairro]" id="tbBairro" class="form-control" value="<?=$vendedor['bairro'] ?>" required/>
                            </div>
                            <label class="col-sm-2 col-md-1 control-label m-bot15" for="tbCidade">Cidade *</label>
                            <div class="col-sm-10 col-md-3 m-bot15">
                                <input type="text" name="end[cidade]" id="tbCidade" class="form-control" value="<?=$vendedor['cidade'] ?>" required/>
                            </div>
                            <label class="col-sm-2 col-md-1 control-label m-bot15" for="seuf">Estado *</label>
                            <div class="col-sm-10 col-md-2 m-bot15">
                                <select id="seuf" name="end[uf]" class="form-control">
                                    <?php $sel = $vendedor['uf'] ?>
                                    <option value="0">- Escolha -</option>
                                    <option value="AC" <?= $sel == "AC" ? "selected" : "" ?>>Acre</option>
                                    <option value="AL" <?= $sel == "AL" ? "selected" : "" ?>>Alagoas</option>
                                    <option value="AP" <?= $sel == "AP" ? "selected" : "" ?>>Amapá</option>
                                    <option value="AM" <?= $sel == "AM" ? "selected" : "" ?>>Amazonas</option>
                                    <option value="BA" <?= $sel == "BA" ? "selected" : "" ?>>Bahia</option>
                                    <option value="CE" <?= $sel == "CE" ? "selected" : "" ?>>Ceará</option>
                                    <option value="DF" <?= $sel == "DF" ? "selected" : "" ?>>Distrito Federal</option>
                                    <option value="ES" <?= $sel == "ES" ? "selected" : "" ?>>Espírito Santo</option>
                                    <option value="GO" <?= $sel == "GO" ? "selected" : "" ?>>Goiás</option>
                                    <option value="MA" <?= $sel == "MA" ? "selected" : "" ?>>Maranhão</option>
                                    <option value="MT" <?= $sel == "MT" ? "selected" : "" ?>>Mato Grosso</option>
                                    <option value="MS" <?= $sel == "MS" ? "selected" : "" ?>>Mato Grosso do Sul</option>
                                    <option value="MG" <?= $sel == "MG" ? "selected" : "" ?>>Minas Gerais</option>
                                    <option value="PA" <?= $sel == "PA" ? "selected" : "" ?>>Pará</option>
                                    <option value="PB" <?= $sel == "PB" ? "selected" : "" ?>>Paraíba</option>
                                    <option value="PR" <?= $sel == "PR" ? "selected" : "" ?>>Paraná</option>
                                    <option value="PE" <?= $sel == "PE" ? "selected" : "" ?>>Pernambuco</option>
                                    <option value="PI" <?= $sel == "PI" ? "selected" : "" ?>>Piauí</option>
                                    <option value="RJ" <?= $sel == "RJ" ? "selected" : "" ?>>Rio de Janeiro</option>
                                    <option value="RN" <?= $sel == "RN" ? "selected" : "" ?>>Rio Grande do Norte</option>
                                    <option value="RS" <?= $sel == "RS" ? "selected" : "" ?>>Rio Grande do Sul</option>
                                    <option value="RO" <?= $sel == "RO" ? "selected" : "" ?>>Rondônia</option>
                                    <option value="RR" <?= $sel == "RR" ? "selected" : "" ?>>Roraima</option>
                                    <option value="SC" <?= $sel == "SC" ? "selected" : "" ?>>Santa Catarina</option>
                                    <option value="SP" <?= $sel == "SP" ? "selected" : "" ?>>São Paulo</option>
                                    <option value="SE" <?= $sel == "SE" ? "selected" : "" ?>>Sergipe</option>
                                    <option value="TO" <?= $sel == "TO" ? "selected" : "" ?>>Tocantins</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 form-titulo">
                            <h4>Dados de Login</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-2 control-label m-bot15" for="tbUsuario">Usuário *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" id="tbUsuario" class="form-control" value="<?= $vendedor['usuario'] ?>" disabled/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbSenha">Senha *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="password" name="vendedor[senha]" id="tbSenha" class="form-control"/>
                                <p>Deixe em branco para manter a senha atual</p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="panel-footer">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <div class="col-sm-12 text-right">
                                <button type="button" class="btn btn-default" onclick="location.href='<?= $this->Layout->getLink("vendedores") ?>';">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </form>
    </div>
</div>