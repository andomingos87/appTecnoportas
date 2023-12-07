<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                <?= $title ?>
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Opção</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nome da Empresa (PDF)</td>
                                <td><?= $configs['nome_empresa'] ?></td>
                                <td><a data-toggle="modal" href="#moNomeEmpresa"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Email de Remetente</td>
                                <td><?= $configs['remetente'] ?></td>
                                <td><a data-toggle="modal" href="#moEmail"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Email de Destinatário</td>
                                <td><?= $configs['destinatario'] ?></td>
                                <td><a data-toggle="modal" href="#moEmailDest"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Email de Atendimento</td>
                                <td><?= $configs['email_atendimento'] ?></td>
                                <td><a data-toggle="modal" href="#moEmailAtend"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Cor padrão da fita PVC</td>
                                <td><?php foreach($cores as $cor){
                                        if($cor['id'] == $configs['pd_cor_fita']){
                                            echo $cor['nome'];
                                        } 
                                    }?></td>
                                <td><a data-toggle="modal" href="#moFitaPvc"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Categoria padrão do catálogo</td>
                                <td><?php foreach($categorias as $cat){
                                        if($cat['id'] == $configs['catalogo']){
                                            echo $cat['nome'];
                                        } 
                                    }?></td>
                                <td><a data-toggle="modal" href="#moCatalogo"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Perfil padrão</td>
                                <td><?php foreach($perfis as $prf){
                                        if($prf['id'] == $configs['perfil_id']){
                                            echo $prf['nome'];
                                        } 
                                    }?></td>
                                <td><a data-toggle="modal" href="#moPerfil"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Material padrão</td>
                                <td><?php foreach($materiais as $mat){
                                        if($mat['id'] == $configs['material_id']){
                                            echo $mat['nome'];
                                        } 
                                    }?></td>
                                <td><a data-toggle="modal" href="#moMaterial"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Sobre nós</td>
                                <td><?= $configs['sobre_nos'] ?></td>
                                <td><a data-toggle="modal" href="#moSobreNos"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Termos de Uso</td>
                                <td><?= $configs['termos_uso'] ?></td>
                                <td><a data-toggle="modal" href="#moTermosUso"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</div>
<!-- Modais -->
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moNomeEmpresa" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=nome_empresa">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Nome da Empresa</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seNomeEmpresa">Nome da Empresa</label>
                            <div class="col-sm-8 m-bot15">
                                <input type="text" name="valor" id="seNomeEmpresa" class="form-control" value="<?=$configs['nome_empresa']?>">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moEmail" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=remetente">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Email de Remetente</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seRemetente">Email de Remetente</label>
                            <div class="col-sm-8 m-bot15">
                                <input type="email" name="valor" id="seRemetente" class="form-control" value="<?=$configs['remetente']?>">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moEmailDest" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=destinatario">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Email de Destinatário</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seDest">Email de Destinatário</label>
                            <div class="col-sm-8 m-bot15">
                                <input type="email" name="valor" id="seDest" class="form-control" value="<?=$configs['destinatario']?>">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moEmailAtend" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=email_atendimento">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Email de Atendimento</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seDest">Email de Atendimento</label>
                            <div class="col-sm-8 m-bot15">
                                <input type="email" name="valor" id="seDest" class="form-control" value="<?=$configs['email_atendimento']?>">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moFitaPvc" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=pd_cor_fita">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Cor Padrão da Fita PVC</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seCor">Cor</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="valor" class="form-control input-sm m-bot15">
                                    <?php foreach($cores as $cor){?>
                                        <option value="<?= $cor['id']?>"><?= $cor['nome']?></option>
                                    <?php } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moCatalogo" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=catalogo">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Categoria Padrão do Catálogo</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seCat">Categoria</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="valor" class="form-control input-sm m-bot15">
                                    <?php foreach($categorias as $cat){?>
                                        <option value="<?= $cat['id']?>"><?= $cat['nome']?></option>
                                    <?php } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moSobreNos" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=sobre_nos">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Inserir conteúdo página Sobre Nós</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seSobre">Página Sobre nós</label>
                            <div class="col-sm-8 m-bot15">
                                <textarea name="valor" id="seSobre" rows="10" class="form-control"><?=$configs['sobre_nos']?></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moTermosUso" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=termos_uso">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Inserir conteúdo dos Termos de Uso</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seTermos">Termos de Uso</label>
                            <div class="col-sm-8 m-bot15">
                                <textarea name="valor" id="seTermos" rows="10" class="form-control"><?=$configs['termos_uso']?></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moPerfil" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=perfil_id">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar perfil padrão</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="sePrf">Perfil</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="valor" class="form-control input-sm m-bot15">
                                    <?php foreach($perfis as $prf){?>
                                        <option value="<?= $prf['id']?>"><?= $prf['nome']?></option>
                                    <?php } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moMaterial" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=material_id">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar material padrão</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15" for="seMat">Material</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="valor" class="form-control input-sm m-bot15">
                                    <?php foreach($materiais as $mat){?>
                                        <option value="<?= $mat['id']?>"><?= $mat['nome']?></option>
                                    <?php } ?>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="submit">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>