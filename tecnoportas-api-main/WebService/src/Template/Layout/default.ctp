<!DOCTYPE html>
<html lang="pt-br">

<head>
    <?= $this->Html->charset() ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="author" content="Finger Marketing Digital">
    <title>
        <?= $title ?> | Tecnoportas
    </title>
    <?= $this->Html->meta('icon') ?>

    <?= $this->Html->css('style.css') ?>
    <?= $this->Html->css('style-responsive.css') ?>
    <?= $this->Html->css('global.css') ?>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
        <?= $this->Html->script('html5shiv.js') ?>
        <?= $this->Html->script('respond.min.js') ?>
        <![endif]-->

    <?php if (count($styles)) : echo $this->Layout->getStyles($styles);
    endif; ?>
    <?= $this->fetch('meta') ?>
    <script>
        var Servidor = "<?= $this->Layout->getLink("") ?>";
    </script>
</head>

<body class="sticky-header">
    <!-- left side start-->
    <div class="left-side sticky-left-side">
        <div class="logo text-center">
            <a href="<?= $this->Layout->getLink('') ?>"><img src="/images/logo1.png" alt="Tecnoportas"></a>
        </div>

        <div class="logo-icon text-center">
            <a href="<?= $this->Layout->getLink('') ?>"><img src="/images/logo1.png" alt="Tecnoportas"></a>
        </div>
        <div class="left-side-inner">
            <!-- visible to small devices only -->
            <div class="visible-xs hidden-sm hidden-md hidden-lg">
                <div class="media logged-user">
                    <img alt="<?= $thisUser[0]['username'] ?>" src="/images/b_user_ico.png" class="media-object">
                    <div class="media-body">
                        <h4><a href="#"><?= $thisUser[0]['username'] ?></a></h4>
                    </div>
                </div>

                <h5 class="left-nav-title">Minha Conta</h5>
                <ul class="nav nav-pills nav-stacked custom-nav">
                    <?php if ($thisUser[0]['acesso'] == 1) { ?>
                        <li><a href="/ajustes/gerais"><i class="fa fa-cog"></i> <span>Ajustes</span></a></li>
                    <?php } ?>
                    <li><a href="<?= $this->Layout->getLink('logout') ?>"><i class="fa fa-sign-out"></i> <span>Sair</span></a></li>
                </ul>
            </div>
            <!--sidebar nav start-->
            <ul class="nav nav-pills nav-stacked custom-nav">
                <li <?= $this->Layout->isActive('orcamentos', $ref, true) ?>><a href="<?= $this->Layout->getLink('orcamentos') ?>"><i class="fa fa-check-square-o"></i> <span>Orçamentos</span></a></li>
                <li <?= $this->Layout->isActive('relatorios', $ref, true) ?>><a href="<?= $this->Layout->getLink('relatorios') ?>"><i class="fa fa-bar-chart-o"></i> <span>Relatórios</span></a></li>
                <?php if ($thisUser[0]['acesso'] == 1) { ?>
                    <li <?= $this->Layout->isActive('Pontos de Venda', $ref, true) ?>><a href="<?= $this->Layout->getLink('representantes') ?>"><i class="fa fa-sitemap"></i><span>Pontos de Venda</span></a></li>
                    <li <?= $this->Layout->isActive('notificacoes', $ref, true) ?>><a href="<?= $this->Layout->getLink('notificacoes') ?>"><i class="fa fa-comment"></i> <span>Notificações (APP)</span></a></li>
                    <li class="menu-list<?= $this->Layout->isActive('motores', $ref) ?>">
                        <a href="#"><i class="fa fa-gears"></i> <span>Motores</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('novo motor', $ref, true) ?>><a href="<?= $this->Layout->getLink('motores/novo') ?>"> + Novo</a></li>
                            <li <?= $this->Layout->isActive('categorias de motores', $ref, true) ?>><a href="<?= $this->Layout->getLink('motores/categorias') ?>">Categorias</a></li>
                            <li <?= $this->Layout->isActive('lista de motores', $ref, true) ?>><a href="<?= $this->Layout->getLink('motores') ?>">Motores</a></li>
                            <li <?= $this->Layout->isActive('testeiras', $ref, true) ?>><a href="<?= $this->Layout->getLink('motores/testeiras') ?>">Testeiras</a></li>
                        </ul>
                    </li>
                    <li class="menu-list<?= $this->Layout->isActive('produtos', $ref) ?>">
                        <a href="#"><i class="fa fa-square"></i> <span>Produtos</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('acionamentos', $ref, true) ?>><a href="<?= $this->Layout->getLink('motores/automatizadores') ?>">Acionamentos</a></li>
                            <li <?= $this->Layout->isActive('perfis', $ref, true) ?>><a href="<?= $this->Layout->getLink('portoes/perfis') ?>"> Perfis</a></li>
                            <li <?= $this->Layout->isActive('entradas', $ref, true) ?>><a href="<?= $this->Layout->getLink('portoes/entradas') ?>"> Entradas</a></li>
                            <li <?= $this->Layout->isActive('componentes', $ref, true) ?>><a href="<?= $this->Layout->getLink('portoes/componentes') ?>"> Componentes</a></li>
                            <li <?= $this->Layout->isActive('pinturas', $ref, true) ?>><a href="<?= $this->Layout->getLink('portoes/pinturas') ?>"> Pinturas</a></li>
                            <li <?= $this->Layout->isActive('Fita PVC', $ref, true) ?>><a href="<?= $this->Layout->getLink('portoes/fitaPvc') ?>"> Fita PVC</a></li>
                            <li <?= $this->Layout->isActive('desabilitados', $ref, true) ?>><a href="<?= $this->Layout->getLink('produtos/desabilitados') ?>"> Desabilitados</a></li>
                            <li <?= $this->Layout->isActive('valores', $ref, true) ?>><a href="<?= $this->Layout->getLink('valores') ?>"> Valores</a></li>
                        </ul>
                    </li>
                    <!-- <li class="menu-list<?= $this->Layout->isActive('atributos', $ref) ?>">
                        <a href="#"><i class="fa fa-ellipsis-h"></i> <span>Atributos</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('novo atributos', $ref, true) ?>><a href="<?= $this->Layout->getLink('atributos/novo') ?>"> + Novo</a></li>
                            <li <?= $this->Layout->isActive('lista de atributos', $ref, true) ?>><a href="<?= $this->Layout->getLink('atributos') ?>"> Atributos</a></li>
                        </ul>
                    </li> -->
                <?php } ?>
                <li class="menu-list<?= $this->Layout->isActive('revendedores', $ref) ?>">
                    <a href="#"><i class="fa fa-users"></i> <span>Revendedores</span></a>
                    <ul class="sub-menu-list">
                    <?php if ($thisUser[0]['acesso'] == 1) { ?>
                        <li <?= $this->Layout->isActive('novo revendedor', $ref, true) ?>><a href="<?= $this->Layout->getLink('serralheiros/novo') ?>"> + Novo</a></li>
                    <?php } ?>
                        <li <?= $this->Layout->isActive('lista de revendedores', $ref, true) ?>><a href="<?= $this->Layout->getLink('serralheiros') ?>"> Ativos</a></li>
                    <?php if ($thisUser[0]['acesso'] == 1) { ?>
                        <li <?= $this->Layout->isActive('lista precad', $ref, true) ?>><a href="<?= $this->Layout->getLink('precadastro') ?>"> Pré - Cadastros</a></li>
                        <li <?= $this->Layout->isActive('lista de revendedores recusados', $ref, true) ?>><a href="<?= $this->Layout->getLink('precadastro/recusados') ?>">Recusados</a></li>
                    <?php } ?>
                        <li <?= $this->Layout->isActive('clientes', $ref, true) ?>><a href="<?= $this->Layout->getLink('clientes') ?>"> Clientes</a></li>
                    </ul>
                </li>
                <?php if ($thisUser[0]['acesso'] == 1) { ?>
                    <li class="menu-list<?= $this->Layout->isActive('vendedores', $ref) ?>">
                        <a href="#"><i class="fa fa-user-md"></i> <span>Vendedores</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('novo vendedor', $ref, true) ?>><a href="<?= $this->Layout->getLink('vendedores/novo') ?>"> + Novo</a></li>
                            <li <?= $this->Layout->isActive('lista de vendedores', $ref, true) ?>><a href="<?= $this->Layout->getLink('vendedores') ?>"> Vendedores</a></li>
                        </ul>
                    </li>
                    <!-- <li class="menu-list<?= $this->Layout->isActive('aparelhos', $ref) ?>">
                    <a href="#"><i class="fa fa-mobile" aria-hidden="true"></i> <span>Aparelhos</span></a>
                    <ul class="sub-menu-list">
                        <li <?= $this->Layout->isActive('lista de aparelhos', $ref, true) ?>><a href="<?= $this->Layout->getLink('aparelhos') ?>"> Aparelhos</a></li>
                    </ul>
                </li> -->
                    <li class="menu-list<?= $this->Layout->isActive('informações', $ref) ?>">
                        <a href="#"><i class="fa fa-info"></i> <span>Informações</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('nova informação', $ref, true) ?>><a href="<?= $this->Layout->getLink('informacoes/nova') ?>"> + Nova</a></li>
                            <li <?= $this->Layout->isActive('lista de informações', $ref, true) ?>><a href="<?= $this->Layout->getLink('informacoes') ?>"> Informações</a></li>
                        </ul>
                    </li>
                    <li class="menu-list<?= $this->Layout->isActive('arquivos', $ref) ?>">
                        <a href="#"><i class="fa fa-book"></i> <span>Arquivos</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('Novo Arquivo', $ref, true) ?>><a href="<?= $this->Layout->getLink('arquivos/novo?t=f') ?>"> + Novo</a></li>
                            <li <?= $this->Layout->isActive('Lista de Arquivos', $ref, true) ?>><a href="<?= $this->Layout->getLink('arquivos?t=f') ?>"> Arquivos</a></li>
                            <li <?= $this->Layout->isActive('Lista de Categorias', $ref, true) ?>><a href="<?= $this->Layout->getLink('arquivos?t=t') ?>"> Categorias</a></li>
                        </ul>
                    </li>
                    <li class="menu-list<?= $this->Layout->isActive('ajustes', $ref) ?>">
                        <a href="#"><i class="fa fa-gear"></i> <span>Ajustes</span></a>
                        <ul class="sub-menu-list">
                            <li <?= $this->Layout->isActive('gerais', $ref, true) ?>><a href="<?= $this->Layout->getLink('ajustes/gerais') ?>"> Gerais</a></li>
                            <li <?= $this->Layout->isActive('garantia pdf', $ref, true) ?>><a href="<?= $this->Layout->getLink('garantiaPdf') ?>"> Garantia PDF</a></li>
                            <li <?= $this->Layout->isActive('padroes', $ref, true) ?>><a href="<?= $this->Layout->getLink('ajustes/padroes') ?>"> Padrões</a></li>
                            <li <?= $this->Layout->isActive('unidades de medida', $ref, true) ?>><a href="<?= $this->Layout->getLink('medidas') ?>"> Unidades de Medida</a></li>
                            <li <?= $this->Layout->isActive('usuarios de acesso', $ref, true) ?>><a href="<?= $this->Layout->getLink('ajustes/usuariosDeAcesso') ?>"> Usuários de Acesso</a></li>
                            <li <?= $this->Layout->isActive('lista de atributos', $ref, true) ?>><a href="<?= $this->Layout->getLink('atributos') ?>"> Atributos</a></li>
                            <li <?= $this->Layout->isActive('lista de aparelhos', $ref, true) ?>><a href="<?= $this->Layout->getLink('aparelhos') ?>"> Aparelhos</a></li>
                            <li <?= $this->Layout->isActive('exportar', $ref, true) ?>><a href="<?= $this->Layout->getLink('exporta') ?>"><i class="fa fa-cloud-download"></i><span>Exportar</span></a></li>
                        </ul>
                    </li>
                    <!-- <li <?= $this->Layout->isActive('exportar', $ref, true) ?>><a href="<?= $this->Layout->getLink('exporta') ?>"><i class="fa fa-cloud-download"></i><span>Exportar</span></a></li> -->
                <?php } ?>
            </ul>
            <!--sidebar nav end-->
        </div>
    </div>
    <!-- left side end-->
    <!-- main content start-->
    <div class="main-content">
        <div class="header-section">
            <a class="toggle-btn"><i class="fa fa-bars"></i></a>
            <!--notification menu start -->
            <div class="menu-right">
                <ul class="notification-menu">
                    <li>
                        <a href="#" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                            <img src="/images/user_ico.png" alt="<?= $thisUser[0]['username'] ?>" />
                            <?= $thisUser[0]['username'] ?>
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-usermenu pull-right">
                            <li><a href="/ajustes/gerais"><i class="fa fa-cog"></i> Ajustes</a></li>
                            <li><a href="<?= $this->Layout->getLink('logout') ?>"><i class="fa fa-sign-out"></i> Sair</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!--notification menu end -->
        </div>
        <div class="page-heading">
            <h3><?= $title ?></h3>
            <ul class="breadcrumb">
                <li><a href="<?= $this->Layout->getLink('') ?>">In&iacute;cio</a></li>
                <li><?= $this->Layout->isLink($this->Layout->getLink($ref[0]), $ref[0]) ?></li>
                <?php if (isset($ref[1])) : ?>
                    <li><?= $ref[1] ?></li>
                <?php endif; ?>
            </ul>
        </div>
        <div class="wrapper">
            <?php if (isset($thisMsg)) { ?>
                <div class="row">
                    <div class="col-md-12">
                        <?php foreach ($thisMsg as $key => $msge) : ?>
                            <div class="alert alert-<?= $key ?>">
                                <button type="button" class="close close-sm" data-dismiss="alert">
                                    <i class="fa fa-times"></i>
                                </button>
                                <?= $msge . "<br/>"; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php } ?>
            <?= $this->fetch('content') ?>
        </div>
        <footer>
            2018 &copy; Tecnoportas
        </footer>
    </div>
    <?= $this->Html->script('jquery-1.10.2.min.js') ?>
    <?= $this->Html->script('jquery-ui-1.9.2.custom.min.js') ?>
    <?= $this->Html->script('jquery-migrate-1.2.1.min.js') ?>
    <?= $this->Html->script('bootstrap.min.js') ?>
    <?= $this->Html->script('modernizr.min.js') ?>
    <?= $this->Html->script('jquery.nicescroll.js') ?>
    <?= $this->Html->script('scripts.js') ?>
    <?= $this->Html->script('script.js?v=1337') ?>
    <?php if (count($scripts)) : echo $this->Layout->getScripts($scripts);
    endif; ?>
</body>

</html>
