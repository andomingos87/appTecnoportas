<?php
namespace App\Controller;

class AjustesController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Ajustes";
        
        $this->pagRef[0] = "ajustes";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $this->redireciona("ajustes/usuariosDeAcesso");
    }
    public function usuariosDeAcesso(){
        $res = $this->connection->newQuery()
        ->select('usuarios.id, username, email')
        ->from('usuarios')
        ->join(
            [
                'table' => "emails",
                'type' => 'LEFT',
                'conditions' => 'emails.pessoa_id = usuarios.pessoa_id'
            ]
        )
        ->where('acesso = 1')
        ->execute()
        ->fetchAll("assoc");
        
        $this->pageTitle = "Usuários de Acesso";
        $this->set('users', $res);
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "usuarios de acesso";
        $this->set('ref', $this->pagRef);

        $this->addTableClass();
    }
    public function editarUsuarioAcesso(){
        $uaid = $this->request->getQuery('uaid');
        
            $usuario = $this->request->getData('user');
            $pessoa = $this->request->getData('pessoa');

            if (!empty($usuario) && !empty($pessoa)){
                $pessoaId = $this->connection->newQuery()
                    ->select('usuarios.pessoa_id')
                    ->from('usuarios')
                    ->where('usuarios.id =' . $uaid)
                    ->execute()
                    ->fetchAll("assoc");

                $res = $this->connection->newQuery()
                    ->select('pessoas.id,emails.email')
                    ->from('pessoas')
                    ->join(
                        [
                            'table' => 'emails',
                            'type' => 'LEFT',
                            'conditions' => 'emails.pessoa_id = ' . $pessoaId[0]['pessoa_id']
                        ]
                    )
                    ->where('pessoas.id = ' . $pessoaId[0]['pessoa_id'])
                    ->execute()
                    ->fetchAll('assoc');
                if (count($res) > 0) {
                    if ($res[0]['email'] != $usuario['email']) {
                        $ckEmail = $this->checaEmail($usuario['email']);
                        if($ckEmail){
                            $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!",false, true);
                            $this->redireciona('ajustes/editarUsuarioAcesso?uaid='.$uaid);
                        }
                    }
    
                    $arrayPessoa = array(
                        'nome' => $pessoa['nome'],
                        'sobrenome' => $pessoa['sobrenome']
                    );
                    $res = $this->connection->update('pessoas', $arrayPessoa, ['id'=>$pessoaId[0]['pessoa_id']]);
        
                    $arrayEmail = array(
                        'email' => $usuario['email']
                    );
                    $this->connection->update('emails', $arrayEmail, ['pessoa_id'=>$pessoaId[0]['pessoa_id']]);
        
                    if(!empty($usuario['senha'])){
                        // var_dump($pessoaId[0]['pessoa_id']);exit;
                        
                        $arrayUsuario = array(
                            'senha' => md5($usuario['senha'])
                        );
                        $res = $this->connection->update('usuarios', $arrayUsuario, ['pessoa_id' => $pessoaId[0]['pessoa_id']]);
                }
                    if ($this->retorno == 'json'){
                        echo json_encode(array('pessoa_id' => $pessoaId[0]['pessoa_id']));
                        exit;
                    }
                    else{
                        $this->setMessage('success','Acesso de usuario editado com sucesso!',true);
                        $this->redireciona('ajustes/usuariosDeAcesso');
                    }
                }
            }
            
        if (!empty($uaid)){
            
            $res = $this->connection->newQuery()
            ->select('usuarios.id, nome, sobrenome, tipo, username, email')
            ->from('usuarios')
            ->join(
                [
                    'table' => "pessoas",
                    'type' => 'LEFT',
                    'conditions' => 'usuarios.pessoa_id = pessoas.id'
                ]
            )
            ->join(
                [
                    'table' => "emails",
                    'type' => 'LEFT',
                    'conditions' => 'usuarios.pessoa_id = emails.pessoa_id'
                ]
            )
            ->where('acesso = 1 and usuarios.id = '. $uaid)
            ->execute()
            ->fetchAll("assoc");
            
            $this->pageTitle = "Editar Usuário de Acesso ".$uaid;
            $this->set('user', $res[0]);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "editar usuario de acesso";
            $this->set('ref', $this->pagRef);
            
            $this->addFormsClass();
        }
        else{
            $this->redireciona('ajustes/usuariosDeAcesso');
        }



    }
    //

    public function adicionarUsuarioAcesso(){
        $pessoa = $this->request->getData('pessoa');
        $usuario = $this->request->getData('user');

        if (!empty($usuario) && !empty($pessoa)){

            $ckUser = $this->checaUser($usuario['username']);
            if($ckUser){
                $this->setError(0, "Já existe um usuário cadastrado com esse username",false, true);
                $this->redireciona('ajustes/adicionarUsuarioAcesso');
            }
            $ckEmail = $this->checaEmail($usuario['email']);
            if($ckEmail){
                $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!",false, true);
                $this->redireciona('ajustes/adicionarUsuarioAcesso');
            }


            $arrayPessoa = array(
                'nome' => $pessoa['nome'],
                'sobrenome' => $pessoa['sobrenome']
            );
            $res = $this->connection->insert('pessoas', $arrayPessoa);
            $pessoa_id = $res->lastInsertId('pessoas');

            $arrayUsuario = array(
                'username' =>$usuario['username'],
                'senha' => md5($usuario['senha']),
                'pessoa_id' => $pessoa_id,
                'acesso'=> '1'
            );
            $res = $this->connection->insert('usuarios', $arrayUsuario);

            $arrayEmail = array(
                'email' => $usuario['email'],
                'pessoa_id' => $pessoa_id
                );
            $this->connection->insert('emails', $arrayEmail);

            

            if ($this->retorno == 'json'){
                echo json_encode(array('pessoa_id' => $pessoa_id));
                exit;
            }
            else{
                $this->redireciona('ajustes/usuariosDeAcesso');
            }
            
        }
        else{
            $this->pageTitle = "Adicionar Usuário de Acesso ";
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "adicionar usuario de acesso";
            $this->set('ref', $this->pagRef);      
        }
    }

    //
    public function padroes(){
        $configs = $this->getConfiguracoes();

        $edita = $this->request->getQuery('edita');
        if (!empty($edita)){
            $medida_id = $this->request->getData('medida_id');
            switch($edita){
                case 'automatizador':
                    if ($configs['pd_automatizador_med'] != $medida_id){
                        $this->connection->update('produtos', ['unidade_medida_id'=>$medida_id], ['tipo'=> 'aut']);
                        $configs['pd_automatizador_med'] = $medida_id;
                    }
                break;
                case 'entrada': 
                    if ($configs['pd_entrada_med'] != $medida_id){
                        $this->connection->update('produtos', ['unidade_medida_id'=>$medida_id], ['tipo'=> 'ent']);
                        $configs['pd_entrada_med'] = $medida_id; 
                    }
                break;
                case 'testeira': 
                    if ($configs['pd_testeira_med'] != $medida_id){
                        $this->connection->update('produtos', ['unidade_medida_id'=>$medida_id], ['tipo'=> 'tst']);
                        $configs['pd_testeira_med'] = $medida_id; 
                    }
                break;
                case 'motor': 
                    if ($configs['pd_motor_med'] != $medida_id){
                        $this->connection->update('produtos', ['unidade_medida_id'=>$medida_id], ['tipo'=> 'mto']);
                        $configs['pd_motor_med'] = $medida_id; 
                    }
                break;
                case 'perfil': 
                    if ($configs['pd_perfil_med'] != $medida_id){
                        $this->connection->update('produtos', ['unidade_medida_id'=>$medida_id], ['tipo'=> 'prf']);
                        $configs['pd_perfil_med'] = $medida_id; 
                    }
                break;
                case 'pintura': 
                    if ($configs['pd_pintura_med'] != $medida_id){
                        $this->connection->update('produtos', ['unidade_medida_id'=>$medida_id], ['tipo'=> 'ptr']);
                        $configs['pd_pintura_med'] = $medida_id; 
                    }
                break;
            }
            $this ->setConfiguracoes($configs);

            $this->redireciona('ajustes/padroes');
        }
        else{
            $res = $this->connection->newQuery()
            ->select('id, nome')
            ->from('unidades_medida')
            ->execute()
            ->fetchAll('assoc');
    
            $this->set('medidas', $res);
            $this->set('configs', $configs);
        
            $this->pageTitle = "Padrões";
            $this->set('chapas', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "padroes";
            $this->set('ref', $this->pagRef);
    
            $this->addTableClass();
        }
    }

    public function gerais(){
        $configs = $this->getConfiguracoes();
        $edita = $this->request->getQuery('edita');
       
        $res = $this->connection->newQuery()
        ->select('atributos.nome,atributos.id')
        ->from('atributos')
        ->where("active = 1")
        ->andWhere("atributos.tipo = 'cor'")
        ->execute()
        ->fetchAll('assoc');
    
        $this->set('cores',$res);

        $cats = $this->getThisJsonData("arquivos?t=t");
        $this->set('categorias',$cats);

        $prf = $this->connection->newQuery()
        ->select('id, nome')
        ->from('atributos')
        ->where('active = 1')
        ->andWhere("atributos.tipo = 'prf'")
        ->execute()
        ->fetchAll('assoc');
    
        $this->set('perfis',$prf);

        $mat = $this->connection->newQuery()
        ->select('id, nome')
        ->from('atributos')
        ->where('active = 1')
        ->andWhere("atributos.tipo = 'mat'")
        ->execute()
        ->fetchAll('assoc');
    
        $this->set('materiais',$mat);

        if (!empty($edita)){
        $valorOpcao = $this->request->getData('valor');
            switch($edita){
                case 'remetente':
                    if ($configs['remetente'] != $valorOpcao){
                        $configs['remetente'] = $valorOpcao;
                    }
                break;
                case 'destinatario':
                    if ($configs['destinatario'] != $valorOpcao){
                        $configs['destinatario'] = $valorOpcao;
                    }
                break;
                case 'pd_cor_fita':
                    if ($configs['pd_cor_fita'] != $valorOpcao){
                        $configs['pd_cor_fita'] = $valorOpcao;
                    }
                break;
                case 'sobre_nos':
                    if ($configs['sobre_nos'] != $valorOpcao){
                        $configs['sobre_nos'] = $valorOpcao;
                    }
                break;
                case 'termos_uso':
                    if ($configs['termos_uso'] != $valorOpcao){
                        $configs['termos_uso'] = $valorOpcao;
                    }
                break;
                case 'email_atendimento':
                    if($configs['email_atendimento'] != $valorOpcao){
                        $configs['email_atendimento'] = $valorOpcao;
                    }
                break;
                case 'catalogo':
                    if($configs['catalogo'] != $valorOpcao){
                        $configs['catalogo'] = $valorOpcao;
                    }
                break;
                case 'perfil_id':
                    if($configs['perfil_id'] != $valorOpcao){
                        $configs['perfil_id'] = $valorOpcao;
                    }
                break;
                case 'material_id':
                    if($configs['material_id'] != $valorOpcao){
                        $configs['material_id'] = $valorOpcao;
                    }
                break;
                case 'nome_empresa':
                    if($configs['nome_empresa'] != $valorOpcao){
                        $configs['nome_empresa'] = $valorOpcao;
                    }
                break;
                }
            $this->setConfiguracoes($configs);
            $this->redireciona('ajustes/gerais');
        }else{
            if ($this->retorno == "json") {
                echo json_encode($configs);
                exit;
            } else {
                $this->pageTitle = "Gerais";
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "gerais";
                $this->set('ref', $this->pagRef);
                $this->addTableClass();
                $this->set('configs', $configs);
            }
        }
    }

    public function deletarUsuarioAcesso(){
        $this->autoRender = false;

        $uaid = $this->request->getQuery('uaid');  
            
            $res = $this->connection->newQuery()
            ->select("pessoa_id")
            ->from("usuarios")
            ->where("id =".$uaid)
            ->execute()
            ->fetchAll("assoc");

            if(!empty($res)){
                $this->connection->delete('pessoas', array('id'=>$res[0]['pessoa_id']));
                $this->connection->delete('emails', array('pessoa_id'=>$res[0]['pessoa_id']));
            }
            $this->connection->delete('usuarios', array('id'=>$uaid));

                if ($this->retorno == 'json'){
                    $this->redireciona('ajustes/adicionarUsuarioAcesso');
                }
                else{
                    $this->redireciona('ajustes/usuariosDeAcesso');
                }
    }
}
