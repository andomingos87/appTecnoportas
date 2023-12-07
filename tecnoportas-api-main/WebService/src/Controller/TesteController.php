<?php
namespace App\Controller;
ini_set( 'display_errors', 1 );
error_reporting( E_ALL );

class TesteController extends AppController
{
    
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }
        $this->pageTitle = "Orçamentos";
        $this->pagRef[0] = "orcamentos";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }

    public function index(){
        $this->autoRender = false;
        
        $emailsender = "app@apptecnoportas.com.br";
        $emaildestinatario = "kezisoc@cloudstat.top";
        $quebra_linha = "\n";
        $assunto = "Checking PHP mail";
        $mensagemHTML = "PHP mail works just fine";
        $headers  = "From: app@apptecnoportas.com.br\n";
        $headers .= "Cc: dev@fingerdigital.com.br\n"; 
        $headers .= "X-Sender: app@apptecnoportas.com.br\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();
        $headers .= "X-Priority: 1\n"; // Urgent message!
        $headers .= "Return-Path: app@apptecnoportas.com.br\n"; // Return path for errors
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=iso-8859-1\n";
        //$mandou = mail($to,$subject,$message, $headers);
        $mandou = mail($emaildestinatario, $assunto, $mensagemHTML, $headers ,"-r".$emailsender);

        /*if(!){ // Se for Postfix
            $headers .= "Return-Path: " . $emailsender . $quebra_linha; // Se "não for Postfix"
            $mandou = mail($emaildestinatario, $assunto, $mensagemHTML, $headers );
            
        }*/

        if($mandou == true){
            echo "MADOU.";
        }else{
            echo "ERRO NO ENVIO.";
        }
        echo "<br/>".$headers;
        
    }
}
 
?>