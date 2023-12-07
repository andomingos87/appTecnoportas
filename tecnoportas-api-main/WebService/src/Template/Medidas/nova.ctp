<div class="row">
    <div class="col-md-12">
        <form class="form-horizontal adminex-form" method="POST">
          <section class="panel">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-sm-12 form-titulo">
                            <h4>Nova Unidade de Medida</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-2 control-label m-t m-bot15 label-pessoa-nome" for="tbNome">Nome *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="med[nome]" id="tbNome" class="form-control" maxlength="10"/>
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="panel-footer">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <div class="col-sm-12 text-right">
                                <button type="button" class="btn btn-default" onclick="location.href='<?= $this->Layout->getLink("medidas") ?>';">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </form>
    </div>
</div>