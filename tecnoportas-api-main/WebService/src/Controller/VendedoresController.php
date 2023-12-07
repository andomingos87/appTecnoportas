<?php
namespace App\Controller;

class VendedoresController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Vendedores";
        $this->pagRef[0] = "vendedores";
        $this->pagRef[1] = "lista de vendedores";
        $this->set('thisUser', $this->user);
        $this->set('ref', $this->pagRef);
    }
    public function index(){
        $res = $this->connection->newQuery()
        ->select("usuarios.username as usuario, pessoas.id, nome, sobrenome, email, ddd, telefones.numero")
        ->from('pessoas')
        ->join(
            [
                'table' => 'emails',
                'type' => 'LEFT',
                'conditions' => 'emails.pessoa_id = pessoas.id'
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
                'table' => 'usuarios',
                'type' => 'LEFT',
                'conditions' => 'usuarios.pessoa_id = pessoas.id'
            ]
        )
        ->where('pessoas.nivel = "VE" and usuarios.acesso = 2')
        ->execute()
        ->fetchAll("assoc");

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{        
            $this->set('vendedores', $res);
            $this->set('title', $this->pageTitle);
            
            $this->addTableClass();
        }
    }
    public function novo(){
        $vendedor = $this->request->getData('vendedor');
        $pessoa = $this->request->getData('pessoa');
        $end = $this->request->getData('end');

        if (!empty($vendedor) && !empty($pessoa)){

            $ckEmail = $this->checaEmail($vendedor['email']);
            if($ckEmail){
                $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!",false, true);
                $this->redireciona('vendedores/novo');
            }

            $ckUser = $this->checaUser($vendedor['usuario']);
            if($ckUser){
                $this->setError(0, "Já existe alguém cadastrado com esse nome de usuário!!",false, true);
                $this->redireciona('vendedores/novo');
            }

            $img = $this->upload($pessoa['foto'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));


            $arrayPessoa = array(
                'nome' => $pessoa['nome'],
                'sobrenome' => $pessoa['sobrenome'],
                'tipo' => 'F',
                'nivel' => 'VE',
                'ip_cadastro' => $this->userIP()
            );

            if (!isset($img['error'])) {
                $arrayPessoa['foto'] = $img;
            }

            $res = $this->connection->insert('pessoas', $arrayPessoa);
            $pessoa_id = $res->lastInsertId('pessoas');

            $arrayUser = array(
                'username' => $vendedor['usuario'],
                'senha' => md5($vendedor['senha']),
                'desconto_max' => $pessoa['desconto_max'],
                'acrecimo_max' => $pessoa['acrecimo_max'],
                'pessoa_id' => $pessoa_id,
                'acesso' => '2'
            );
            $res = $this->connection->insert('usuarios', $arrayUser);

            $arrayEmail = array(
                'email' => $vendedor['email'],
                'pessoa_id' => $pessoa_id,
                'ip_atualizado' => $this->userIP()
            );
            $this->connection->insert('emails', $arrayEmail);

            $tele = [null, null];
            if (!empty($vendedor['telefone'])){
                $tele = $this->configTel($vendedor['telefone']);
            }
            
            if ($tele[0] !== null) {
                $arrayTel = array(
                    'ddd' => $tele[0],
                    'numero' => $tele[1],
                    'pessoa_id' => $pessoa_id,
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('telefones', $arrayTel);
            }

            if (!empty($end['cidade']) && !empty($end['uf'])) {
                $arrayEnd = array(
                    'pessoa_id' => $pessoa_id,
                    'cep' => $end['cep'],
                    'logradouro' => $end['logradouro'],
                    'numero' => $end['numero'],
                    'complemento' => $end['complemento'],
                    'bairro' => $end['bairro'],
                    'cidade' => $end['cidade'],
                    'uf' => $end['uf'],
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('enderecos', $arrayEnd);
            }
            if ($this->retorno == 'json'){
                echo json_encode(array('vendedor_id' => $pessoa_id));
                exit;
            }
            else{
                $this->setMessage('success','Vendedor cadastrado com sucesso!',true);
                $this->redireciona('vendedores');
            }
        }

        $this->pageTitle = "Novo Vendedor";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "novo vendedor";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editar(){
        $vendedor_id = $this->request->getQuery('vid');

        if (!empty($vendedor_id)){
            $res = $this->connection->newQuery()
            ->select('pessoas.id,emails.email')
            ->from('pessoas')
            ->join(
                [
                    'table'=>'emails',
                    'type'=>'LEFT',
                    'conditions'=>'emails.pessoa_id = pessoas.id'
                ]
            )
            ->where('pessoas.id = '.$vendedor_id.' and nivel = "VE"')
            ->execute()
            ->fetchAll('assoc');

            if(count($res)>0){

                $vendedor = $this->request->getData('vendedor');
                $pessoa = $this->request->getData('pessoa');
                $endereco = $this->request->getData('end');

                if (!empty($vendedor) && !empty($pessoa)){
                    if($res[0]['email'] != $vendedor['email']){
                        $ckEmail = $this->checaEmail($vendedor['email']);
                        if($ckEmail){
                            $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!",false, true);
                            $this->redireciona('vendedores/editar?vid='.$vendedor_id);
                        }    
                    }
                    
                    $arrayPessoa = array(
                        'nome' => $pessoa['nome'],
                        'sobrenome' => $pessoa['sobrenome']
                    );

                    $isImg = !empty($pessoa['foto']);
                    if ($isImg) {
                        $isImg = !empty($pessoa['foto']['name']);
                        if (!$isImg) {
                            unset($pessoa['foto']);
                        }
                    }
                    $img_ant = null;

                    if ($isImg) {
                        $res = $this->connection->newQuery()
                            ->select('foto')
                            ->from('pessoas')
                            ->where('id = ' . $vendedor_id)
                            ->execute()
                            ->fetchAll('assoc');

                        $img_ant = $res[0]['foto'];

                        $img = $this->upload($pessoa['foto'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $img_ant);

                        if (!isset($img['error'])) {
                            $arrayPessoa['foto'] = $img;
                        }
                    }

                    $res = $this->connection->update('pessoas', $arrayPessoa, ['id'=>$vendedor_id]);
        
                    $arrayEmail = array(
                        'email' => $vendedor['email'],
                        'ip_atualizado' => $this->userIP()
                    );
                    $this->connection->update('emails', $arrayEmail, ['pessoa_id'=>$vendedor_id]);
        
                    $tele = [null, null];
                    if (!empty($vendedor['telefone'])){
                        $tele = $this->configTel($vendedor['telefone']);
                    }
                    
                    if ($tele[0] !== null) {
                        $arrayTel = array(
                            'ddd' => $tele[0],
                            'numero' => $tele[1],
                            'ip_atualizado' => $this->userIP()
                        );
                        $this->connection->update('telefones', $arrayTel, ['pessoa_id'=>$vendedor_id]);
                    }

                    if (!empty($endereco['cidade']) && !empty($endereco['uf'])) {
                        $arrayEnd = array(
                            'cep' => $endereco['cep'],
                            'logradouro' => $endereco['logradouro'],
                            'numero' => $endereco['numero'],
                            'complemento' => $endereco['complemento'],
                            'bairro' => $endereco['bairro'],
                            'cidade' => $endereco['cidade'],
                            'uf' => $endereco['uf'],
                            'ip_atualizado' => $this->userIP()
                        );

                        $resEnd = $this->connection->newQuery()
                        ->select('*')
                        ->from('enderecos')
                        ->where('pessoa_id = ' . $vendedor_id)
                        ->execute()
                        ->fetchAll('assoc');

                        if(count($resEnd)){
                            $this->connection->update('enderecos', $arrayEnd, ['pessoa_id' => $vendedor_id]);
                        }else{
                            $arrayEnd['pessoa_id'] = $vendedor_id;
                            $this->connection->insert('enderecos', $arrayEnd);
                        }
                        
                    }


                    $arrayUser = array(
                        'desconto_max' => $pessoa['desconto_max'],
                        'acrecimo_max' => $pessoa['acrecimo_max'],
                        'ip_atualizado' => $this->userIP()
                    );
                    if(!empty($vendedor['senha'])){
                        $arrayUser['senha'] = md5($vendedor['senha']);
                    }
                    $this->connection->update('usuarios', $arrayUser, ['pessoa_id' => $vendedor_id]);
                    
                    if ($this->retorno == 'json'){
                        echo json_encode(array('vendedor_id' => $vendedor_id));
                        exit;
                    }
                    else{
                        $this->setMessage('success','Vendedor editado com sucesso!',true);
                        $this->redireciona('vendedores');
                    }
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('usuarios.desconto_max, usuarios.acrecimo_max, usuarios.username as usuario, pessoas.ie, pessoas.cnpj, pessoas.foto,pessoas.nome, pessoas.sobrenome, emails.email, ddd, telefones.numero as tel_num, enderecos.cep, enderecos.logradouro, enderecos.numero, enderecos.complemento, enderecos.bairro, enderecos.cidade, enderecos.uf')
                    ->from('pessoas')
                    ->join(
                        [
                            'table' => 'emails',
                            'type' => 'LEFT',
                            'conditions' => 'emails.pessoa_id = pessoas.id'
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
                            'table' => 'usuarios',
                            'type' => 'LEFT',
                            'conditions' => 'usuarios.pessoa_id = pessoas.id'
                        ]
                    )
                    ->join(
                        [
                            'table' => 'enderecos',
                            'type' => 'LEFT',
                            'conditions' => 'enderecos.pessoa_id = pessoas.id'
                        ]
                    )
                    ->where('pessoas.id = '.$vendedor_id)
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('vendedor', $res[0]);
                }
                $this->pageTitle = "Editar Vendedor ".$vendedor_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "editar vendedor";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage('danger','Vendedor não encontrado!',true);
                $this->redireciona('vendedores');
            }
        }
        else{
            $this->redireciona('vendedores');
        }
    }
    public function deleta(){
        $vendedor_id = $this->request->getQuery('vid');

        $res = $this->connection->newQuery()
        ->select('id')
        ->from('pessoas')
        ->where('id = '.$vendedor_id.' and nivel = "VE"')
        ->execute()
        ->fetchAll();
        if(count($res)>0){
            $this->apagaOrcs("vendedor",$vendedor_id);
            $this->connection->delete('serralheiro_vendedores', array('vendedor_id'=>$vendedor_id));
            $this->connection->delete('pessoas', array('id'=>$vendedor_id));
            $this->connection->delete('emails', array('pessoa_id'=>$vendedor_id));
            $this->setMessage('success','Vendedor excluído!',true);
        }else{
            $this->setMessage('danger','Vendedor não encontrado!',true);
        }
        $this->redireciona('vendedores');
    }
}