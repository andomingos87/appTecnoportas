<div class="row">
    <div class="col-sm-12">
        <section class="panel">
            <header class="panel-heading">
                Padrões de Unidades de Medida
                <span class="tools pull-right">
                    <a href="javascript:;" class="fa fa-chevron-down"></a>
                </span>
            </header>
            <div class="panel-body">
                <div class="adv-table">
                    <table  class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Unidade de Medida</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Acionamentos</td>
                                <td><?= $this->Layout->getByAtt('id', $configs['pd_automatizador_med'], $medidas)['nome'] ?></td>
                                <td><a data-toggle="modal" href="#moAuto"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Entrada</td>
                                <td><?= $this->Layout->getByAtt('id', $configs['pd_entrada_med'], $medidas)['nome'] ?></td>
                                <td><a data-toggle="modal" href="#moEntr"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Testeira</td>
                                <td><?= $this->Layout->getByAtt('id', $configs['pd_testeira_med'], $medidas)['nome'] ?></td>
                                <td><a data-toggle="modal" href="#moTest"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Motores</td>
                                <td><?= $this->Layout->getByAtt('id', $configs['pd_motor_med'], $medidas)['nome'] ?></td>
                                <td><a data-toggle="modal" href="#moMotor"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Perfis</td>
                                <td><?= $this->Layout->getByAtt('id', $configs['pd_perfil_med'], $medidas)['nome'] ?></td>
                                <td><a data-toggle="modal" href="#moPerfis"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                            <tr>
                                <td>Pinturas</td>
                                <td><?= $this->Layout->getByAtt('id', $configs['pd_pintura_med'], $medidas)['nome'] ?></td>
                                <td><a data-toggle="modal" href="#moPint"><button class="btn btn-info"><i class="fa fa-pencil"></i></button></a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</div>
<!-- Modais -->
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moAuto" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=automatizador">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Unidade de Medida Padrão para Automatizadores</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15 label-pessoa-nome" for="seMedida">Unidade de Medida</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="medida_id" id="seMedida" class="form-control">
                                    <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                                        <option value="<?= $medida['id'] ?>"<?php if ($configs['pd_automatizador_med'] == $medida['id']) { echo " selected='selected'"; } ?>><?= $medida['nome'] ?></option>
                                    <?php endforeach; else: ?>
                                        <option value="0">- Sem Unidades de Medida -</option>
                                    <?php endif; ?>
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
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moEntr" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=entrada">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Unidade de Medida Padrão para Entradas</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15 label-pessoa-nome" for="seMedida">Unidade de Medida</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="medida_id" id="seMedida" class="form-control">
                                    <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                                        <option value="<?= $medida['id'] ?>"<?php if ($configs['pd_entrada_med'] == $medida['id']) { echo " selected='selected'"; } ?>><?= $medida['nome'] ?></option>
                                    <?php endforeach; else: ?>
                                        <option value="0">- Sem Unidades de Medida -</option>
                                    <?php endif; ?>
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
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moTest" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=testeira">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Unidade de Medida Padrão para Testeiras</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15 label-pessoa-nome" for="seMedida">Unidade de Medida</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="medida_id" id="seMedida" class="form-control">
                                    <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                                        <option value="<?= $medida['id'] ?>"<?php if ($configs['pd_testeira_med'] == $medida['id']) { echo " selected='selected'"; } ?>><?= $medida['nome'] ?></option>
                                    <?php endforeach; else: ?>
                                        <option value="0">- Sem Unidades de Medida -</option>
                                    <?php endif; ?>
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
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moMotor" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=motor">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Unidade de Medida Padrão para Motores</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15 label-pessoa-nome" for="seMedida">Unidade de Medida</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="medida_id" id="seMedida" class="form-control">
                                    <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                                        <option value="<?= $medida['id'] ?>"<?php if ($configs['pd_motor_med'] == $medida['id']) { echo " selected='selected'"; } ?>><?= $medida['nome'] ?></option>
                                    <?php endforeach; else: ?>
                                        <option value="0">- Sem Unidades de Medida -</option>
                                    <?php endif; ?>
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
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moPerfis" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=perfil">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Unidade de Medida Padrão para Perfis</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15 label-pessoa-nome" for="seMedida">Unidade de Medida</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="medida_id" id="seMedida" class="form-control">
                                    <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                                        <option value="<?= $medida['id'] ?>"<?php if ($configs['pd_perfil_med'] == $medida['id']) { echo " selected='selected'"; } ?>><?= $medida['nome'] ?></option>
                                    <?php endforeach; else: ?>
                                        <option value="0">- Sem Unidades de Medida -</option>
                                    <?php endif; ?>
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
<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="moPint" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <form method="post" action="?edita=pintura">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Alterar Unidade de Medida Padrão para Pinturas</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12 form-group">
                            <label class="col-sm-4 control-label m-t m-bot15 label-pessoa-nome" for="seMedida">Unidade de Medida</label>
                            <div class="col-sm-8 m-bot15">
                                <select name="medida_id" id="seMedida" class="form-control">
                                    <?php if (count($medidas)) : foreach ($medidas as $medida) : ?>
                                        <option value="<?= $medida['id'] ?>"<?php if ($configs['pd_pintura_med'] == $medida['id']) { echo " selected='selected'"; } ?>><?= $medida['nome'] ?></option>
                                    <?php endforeach; else: ?>
                                        <option value="0">- Sem Unidades de Medida -</option>
                                    <?php endif; ?>
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