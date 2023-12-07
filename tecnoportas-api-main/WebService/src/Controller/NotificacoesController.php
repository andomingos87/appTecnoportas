<?php
namespace App\Controller;

use PhpOffice\PhpSpreadsheet\Exception;

class NotificacoesController extends AppController
{
    public function initialize()
    {
        parent::initialize();
        $token = "hKzNkOw19";
        $recievedToken = $this->request->getQuery('token');

        if(!empty($recievedToken)){
            if($recievedToken == $token){
                echo "OK";
            }else{
                echo "ERROR";
                exit;
            }
        }else{
            if (!$this->user){
                $this->redireciona('login');
            }elseif($this->user[0]['acesso'] != 1){
                $this->redireciona('orcamentos');
            }
            $this->pageTitle = "Notificações";
            $this->pagRef[0] = "notificacoes";
            $this->set('thisUser', $this->user);
        }
    }

    public function index(){

    $res = $this->connection->newQuery()

        ->select('*')
        ->from('notificacoes')
        ->order('id')
        ->execute()
        ->fetchAll('assoc');
    
        $this->set('notificacoes', $res);
        $this->set('ref', $this->pagRef);
        $this->set('title', $this->pageTitle);
        $this->addTableClass();

    }

    public function novo(){
        $notificacao = $this->request->getData('notificacao');
        
        if (!empty($notificacao)){

            $arrayNotif = array(
                "titulo" => $notificacao['titulo'],
                'mensagem' => $notificacao['mensagem']
            );
            
            try {
                $this->sendPushNotification($notificacao['mensagem'], $notificacao['titulo'], null);

                $this->connection->insert('notificacoes', $arrayNotif);
                $this->setMessage('success','Notificação publicada com sucesso!',true);
                $this->redireciona('notificacoes');
            } catch (Throwable $th) {
                $this->setError(0, 'ERRO AO PUBLICAR NOTIFICAÇÂO:');
                $this->redireciona('notificacoes');
            }           

        }

        $this->pageTitle = "Novo Notificação";
        $this->set('title', $this->pageTitle);
        $this->set('ref', $this->pagRef);
        $this->addFormsClass();
    }

    public function atualizaKey(){
        $key = $this->request->getData('pushkey');
        $user = $this->request->getData('userId');

        if(!empty($key)){

            if(!empty($user)){
                $res = $this->connection->newQuery()
                ->select('id, usuario_id')
                ->from('pushkeys')
                ->where("usuario_id = '$user'")
                ->execute()
                ->fetchAll("assoc");

                if(count($res)>0){
                    try {
                        $this->connection->update('pushkeys', array('pushkey'=>$key, 'usuario_id'=>$user), ['id'=>$res[0]['id']]);
                        echo json_encode("OK");
                        exit;
                    } catch (Exception $e) {
                        echo json_encode("ERROR UPDATE KEY" . json_encode($e));
                        exit;
                    }

                }else{

                    $res = $this->connection->newQuery()
                    ->select("id, pushkey")
                    ->from("pushkeys")
                    ->where("pushkey = '$key'")
                    ->execute()
                    ->fetchAll("assoc");
                    if(count($res)>0){
                        try {
                            $this->connection->update('pushkeys', array('pushkey'=>$key, 'usuario_id'=>$user), ['id'=>$res[0]['id']]);
                            echo json_encode("OK");
                            exit;
                        } catch (Exception $e) {
                            echo json_encode("ERROR UPDATE KEY" . json_encode($e));
                            exit;
                        }
                        
                    }else{
                        try {
                            $this->connection->insert('pushkeys', array('pushkey'=>$key,'usuario_id'=>$user));
                            echo json_encode("OK");
                            exit;
                        } catch (Exception $e) {
                            echo json_encode("ERROR INSERT PUSHKEY" . json_encode($e));
                            exit;
                        }
                    }
                }

            }else{

                $res = $this->connection->newQuery()
                ->select("id, pushkey")
                ->from("pushkeys")
                ->where("pushkey = '$key'")
                ->execute()
                ->fetchAll("assoc");
                if(count($res)>0){
                    try {
                        $this->connection->update('pushkeys', array('pushkey'=>$key, 'usuario_id'=>$user), ['id'=>$res[0]['id']]);
                        echo json_encode("OK");
                        exit;
                    } catch (Exception $e) {
                        echo json_encode("ERROR UPDATE KEY" . json_encode($e));
                        exit;
                    }
                    
                }else{
                    try {
                        $this->connection->insert('pushkeys', array('pushkey'=>$key,'usuario_id'=>$user));
                        echo json_encode("OK");
                        exit;
                    } catch (Exception $e) {
                        echo json_encode("ERROR INSERT PUSHKEY" . json_encode($e));
                        exit;
                    }
                }
    
            }
        }
            
        exit;
    }

    public function notificaPendentes(){
        $pendentes = $this->connection->newQuery()
        ->select('count(orcamentos.id) as num_orcamentos, orcamentos.status, orcamento_pessoas.serralheiro_id, pessoas.nome, usuarios.id as userId')
        ->from('orcamentos')
        ->join(
            [
                'table'=>'orcamento_pessoas',
                'type'=>'LEFT',
                'conditions'=>'orcamentos.id = orcamento_pessoas.orcamento_id'
            ]
        )
        ->join(
            [
                'table'=>'pessoas',
                'type'=>'LEFT',
                'conditions'=>'orcamento_pessoas.serralheiro_id = pessoas.id'
            ]
        )
        ->join(
            [
                'table'=>'usuarios',
                'type'=>'LEFT',
                'conditions'=>'pessoas.id = usuarios.pessoa_id'
            ]
        )
        ->where('orcamentos.status = 1 and orcamento_pessoas.serralheiro_id is not null')
        ->group('orcamento_pessoas.serralheiro_id')
        ->execute()
        ->fetchAll('assoc');

        if(count($pendentes)>0){
            echo "<h1>Pendentes</h1><br><br>";
            $msg = "";
            foreach ($pendentes as $key => $pendente) {
                echo "Seralheiro(" . $pendente['serralheiro_id'] ."): " . $pendente['nome'] . "  possui ( " . $pendente['num_orcamentos'] ." ) orçamentos pendentes ($key)...<br/>";
            
                if(intval($pendente['num_orcamentos']) > 1){

                    $msg = $pendente['nome'] . " você possui: " . $pendente['num_orcamentos'] . " orçamentos pendentes";

                }else{

                    $msg = $pendente['nome'] . " você ainda possui: " . $pendente['num_orcamentos'] . " orçamento pendente";

                }

               $this->sendPushNotification($msg, 'Tecnoportas: Orçamentos Pendentes', null, "usuario_id = ". $pendente['userId']);

            }
        }
        exit;

    }
}