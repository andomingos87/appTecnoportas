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
                <form id='formComponente' role="form" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                        <label for='tbImg'>Icone:</label>
                        <div class="fileupload fileupload-new" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                                <label for='tbImg'><img src="<?php if (!empty($componente['imagem'])) { echo $this->Layout->getLink('files?name='.$componente['imagem']); } else { echo $this->Layout->getLink('files?name=sem-img.jpg'); } ?>" alt="Enviar uma imagem" /></label>
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                                <span class="btn btn-default btn-file">
                                    <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Enviar uma imagem</span>
                                    <span class="fileupload-exists"><i class="fa fa-undo"></i> Atualizar a Imagem</span>
                                    <input id='tbImg' type='file' name='componente[imagem]' accept='.png, .jpg, .jpeg, .gif, .svg'/>
                                </span>
                                <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remover</a>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for='seUnidade'>Unidade de Medida:</label>
                        <select id='seUnidade' class="form-control" name='componente[unidade_medida_id]'>
                            <?php if (count($unidades)) : foreach($unidades as $unidade) : ?>
                            <option value="<?= $unidade['id'] ?>"<?php if ($componente['unidade_medida_id'] == $unidade['id']) { echo " selected='selected'"; } ?>><?= $unidade['nome'] ?></option>
                            <?php endforeach; else: ?>
                            <option value='0'>Nenhuma Unidade de Medida</option>
                            <?php endif; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='componente[codigo]' value="<?= $componente['codigo'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' class="form-control" type='text' name='componente[nome]' value="<?= $componente['nome'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3" class="form-control" name='componente[descricao]'><?= $componente['descricao'] ?></textarea>
                    </div>
                    <div class="form-group slide-toggle">
                        <label for='cbPadrao'>Definir componente como padrão: </label>
                        <input id='cbPadrao' type="checkbox" onchange="changePadrao(this)" class="js-switch-blue" name='componente[is_padrao]' value='1'<?php if ($componente['is_padrao']) { echo " checked='checked'"; } ?>/>
                    </div>
                    <div id="fixaRodape" class="form-group slide-toggle <?php if (!$componente['is_padrao']) { echo " invisivel"; } ?>">
                        <label for='cbRodape'>Fixar no rodapé: </label>
                        <input id='cbRodape' type="checkbox" class="js-switch-blue" name='componente[is_rodape]' value='1' <?php if ($componente['is_rodape']) { echo " checked='checked'"; } ?>/>
                    </div>
                    <div id="divCondicao" class="form-group<?php if (!$componente['is_padrao']) { echo " invisivel"; } ?>">
                        <label for='tbAplic'>Fórmula de Aplicação:</label> <a href="#myModal" data-toggle="modal"><i class="fa fa-info-circle"></i></a>
<input id='tbAplic' type='text' class="form-control formula" name='componente[condicao]' data-submit="btSubmit" <?php if ($componente['condicao']){?> value="<?= $componente['condicao'] ?>"  <? } ?>/>
                        <p class="help-block error-feedback">Parece que á algo errado, <a href="#myModal" data-toggle="modal">clique aqui</a>.</p>
                    </div>
                    <script>
                        function changePadrao(obj){
                            var divCondicao = document.getElementById("divCondicao"),
                            fixaRodape = document.getElementById("fixaRodape");
                            if (obj.checked){
                                divCondicao.style.display = "block";
                                fixaRodape.style.display = "block";
                            }
                            else{
                                divCondicao.style.display = "none";
                                fixaRodape.style.display = "none";                                
                            }
                        };
                    </script>
                    <div class="form-group">
                        <label for='tbVu'>Valor Unitário:</label>
                        <input id='tbVu' type='text' class="form-control" name='componente[valor_unitario]' placeholder="0.00" value="<?= $componente['valor_unitario'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbCp'>Cálculo do Preço:</label> <a href="#myModal" data-toggle="modal"><i class="fa fa-info-circle"></i></a>
                        <input id='tbCp' type='text' class="form-control formula" name='componente[formula]' value="<?= $componente['formula'] ?>" data-submit="btSubmit"/>
                        <p class="help-block error-feedback">Parece que á algo errado, <a href="#myModal" data-toggle="modal">clique aqui</a>.</p>
                        <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="myModal" class="modal fade">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                                        <h4 class="modal-title">Fórmulas e Variáveis</h4>
                                    </div>
                                    <div class="modal-body">
                                        <h4>Como funciona o sistema de Fórmulas?</h4>
                                        <pre>ATP MAIS (PTP VEZES LGP) DIVIDIDO 2</pre>
                                        <b>Explicação:</b>
                                        <p>
                                            ATP (altura do portão) mais o resultado de PTP (número de portas do portão) vezes LGP (largura do portão), tudo isso dividido por 2.<br/>
                                            É possível representar essa mesma fórmula de uma forma mais resumida, assim:
                                        </p>
                                        <pre>atp+(ptp*lgp)/2</pre>
                                        <p>
                                            O uso de letras maiúsculas e espaços não é obrigatório, mas fique atento ao nome das variáveis e operadores.
                                        </p>
                                        <h4>Operadores Aritméticos:</h4>
                                        <ul>
                                            <li><b>MAIS:</b> Operador de adição, pode ser substituído pelo sinal: <b>+</b> (mais).</li>
                                            <li><b>MENOS:</b> Operador de subtração, pode ser substituído pelo sinal: <b>-</b> (menos).</li>
                                            <li><b>VEZES:</b> Operador de multiplicação, pode ser substituído pelo sinal <b>*</b> (asterisco) e pela letra <b>X</b>.</li>
                                            <li><b>DIVIDIDO:</b> Operador de divisão, pode ser substituído pelo sinal <b>/</b> (barra).</li>
                                        </ul>
                                        <h4>Operadores Lógicos:</h4>
                                        <ul>
                                            <li><b>E:</b> Operador lógico "E" é usado caso queira que duas ou mais condições sejam verdadeira, pode ser substituído pelo sinal <b>&&</b> (e comercial).</li>
                                            <li><b>OU:</b> Operador lógico "OU" é usado caso queira que uma das condições sejam verdadeiras , pode ser substituído pelo sinal <b>||</b> (barra vertical).</li>
                                        </ul>
                                        <h4>Variáveis Locais:</h4>
                                        <ul>
                                            <li><b>VL:</b> Valor do produto atual.</li>
                                        </ul>
                                        <h4>Variáveis Globais:</h4>
                                        <ul>
                                            <li><b>ATT:</b> Altura do Portão.</li>
                                            <li><b>LGP:</b> Largura do Portão.</li>
                                            <li><b>ATP:</b> Altura do Portão + (Se LGP < 8.500 = 0.600 Se não = 0.900).</li>
                                            <li><b>PTP:</b> Número de Portas do Portão.</li>
                                            <li><b>PM2:</b> Tamanho do portão em metros quadrados.</li>
                                            <li><b>PKG:</b> Peso do portão.</li>
                                        </ul>
                                        <h4>Variáveis de Atributos:</h4>
                                        <ul>
                                            <li><b>PRF:</b> Perfil do portão.</li>
                                            <li><b>MAT:</b> Material do portão.</li>
                                            <li><b>TPI:</b> Tipo de Instalação.</li>
                                        </ul>
                                        <h4>Também pode ser usado:</h4>
                                        <ul>
                                            <li><b>0-9 (números):</b> Os números são aceitos.</li>
                                            <li><b>"." (ponto):</b> Separador de casas decimais.</li>
                                            <li><b>"(" e ")" (abre e fecha parêntesis):</b> Usado para definir a hierarquia dos cálculos.</li>
                                        </ul>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="<?= $this->Layout->getLink('portoes/componentes') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </div>
    </div>
</div>