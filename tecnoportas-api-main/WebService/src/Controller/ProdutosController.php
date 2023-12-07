<?php
namespace App\Controller;

class ProdutosController extends AppController
{


    public function initialize()
    {
        parent::initialize();
        
        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Produtos";
        
        $this->pagRef = "produtos";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $res = $this->connection->newQuery()
        ->select('id, nome')
        ->from('produtos')
        ->where("produtos.deletado = 0")
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->set('produtos', $res);
            $this->set('title', $this->pageTitle);

            $this->addTableClass();
        }
    }
    public function buscaProdutos(){

        $limit = $this->request->getQuery("limit");
        $offset = $this->request->getQuery("offset");
        $search = $this->request->getQuery("search");


        if(!$limit){
            $limit = null;
        }
        
        if(!$offset){
            $offset = null;
        }

        $condicao = "produtos.deletado = 0";

        if($search){
            $condicao.= " AND produtos.nome like '$search%'";
        }

        $res = $this->connection->newQuery()
        ->select('unidades_medida.nome as unNome, produtos.id, produtos.codigo, motores.produto_id, catmotores.nome, catmotores.imagem, pinturas.produto_id, entradas.produto_id, produtos.nome, produtos.descricao, produtos.imagem, tipo, valor_unitario')
        ->from('produtos')
        ->join(
            [
                'table' => 'entradas',
                'type' => 'LEFT',
                'conditions' => 'entradas.produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'motores',
                'type' => 'LEFT',
                'conditions' => 'motores.produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'catmotores',
                'type' => 'LEFT',
                'conditions' => 'categoria_id = catmotores.id'
            ]
        )
        ->join(
            [
                'table' => 'automatizadores',
                'type' => 'LEFT',
                'conditions' => 'automatizadores.produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'pinturas',
                'type' => 'LEFT',
                'conditions' => 'pinturas.produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidades_medida.id = produtos.unidade_medida_id'
            ]
        )
        ->where($condicao)        
        ->order('produtos.nome, catmotores.nome');
        if($limit != null){
            $res = $res->limit($limit);
        }
        if($offset != null){
            $res = $res->offset($offset);
        }
        $res = $res->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Produtos";
            $this->set('produtos', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "produtos";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }

    public function desabilitados(){
        $res = $this->connection->newQuery()
        ->select('*')
        ->from('produtos')
        ->where("produtos.deletado = 1")        
        ->order('produtos.nome')
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "desabilitados";
            $this->set('produtos', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "desabilitados";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }

    public function habilitar(){
        $pid = $this->request->getQuery('pid');
        $this->connection->update('produtos', array('deletado'=> 0),array('id'=>$pid));
        $this->setMessage('success','Produto habilitado!',true);
        $this->redireciona('produtos/desabilitados');
    }

    public function deletar(){
        $pid = $this->request->getQuery('pid');
        $res = $this->connection->newQuery()
        ->select('*')
        ->from('produtos')
        ->where('id = '. $pid)
        ->execute()
        ->fetchAll('assoc');
        $this->connection->delete('produtos', array('id'=>$pid));
        $this->setMessage('success','Produto excluído!',true);
        $this->redireciona('produtos/desabilitados');
    }
}
