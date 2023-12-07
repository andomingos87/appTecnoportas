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
                <form id='formRepres' action="<?= $this->Layout->getLink('representantes/editar?id='.$id) ?>" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <h3>Dados Pessoais</h3>
                        <label for='tbImg'>Foto:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?= $this->Layout->getLink('files?name='.($rep['foto'] ? : 'sem-img.jpg')) ?>" alt="Enviar uma Foto" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma Foto</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Foto</span>
                                    <input id='tbImg' type='file' name='representante[foto]' accept='.png, .jpg, .jpeg, .gif'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome: *</label>
                        <input id='tbNome' class="form-control" type='text' name='representante[nome]' value="<?= $rep["nome"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label for='tbSNome'>Sobrenome: *</label>
                        <input id='tbSNome' class="form-control" type='text' name='representante[sobrenome]' value="<?= $rep["sobrenome"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label>Gênero: *</label>
                        <label class="checkbox-inline"><?php $g = $rep["genero"]; $ck = " checked='checked'"; ?>
                            <input type="radio" id="radM" name="representante[genero]" value="m"<?= $g == "m" ? $ck : "" ?>> Masculino
                        </label>
                        <label class="checkbox-inline">
                            <input type="radio" id="radF" name="representante[genero]" value="f"<?= $g == "f" ? $ck : "" ?>> Feminino
                        </label>
                    </div>
                    <div class="form-group">
                        <label for='tbTel'>Telefone:</label>
                        <input id='tbTel' class="form-control" data-mask="(99)9999-9999?9" type='tel' name='representante[telefone]' value="<?= !empty($rep["ddd"]) ? "(" . $rep["ddd"] . ")" . $rep["telefone"] : "" ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbEmail'>E-mail: *</label>
                        <input id='tbEmail' class="form-control" type='email' name='representante[email]' value="<?= $rep["email"] ?>" required/>
                    </div>
                    <h3>Dados da Empresa</h3>
                    <div class="form-group">
                        <label for='tbRSocial'>Razão Social:</label>
                        <input id='tbRSocial' class="form-control" type='text' name='representante[razao_social]' value="<?= $rep["razao_social"] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbNFanta'>Nome Fantasia: *</label>
                        <input id='tbNFanta' class="form-control" type='text' name='representante[nome_fantasia]' value="<?= $rep["nome_fantasia"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label for='tbCNPJ'>CNPJ:</label>
                        <input id='tbCNPJ' class="form-control" data-mask="99.999.999/9999-99" type='text' name='representante[cnpj]' value="<?= $rep["cnpj"] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbIE'>I.E.:</label>
                        <input id='tbIE' class="form-control" data-mask="999.999.999.999" type='text' name='representante[ie]' value="<?= $rep["ie"] ?>"/>
                    </div>
                    <h3>Endereço</h3>
                    <div class="form-group">
                        <label for='tbCep'>CEP: *</label>
                        <input id='tbCep' class="form-control" onblur="buscaCep(this)" data-mask="99999.999" type='text' name='representante[cep]' value="<?= $rep["cep"] ?>" required/>
                        <script>buscaCep("tbCep");</script>
                    </div>
                    <div class="form-group">
                        <label for='tbLog'>Logradouro: *</label>
                        <input id='tbLog' class="form-control" type='text' name='representante[logradouro]' value="<?= $rep["logradouro"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label for='tbNumero'>Número: *</label>
                        <input id='tbNumero' class="form-control" type='text' name='representante[numero]' value="<?= $rep["numero"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label for='tbCompl'>Complemento:</label>
                        <input id='tbCompl' class="form-control" type='text' name='representante[complemento]' value="<?= $rep["complemento"] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbBairro'>Bairro: *</label>
                        <input id='tbBairro' class="form-control" type='text' name='representante[bairro]' value="<?= $rep["bairro"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label for='tbCidade'>Cidade: *</label>
                        <input id='tbCidade' class="form-control" type='text' name='representante[cidade]' value="<?= $rep["cidade"] ?>" required/>
                    </div>
                    <div class="form-group">
                        <label for='seEstado'>Estado: *</label><?php $uf = $rep["uf"]; $sl = " selected='selected'"; ?>
                        <select id="seEstado" name="representante[estado]" class="form-control" required>
                            <option value="AC"<?= $uf == "AC" ? $sl : "" ?>>Acre</option>
                            <option value="AL"<?= $uf == "AL" ? $sl : "" ?>>Alagoas</option>
                            <option value="AP"<?= $uf == "AP" ? $sl : "" ?>>Amapá</option>
                            <option value="AM"<?= $uf == "AM" ? $sl : "" ?>>Amazonas</option>
                            <option value="BA"<?= $uf == "BA" ? $sl : "" ?>>Bahia</option>
                            <option value="CE"<?= $uf == "CE" ? $sl : "" ?>>Ceara</option>
                            <option value="DF"<?= $uf == "DF" ? $sl : "" ?>>Distrito Federal</option>
                            <option value="ES"<?= $uf == "ES" ? $sl : "" ?>>Espírito Santo</option>
                            <option value="GO"<?= $uf == "GO" ? $sl : "" ?>>Goiás</option>
                            <option value="MA"<?= $uf == "MA" ? $sl : "" ?>>Maranhão</option>
                            <option value="MS"<?= $uf == "MS" ? $sl : "" ?>>Mato Grosso</option>
                            <option value="MT"<?= $uf == "MT" ? $sl : "" ?>>Mato Grosso do Sul</option>
                            <option value="MG"<?= $uf == "MG" ? $sl : "" ?>>Minas Gerais</option>
                            <option value="PA"<?= $uf == "PA" ? $sl : "" ?>>Pará</option>
                            <option value="PB"<?= $uf == "PB" ? $sl : "" ?>>Paraíba</option>
                            <option value="PR"<?= $uf == "PR" ? $sl : "" ?>>Paraná</option>
                            <option value="PE"<?= $uf == "PE" ? $sl : "" ?>>Pernambuco</option>
                            <option value="PI"<?= $uf == "PI" ? $sl : "" ?>>Piauí</option>
                            <option value="RJ"<?= $uf == "RJ" ? $sl : "" ?>>Rio de Janeiro</option>
                            <option value="RN"<?= $uf == "RN" ? $sl : "" ?>>Rio Grande do Norte</option>
                            <option value="RS"<?= $uf == "RS" ? $sl : "" ?>>Rio Grande do Sul</option>
                            <option value="RO"<?= $uf == "RO" ? $sl : "" ?>>Rondônia</option>
                            <option value="RR"<?= $uf == "RR" ? $sl : "" ?>>Roraima</option>
                            <option value="SC"<?= $uf == "SC" ? $sl : "" ?>>Santa Catarina</option>
                            <option value="SP"<?= $uf == "SP" ? $sl : "" ?>>São Paulo</option>
                            <option value="SE"<?= $uf == "SE" ? $sl : "" ?>>Sergipe</option>
                            <option value="TO"<?= $uf == "TO" ? $sl : "" ?>>Tocantins</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for='sePais'>País: *</label><?php $pa = $rep["pais"]; ?>
                        <select id="sePais" name="representante[pais]" class="form-control" required>
                            <option value="BR"<?= $pa == "BR" ? $sl : "" ?>>Brasil</option>
                        </select>
                    </div>
                    <a href="<?= $this->Layout->getLink('representantes') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>