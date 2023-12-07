<?php
namespace App\Controller;

class MotoresController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Motores";
        $this->pagRef[0] = "motores";
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $peso = $this->request->getData('peso');
        $categoria = $this->request->getData('categoria');
        $ordem = 'produtos.nome';

        $res = $this->connection->newQuery()
        ->select('motores.id, categoria_id, motores.condicao, produto_id, produtos.nome, produtos.codigo, produtos.descricao, produtos.tipo, catmotores.imagem, catmotores.nome as cat_nome, kg_max, is_padrao, unidades_medida.nome as medida, unidades_medida.nome as unNome, valor_unitario')
        ->from('motores')
        ->join(
            [
                'table' => 'produtos',
                'type' => 'LEFT',
                'conditions' => 'produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]
        )
        ->join(
            [
                'table' => 'catmotores',
                'type' => 'LEFT',
                'conditions' => 'categoria_id = catmotores.id'
            ]
        )
        ->where('catmotores.active = 1');
        if (!empty($peso) && !empty($categoria)){
            $res = $res->andWhere('kg_max >= '.$peso. ' and categoria_id = '. $categoria);
            $ordem = "kg_max";
        }
        if (!empty($categoria)){
            $res = $res->andWhere('categoria_id = '. $categoria);
        }       
        $res = $res->andWhere("produtos.deletado = 0")
        ->order($ordem)
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{        
            $this->set('motores', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "lista de motores";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function categorias(){
        $res = $this->connection->newQuery()
        ->select('id, nome, descricao, imagem, aciona_padrao_img')
        ->from('catmotores')
        ->where('active = 1')
        ->execute()
        ->fetchAll('assoc');
        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Categorias dos Motores";
            $this->set('categorias', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "categorias de motores";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addCategoria(){
        $categoria = $this->request->getData('categoria');

        if (!empty($categoria)){
            $acionaImg = null;
            if (!empty($categoria['aciona_img'])) {
                $acionaImg = $this->upload($categoria['aciona_img'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));
            }
            $img = $this->upload($categoria['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));
            $arrayCat = array(
                'nome'=>$categoria['nome'],
                'descricao'=>$categoria['descricao'],
                'ip_atualizado'=>$this->userIP()
            );
            if ($acionaImg !== null && !isset($acionaImg['error'])){
                $arrayCat['aciona_padrao_img'] = $acionaImg;
            }
            if (!isset($img['error'])){
                $arrayCat['imagem'] = $img;
            }

            $res = $this->connection->insert('catmotores', $arrayCat);
            $categoria_id = $res->lastInsertId('catmotores');

            if ($this->retorno == 'json'){
                echo json_encode(array('categoria_id' => $categoria_id));
                exit;
            }
            else{
                $this->redireciona('motores/categorias');
            }
        }
        $this->pageTitle = "Nova Categoria";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "categorias de motores";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editCategoria(){
        $categoria_id = $this->request->getQuery('cid');

        if (!empty($categoria_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('catmotores')
            ->where('active = 1')
            ->andWhere('id = '.$categoria_id)
            ->execute()
            ->fetchAll();

            if(count($res) > 0){

                $categoria = $this->request->getData('categoria');

                $arrayCat = array(
                    'nome'=>$categoria['nome'],
                    'descricao'=>$categoria['descricao'],
                    'ip_atualizado'=>$this->userIP()
                );
                $categoria = $this->request->getData('categoria');

                if (!empty($categoria)){
                    $arrayCat = array(
                        'nome'=>$categoria['nome'],
                        'descricao'=>$categoria['descricao'],
                        'ip_atualizado'=>$this->userIP()
                    );
                    
                    $isAcionaImg = !empty($categoria['aciona_img']);
                    if ($isAcionaImg){
                        $isAcionaImg = !empty($categoria['aciona_img']['name']);
                        if (!$isAcionaImg){
                            unset($categoria['aciona_img']);
                        }
                    }
                    $acionaImg_ant = null;
                    
                    if ($isAcionaImg){
                        $res = $this->connection->newQuery()
                        ->select('aciona_padrao_img')
                        ->from('catmotores')
                        ->where('active = 1')
                        ->andWhere('id = '.$categoria_id)
                        ->execute()
                        ->fetchAll('assoc');

                        $acionaImg_ant = $res[0]['aciona_padrao_img'];

                        $acionaImg = $this->upload($categoria['aciona_img'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $acionaImg_ant);

                        if (!isset($acionaImg['error'])){
                            $arrayCat['aciona_padrao_img'] = $acionaImg;
                        }
                    }

                    $isImg = !empty($categoria['imagem']);
                    if ($isImg){
                        $isImg = !empty($categoria['imagem']['name']);
                        if (!$isImg){
                            unset($categoria['imagem']);
                        }
                    }
                    $img_ant = null;

                    
                    if ($isImg){
                        $res = $this->connection->newQuery()
                        ->select('imagem')
                        ->from('catmotores')
                        ->where('active = 1')
                        ->andWhere('id = '.$categoria_id)
                        ->execute()
                        ->fetchAll('assoc');

                        $img_ant = $res[0]['imagem'];

                        $img = $this->upload($categoria['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $img_ant);

                        if (!isset($img['error'])){
                            $arrayCat['imagem'] = $img;
                        }
                    }
                    $res = $this->connection->update('catmotores', $arrayCat, ['id'=>$categoria_id]);

                    if ($this->retorno == 'json'){
                        echo json_encode(array('categoria_id' => $categoria_id));
                        exit;
                    }
                    else{
                        $this->redireciona('motores/categorias');
                    }
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('nome, descricao, imagem, aciona_padrao_img')
                    ->from('catmotores')
                    ->where('active = 1')
                    ->andWhere('id = '.$categoria_id)
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $this->set('categoria', $res[0]);
                }
                $this->pageTitle = "Editar categoria ".$categoria_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "categorias de motores";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage("danger", "Categoria de motor não encontrada!", true);
                $this->redireciona('motores/categorias');
            }
        }
        else{
            $this->redireciona('motores/categorias');
        }
    }
    public function delCategoria(){
        $categoria_id = $this->request->getQuery('cid');
        
        $res = $this->connection->newQuery()
        ->select('imagem')
        ->from('catmotores')
        ->where('id = '.$categoria_id)
        ->execute()
        ->fetchAll('assoc');

        if(count($res)>0){
            $arrayAtr = array(
                "active" => 0,
                'ip_atualizado' => $this->userIP(),
                'dt_atualizado' => $this->getCurrentTimeStamp()
            );
            $this->connection->update('catmotores', $arrayAtr, array('id'=>$categoria_id));
            
            $this->setMessage("success", "Categoria excluída com sucesso!", true);
            $this->redireciona('motores/categorias');
        }else{
            $this->setMessage("danger", "Categoria de motor não encontrada!", true);
            $this->redireciona('motores/categorias');
        }
    }
    public function testeiras(){
        $peso = $this->request->getData('peso');
        $categoria = $this->request->getData('categoria');
        $motor_id = $this->request->getData('motor_id');
        $ordem = 'produtos.nome';

        $res = $this->connection->newQuery()
        ->select('produtos.imagem, testeiras.id, testeiras.produto_id, produtos.codigo, produtos.nome, produtos.tipo, produtos.descricao, testeiras.kg_max, unidades_medida.nome as medida, valor_unitario')
        ->from('testeiras')
        ->join(
            [
                'table' => 'produtos',
                'type' => 'LEFT',
                'conditions' => 'testeiras.produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]
        )
        ->join(
            [
                'table' => 'testeira_motores',
                'type' => 'LEFT',
                'conditions' => 'testeira_motores.testeira_id = testeiras.id'
            ]
        )
        ->join(
            [
                'table' => 'motores',
                'type' => 'LEFT',
                'conditions' => 'motores.id = testeira_motores.motor_id'
            ]
        )
        ->join(
            [
                'table' => 'catmotores',
                'type' => 'LEFT',
                'conditions' => 'motores.categoria_id = catmotores.id'
            ]
        )
        ->where('catmotores.active = 1');
        if(!empty($motor_id)){
        $res = $res->andWhere('testeira_motores.motor_id = '.$motor_id);
        }

        $res = $res->andWhere("produtos.deletado = 0")
        ->order($ordem)
        ->group("testeiras.id")
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Testeiras";
            $this->set('testeiras', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "testeiras";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addTesteira(){
        $configs = $this->getConfiguracoes();
        $testeira = $this->request->getData('testeira');
        $motores = $this->request->getData('motores');

        if (!empty($testeira) && !empty($motores)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$testeira['codigo'],
                'imagem'=>$testeira['imagem'],
                'tipo'=>'tst',
                'nome'=>$testeira['nome'],
                'descricao'=>$testeira['descricao'],
                'is_padrao'=>'0',
                'unidade_medida_id'=>$configs['pd_testeira_med'],
                'valor_unitario'=>$testeira['valor_unitario']
            ));
            if ($produto_id){
                $res = $this->connection->insert('testeiras', array('produto_id'=>$produto_id));
                $testeira_id = $res->lastInsertId('testeiras');

                foreach($motores as $motor){
                    $this->connection->insert("testeira_motores", array("testeira_id"=>$testeira_id, "motor_id"=>$motor));
                }

                if ($this->retorno == 'json'){
                    echo json_encode(array('testeira_id' => $testeira_id));
                    exit;
                }
                else{
                    $this->redireciona('motores/testeiras');
                }
            }
            else{
                $this->setError(0, "Erro ao adicionar a testeira!");
            }
        }
        else{                
                $motores = $this->connection->newQuery()
                ->select('motores.id, motores.categoria_id, motores.produto_id, produtos.nome, produtos.descricao, catmotores.imagem')
                ->from('produtos')
                ->join(
                    [
                        'table'=>'motores',
                        'type'=>'LEFT',
                        'conditions'=>'motores.produto_id = produtos.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'catmotores',
                        'type' => 'LEFT',
                        'conditions' => 'motores.categoria_id = catmotores.id'
                    ]
                )
                ->where('produtos.id = motores.produto_id AND produtos.deletado = 0 AND catmotores.active = 1')
                ->execute()
                ->fetchAll('assoc');

                $this->set('motores', $motores);
        }
        $this->pageTitle = "Nova Testeira";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "testeiras";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editTesteira(){
        $testeira_id = $this->request->getQuery('tid');

        if (!empty($testeira_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('testeiras')
            ->where('id = '.$testeira_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                
            $testeira = $this->request->getData('testeira');
            $motores = $this->request->getData('motores');

            if (!empty($testeira) && !empty($motores)){
                $res = $this->editProduto(array(
                    'codigo'=>$testeira['codigo'],
                    'imagem'=>$testeira['imagem'],
                    'tipo'=>'tst',
                    'nome'=>$testeira['nome'],
                    'descricao'=>$testeira['descricao'],
                    'valor_unitario'=>$testeira['valor_unitario']
                ), $testeira_id);
                if ($res){
                    $this->connection->delete("testeira_motores", array("testeira_id" => $testeira_id));

                    foreach($motores as $motor){
                        $this->connection->insert("testeira_motores", array("testeira_id"=>$testeira_id, "motor_id"=>$motor));
                    }

                    if ($this->retorno == 'json'){
                        echo json_encode(array('testeira_id' => $testeira_id));
                        exit;
                    }
                    else{
                        
                        $this->setMessage("success", "Testeira editada com sucesso!", true);
                        $this->redireciona('motores/testeiras');
                    }
                }
                else{
                    $this->setError(0, "Erro ao editar a testeira!");                  
                }
            }
            else{
                $res = $this->connection->newQuery()
                ->select('nome, imagem, produtos.codigo, descricao, kg_max, valor_unitario')
                ->from('testeiras')
                ->join(
                    [
                        'table'=>'produtos',
                        'type'=>'LEFT',
                        'conditions'=>'produtos.id = produto_id'
                    ]
                )
                ->where('testeiras.id = '.$testeira_id)
                ->execute()
                ->fetchAll('assoc');
                
                $motores = $this->connection->newQuery()
                ->select('motores.id, motores.categoria_id, motores.produto_id, produtos.nome, produtos.descricao, catmotores.imagem')
                ->from('produtos')
                ->join(
                    [
                        'table'=>'motores',
                        'type'=>'LEFT',
                        'conditions'=>'motores.produto_id = produtos.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'catmotores',
                        'type' => 'LEFT',
                        'conditions' => 'motores.categoria_id = catmotores.id'
                    ]
                )
                ->where('produtos.id = motores.produto_id AND produtos.deletado = 0 AND catmotores.active = 1')
                ->execute()
                ->fetchAll('assoc');

                $cats = $this->connection->newQuery()
                ->select("motor_id")
                ->from("testeira_motores")
                ->where("testeira_id = " . $testeira_id)
                ->execute()
                ->fetchAll("assoc");

                $tCats = array();
                foreach($cats as $cat){
                    $tCats[] = $cat["motor_id"];
                }

                $this->set('tcats', $tCats);
                $this->set('motores', $motores);
                $this->set('testeira', $res[0]);
            }
            $this->pageTitle = "Editar Testeira ".$testeira_id;
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "testeiras";
            $this->set('ref', $this->pagRef);

            $this->addFormsClass();

            }else{
                $this->setMessage("danger", "Testeira não encontrada!", true);
                $this->redireciona('motores/testeiras');
            }

        }
        else{
            $this->redireciona('motores/testeiras');
        }
    }
    public function deletaTesteira($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('testeiras')
        ->join(
            [
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produtos.id = produto_id'
            ]
        )
        ->where('testeiras.id = '.$id)
        ->execute()
        ->fetchAll('assoc');

        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage("danger", "Testeira não encontrada!", true);
            $this->redireciona('motores/testeiras');
        }
        
    }
    public function delTesteira(){        
        $testeira_id = $this->request->getQuery('tid');

        $this->deletatesteira($testeira_id);

        $this->redireciona('motores/testeiras');
    }
    public function novo(){
        $configs = $this->getConfiguracoes();
        $motor = $this->request->getData('motor');
        $categorias = $this->request->getData('categorias');

        if (!empty($motor) && !empty($categorias)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$motor['codigo'],
                'tipo'=>'mto',
                'nome'=>$motor['nome'],
                'descricao'=>$motor['descricao'],
                'is_padrao'=>'1',
                'unidade_medida_id'=>$configs['pd_motor_med'],
                'valor_unitario'=>$motor['valor_unitario']
            ));
            if ($produto_id){
                $res = $this->connection->insert('motores', array('produto_id'=>$produto_id, 'condicao'=>$motor['formula'], 'categoria_id'=>$categorias[0]));
                $motor_id = $res->lastInsertId('motores');

                if ($this->retorno == 'json'){
                    echo json_encode(array('motor_id' => $motor_id));
                    exit;
                }
                else{
                    $this->setMessage("success", "Motor adicionado com sucesso!", true);
                    $this->redireciona('motores');
                }
            }
        }
        else{
            $res = $this->connection->newQuery()
            ->select('id, nome, descricao, imagem')
            ->from('catmotores')
            ->where('active = 1')
            ->execute()
            ->fetchAll('assoc');

            $this->set('categorias', $res);
        }
        $this->pageTitle = "Novo Motor";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "novo motor";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editar(){
        $motor_id = $this->request->getQuery('mid');

        if (!empty($motor_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('motores')
            ->where('id = '.$motor_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                $motor = $this->request->getData('motor');
                $categorias = $this->request->getData('categorias');

                if (!empty($motor) && !empty($categorias)){
                    $res = $this->editProduto(array(
                        'codigo'=>$motor['codigo'],
                        'tipo'=>'mto',
                        'nome'=>$motor['nome'],
                        'descricao'=>$motor['descricao'],
                        'valor_unitario'=>$motor['valor_unitario']
                    ), $motor_id);
                    if ($res){
                        $res = $this->connection->update('motores', array('condicao'=>$motor['formula'], 'categoria_id'=>$categorias[0]), array('id'=>$motor_id));
                        
                        if ($this->retorno == 'json'){
                            echo json_encode(array('motor_id' => $motor_id));
                            exit;
                        }
                        else{
                            $this->setMessage("success", "Motor editado com sucesso!", true);
                            $this->redireciona('motores');
                        }
                    }
                    else{
                        $this->setError(0, "Erro ao editar o Produto!");
                    }
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('nome, produtos.codigo, descricao, motores.condicao, kg_max, valor_unitario, categoria_id')
                    ->from('motores')
                    ->join(
                        [
                            'table'=>'produtos',
                            'type'=>'LEFT',
                            'conditions'=>'produtos.id = produto_id'
                        ]
                    )
                    ->where('motores.id = '.$motor_id)
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $cat = $this->connection->newQuery()
                    ->select('id, nome, descricao, imagem')
                    ->from('catmotores')
                    ->where('active = 1')
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('categorias', $cat);

                    $this->set('motor', $res[0]);                
                }
                $this->pageTitle = "Editar Motor ".$motor_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "editar motor";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage("danger", "Motor não encontrado!", true);
                $this->redireciona('motores');
            }
        }
        else{
            $this->redireciona('motores');
        }
    }
    public function deletaMotor($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('motores')
        ->join(
            [
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produtos.id = produto_id'
            ]
        )
        ->where('motores.id = '.$id)
        ->execute()
        ->fetchAll('assoc');

        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage("danger", "Motor não encontrado!", true);
            $this->redireciona('motores');
        }
        
    }
    public function deleta(){
        $motor_id = $this->request->getQuery('mid');
        $this->deletaMotor($motor_id);
        $this->setMessage("success", "Motor não encontrado!", true);
        $this->redireciona('motores');
    }
    public function automatizadores(){
        $catmotor_id = $this->request->getData('catmotor_id');

        $res = $this->connection->newQuery()
        ->select('automatizadores.id, automatizadores.catmotor_id, produtos.nome, produtos.codigo, descricao, imagem, is_padrao, unidades_medida.nome as medida, unidades_medida.nome as unNome, valor_unitario')
        ->from('automatizadores')
        ->join(
            [
                'table' => 'produtos',
                'type' => 'LEFT',
                'conditions' => 'produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]
        )
        ->where('produtos.deletado = 0');
        
        if(!empty($catmotor_id)){
            $res = $res->andWhere('automatizadores.catmotor_id = '.$catmotor_id);
        }
    
        $res = $res->order('produtos.nome')
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{        
            $this->pageTitle = "Acionamentos";
            $this->set('automatizadores', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[0] = "produtos";
            $this->pagRef[1] = "acionamentos";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addAutomatizador(){
        $configs = $this->getConfiguracoes();
        $automatizador = $this->request->getData('automatizador');
        $categorias = $this->request->getData('categorias');

        if (!empty($automatizador) && !empty($categorias)){

            $produto_id = $this->addProduto(array(
                'codigo'=>$automatizador['codigo'],
                'imagem'=>$automatizador['imagem'],
                'tipo'=>'aut',
                'nome'=>$automatizador['nome'],
                'descricao'=>$automatizador['descricao'],
                'is_padrao'=>'1',
                'unidade_medida_id'=>$configs['pd_automatizador_med'],
                'valor_unitario'=>$automatizador['valor_unitario']
            ));
            if ($produto_id){
                $res = $this->connection->insert('automatizadores', array(
                    'produto_id' => $produto_id,
                    'catmotor_id' => $categorias[0],
                ));
                $automatizador_id = $res->lastInsertId('automatizadores');

                if ($this->retorno == 'json'){
                    echo json_encode(array('automatizador_id' => $automatizador_id));
                    exit;
                }
                else{
                    $this->setMessage("success", "Acionador Adicionado!", true);
                    $this->redireciona('motores/automatizadores');
                }
            }
        }
        else {
            $cat = $this->connection->newQuery()
            ->select('id, nome, descricao, imagem')
            ->from('catmotores')
            ->where('active = 1')
            ->execute()
            ->fetchAll('assoc');

            $this->set('categorias', $cat);
        }
        $this->pageTitle = "Novo Acionamento";
        $this->set('title', $this->pageTitle);
        $this->pagRef[0] = "produtos";
        $this->pagRef[1] = "acionamentos";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editAutomatizador(){
        $automatizador_id = $this->request->getQuery('aid');

        if (!empty($automatizador_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('automatizadores')
            ->where('id ='.$automatizador_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                $automatizador = $this->request->getData('automatizador');
                $categorias = $this->request->getData('categorias');

                if (!empty($automatizador) && !empty($categorias)){
                    $res = $this->editProduto(array(
                        'codigo'=>$automatizador['codigo'],
                        'imagem'=>$automatizador['imagem'],
                        'tipo'=>'aut',
                        'nome'=>$automatizador['nome'],
                        'descricao'=>$automatizador['descricao'],
                        'valor_unitario'=>$automatizador['valor_unitario']
                    ), $automatizador_id);
                    if ($res){
                        $res = $this->connection->update(
                            'automatizadores',
                            array(
                                'catmotor_id' => $categorias[0],
                            ),
                            array('id'=>$automatizador_id)
                        );
                        if ($this->retorno == 'json'){
                            echo json_encode(array('automatizador_id' => $automatizador_id));
                            exit;
                        }
                        else{
                            $this->setMessage("success", "Acionador editado com sucesso", true);
                            $this->redireciona('motores/automatizadores');
                        }
                    }
                    else{
                        $this->setError(0, "Erro ao editar o Automatizador!");
                    }                
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('nome, imagem, descricao, catmotor_id, produtos.codigo, is_padrao, valor_unitario')
                    ->from('automatizadores')
                    ->join(
                        [
                            'table'=>'produtos',
                            'type'=>'LEFT',
                            'conditions'=>'produtos.id = produto_id'
                        ]
                    )
                    ->where('automatizadores.id = '.$automatizador_id)
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('automatizador', $res[0]);
                    
                    $cat = $this->connection->newQuery()
                    ->select('id, nome, descricao, imagem')
                    ->from('catmotores')
                    ->where('active = 1')
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('categorias', $cat);
                }
                $this->pageTitle = "Editar Acionamento ".$automatizador_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[0] = "produtos";
                $this->pagRef[1] = "acionamentos";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage("danger", "Acionador não encontrado", true);
                $this->redireciona('motores/automatizadores');
            }
        }
        else{
            $this->redireciona('motores/automatizadores');
        }
    }
    public function deletaAutomatizador($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('automatizadores')
        ->where('automatizadores.id = '.$id)
        ->execute()
        ->fetchAll('assoc');

        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage("danger", "Acionador não encontrado", true);
            $this->redireciona('motores/automatizadores');
        }
        
    }
    public function delAutomatizador(){
        $automatizador_id = $this->request->getQuery('aid');
        $this->deletaAutomatizador($automatizador_id);
        $this->setMessage("success", "Acionador excluído", true);
        $this->redireciona('motores/automatizadores');
    }
}