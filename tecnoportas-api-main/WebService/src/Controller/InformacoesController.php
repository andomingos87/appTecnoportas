<?php
namespace App\Controller;

class InformacoesController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Informações";
        $this->pagRef[0] = "informações";
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $res = $this->connection->newQuery()
        ->select("id, nome, descricao, imagem, dt_cadastro")
        ->from("informacoes")
        ->order("dt_cadastro desc")
        ->execute()
        ->fetchAll("assoc");

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{        
            $this->set('infos', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "lista de informações";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function nova(){
        $info = $this->request->getData('info');

        if (!empty($info)){
            $img = $this->upload($info['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));
            if (isset($img['error'])){
                $img = null;
            }

            $arrayInfo = array(
                "nome"=>$info['nome'],
                "descricao"=>$info['descricao'],
                "imagem"=>$img,
                "ip_cadastro"=>$this->userIP()
            );
            $res = $this->connection->insert("informacoes", $arrayInfo);
            $info_id = $res->lastInsertId("informacoes");
            if ($this->retorno == 'json'){
                echo json_encode(array("informacao_id"=>$info_id));
                exit;
            }
            $this->setMessage('success','Informação adicionada com sucesso',true);
            $this->redireciona('informacoes');
        }
        
        $this->pageTitle = "Nova informação";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "nova informação";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editar(){
        $info_id = $this->request->getQuery('iid');
        if(!empty($info_id)){
            $res = $this->connection->newQuery()
            ->select("id, nome, descricao, imagem, dt_cadastro")
            ->from("informacoes")
            ->where("id = ". $info_id)
            ->execute()
            ->fetchAll("assoc");

            if (count($info_id)>0){
                $info = $this->request->getData('info');
                if (!empty($info)){
                    $isImg = isset($info['imagem']);
                    $img = null;
                    if ($isImg){
                        $img_ant = $res[0]['imagem'] | false;
                        
                        $img = $this->upload($info['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $img_ant);
                        if (isset($img['error'])){
                            $img = null;
                        }
                    }                    
                    $arrayInfo = array(
                        'nome' => $info['nome'],
                        "descricao"=>$info['descricao']
                    );
                    if ($img != null){
                        $arrayInfo['imagem'] = $img;
                    }
                    $this->connection->update('informacoes', $arrayInfo, array('id'=>$info_id));
                    $this->setMessage('success','Informação editada com sucesso!',true);
                    $this->redireciona('informacoes');
                }
                else{
                    $this->set('info', $res[0]);
                }
                $this->pageTitle = "Editar informação ".$info_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "informações";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }
            else{
                $this->setMessage('danger','Informação não encontrada',true);
                $this->redireciona('informacoes');
            }
        }else{
            $this->redireciona('informacoes');
        }
    }
    public function excluir(){
        $info_id = $this->request->getQuery('iid');
        
        if(!empty($info_id)){
            $res = $this->connection->newQuery()
            ->select('imagem')
            ->from('informacoes')
            ->where('id = '. $info_id)
            ->execute()
            ->fetchAll('assoc');
            if(count($res)>0){
                if (!empty($res[0]['imagem'])){
                    $this->deleteFile($res[0]['imagem']);
                }
                $this->connection->delete('informacoes', array('id'=>$info_id));
                $this->setMessage('success','Informação excluída!',true);
                $this->redireciona('informacoes');
            }else{
                $this->setMessage('danger','Informação não encontrada!',true);
                $this->redireciona('informacoes');                
            }
        }else{
            $this->redireciona('informacoes');            
        }
    }
}