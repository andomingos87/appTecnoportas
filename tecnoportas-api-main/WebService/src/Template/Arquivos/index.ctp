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
                    <table class="display table table-bordered table-striped" id="dynamic-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <?php if ($t == "f") : ?><th class="hidden-phone">Categorias</th><?php endif; ?>
                                <th>Data</th>
                                <th><a href="<?= $this->Layout->getLink('arquivos/novo?t='.$t) ?>">+ Nov<?= $l["o"] ?></a></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($posts)) : foreach ($posts as $post) : $data = date_create($post['dt_cad']); ?>
                            <tr>
                                <td><?= $post['id']?></td>
                                <td><img src='<?= $this->Layout->getLink('files?name='.($post['imagem'] ? : 'sem-img.jpg')) ?>' alt='<?= $post['nome'] ?>'/></td>
                                <td><?= (!empty($post["pai"]) ? $post["pai"]["nome"] . " > " : "") . $post['nome'] ?></td>
                                <?php if ($t == "n" || $t == "f") : ?><td><?php
                                    $tTax = "";
                                    foreach($post["posts"] as $key => $pp) :
                                        $tTax .= ", " . $pp["nome"];
                                    endforeach;
                                    if(!empty($tTax)){
                                        echo substr($tTax, 2);
                                    }
                                ?></td><?php endif; ?>
                                <td><?= date_format($data, 'Y/m/d') ?><br/><?= date_format($data, 'H:i:s') ?></td>
                                <td>
                                    <a href="<?= $this->Layout->getLink('arquivos/editar?t='.$t.'&id='.$post['id']) ?>">
                                        <button class="btn btn-info"><i class="fa fa-pencil"></i></button>
                                    </a>
                                    <a href="#" onclick="if (confirm('Excluir post <?= $post['nome'] ?>?')){ location.href='<?= $this->Layout->getLink('arquivos/excluir?t='.$t.'&id='.$post['id']) ?>'; }">
                                        <button class="btn btn-warning"><i class="fa fa-trash-o"></i></button>
                                    </a>
                                </td>
                            </tr>
                            <?php endforeach; endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>