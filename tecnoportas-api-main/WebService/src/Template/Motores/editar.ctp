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
                <form id='formMotores' method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for='tbCod'>Código:</label>
                        <input id='tbCod' class="form-control" type='text' name='motor[codigo]' value="<?= $motor['codigo'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome:</label>
                        <input id='tbNome' type='text' class="form-control" name='motor[nome]' value="<?= $motor['nome'] ?>"/>
                    </div>
                    <div class="form-group">
                        <label for='taDesc'>Descrição:</label>
                        <textarea id='taDesc' rows="3" class="form-control" name='motor[descricao]'><?= $motor['descricao'] ?></textarea>
                    </div>
                    <div class="form-group">
                        <label for='tbKg'>Fórmula: </label><a href="#myModal" data-toggle="modal"><i class="fa fa-info-circle"></i></a>
                        <input id='tbKg' class="form-control formula" type='text' name='motor[formula]' value="<?= $motor['condicao'] ?>" data-submit="btSubmit" required/>
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
                    <div class="form-group">
                        <label for='tbVu'>Valor:</label>
                        <input id='tbVu' class="form-control" type='text' name='motor[valor_unitario]' placeholder="0.00" value="<?= $motor['valor_unitario'] ?>"/>
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
                            <input type="radio" value="<?= $categorias[$i]['id'] ?>" name="categorias[]" id="categoria<?= $categorias[$i]['id'] ?>"<?= $categorias[$i]['id'] == $motor['categoria_id'] ? " checked='checked'" : "" ?>>
                        </label>
                        <?php endfor; else: ?>
                        <strong>Nenhuma categoria cadastrada!</strong>
                        <?php endif; ?>
                    </div>
                    <a href="<?= $this->Layout->getLink('motores') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Salvar</button>
                </form>
            </div>
        </section>
    </div>
</div>