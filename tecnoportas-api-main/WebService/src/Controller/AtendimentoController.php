<?php
namespace App\Controller;

class AtendimentoController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Atendimento";
        
        $this->pagRef[0] = "atendimento";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index()
    {
        $atendimento = $this->request->getData('atendimento');
        
        if($atendimento){
            $nome = $atendimento['nome'];
            $email = $atendimento['email'];
            $msg = $atendimento['mensagem'];
            
            $configs = $this->getConfiguracoes();
    
            $mensagem = "<h1>Novo e-mail de atendimento</h1><br/>";
            $mensagem .= "<h2>Solicitante: $nome </h2>";
            $mensagem .= "<h4>Nome: $nome</h4>";
            $mensagem .= "<h4>Email: $email</h4>";
            $mensagem .= "<h4>Mensagem:</h4><p style='white-space: pre-line'>$msg</p>";
    
    
            $remDados = array($configs['remetente'],"Sistema Tecnoportas");
            $arrayEmail = array(
                'remetente' => $remDados,
                'destinatario' => $configs['email_atendimento'],
                'assunto' => 'Nova solicitação de atendimento - ' . $email,
                'mensagem' => $mensagem
            );
    
            $res = $this->enviaEmail($arrayEmail);
            echo json_encode($res);
            exit;
        }else{
            echo "Sem dados";
            exit;
        }
        
    }
}
