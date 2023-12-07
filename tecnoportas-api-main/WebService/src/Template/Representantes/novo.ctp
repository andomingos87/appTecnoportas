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
                <form id='formRepres' action="<?= $this->Layout->getLink('representantes/novo') ?>" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <h3>Selecione o Revendedor</h3>
                    </div>
                    <div class="form-group">
                        <select id="seRevendedor" name="rId" class="form-control" required>
                            <option>-- Selecione --</option>
                            <?php foreach($revendedores as $rev){?>
                                <option value="<?= $rev['sId']?>"><?= $rev['razao_social']?> - <?= $rev['nome_fantasia']?></option>
                            <?php } ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for='tbNome'>Nome: *</label>
                        <input id='tbNome' class="form-control" type='text' name='representante[nome]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbSNome'>Sobrenome: *</label>
                        <input id='tbSNome' class="form-control" type='text' name='representante[sobrenome]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbTel'>Telefone:</label>
                        <input id='tbTel' class="form-control" data-mask="(99)9999-9999?9" type='tel' name='representante[telefone]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbEmail'>E-mail: *</label>
                        <input id='tbEmail' class="form-control" type='email' name='representante[email]' disabled/>
                    </div>
                    <h3>Dados da Empresa</h3>
                    <div class="form-group">
                        <label for='tbRSocial'>Razão Social:</label>
                        <input id='tbRSocial' class="form-control" type='text' name='representante[razao_social]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbNFanta'>Nome Fantasia: *</label>
                        <input id='tbNFanta' class="form-control" type='text' name='representante[nome_fantasia]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbCNPJ'>CNPJ:</label>
                        <input id='tbCNPJ' class="form-control" data-mask="99.999.999/9999-99" type='text' name='representante[cnpj]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbIE'>I.E.:</label>
                        <input id='tbIE' class="form-control" data-mask="999.999.999.999" type='text' name='representante[ie]' disabled/>
                    </div>
                    <h3>Endereço</h3>
                    <div class="form-group">
                        <label for='tbCep'>CEP: *</label>
                        <input id='tbCep' class="form-control" data-mask="99999.999" type='text' name='representante[cep]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbLog'>Logradouro: *</label>
                        <input id='tbLog' class="form-control" type='text' name='representante[logradouro]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbNumero'>Número: *</label>
                        <input id='tbNumero' class="form-control" type='text' name='representante[numero]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbCompl'>Complemento:</label>
                        <input id='tbCompl' class="form-control" type='text' name='representante[complemento]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbBairro'>Bairro: *</label>
                        <input id='tbBairro' class="form-control" type='text' name='representante[bairro]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='tbCidade'>Cidade: *</label>
                        <input id='tbCidade' class="form-control" type='text' name='representante[cidade]' disabled/>
                    </div>
                    <div class="form-group">
                        <label for='seEstado'>Estado: *</label>
                        <select id="seEstado" name="representante[estado]" class="form-control" disabled>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceara</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MS">Mato Grosso</option>
                            <option value="MT">Mato Grosso do Sul</option>
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
                        <label for='sePais'>País: *</label>
                        <select id="sePais" name="representante[pais]" class="form-control" disabled>
                            <option value="BR">Brasil</option>
                        </select>
                    </div>
                    <input id="hRid" type="hidden" name="rId">
                    <a href="<?= $this->Layout->getLink('representantes') ?>" class="btn btn-default">Cancelar</a>
                    <button type="submit" id="btSubmit" class="btn btn-primary">Adicionar</button>
                </form>
            </div>
        </section>
    </div>
</div>

<script src="https://code.jquery.com/jquery-1.12.4.js"></script>

<script>

$(function(){

    $("#seRevendedor").change(function(){
        var id = $("#seRevendedor").val();
        if(id){

            var api = new Api("representantes/listaRevendedores?id="+id);
            api.send(function(res){
                if(res.error){Erro(res);}else{
                    if(res.length){
                        res = res[0];
                        console.log("Dentro");
                        console.log(res);
                        $("#hRid").val(res.sId);
                        $("#tbNome").val(res.nome);
                        $("#tbSNome").val(res.sobrenome);
                        $("#tbTel").val( "("+res.ddd+") "+res.telefone);
                        $("#tbEmail").val(res.email);
                        $("#tbRSocial").val(res.razao_social);
                        $("#tbNFanta").val(res.nome_fantasia);
                        $("#tbCNPJ").val(res.cnpj);
                        $("#tbIE").val(res.ie);
                        $("#tbCep").val(res.cep);
                        $("#tbLog").val(res.logradouro);
                        $("#tbNumero").val(res.numero);
                        $("#tbCompl").val(res.complemento);
                        $("#tbBairro").val(res.bairro);
                        $("#tbCidade").val(res.cidade);
                        $("#seEstado").val(res.uf);
                    }   
                    console.log("Fora");
                }
            });
        }
    })

})

</script>