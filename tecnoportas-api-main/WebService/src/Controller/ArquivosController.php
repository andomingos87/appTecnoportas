<?php
namespace App\Controller;

class ArquivosController extends AppController
{
    public $l = array(
        "n" => array(
            "nome" => array("Post", "Posts"),
            "o" => "o"
        ),
        "p" => array(
            "nome" => array("Página", "Páginas"),
            "o" => "a"
        ),
        "t" => array(
            "nome" => array("Categoria", "Categorias"),
            "o" => "a"
        ),
        "f" => array(
            "nome" => array("Arquivo", "Arquivos"),
            "o" => "o"
        )
    );
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }
        $t = $this->request->getQuery("t");
        if (empty($t)){
            $t = "f";
        }

        $this->pageTitle = $this->l[$t]["nome"][1];
        $this->set('title', $this->pageTitle);
        $this->pagRef[0] = "arquivos";
        $this->pagRef[1] = "Lista de ".$this->l[$t]["nome"][1];
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
        $this->set("t", $t);
        $this->set("l", $this->l[$t]);
    }
    public function index(){
        $t = $this->request->getQuery("t");
        $id = $this->request->getQuery("id");
        $menu = $this->request->getQuery("menu");
        $taxId = $this->request->getQuery("t_id");

        $condicao = "";
        if (!empty($t) || $this->retorno != "json"){
            if (empty($t) && $this->retorno != "json"){
                $t = "f";
            }
            $condicao = "p.tipo = '$t'";
        }

        if (!empty($id)){
            $condicao .= (!empty($condicao) ? " AND " : "") . "p.id = $id";
        }
        if (!empty($menu)){
            $condicao .= (!empty($condicao) ? " AND " : "") . "p.is_menu = 1";
        }
        if (!empty($taxId)){
            $condicao .= (!empty($condicao) ? " AND " : "") . "p2.id = " . $taxId;
        }

        $select = array(
            /*Post */
            "p.id", "p.tipo", "p.nome", "p.descricao", "p.is_menu", "p.dt_cad",
            "p.layout", "p.ordem", "p.imagem_id", "p.post_pai_id", "p.icone_id",
            
            "a.nome as img_nome", "a.endereco as imagem", 

            "i.nome as i_nome", "i.endereco as icone",
            
            "f.nome as f_nome", "f.endereco as arquivo", "f.id as f_id",

            /*Taxonomias */
            "p2.id as p_id", "p2.tipo as p_tipo", "p2.nome as p_nome", "p2.descricao as p_descr", 
            "p2.is_menu as p_is_menu", "p2.dt_cad as p_dt_cad", 
            "p2.layout as p_layout", "p2.ordem as p_ordem", "p2.imagem_id as p_img_id", 
            "p2.post_pai_id as p_pp_id", "p2.icone_id as p_ico_id",
            
            "a2.nome as p_img_nome", "a2.endereco as p_imagem", 

            "i2.nome as p_i_nome", "i2.endereco as p_icone",

            "f2.nome as p_f_nome", "f2.endereco as p_arquivo", "f2.id as p_f_id",

            /*Post Pai*/
            "p3.id as p2_id", "p3.tipo as p2_tipo", "p3.nome as p2_nome", "p3.descricao as p2_descr", 
            "p3.is_menu as p2_is_menu", "p3.dt_cad as p2_dt_cad", 
            "p3.layout as p2_layout", "p3.ordem as p2_ordem", "p3.imagem_id as p2_img_id", 
            "p3.post_pai_id as p2_pp_id", "p3.icone_id as p2_ico_id",

            "a3.nome as p2_img_nome", "a3.endereco as p2_imagem",
            
            "i3.nome as p2_i_nome", "i3.endereco as p2_icone", 
            
            "f3.nome as p2_f_nome", "f3.endereco as p2_arquivo", "f3.id as p2_f_id",
        );

        $order = "p.ordem";

        $res = $this->connection->newQuery()
        ->select($select)
        ->from("posts p")
        ->join([
            'table'=>'arquivos a',
            'type'=>'LEFT',
            'conditions'=>'a.id = p.imagem_id'
        ])
        ->join([
            "table" => 'arquivos i',
            "type" => "LEFT",
            "conditions" => "i.id = p.icone_id"
        ])
        ->join([
            "table" => 'arquivos f',
            "type" => "LEFT",
            "conditions" => "f.post_id = p.id"
        ])
        ->join([
            "table"=>"posts_posts pp",
            "type"=>"LEFT",
            "conditions"=>"pp.post_id1 = p.id"
        ])
        ->join([
            "table"=>"posts p2",
            "type"=>"LEFT",
            "conditions"=>"p2.id = pp.post_id2"
        ])
        ->join([
            'table'=>'arquivos a2',
            'type'=>'LEFT',
            'conditions'=>'a2.id = p2.imagem_id'
        ])
        ->join([
            "table" => 'arquivos i2',
            "type" => "LEFT",
            "conditions" => "i2.id = p2.icone_id"
        ])
        ->join([
            "table" => 'arquivos f2',
            "type" => "LEFT",
            "conditions" => "f2.post_id = p2.id"
        ])
        ->join([
            "table"=>"posts p3",
            "type"=>"LEFT",
            "conditions"=>"p3.id = p.post_pai_id"
        ])
        ->join([
            'table'=>'arquivos a3',
            'type'=>'LEFT',
            'conditions'=>'a3.id = p3.imagem_id'
        ])
        ->join([
            "table" => 'arquivos i3',
            "type" => "LEFT",
            "conditions" => "i3.id = p3.icone_id"
        ])
        ->join([
            "table" => 'arquivos f3',
            "type" => "LEFT",
            "conditions" => "f3.post_id = p3.id"
        ])
        ->where($condicao)
        ->order($order)
        ->execute()
        ->fetchAll("assoc");

        $res = $this->limpaPosts($res);

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->set("posts", $res);
            $this->addTableClass();
        }
    }
    
    public function novo(){
        $t = $this->request->getQuery("t");
        $snome = $this->l[$t]["nome"][0];
        $pnome = $this->l[$t]["nome"][1];
        $o = $this->l[$t]["o"];
        
        $post = $this->request->getData("post");
        $taxonomias = $this->request->getData("taxonomias");

        if (!empty($post)){
            $arrayIds = array();
            $arrayImg = array();
            $arrayIco = array();
            $arrayArq = array();

            $ico = null;
            if (isset($post["icone"])){
                $ico = $this->upload($post["icone"], array('gif', 'jpg', 'png', 'jpeg', 'svg'), false, false);
                if (isset($ico["error"])){
                    $ico = null;
                }
                else{
                    $ext = pathinfo($ico, PATHINFO_EXTENSION);
                    $arrayIco = array(
                        "nome" => $post["icone"]["name"],
                        "endereco" => $ico,
                        "extencao" => $ext,
                        "pessoa_id" => $this->user[0]["pessoa_id"]
                    );
                    $res = $this->connection->insert("arquivos", $arrayIco);
                    $ico = $res->lastInsertId("arquivos");
                    $arrayIds["icone_id"] = $ico;
                }
            }
            $img = $this->upload($post["imagem"], array('gif', 'jpg', 'png', 'jpeg', 'svg'));
            if (isset($img["error"])){
                $img = null;
            }
            else{
                $ext = pathinfo($img, PATHINFO_EXTENSION);
                $arrayImg = array(
                    "nome" => $post["imagem"]["name"],
                    "endereco" => $img,
                    "extencao" => $ext,
                    "pessoa_id" => $this->user[0]["pessoa_id"]
                );
                $res = $this->connection->insert("arquivos", $arrayImg);
                $img = $res->lastInsertId("arquivos");
                $arrayIds["arquivo_id"] = $img;
            }

            $arrayPost = array(
                "tipo" => $t,
                "nome" => $post["nome"],
                "descricao" => $post["descricao"],
                "post_pai_id" => !empty($post["pai_id"]) ? $post["pai_id"] : null,
                "imagem_id" => $img,
                "is_menu" => isset($post["is_menu"]) ? 1 : 0,
                "ordem" => !empty($post["ordem"]) ? $post["ordem"] : null
            );
            if (isset($post["layout"])){
                $arrayPost["layout"] = $post["layout"];
            }
            if (isset($post["icone"])){
                $arrayPost["icone_id"] = $ico;
            }
            $res = $this->connection->insert("posts", $arrayPost);
            $post_id = $res->lastInsertId("posts");
            $arrayIds["post_id"] = $post_id;
            
            $arq = null;
            if (isset($post["arquivo"])){
                $arq = $this->upload($post["arquivo"], array('gif', 'jpg', 'png', 'jpeg', 'svg', 'pdf'), false, false);
                if (isset($arq["error"])){
                    $arq = null;
                }
                else{
                    $ext = pathinfo($arq, PATHINFO_EXTENSION);
                    $arrayArq = array(
                        "nome" => $post["arquivo"]["name"],
                        "endereco" => $arq,
                        "extencao" => $ext,
                        "pessoa_id" => $this->user[0]["pessoa_id"],
                        "post_id" => $post_id
                    );
                    $res = $this->connection->insert("arquivos", $arrayArq);
                    $arq = $res->lastInsertId("arquivos");
                    $arrayIds["arquivo_id"] = $arq;
                }
            }

            if (!empty($taxonomias)){
                foreach($taxonomias["ids"] as $tax){
                    $this->connection->insert("posts_posts", array(
                        "post_id1" => $post_id,
                        "post_id2" => $tax
                    ));
                }
            }

            if ($this->retorno == "json"){
                $arrayRes = array(
                    "post_id" => $post_id,
                    "post_data" => $arrayPost,
                    "img_data" => $arrayImg,
                    "arquivo_data" => $arrayArq,
                    "ids" => $arrayIds
                );
                if (isset($post["icone"])){
                    $arrayRes["ico_data"] = $arrayIco;
                }
                echo json_encode($arrayRes);
                exit;
            }

            if($t == 'n'){
                $this->sendPushNotification(strip_tags($post["descricao"]), $post["nome"], array(
                    "post_id" => $post_id,
                    "taxonomias" => $taxonomias["ids"],
                    "tipo" => $t
                )); 
            }

            $this->setMessage("success", $o . " " . $snome . " ($post_id) foi cadastrad" . $o . "!", true);
            $this->redireciona("arquivos?t=".$t);
        }
        else{
            if ($t != "p"){
                $posts = $this->getThisJsonData("arquivos/?t=t");
                $this->set("posts", $posts);
            }
            $this->pageTitle = "Nov" . $o . " " . $snome;
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "Nov" . $o . " " . $snome;
            $this->set('ref', $this->pagRef);
            $this->addFormsClass();
        }
    }

    public function editar(){
        $t = $this->request->getQuery("t");
        $snome = $this->l[$t]["nome"][0];
        $pnome = $this->l[$t]["nome"][1];
        $o = $this->l[$t]["o"];

        $id = $this->request->getQuery("id");
        $post = $this->request->getData("post");
        $taxonomias = $this->request->getData("taxonomias");

        if (!empty($id)){
            $posts = $this->getThisJsonData("arquivos/?id=".$id."&t=".$t);

            if (count($posts)){
                $vl_anterior = $posts[0]['nome'];
                if (!empty($post)){
                    $arrayIds = array();
                    $arrayImg = array();
                    $arrayIco = array();
                    $arrayArq = array();
        
                    $ico = null;
                    if (isset($post["icone"])){
                        $ico = $this->upload($post["icone"], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $posts[0]["icone"], false);
                        
                        if (isset($ico["error"])){
                            $ico = $posts[0]["icone_id"];
                        }
                        else{
                            $ext = pathinfo($ico, PATHINFO_EXTENSION);
                            $arrayIco = array(
                                "nome" => $post["icone"]["name"],
                                "endereco" => $ico,
                                "extencao" => $ext,
                                "pessoa_id" => $this->user[0]["pessoa_id"]
                            );
                            if (!empty($posts[0]["icone"])){
                                $res = $this->connection->update("arquivos", $arrayIco, array(
                                    "id" => $posts[0]["icone_id"]
                                ));
                                $ico = $posts[0]["icone_id"];
                            }
                            else{
                                $res = $this->connection->insert("arquivos", $arrayIco);
                                $ico = $res->lastInsertId("arquivos");
                                $arrayIds["icone_id"] = $ico;
                            }
                        }
                    }

                    $arq = null;
                    if (isset($post["arquivo"])){
                        $arq = $this->upload($post["arquivo"], array('gif', 'jpg', 'png', 'jpeg', 'svg', 'pdf'), $posts[0]["arquivo"], false);
                        if (isset($arq["error"])){
                            $arq = $posts[0]["f_id"];
                        }
                        else{
                            $ext = pathinfo($arq, PATHINFO_EXTENSION);
                            $arrayArq = array(
                                "nome" => $post["arquivo"]["name"],
                                "endereco" => $arq,
                                "extencao" => $ext,
                                "pessoa_id" => $this->user[0]["pessoa_id"],
                                "post_id" => $id
                            );
                            if (!empty($posts[0]["arquivo"])){
                                $res = $this->connection->update("arquivos", $arrayArq, array(
                                    "id" => $posts[0]["f_id"]
                                ));
                                $arq = $posts[0]["f_id"];
                            }
                            else{
                                $res = $this->connection->insert("arquivos", $arrayArq);
                                $arq = $res->lastInsertId("arquivos");
                                $arrayIds["arquivo_id"] = $arq;
                            }
                        }
                    }

                    $img = $this->upload($post["imagem"], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $posts[0]["imagem"]);
                    
                    if (isset($img["error"])){
                        $img = $posts[0]["imagem_id"];
                    }
                    else{
                        $ext = pathinfo($img, PATHINFO_EXTENSION);
                        $arrayImg = array(
                            "nome" => $post["imagem"]["name"],
                            "endereco" => $img,
                            "extencao" => $ext,
                            "pessoa_id" => $this->user[0]["pessoa_id"]
                        );
                        if (!empty($posts[0]["imagem"])){
                            $res = $this->connection->update("arquivos", $arrayImg, array(
                                "id" => $posts[0]["imagem_id"]
                            ));
                            $img = $posts[0]["imagem_id"];
                        }
                        else{
                            $res = $this->connection->insert("arquivos", $arrayImg);
                            $img = $res->lastInsertId("arquivos");
                            $arrayIds["arquivo_id"] = $img;
                        }
                    }
                    $arrayPost = array(
                        "nome" => $post["nome"],
                        "descricao" => $post["descricao"],
                        "post_pai_id" => !empty($post["pai_id"]) ? $post["pai_id"] : null,
                        "imagem_id" => $img,
                        "is_menu" => isset($post["is_menu"]) ? 1 : 0,
                        "ordem" => !empty($post["ordem"]) ? $post["ordem"] : null
                    );
                    if (isset($post["layout"])){
                        $arrayPost["layout"] = $post["layout"];
                    }
                    if (isset($post["icone"])){
                        $arrayPost["icone_id"] = $ico;
                    }

                    $res = $this->connection->update("posts", $arrayPost, array(
                        "id" => $id
                    ));
    
                    $this->connection->delete("posts_posts", array(
                        "post_id1" => $id
                    ));
                    
                    if (!empty($taxonomias)){
                        foreach($taxonomias["ids"] as $tax){
                            $this->connection->insert("posts_posts", array(
                                "post_id1" => $id,
                                "post_id2" => $tax
                            ));
                        }
                    }


                    if ($this->retorno == "json"){
                        $arrayRes = array(
                            "post_id" => $id,
                            "post_data" => $arrayPost,
                            "img_data" => $arrayImg,
                            "ids" => $arrayIds
                        );
                        if (isset($post["icone"])){
                            $arrayRes["ico_data"] = $arrayIco;
                        }
                        echo json_encode($arrayRes);
                        exit;
                    }
                    $this->setMessage("success", $o . " " . $snome . " ($id) foi alterad" . $o . "!", true);
                    $this->redireciona("arquivos?t=".$t);
                }
                else{
                    if ($t != "p"){
                        $oPosts = $this->getThisJsonData("arquivos/?t=t");

                        if ($t != "t"){
                            $pts = $this->connection->newQuery()
                            ->select("*")
                            ->from("posts_posts")
                            ->where("post_id1 = $id")
                            ->execute()
                            ->fetchAll("assoc");

                            $aryPts = array();
                            foreach($pts as $pt){
                                $aryPts[] = $pt["post_id2"];
                            }

                            $this->set("pts", $aryPts);
                        }
                        $this->set("posts", $oPosts);
                    }
                    $this->set("post", $posts[0]);
                    $this->set("id", $id);
                    $this->pageTitle = "Editar " . $snome . " ".$posts[0]["id"];
                    $this->pagRef[1] = "Editar " . $snome;
                    $this->set('ref', $this->pagRef);
                    $this->set('title', $this->pageTitle);
                    $this->addFormsClass();
                }
            }
            else{
                $this->setMessage("danger", $o . " " . $snome . " $id não exite!", true);
                $this->redireciona("arquivos?t=".$t);
            }
        }
        else{
            $this->setMessage("danger", "Id d". $o . " " . $snome . " não recebido!", true);
            $this->redireciona("arquivos?t=".$t);
        }
    }
    public function excluir(){
        $t = $this->request->getQuery("t");
        $snome = $this->l[$t]["nome"][0];
        $pnome = $this->l[$t]["nome"][1];
        $o = $this->l[$t]["o"];

        $id = $this->request->getQuery("id");

        if (!empty($id)){
            $post = $this->getThisJsonData("arquivos/?id=".$id."&t=".$t);
            if (count($post)){
                $post = $post[0];

                $pps = $this->connection->newQuery()
                ->select("*")
                ->from("posts_posts")
                ->where("post_id2 = $id")
                ->execute();

                $pp = $this->connection->newQuery()
                ->select("*")
                ->from("posts")
                ->where("post_pai_id = $id")
                ->execute();
    
                if (!count($pps) && !count($pp)){
                    if (!empty($post["imagem"])){
                        $this->deleteFile($post["imagem"]);
                        $this->connection->delete("arquivos", array(
                            "id" => $post["imagem_id"]
                        ));
                    }
                    $this->connection->delete("posts_posts", array(
                        "post_id1" => $id
                    ));
                    $this->connection->delete("posts", array(
                        "id" => $id
                    ));
                    if ($this->retorno == "json"){
                        echo json_encode(array(
                            "post_data" => $post
                        ));
                        exit;
                    }
                    $this->setMessage("success", $o . " " . $snome . " ($id) foi excluid" . $o . "!", true);
                }
                else{
                    $this->setMessage("danger", "Não foi possível excluir " . $o . " " . $snome . " ($id) por que " . $o . " mesm" . $o . " possui posts dependentes!", true);
                }
            }
            else{
                $this->setMessage("danger", $o . " " . $snome . " $id não exite!", true);
            }
        }
        else{
            $this->setMessage("danger", "Id d". $o . " " . $snome . " não recebido!", true);
        }
        $this->redireciona("arquivos?t=".$t);
    }
    //Funções
    public function limpaPosts($data){
        $arrayResu = array();

        $arrayKeys = array(
            "p_id", "p_tipo", "p_nome", "p_descr", "p_is_menu",
            "p_img_id", "p_pp_id", "p_dt_cad", "p_layout", "p_ordem",
            "p_img_nome", "p_imagem", "p_i_nome", "p_icone", "p_ico_id",
            "p_f_id", "p_f_nome", "p_arquivo",

            "p2_id", "p2_tipo", "p2_nome", "p2_descr", "p2_is_menu",
            "p2_img_id", "p2_pp_id", "p2_dt_cad", "p2_layout", "p2_ordem",
            "p2_img_nome", "p2_imagem", "p2_i_nome", "p2_icone", "p2_ico_id",
            "p2_f_id", "p2_f_nome", "p2_arquivo",
        );

        foreach($data as $key => $post){
            $id = $this->hasId($arrayResu, $post["id"]);
            if ($id !== false){
                if (!isset($arrayResu[$id]["posts"][$post["p_id"]])){
                    if (!empty($post["p_id"])){
                        $arrayResu[$id]["posts"][$post["p_id"]] = array(
                          "id" => $post["p_id"],
                          "tipo" => $post["p_tipo"],
                          "nome" => $post["p_nome"],
                          "descricao" => $post["p_descr"],
                          "is_menu" => $post["p_is_menu"],
                          "dt_cad" => $post["p_dt_cad"],
                          "layout" => $post["p_layout"],
                          "ordem" => $post["p_ordem"],
                          "post_pai_id" => $post["p_pp_id"],
                          "imagem" => $post["p_imagem"],
                          "img_nome" => $post["p_img_nome"],
                          "imagem_id" => $post["p_img_id"],
                          "icone" => $post["p_icone"],
                          "i_nome" => $post["p_i_nome"],
                          "icone_id" => $post["p_ico_id"],
                          "arquivo" => $post["p_arquivo"],
                          "f_id" => $post["p_f_id"],
                          "f_nome" => $post["p_f_nome"]
                        );
                    }
                }
            }
            else{
                $post["posts"] = array();
                $post["pai"] = array();
                if (!empty($post["p_id"])){
                    $post["posts"] = array($post["p_id"] => array(
                        "id" => $post["p_id"],
                        "tipo" => $post["p_tipo"],
                        "nome" => $post["p_nome"],
                        "descricao" => $post["p_descr"],
                        "is_menu" => $post["p_is_menu"],
                        "dt_cad" => $post["p_dt_cad"],
                        "layout" => $post["p_layout"],
                        "ordem" => $post["p_ordem"],
                        "post_pai_id" => $post["p_pp_id"],
                        "imagem" => $post["p_imagem"],
                        "img_nome" => $post["p_img_nome"],
                        "imagem_id" => $post["p_img_id"],
                        "icone" => $post["p_icone"],
                        "i_nome" => $post["p_i_nome"],
                        "icone_id" => $post["p_ico_id"],
                        "arquivo" => $post["p_arquivo"],
                        "f_id" => $post["p_f_id"],
                        "f_nome" => $post["p_f_nome"]
                    ));
                }
                if (!empty($post["p2_id"])){
                    $post["pai"] = array(
                        "id" => $post["p2_id"],
                        "tipo" => $post["p2_tipo"],
                        "nome" => $post["p2_nome"],
                        "descricao" => $post["p2_descr"],
                        "is_menu" => $post["p2_is_menu"],
                        "dt_cad" => $post["p2_dt_cad"],
                        "layout" => $post["p2_layout"],
                        "ordem" => $post["p2_ordem"],
                        "post_pai_id" => $post["p2_pp_id"],
                        "imagem" => $post["p2_imagem"],
                        "img_nome" => $post["p2_img_nome"],
                        "imagem_id" => $post["p2_img_id"],
                        "icone" => $post["p2_icone"],
                        "i_nome" => $post["p2_i_nome"],
                        "icone_id" => $post["p2_ico_id"],
                        "arquivo" => $post["p2_arquivo"],
                        "f_id" => $post["p2_f_id"],
                        "f_nome" => $post["p2_f_nome"]
                    );
                }
                $post = $this->limpaObjKeys($post, $arrayKeys);
                array_push($arrayResu, $post);
            }
        }

        return $arrayResu;
    }
}