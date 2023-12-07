<div class="row">
    <div class='col-md-12'>
        <form id='formUsA' method="POST" enctype="multipart/form-data">
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
                            <h4>Adicionar Usuário</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 form-group" style="display:grid; white-space:nowrap;">
                            <label class="col-sm-2 control-label m-t m-bot15" for="tbNome">Nome (Razão Social)</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="pessoa[nome]" id="tbNome" class="form-control" value=""/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbSNome">Sobrenome(Nome Fantasia)</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="pessoa[sobrenome]" id="tbSNome" class="form-control" value=""/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbEmail">E-mail *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="email" name="user[email]" id="tbEmail" class="form-control" value="" required/>
                            </div>
                            <label class="col-sm-2 control-label m-bot15" for="tbUsName">Nome de Usuário *</label>
                            <div class="col-sm-10 m-bot15">
                                <input type="text" name="user[username]" id="tbUsName" class="form-control" value=""/>
                            </div>
                                <label class="col-sm-2 control-label m-bot15" for="tbSenha">Senha *</label>
                                <div class="col-sm-10 m-bot15">
                                    <input type="password" name="user[senha]" id="tbSenha" class="form-control" autocomplete="new-password"/>
                                </div>

                        </div>
                    </div>
                </div>
                <footer class="panel-footer">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <div class="col-sm-12 text-right">
                                <button type="button" class="btn btn-default" onclick="location.href='<?= $this->Layout->getLink("ajustes/usuariosDeAcesso") ?>';">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </section>
        </form>
    </div>
</div>