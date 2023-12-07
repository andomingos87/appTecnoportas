<?php
namespace App\Controller;

use PhpOffice\PhpSpreadsheet\Exception;

class PrecadastroController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Pré-Cadastro";
        $this->pagRef[0] = "revendedores";
        $this->pagRef[1] = "lista precad";
        $this->set('thisUser', $this->user);
        $this->set('ref', $this->pagRef);
    }
    public function index(){

        $res = $this->connection->newQuery()
        ->select("ddd, telefones.numero, enderecos.uf, enderecos.cidade, usuarios.id, pessoas.id as pessoaId, usuarios.username, CONCAT(pessoas.nome, ' ', pessoas.sobrenome) as nome, usuarios.preCad,usuarios.recusado, aparelhos.modelo, aparelhos.fabricante, aparelhos.is_aprovado")
        ->from('usuarios')
        ->join(
            [
                'table' => 'aparelhos',
                'type' => 'LEFT',
                'conditions' => 'aparelhos.usuario_id = usuarios.id'
            ]
        )
        ->join(
            [
                'table' => 'pessoas',
                'type' => 'LEFT',
                'conditions' => 'pessoas.id = usuarios.pessoa_id'
            ]
        )
        ->join(
            [
                'table' => 'telefones',
                'type' => 'LEFT',
                'conditions' => 'telefones.pessoa_id = pessoas.id'
            ]
        )
        ->join(
            [
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = pessoas.id'
            ]
        )
        ->where('usuarios.active = 1')
        ->andWhere('usuarios.preCad = 1 and usuarios.recusado < 1 or (aparelhos.is_aprovado = 0 and usuarios.dt_atualizado < "2019-12-16" and usuarios.recusado < 1)')
        ->execute()
        ->fetchAll("assoc");

        $this->set('precads', $res);
        $this->set('title', $this->pageTitle);

        $this->addTableClass();

    }

    public function recusar(){

        try {
            $usuario_id = $this->request->getQuery('uid');
            $res = $this->connection->newQuery()
            ->select("emails.email, usuarios.recusado + 1 as recusado_increment, CONCAT(pessoas.nome, ' ', pessoas.sobrenome) as nomeUser")
            ->from('usuarios')
            ->join([
                'table'=>'pessoas',
                'type'=>'LEFT',
                'conditions'=>'pessoas.id = usuarios.pessoa_id'
            ])
            ->join([
                'table'=>'emails',
                'type'=>'LEFT',
                'conditions'=>'emails.pessoa_id = pessoas.id'
            ])
            ->where("usuarios.id = $usuario_id")
            ->execute()
            ->fetchAll('assoc');
            $recusado_increment = $res[0]['recusado_increment'];
            $this->connection->update('usuarios', ['recusado' => "$recusado_increment", 'aprovado' => '0'] , ['id' => $usuario_id]);
            $this->connection->update('aparelhos', ['is_aprovado' => '0'] , ['usuario_id' => $usuario_id]);

            $template = $this->connection->newQuery()
            ->select('content, ativo')
            ->from('email_templates')
            ->where("name = 'templateReprova'")
            ->execute()
            ->fetchAll('assoc');

            if($template[0]['ativo'] == 1){

                $email = $template[0]['content'];
                $email = str_replace('$usuario', $res[0]['nomeUser'], $email);

                $arrayEmail = array(
                    'assunto' => 'Cadastro Recusado | Sistema TecnoPortas',
                    'mensagem' => $email,
                    'destinatario' => $res[0]['email']
                );

                $this->enviaEmail($arrayEmail);
                $this->setMessage('success','Usuário Recusado e e-mail de confirmação enviado',true);
                $this->redireciona('precadastro');
            }else{
                $this->setMessage('success','Usuário Recusado',true);
                $this->redireciona('precadastro');
            }

            $this->setMessage('success','Usuário Recusado',true);
            $this->redireciona('precadastro');
        } catch (Exception $e) {
            $this->setError(0,'ERRO AO RECUSAR USUÁRIO', false, true);
            $this->redireciona('precadastro');
        }

    }

    public function recusados(){
        $this->pageTitle = "Pré - Cadastros Recusados";
        $this->pagRef[1] = "lista de revendedores recusados";
        $this->set('ref', $this->pagRef);

        $res = $this->connection->newQuery()
        ->select("ddd, telefones.numero, enderecos.uf, enderecos.cidade, usuarios.id, pessoas.id as pessoaId, usuarios.username, CONCAT(pessoas.nome, ' ', pessoas.sobrenome) as nome, usuarios.preCad,usuarios.recusado, aparelhos.modelo, aparelhos.fabricante, aparelhos.is_aprovado, pessoas.dt_cadastro")
        ->from('usuarios')
        ->join(
            [
                'table' => 'aparelhos',
                'type' => 'LEFT',
                'conditions' => 'aparelhos.usuario_id = usuarios.id'
            ]
        )
        ->join(
            [
                'table' => 'pessoas',
                'type' => 'LEFT',
                'conditions' => 'pessoas.id = usuarios.pessoa_id'
            ]
        )
        ->join(
            [
                'table' => 'telefones',
                'type' => 'LEFT',
                'conditions' => 'telefones.pessoa_id = pessoas.id'
            ]
        )
        ->join(
            [
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = pessoas.id'
            ]
        )
        ->where('usuarios.recusado > 0')
        ->execute()
        ->fetchAll("assoc");

        $this->set('precads', $res);
        $this->set('title', $this->pageTitle);

        $this->addTableClass();
    }

    public function aprova(){
        $recusados = $this->request->getQuery('recusados');
        try{
            $usuario_id = $this->request->getQuery('uid');

            $res = $this->connection->newQuery()
            ->select("emails.email, CONCAT(pessoas.nome, ' ', pessoas.sobrenome) as nomeUser")
            ->from('usuarios')
            ->join([
                'table'=>'pessoas',
                'type'=>'LEFT',
                'conditions'=>'pessoas.id = usuarios.pessoa_id'
            ])
            ->join([
                'table'=>'emails',
                'type'=>'LEFT',
                'conditions'=>'emails.pessoa_id = pessoas.id'
            ])
            ->where("usuarios.id = $usuario_id")
            ->execute()
            ->fetchAll('assoc');


            $this->connection->update('usuarios', ['preCad'=> '0','aprovado' => '1', 'recusado'=> '0'] , ['id' => $usuario_id]);
            $this->connection->update('aparelhos', ['is_aprovado' => '1'] , ['usuario_id' => $usuario_id]);

            $template = $this->connection->newQuery()
            ->select('content,ativo')
            ->from('email_templates')
            ->where("name = 'templateAprova'")
            ->execute()
            ->fetchAll('assoc');

            if($template[0]['ativo'] == 1){

                $email = $template[0]['content'];
                $email = str_replace('$usuario', $res[0]['nomeUser'], $email);

                $arrayEmail = array(
                    'assunto' => 'Cadastro Aprovado | Sistema TecnoPortas',
                    'mensagem' => $email,
                    'destinatario' => $res[0]['email']
                );

                $this->enviaEmail($arrayEmail);

                $this->setMessage('success','Usuário Aprovado e e-mail de confirmação enviado',true);

            }else{
                $this->setMessage('success','Usuário Aprovado',true);
            }
            if($recusados){
                $this->redireciona('precadastro/recusados');
            }else{
                $this->redireciona('precadastro');
            }

        }catch(Exception $e){
            $this->setError(0, "ERRO AO APROVAR USUÁRIO");
            $this->redireciona('precadastro');
        }


    }

    public function templateAprova(){
        $templateEmail = $this->request->getData('templateEmail');
        $ativo = $this->request->getData('ativo');

        if(empty($ativo)){
            $ativo = 0;
        }

        if (!empty($templateEmail)){
            $res = $this->connection->newQuery()
            ->select('id,name')
            ->from('email_templates')
            ->where("name = 'templateAprova'")
            ->execute()
            ->fetchAll("assoc");

            if(count($res)>0){

                $this->connection->update('email_templates', array('content'=> $templateEmail,'ativo'=>$ativo), array('id'=>$res[0]['id']));

                $this->setMessage('success','Template editado com sucesso!',true);
                $this->redireciona('precadastro/templateAprova');
            }else{
                $this->setError(0, "Erro ao editar template!");
            }
        }
        else{
            $template = $this->connection->newQuery()
            ->select('content,ativo')
            ->from('email_templates')
            ->where("name = 'templateAprova'")
            ->execute()
            ->fetchAll('assoc');

            $this->set('template', $template[0]);
        }

        $this->set('title', $this->pageTitle);

    }

    public function templateReprova(){
        $templateEmail = $this->request->getData('templateEmail');
        $ativo = $this->request->getData('ativo');

        if(empty($ativo)){
            $ativo = 0;
        }

        if (!empty($templateEmail)){
            $res = $this->connection->newQuery()
            ->select('id,name')
            ->from('email_templates')
            ->where("name = 'templateReprova'")
            ->execute()
            ->fetchAll("assoc");

            if(count($res)>0){

                $this->connection->update('email_templates', array('content'=> $templateEmail, 'ativo' => $ativo), array('id'=>$res[0]['id']));

                $this->setMessage('success','Template editado com sucesso!',true);
                $this->redireciona('precadastro/templateReprova');
            }else{
                $this->setError(0, "Erro ao editar template!");
            }
        }
        else{
            $template = $this->connection->newQuery()
            ->select('content, ativo')
            ->from('email_templates')
            ->where("name = 'templateReprova'")
            ->execute()
            ->fetchAll('assoc');

            $this->set('template', $template[0]);
        }

        $this->set('title', $this->pageTitle);

    }

}
