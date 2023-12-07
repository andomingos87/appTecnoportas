<?php
namespace App\Controller;

class MedidasController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Medidas";
        
        $this->pagRef[0] = "ajustes";
        $this->pagRef[1] = "unidades de medida";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $res = $this->connection->newQuery()
        ->select('id, nome')
        ->from('unidades_medida')
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->set('medidas', $res);
            $this->set('title', $this->pageTitle);

            $this->addTableClass();
        }
    }
    public function nova(){
        $med = $this->request->getData('med');

        if (!empty($med)){
            $res = $this->connection->insert('unidades_medida', ['nome'=>$med['nome']]);
            $unidade_id = $res->lastInsertId('unidades_medida');
            if ($this->retorno == 'json'){
                echo json_encode(array('unidade_id'=>$unidade_id));
            }
            else{              
                $this->setMessage('success','Medida adicionada com sucesso!',true);  
                $this->redireciona('medidas');
            }
        }
        $this->pageTitle = "Nova Unidade de Medida";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "nova unidade de medida";
        $this->set('ref', $this->pagRef);
    }    
    public function editar(){
        $id = $this->request->getQuery('mid');
        $med = $this->request->getData('med');

        $res = $this->connection->newQuery()
        ->select('id')
        ->from('unidades_medida')
        ->where('id = '.$id)
        ->execute()
        ->fetchAll();

        if(count($res)>0){
            if (!empty($med)){
                $res = $this->connection->update('unidades_medida', ['nome'=>$med['nome']], ['id'=>$id]);
                if ($this->retorno == 'json'){
                    echo json_encode(array('unidade_id'=>$id));
                }
                else{                
                    $this->setMessage('success','Medida adicionada com sucesso!',true);  
                    $this->redireciona('medidas');
                }
            }
            else{
                $res = $this->connection->newQuery()
                ->select('id, nome')
                ->from('unidades_medida')
                ->where('id = '.$id)
                ->execute()
                ->fetchAll('assoc');
    
                $this->set('medida', $res[0]);
            }
            $this->pageTitle = "Editar Unidade de Medida";
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "editar unidade de medida";
            $this->set('ref', $this->pagRef);
        }else{
            $this->setMessage('danger','Medida não encontrada!',true);  
            $this->redireciona('medidas');
        }
        
    }
    public function deleta(){
        $id = $this->request->getQuery('mid');
        try{
            $res = $this->connection->delete('unidades_medida', ['id'=>$id]);
        }
        catch (\Exception $e){
            $this->setError($e->getCode(), $e->getMessage(), 'excluir a medida '.$id, true);
        }
        $this->setMessage('success','Medida excluída!',true);
        $this->redireciona('medidas');
    }
}