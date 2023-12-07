<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Clientes dos Revendedores
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
            <a href="/Clientes/lista_clientes"><button type="button" class="btn-primary">Exportar</button></a>
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th class="hidden-phone">Tipo</th>
                                <th class="hidden-phone">E-mail</th>
                                <th class="hidden-phone">Telefone</th>
                                <th>Localização</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($clientes)) : $arrayTipos = array('F'=>'Pessoa Física', 'J'=>'Pessoa Jurídica'); foreach ($clientes as $cliente) : ?>
                            <tr>
                                <td><?= $cliente['id']?></td>
                                <td><?= $cliente['tipo'] == "F" ? $cliente['nome'] . " " . $cliente['sobrenome'] : $cliente['sobrenome'] ?></td>
                                <td class="hidden-phone"><?= $arrayTipos[$cliente['tipo']] ?></td>
                                <td class="hidden-phone"><?= $cliente['email'] ?></td>
                                <td class="hidden-phone">(<?= $cliente['ddd'] ?>) <?= $cliente['numero'] ?></td>
                                <td><?= $cliente['cidade'].'-'.$cliente['uf'] ?></td>
                                <td><a href="<?= $this->Layout->getLink('clientes/ver?cid='.$cliente['id']) ?>">Ver</a> / <a href="#" onclick="if (confirm('Excluir cliente <?= $cliente['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('clientes/excluir?uid='.$cliente['id']) ?>'; }">Excluir</a></td>
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
    location.href = "/clientes?est="+$estado+"&cid="+$cidade;
    });

});  
</script>