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
                            <h4>Dados do Serralheiro</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
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
                                        <input id='tbImg' type='file' name='pessoa[foto]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                    </span>
                                    <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                                </div>
                            </div>
                            <div class="col-sm-2 control-label m-bot15">
                                Pessoa *
                            </div>
                            <div class="col-sm-10 radio m-bot15">
                                <label>
                                    <input type="radio" class="pessoa-tipo-f" name="pessoa[tipo]" value="F" checked="checked"/>
                                    F&iacute;sica
                                </label>
                                <label>
                                    <input type="radio" class="pessoa-tipo-j" name="pessoa[tipo]" value="J">
                                    Jur&iacute;dica
                                </label>
                            </div>
                            <label class="col-sm-2 control-label m-t m-bot15 label-pessoa-nome" for="tbNome">Nome *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="pessoa[nome]" id="tbNome" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15 label-pessoa-snome" for="tbSNome">Sobrenome</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="pessoa[sobrenome]" id="tbSNome" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15 label-pessoa-cpf" for="tbCPF">CPF </label>
                            <div class="col-sm-10 col-md-4 m-bot15">
                                <input type="text" name="pessoa[cnpj]" id="tbCPF" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15 label-pessoa-rg" for="tbAcre">RG</label>
                            <div class="col-sm-10 col-md-4 m-bot15">
                                <input type="text" name="pessoa[ie]" id="tbAcre" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbAcre">Acrésc.&nbsp;Máx.&nbsp;(%) *</label>
                            <div class="col-sm-10 col-md-4 m-bot15">
                                <input type="text" name="serralheiro[acrecimo_max]" id="tbAcre" class="form-control" placeholder="0.00" value="0.00"/>
                            </div>
                            <div id="divDescontoMax" >
                                <label class="col-sm-2 control-label m-bot15" for="tbDesc">Desc.&nbsp;Máx.&nbsp;(%) *</label>
                                <div class="col-sm-10 col-md-4 m-bot15">
                                    <input type="text" name="serralheiro[desconto_max]" id="tbDesc" class="form-control" placeholder="0.00" value="0.00"/>
                                </div>
                            </div>
                            <div style="display: flex;width: 100%;flex-direction: column;">
                                <div style="display: flex;width: 100%;">
                                    <label class="col-sm-2 control-label m-bot15" for="ckbDesconto">Desconto seletivo: </label>
                                    <!-- <input style="margin-left: 15px;" type="checkbox" id="ckbDesconto" name="serralheiro[desconto_seletivo]" onchange="$('#divDescontoSeletivo').toggleClass('invisivel');" value='1' <?= $serralheiro['desconto_seletivo'] == 1 ? 'checked' : '' ?>/></label> -->
                                    <input style="margin-left: 15px;" type="checkbox" id="ckbDesconto" name="serralheiro[desconto_seletivo]" onchange="teste(this);" value='1'/></label>
                                </div>
                                <div style="width:100%;" id="divDescontoSeletivo" class="invisivel" >
                                    <label class="col-sm-2 control-label m-bot15" for="descAut">Acionamentos.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control" name="serralheiro[desconto_aut]" id="descAut" placeholder="0.00" value="0.00"/>
                                    </div>
                                    <label class="col-sm-2 control-label m-bot15" for="descPtr">Pinturas.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control" name="serralheiro[desconto_ptr]" id="descPtr" placeholder="0.00" value="0.00"/>
                                    </div>
                                    <label class="col-sm-2 control-label m-bot15" for="descOpc">Opcionais.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control" name="serralheiro[desconto_opc]" id="descOpc" placeholder="0.00" value="0.00"/>
                                    </div>
                                    <label class="col-sm-2 control-label m-bot15" for="descMto">Motores.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control" id="descMto" name="serralheiro[desconto_mto]" placeholder="0.00" value="0.00"/>
                                    </div>
                                    <label class="col-sm-2 control-label m-bot15" for="descEnt">Entradas.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control"  name="serralheiro[desconto_ent]" id="descEnt" placeholder="0.00" value="0.00"/>
                                    </div>
                                    <label class="col-sm-2 control-label m-bot15" for="descPrf">Perfis.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control" name="serralheiro[desconto_prf]" id="descPrf" placeholder="0.00" value="0.00"/>
                                    </div>
                                    <label class="col-sm-2 control-label m-bot15" for="descTst">Testeiras.&nbsp;(%) *</label>
                                    <div class="col-sm-10 col-md-4 m-bot15">
                                        <input type="text" class="form-control" id="descTst" name="serralheiro[desconto_tst]" placeholder="0.00" value="0.00"/>
                                    </div>
                                </div>
                                <div style="width:100%;">
                                    <label class="col-sm-2 control-label m-bot15" for="seVend">Vendedor</label>
                                    <div class="col-sm-10 m-bot15">
                                        <select id="seVend" name="serralheiro[vendedor]" class="form-control input-lg m-bot15">
                                            <option value="0">-- Selecione o Vendedor --</option>
                                            <?php foreach ($vendedores as $vendedor): ?>
                                            <option value="<?= $vendedor['id'] ?>"><?= $vendedor['nome'] . ' ' . $vendedor['sobrenome'] ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>
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
                            <label class="col-sm-2 control-label m-t m-bot15" for="tbNome" required>Nome *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="serralheiro[nome]" id="tbNome" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbSNome">Sobrenome</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="serralheiro[sobrenome]" id="tbSNome" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbEmail">E-mail *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="email" name="serralheiro[email]" id="tbEmail" class="form-control" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbTel">Telefone</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="tel" name="serralheiro[telefone]" id="tbTel" data-mask="(99)9999-9999?9" class="form-control"/>
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
                                <input type="text" name="end[cep]" id="tbCep" data-mask="99999-999" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbEnd">Endere&ccedil;o</label>
                            <div class="col-sm-10 col-md-7 m-bot15">
                                <input type="text" name="end[logradouro]" id="tbEnd" class="form-control"/>
                            </div>
                            <label class="col-sm-2 col-md-1 control-label m-bot15" for="tbNum">N&uacute;mero</label>
                            <div class="col-sm-10 col-md-2 m-bot15">
                                <input type="text" name="end[numero]" id="tbNum" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbCompl">Complemento</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="end[complemento]" id="tbCompl" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbBairro">Bairro</label>
                            <div class="col-sm-10 col-md-3 m-bot15">
                                <input type="text" name="end[bairro]" id="tbBairro" class="form-control"/>
                            </div>
                            <label class="col-sm-2 col-md-1 control-label m-bot15" for="tbCidade">Cidade *</label>
                            <div class="col-sm-10 col-md-3 m-bot15">
                                <input type="text" name="end[cidade]" id="tbCidade" class="form-control" required/>
                            </div>
                            <label class="col-sm-2 col-md-1 control-label m-bot15" for="seuf">Estado *</label>
                            <div class="col-sm-10 col-md-2 m-bot15">
                                <select id="seuf" name="end[uf]" class="form-control">
                                    <option value="0">- Escolha -</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SP">São Paulo</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 form-titulo">
                            <h4>Dados de Acesso</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-2 control-label m-bot15" for="tbUsName">Nome de Usuário *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="serralheiro[username]" id="tbUsName" class="form-control"/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbSenha">Senha *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="password" name="serralheiro[senha]" id="tbSenha" class="form-control" autocomplete="new-password"/>
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="panel-footer">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <div class="col-sm-12 text-right">
                                <button type="button" class="btn btn-default" onclick="location.href='<?= $this->Layout->getLink("serralheiros") ?>';">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </form>
    </div>
</div>
<script>
    function teste(input){
        $('#divDescontoSeletivo').toggleClass('invisivel');
        if(input.checked){
            $('#tbDesc').prop('disabled','true');
            $('#divDescontoMax').hide();
        }else{
            $('#tbDesc').removeProp('disabled');
            $('#divDescontoMax').show();
        }
    }
</script>