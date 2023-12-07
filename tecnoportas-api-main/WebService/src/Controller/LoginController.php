<?php
namespace App\Controller;

class LoginController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if ($this->user){
            $this->redireciona('orcamentos');
        }
        $this->viewBuilder()->enableAutoLayout(false);
        
        $this->pageTitle = "Acesse Sua Conta";
        $this->set('title', $this->pageTitle);
    }

    public function index(){
        $nivel = $this->request->getData('nivel');
        $username = $this->request->getData('username');
        $senha = $this->request->getData('senha');      
          
        if (empty($nivel) && $nivel !== "0"){
            $nivel = 1;
        };

        if (!empty($username) && !empty($senha)){
            $res = $this->connection->newQuery()
            ->select('usuarios.id, usuarios.pessoa_id, username, pessoas.nome, pessoas.sobrenome, pessoas.foto, 
            desconto_max, acrecimo_max, pessoas.cnpj, pessoas.ie, emails.email, telefones.ddd, telefones.numero as tel_num,
            pessoas.tipo, pessoas.nivel, cep, logradouro, enderecos.numero, complemento, cidade, uf, bairro, vendedor.nome as vend_nome, 
            vendedor.sobrenome as vend_snome, ve_email.email as vend_email, aparelhos.id as aparelho_id, aparelhos.is_aprovado, 
            ve_tel.ddd as ve_ddd, ve_tel.numero as ve_numero, contato.nome as ct_nome, contato.sobrenome as ct_snome, acesso,
            usuarios.desconto_aut,usuarios.desconto_ptr,usuarios.desconto_opc,usuarios.desconto_mto,usuarios.desconto_ent,usuarios.desconto_prf,
            usuarios.desconto_tst, desconto_seletivo')
            ->from('usuarios')
            ->join(
                [
                    'table' => 'emails',
                    'type' => 'LEFT',
                    'conditions' => 'emails.pessoa_id = usuarios.pessoa_id'
                ]
            )
            ->join(
                [
                    'table' => 'pessoas',
                    'type' => 'LEFT',
                    'conditions' => 'usuarios.pessoa_id = pessoas.id'                    
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
            ->join(
                [
                    'table' => 'serralheiro_vendedores',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_vendedores.serralheiro_id = pessoas.id'
                ]
            )
            ->join(
                [
                    'table' => 'pessoas as vendedor',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_vendedores.vendedor_id = vendedor.id'
                ]
            )
            ->join(
                [
                    'table' => 'emails as ve_email',
                    'type' => 'LEFT',
                    'conditions' => 've_email.pessoa_id = vendedor.id'
                ]
            )
            ->join(
                [
                    'table' => 'telefones as ve_tel',
                    'type' => 'LEFT',
                    'conditions' => 've_tel.pessoa_id = vendedor.id'
                ]
            )
            ->join(
                [
                    'table' => 'serralheiro_contato',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_contato.serralheiro_id = pessoas.id'
                ]
            )
            ->join(
                [
                    'table' => 'pessoas as contato',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_contato.contato_id = contato.id'
                ]
            )
            ->join(
                [
                    'table' => 'aparelhos',
                    'type' => 'LEFT',
                    'conditions' => 'aparelhos.usuario_id = usuarios.id'
                ]
            )
            ->where('usuarios.active = 1')
            ->andWhere('(username = "'.$username.'" or emails.email = "'.$username.'") and senha = "'.md5($senha).'"')
            ->execute()
            ->fetchAll('assoc');

            if (count($res) > 0){
                if ($res[0]['acesso'] == $nivel || $res[0]['acesso'] >= 1 && $res[0]['acesso'] != 9){
                        $this->setLogin($res);
                        if ($this->retorno == 'json'){
                            echo json_encode($res);
                            exit;
                        }
                        else{
                            $this->redireciona('orcamentos');
                        }
                }
                else{
                    $this->setError(0, 'Acesso não Autorizado!');
                }
            }
            else{
                $this->setError(0, "E-mail, Nome de Usuário ou Senha Inválido!");
            }
        }
        else if ($this->retorno == "json"){
            $this->setError(3);
        }
    }
    public function aparelho(){
        $userId = $this->request->getData('userid');
        $isAlterado = false;
        if (!empty($userId)){
            $aparelhoData = $this->request->getData('aparelho');
            if (!empty($aparelhoData)){
                $aparelhoOldData = null;
                $aparelhoData = json_decode($aparelhoData, true);

                $res = $this->connection->newQuery()
                ->select('usuarios.id, aparelhos.id as aparelho_id')
                ->from('usuarios')
                ->join(
                    [
                        'table'=>'aparelhos',
                        'type'=>"LEFT",
                        'conditions'=>'aparelhos.usuario_id = usuarios.id'
                    ]
                )
                ->where('usuarios.id = '.$userId)
                ->execute()
                ->fetchAll('assoc');

                if (count($res) > 0){
                    $aparelhoId = $res[0]['aparelho_id'];

                    if (!empty($aparelhoId)){
                        $res = $this->connection->newQuery()
                        ->select('*')
                        ->from('aparelhos')
                        ->where('id = '.$aparelhoId)
                        ->execute()
                        ->fetchAll('assoc');

                        if (count($res) > 0){
                            $aparelhoOldData = $res[0];
                        }

                        $this->connection->update('aparelhos', $aparelhoData, array('id'=>$aparelhoId));

                        if($userId != 29){
                            if($aparelhoOldData['uuid'] != $aparelhoData['uuid']){
                                $this->connection->update('aparelhos', array('is_aprovado' => "0"), array('id'=>$aparelhoId));
                                $aparelhoOldData["is_aprovado"] = "0";
                                $isAlterado = true;
                            }
                        }
                    }
                    else{
                        $aparelhoData["usuario_id"] = $userId;
                        $res = $this->connection->insert('aparelhos', $aparelhoData);
                        $aparelhoId = $res->lastInsertId('aparelhos');
                        $aparelhoOldData["is_aprovado"] = "0";
                    }
                    echo json_encode(array('id'=>$aparelhoId, 'old'=>$aparelhoOldData, 'bloqueado'=>$isAlterado));
                    exit;
                }
                else{
                    $this->setError(0, "Usuário inválido!");
                }
            }
            else{
                $this->setError(3);
            }
        }
        else{
            $this->setError(0, "Usuário não encontrado!");
        }
        exit;
    }

    
    public function lembraSenha(){
        $this->autoRender = false;

        $username = $this->request->getData('username');

        if(!empty($username)){
            $res = $this->enviaSenhaEmail($username);

            if ($res==true){
                $this->redireciona("login#msgEnviada");
            }
            else{
                $this->redireciona("login#msgFalha");
            }

        }else{
            $this->redireciona("login#msgVazio");

        }

    }

    public function alteraSenha(){
        $cod = $this->request->getQuery('cod');
        $id = $this->request->getQuery('id');
        $acesso = $this->request->getQuery('n');
        $usuario = $this->request->getData('usuarioES');
        
        if (!empty($cod) && !empty($id)){
            $res = $this->connection->newQuery()
            ->select('id, username, acesso')
            ->from('usuarios')
            ->where('senha = "'.$cod.'" and id = '.$id)
            ->execute()
            ->fetchAll('assoc');

            if (count($res)){
                $this->set('id', $res[0]['id']); 
                $this->set('username', $res[0]['username']);
                $this->set('acesso', $res[0]['acesso']);
            }
            else{
                echo json_encode(['error' => 'Dados Inválidos!']);
                exit;
            }
        }
        else if (!empty($usuario)) {

            $res = $this->enviaSenhaEmail($usuario);
            if($res==false){

            $this->setError(0, "Usuário não encontrado");
            }
            echo json_encode(['sucess' => $res]);
            exit;
        }
        else{
            $id = $this->request->getQuery('id');
            $username = $this->request->getQuery('username');
            $n = $this->request->getQuery('n');
            $acesso = (string)$n;
            $novasenha = $this->request->getData('novasenha');
            $confirmasenha = $this->request->getData('confirmasenha');
            if (!empty($id) && !empty($novasenha) && !empty($confirmasenha) && !empty($username) && !empty($acesso) || $acesso === "0"){      
                if ($novasenha == $confirmasenha){
                    $this->connection->update('usuarios', ['senha' => md5($novasenha)], ['id'=>$id]);
                    $this->redireciona('login#senhaAlterada');
                }
                else{
                    $this->set('erro', 'As senhas não são iguais!');
                }
                $this->set('id', $id); 
                $this->set('username', $username);
            }
            else{
                echo json_encode(['error' => 'Dados nao encontrados!']);
                exit;
            }
        }
        $this->viewBuilder()->enableAutoLayout(false);
        $this->set('title', 'Alterar Minha Senha | TecnoPortas');
    }

    
}