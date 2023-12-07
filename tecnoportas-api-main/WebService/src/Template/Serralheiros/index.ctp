<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Serralheiros
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
            <div class="form-group">
                <label class="control-label col-md-4">Filtrar por estado:</label>
                <select id="selIdEstado" name="selEstado" class="form-control">
                <option value="0">- Selecione -</option>
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
            <div class="form-group">
                <div id="divCidade" style="display:none;">
                    <label class="col-sm-2 col-md-1 control-label m-bot15" for="tbCidade">Cidade:</label>
                    <div>
                        <input type="text" name="cidade" id="tbCidade" class="form-control"/>
                    </div>
                </div>
            </div>
            <button id="btnFiltra" type="button" class="btn-primary">Filtrar</button>
            <div style="display:none;">
            <?= json_encode($serralheiros) ?>
            </div>
            <a href="/Serralheiros/lista_revendedores"><button type="button" class="btn-primary">Exportar</button></a>
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Acesso</th>
                                <th>Aparelho Ativo</th>
                                <th>Data de Cadastro</th>
                                <th class="hidden-phone">E-mail</th>
                                <th>Localização</th>
                                <th>Nome para Contato</th>
                                <th>Nome Fantasia</th>
                                <th>Valor Total de Orçamentos</th>
                                <th>Data último Orçamento</th>
                                <!-- <th>Telefone</th> -->
                                <?php if($thisUser[0]['acesso'] == 1){ ?>

                                <th><a href="<?= $this->Layout->getLink('serralheiros/novo') ?>">+ Novo</a></th>

                                <?php }else{ ?>
                                    <th></th>
                                <?php } ?>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($serralheiros)) : foreach ($serralheiros as $serralheiro) : ([$dataCadastro = date_create($serralheiro['dt_cadastro']), $dataUltimoOrc = date_create($serralheiro['dt_ultimo_cadastro'])]);?>
                            <tr>
                                <td><?= $serralheiro['id'] ?></td>
                                <td><?= $serralheiro['acesso'] == 9 ? "Desativado" : ($serralheiro['acesso'] == 0 ? "Ativo" : "esconhecido") ?></td>
                                <td><?= $serralheiro['is_aprovado'] == 1 ? 'Ativo' : ($serralheiro['is_aprovado'] == null ? "Sem aparelho" : 'Não Ativo') ?></td>
                                <td><?= date_format($dataCadastro, 'Y/m/d') ?><br/><?= date_format($dataCadastro, 'H:i') ?></td>
                                <td class="hidden-phone"><?= $serralheiro['email'] ?></td>
                                <td><?= $serralheiro['cidade'] . "-" . $serralheiro['uf'] ?></td>
                                <td><?= $serralheiro['ct_nome'] ." ". $serralheiro['ct_snome'] ?></td>
                                <td><?= $serralheiro['tipo'] == "J" ? $serralheiro['sobrenome']: ""?></td>
                                <td>R$: <?= number_format($serralheiro['valor_total'], 2, ',', '.') ?></td>
                                <td><?= date_format($dataUltimoOrc, 'Y/m/d') ?><br/><?= date_format($dataUltimoOrc, 'H:i') ?></td>

                                <!-- <td><?= "(" . $serralheiro['ddd'] . ") " . $serralheiro['numero'] ?></td> -->
                                <td>

                                <div class="option">
                                    <a href="<?= $this->Layout->getLink('serralheiros/detalhes?sid='.$serralheiro['id']) ?>">Detalhes</a>
                                </div>

                                <?php if($thisUser[0]['acesso'] == 1){ ?>

                                <div class="option">
                                    <a href="<?= $this->Layout->getLink('serralheiros/editar?sid='.$serralheiro['id']) ?>">Editar</a> <?php if ($serralheiro['is_aprovado'] == 0 and $serralheiro['apId']){?>
                                </div>
                                    <div class="option">
                                        <a href="#" onclick="if (confirm('Ativar Aparelho <?= $serralheiro['nome'] ?>?')) { location.href='<?= $this->Layout->getLink('aparelhos/ativa?aid='.$serralheiro['apId']) ?>'; }">Ativar Aparelho</a> <?php } ?>
                                    </div>
                                <div class="option">
                                    <?php if ($serralheiro['acesso'] == 9) : ?><a href="#" onclick="if (confirm('Ativar Serralheiro <?= $serralheiro['nome'] . " " . $serralheiro['sobrenome'] ?>?')) { location.href='<?= $this->Layout->getLink('serralheiros/ativa?sid='.$serralheiro['user_id']) ?>'; }">Ativar Acesso</a><?php else : ?><a href="#" onclick="if (confirm('Desativar Serralheiro <?= $serralheiro['nome'] . " " . $serralheiro['sobrenome'] ?>?')) { location.href='<?= $this->Layout->getLink('serralheiros/desativa?sid='.$serralheiro['user_id']) ?>'; }">Desativar Acesso</a><?php endif; ?>
                                </div>
                                <div class="option">
                                    <a href="#" onclick="if (confirm('Excluir Serralheiro <?= $serralheiro['nome'] . " " . $serralheiro['sobrenome'] ?>?')) { location.href='<?= $this->Layout->getLink('serralheiros/deleta?sid='.$serralheiro['id']) ?>'; }">Excluir</a></td>
                                </div>

                                <?php } ?>

                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script>
$(function(){

    $('#selIdEstado').change(function(){
        var $sel = $('#selIdEstado').val();
        if($sel == 0){
            $('#tbCidade').val("");
            $('#divCidade').hide();
        }else{
            $('#divCidade').show();
        }
    });

    $("#btnFiltra").click(function(){
    var $estado, $cidade;
    $estado = $('#selIdEstado').val();
    $cidade = $('#tbCidade').val();
    location.href = "/serralheiros?est="+$estado+"&cid="+$cidade;
    });

});
</script>
