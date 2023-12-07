<div class="row">
    <div class='col-md-5'>
        <div class="row">
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Resumo
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul><?php $dtor = date_create($resumo['u_orcamento']); $dtac = date_create($resumo['u_acesso']['dt_acesso']); ?>
                            <li><?php if ($resumo['orcamentos'] > 0) : ?><strong>Orçamentos Realizados: </strong><?php echo $resumo['orcamentos']; else : ?><strong>Nenhum Orçamento Realizado!</strong><?php endif; ?></li>
                            <?php if ($resumo['vl_orcamentos'] > 0) : ?><li><strong>Valor Total de Orçamentos: </strong>R$: <?= $resumo['vl_orcamentos'] ?></li><?php endif; ?>
                            <?php if (!empty($resumo['u_orcamento'])) : ?><li><strong>Data do Ultimo Orçamento: </strong><?= date_format($dtor, 'd/m/Y') . " ás " . date_format($dtor, 'H:i') ?></li><?php endif; ?>
                            <li><?php if ($resumo['clientes'] > 0) : ?><strong>Clientes Cadastrados: </strong><?php echo $resumo['clientes']; else : ?><strong>Nenhum Cliente Cadastrado!</strong><?php endif; ?></li>
                            <li><?php if ($resumo['acessos'] > 0) : ?><strong>Nº de acessos ao aplicativo: </strong><?php echo $resumo['acessos']; else : ?><strong>O Revendedor ainda não acessou o aplicativo!</strong><?php endif; ?></li>
                            <?php if (!empty($resumo['u_acesso'])) : ?><li><strong>Data do Ultimo Acesso: </strong><?= date_format($dtac, 'd/m/Y') . " ás " . date_format($dtac, 'H:i') ?></li><?php endif; ?>
                        </ul>
                        <a href="<?= $this->Layout->getLink('clientes?sid='.$serralheiro['id']) ?>"><button class="btn btn-primary">Clientes</button></a> <a href="<?= $this->Layout->getLink('orcamentos?sid='.$serralheiro['id']) ?>"><button class="btn btn-primary">Orçamentos</button></a> <a href="<?= $this->Layout->getLink('vendedores/editar?vid='.$serralheiro['vendedor_id']) ?>"><button class="btn btn-primary">Vendedor</button></a>
                    </div>
                </section>
            </div>
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        <?= $title ?>
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <ul><?php
                        $nome = "Nome";
                        $sobrenome = null;
                        $tipo = "Física";
                        if ($serralheiro['tipo'] == "J"){
                            $nome = "Razão Social";
                            $sobrenome = "Nome Fantasia";
                            $tipo = "Jurídica";
                        }
                        ?>
                            <li><strong><?= $nome ?>: </strong><?= $serralheiro['tipo'] == "J" ? $serralheiro['nome'] : $serralheiro['nome'] . " " . $serralheiro['sobrenome'] ?></li>
                            <?php if ($sobrenome != null) : ?>
                            <li><strong><?= $sobrenome ?>: </strong><?= $serralheiro['sobrenome'] ?></li>
                            <?php endif; ?>
                            <li><strong>Tipo: </strong><?= $tipo ?></li>
                            <li><strong>Nome de Usuário: </strong><?= $serralheiro['username'] ?></li>
                            <li><strong>Nome para Contato: </strong><?= $serralheiro['ct_nome'] . " " . $serralheiro['ct_snome'] ?></li>
                            <li><strong>E-mail: </strong><?= $serralheiro['email'] ?></li>
                            <li><strong>Telefone: </strong><?= "(" . $serralheiro['ddd'] . ")" . $serralheiro['tel_num'] ?></li>
                            <li><strong>Nome de Usuário: </strong><?= $serralheiro['username'] ?></li>
                        </ul>
                        <a href="<?= $this->Layout->getLink('serralheiros/editar?sid=' . $serralheiro['id']) ?>"><button class="btn btn-primary">Editar Revendedor</button></a>
                    </div>
                </section>
            </div>
            <?php if (isset($aparelho)) : ?>
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Aparelhos
                        <span class="tools pull-right">
                            <a class="fa fa-chevron-down" href="javascript:;"></a>
                        </span>
                    </header>
                    <?php foreach($aparelho as $ap){?>
                    <div class="panel-body">
                        <ul>
                            <li><strong>Ativado: </strong><?= $ap['is_aprovado'] != "0" ? "Ativo" : "Desativado"?></li>
                            <li><strong>Modelo: </strong><?= $ap['modelo'] ?></li>
                            <li><strong>Plataforma: </strong><?= $ap['plataforma'] ?></li>
                            <li><strong>Identificador (UUID): </strong><?= $ap['uuid'] ?></li>
                            <li><strong>Versão: </strong><?= $ap['versao'] ?></li>
                            <li><strong>Fabricante: </strong><?= $ap['fabricante'] ?></li>
                            <li><strong>Serial: </strong><?= $ap['serial'] ?></li>
                            <li><strong>Dispositívo Virtual? </strong><?= $ap['is_virtual'] ? "Sim" : "Não" ?></li>
                        </ul>
                    </div>
                    <?php } ?>
                </section>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <div class='col-md-7'>
        <div class="row">
            <div class="col-md-12">
                <section class="panel">
                    <header class="panel-heading">
                        Acessos
                        <span class="tools pull-right">
                            <a href="javascript:;" class="fa fa-chevron-down"></a>
                        </span>
                    </header>
                    <div class="panel-body">
                        <div class="adv-table">
                            <table  class="display table table-bordered table-striped" id="dynamic-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($acessos as $acesso) : $data = date_create($acesso['dt_acesso']); ?>
                                    <tr>
                                        <td><?= date_format($data, 'd/m/Y') ?><br/><?= date_format($data, 'H:i') ?></td>
                                        <td><?= $acesso['ip_acesso'] ?></td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>