<?php
namespace App\Controller;

class UsuariosController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Usuarios";
        
        $this->pagRef[0] = "usuarios";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index(){
        
    }
   
    public function novo(){
        $usuario = $this->request->getData('user');
        $precad = $this->request->getData('preCad');

        if (!empty($usuario)){

            $ckUser = $this->checaUser($usuario['nomeUsuario']);
            if($ckUser){
                if($this->retorno == "json"){
                    echo "Já existe um usuário cadastrado com esse username";
                    exit;
                }else{
                    $this->setError(0, "Já existe um usuário cadastrado com esse username",false, true);
                    $this->redireciona('ajustes/adicionarUsuarioAcesso');
                }
            }
            $ckEmail = $this->checaEmail($usuario['email']);
            if($ckEmail){
                if($this->retorno == "json"){
                    echo "Já existe um usuário cadastrado com esse e-mail!!";
                    exit;
                }else{
                    $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!",false, true);
                    $this->redireciona('ajustes/adicionarUsuarioAcesso');
                }
            }


            $arrayPessoa = array(
                'nome' => $usuario['nome'],
                'sobrenome' => $usuario['sobrenome'],
                'cnpj' => $usuario['cpf'],
                'ie' => $usuario['rg'],
                'tipo' => $usuario['tipo'],
                'nivel' => "SE"
            );
            $res = $this->connection->insert('pessoas', $arrayPessoa);
            $pessoa_id = $res->lastInsertId('pessoas');

            $arrayUsuario = array(
                'username' =>$usuario['nomeUsuario'],
                'senha' => md5($usuario['senha']),
                'pessoa_id' => $pessoa_id,
                'acesso'=> '0',
                'preCad' => $precad ? 1 : 0,
                'aprovado' => $precad ? 0 : 1
            );
            $res = $this->connection->insert('usuarios', $arrayUsuario);

            $arrayEmail = array(
                'email' => $usuario['email'],
                'pessoa_id' => $pessoa_id
            );
            $this->connection->insert('emails', $arrayEmail);
            
            $tele = [null, null];
            if (!empty($usuario['telefone'])) {
                $tele = $this->configTel($usuario['telefone']);
            }

            if ($tele[0] !== null) {
                $arrayTel = array(
                    'ddd' => $tele[0],
                    'numero' => $tele[1],
                    'pessoa_id' => $pessoa_id,
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('telefones', $arrayTel);
            } else {
                $arrayTel = array(
                    'ddd' => '',
                    'numero' => '',
                    'pessoa_id' => $pessoa_id,
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('telefones', $arrayTel);
            }
            
            if (!empty($usuario['cidade']) && !empty($usuario['estado'])) {
                $arrayEnd = array(
                    'pessoa_id' => $pessoa_id,
                    'cep' => $usuario['cep'],
                    'logradouro' => $usuario['endereco'],
                    'numero' => $usuario['numero'],
                    'cidade' => $usuario['cidade'],
                    'uf' => $usuario['estado'],
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('enderecos', $arrayEnd);
            }

            if($precad){

                $configs = $this->getConfiguracoes();

                $mensagem = "<h1>Novo usuário cadastrado pelo aplicativo Tecnoportas</h1><br/>";
                $mensagem .= ($usuario['tipo'] == "F" ? "Nome: " : "Razão Social: ") . $usuario['nome']."<br/>";
                $mensagem .= ($usuario['tipo'] == "F" ? "Sobrenome: " : "Nome Fantasia: ") . $usuario['sobrenome']."<br/>";
                $mensagem .= ($usuario['tipo'] == "F" ? "CPF: " : "CNPJ: ") . $usuario['cpf']."<br/>";
                $mensagem .= ($usuario['tipo'] == "F" ? "RG: " : "IE: ") . $usuario['rg']."<br/>";
                $mensagem .= "E-Mail: ".$usuario['email']."<br/>";
                $mensagem .= "Telefone: ".$usuario['telefone']."<br/>";
                $mensagem .= "Endereço: ".$usuario['endereco']."<br/>";
                $mensagem .= "Número: ".$usuario['numero']."<br/>";
                $mensagem .= "CEP: ".$usuario['cep']."<br/>";
                $mensagem .= "Estado: ".$usuario['estado']."<br/>";
                $mensagem .= "Cidade: ".$usuario['cidade']."<hr/>";
                $mensagem .= "Nome de Usuário: ".$usuario['nomeUsuario']."</p>";

                $arrayEmail = array(
                    'assunto' => 'Novo usuário Cadastrado | Sistema TecnoPortas',
                    'mensagem' => $mensagem,
                    'destinatario' => $configs['email_atendimento']
                );
                $this->enviaEmail($arrayEmail);
                
                $mensagem1  = "<h1>Obrigado por realizar o pré cadastro no aplicativo Tecnoportas</h1><br/><p>";
                $mensagem1 .= ($usuario['tipo'] == "F" ? "Nome: " : "Razão Social: ") . $usuario['nome']."<br/>";
                $mensagem1 .= ($usuario['tipo'] == "F" ? "Sobrenome: " : "Nome Fantasia: ") . $usuario['sobrenome']."<br/>";
                $mensagem1 .= ($usuario['tipo'] == "F" ? "CPF: " : "CNPJ: ") . $usuario['cpf']."<br/>";
                $mensagem1 .= ($usuario['tipo'] == "F" ? "RG: " : "IE: ") . $usuario['rg']."<br/>";
                $mensagem1 .= "E-Mail: ".$usuario['email']."<br/>";
                $mensagem1 .= "Telefone: ".$usuario['telefone']."<br/>";
                $mensagem1 .= "Endereço: ".$usuario['endereco']."<br/>";
                $mensagem1 .= "Número: ".$usuario['numero']."<br/>";
                $mensagem1 .= "CEP: ".$usuario['cep']."<br/>";
                $mensagem1 .= "Estado: ".$usuario['estado']."<br/>";
                $mensagem1 .= "Cidade: ".$usuario['cidade']."<hr/>";
                $mensagem1 .= "Nome de Usuário: ".$usuario['nomeUsuario']."<br/>";
                $mensagem1 .= "Senha: ".$usuario['senha']."</p>";
                $mensagem1 .= "<hr/>Ao realizar o cadastro através do aplicativo Tecnoportas, os termos abaixo foram aceitos:<br/>";
                $mensagem1 .= "<p style='white-space: pre-line'>" . $configs['termos_uso'] . "</p>";


                $arrayEmail2 = array(
                    'assunto' => 'Dados de Cadastro | Sistema TecnoPortas',
                    'mensagem' => $mensagem1,
                    'destinatario' => $usuario['email']
                );
                $this->enviaEmail($arrayEmail2);

            }

            if ($this->retorno == 'json'){
                echo json_encode(array('pessoa_id' => $pessoa_id));
                exit;
            }
            
        }
        else{
            echo "Dados não recebidos";
            exit;
        }
    }

    public function excluir() {
        $serralheiro_id = $this->request->getData('serralheiro_id');

        if (empty($serralheiro_id)) {
            $serralheiro_id = $this->request->getQuery('sid');
        }

        $res = $this->connection->newQuery()
        ->select('*')
        ->from('usuarios')
        ->where('pessoa_id = ' . $serralheiro_id)
        ->execute()
        ->fetchAll('assoc');
        
        if(count($res) > 0){
            $arrayAtr = array(
                "active" => 0,
                'ip_atualizado' => $this->userIP(),
                'dt_atualizado' => $this->getCurrentTimeStamp()
            );

            $this->connection->update('usuarios', $arrayAtr, array('pessoa_id'=>$serralheiro_id));
            
            if ($this->retorno == 'json'){
                echo json_encode(array('success' => true));
                exit;
            }
            $this->setMessage('success','Usuario excluído com sucesso!',true);
            $this->redireciona('usuarios');
        }
        else{
            if ($this->retorno == 'json'){
                echo json_encode(array('success' => false));
                exit;
            }
            $this->setMessage('danger','Usuario não encontrado!',true);
            $this->redireciona('usuarios');
        }
    }
}
