<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Valores
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
            <div style="display: flex;flex-direction: row;">
                <div class="form-group" style="width: 25%;display: flex;flex-direction: column;">
                    <label class="control-label col-md-4" style="width: 100%;">Atualizar valores por categoria:</label>
                    <select id="selCat0" name="selCat" class="form-control" style="margin-bottom: 20px;">
                        <option value="0">- Selecione -</option>
                        <option value="aut">Acionamentos</option>
                        <option value="ptr">Pinturas</option>
                        <option value="opc">Opcionais</option>
                        <option value="mto">Motores</option>
                        <option value="ent">Entradas</option>
                        <option value="prf">Perfis</option>
                        <option value="tst">Testeiras</option>
                    </select>
                    
                    <label class="control-label col-md-4" style="width: 100%;">Acréscimo/Desconto:</label>
                    <select id="selTipo0" name="selTipo" class="form-control" style="margin-bottom: 20px;">
                        <option value="a">Acréscimo</option>
                        <option value="d">Desconto</option>
                    </select>
                    
                    <label class="control-label col-md-4" style="width: 100%;">Porcentagem ( % ):</label>
                    <input type="number" placeholder="0" id="inputPorcentagem" style="margin-bottom: 20px;" min="0">

                    <button id="btnFiltra" type="button" class="btn-primary">Aplicar</button>
                </div>
                <div style="width: 60%;padding: 25px;border: solid 1px;margin-left: 5%;">
                    <div class="box-produtos">
                    <ul style="display: flex;flex-direction: column;">
                    
                    <?php if (count($produtos)) : foreach ($produtos as $produto) : ?>
                        <div style="display: flex;justify-content: space-between;border: solid 1px;padding: 5px;">
                            <input type="checkbox" name="checkProds[]" value="<?= $produto['id'] ?>">
                            <l1 style="max-width: 50%;"><?= $produto['nome'] ?></l1>
                            <li> Valor: R$ <?= $produto['valor_unitario'] ?></l1>
                        </div>
                    <?php endforeach; endif; ?>

                    </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script>
$(function(){

    var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }

    };

    var cat = getUrlParameter('cat');
    if(cat){
        $('#selCat0').val(cat);
    }


    $('#selCat0').change(function(){
       


        var $cat;
        $cat = $('#selCat0').val();
        location.href = "/valores?cat="+$cat;
    });

    $('#inputPorcentagem').change(function(){
        var valor = $('#inputPorcentagem').val();
        if(valor < 0){
            $('#inputPorcentagem').val(0);
        }
    });

    $("#btnFiltra").click(function(){
        if(checkCampos()){
        $('#selCat0').prop('disabled','true');
        $('#btnFiltra').prop('disabled','true');

        var val = [];
        var porcentagem = $('#inputPorcentagem').val();
        var tipo = $('#selTipo0').val();

        $(':checkbox:checked').each(function(i){
          val[i] = $(this).val();
        });
        

        $.post('/valores',   // url
			   {dadosUpdate: {'valor':val, 'prct': porcentagem, 'tipo': tipo}}, 
			   function(data, status, jqXHR) {// success callback
						location.reload();
				});
        }
    });


   function checkCampos(){
    var porcentagem = $('#inputPorcentagem').val();
    if(!porcentagem){
        alert('Por favor insira uma porcentagem válida');
        return false;
    }

    var val = [];
    $(':checkbox:checked').each(function(i){
          val[i] = $(this).val();
    });

    if(val.length < 1){
        alert('Nenhum produto selecionado');
        return false;
    }

    return true;

   }



});  
</script>