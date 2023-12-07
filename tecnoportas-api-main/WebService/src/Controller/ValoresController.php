<?php
namespace App\Controller;

class ValoresController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Valores";
        $this->pagRef[0] = "produtos";
        $this->pagRef[1] = "valores";
        $this->set('thisUser', $this->user);
        $this->set('ref', $this->pagRef);
        $this->set('title', 'Valores');
    }

    //aut
    // ptr
    // opc
    // mto
    // ent
    // prf
    // tst
    //$res = $this->connection->newQuery()
    // ->select('foto')
    // ->from('pessoas')
    // ->where('id = ' . $serralheiro_id)
    // ->execute()
    // ->fetchAll('assoc');
    //$this->connection->update('emails', $arrayEmail, ['pessoa_id' => $serralheiro_id]);

    public function index(){
        $dados = $this->request->getData('dadosUpdate');
        if($dados){
            $valUnit = [];
            $produtosIds = $dados['valor'];
            $tipo = $dados['tipo'];
            $porcentagem = $dados['prct'];

            foreach ($produtosIds as $produtoId => $value) {
                $res = $this->connection->newQuery()
                ->select('valor_unitario')
                ->from('produtos')
                ->where('id = ' . $value)
                ->execute()
                ->fetch('assoc');

                $valorAtualizado = $res['valor_unitario'];
                if($tipo == 'a'){
                    $valorAtualizado = $valorAtualizado + ($valorAtualizado * ($porcentagem / 100));
                }else{
                    $valorAtualizado = $valorAtualizado - ($valorAtualizado * ($porcentagem / 100));
                }

                $valorAtualizado = number_format($valorAtualizado, 2);

                 array_push($valUnit, $valorAtualizado);

                 $arrayProduto = array(
                     'valor_unitario' => $valorAtualizado
                 );

                $this->connection->update('produtos', $arrayProduto, ['id' => $value]);
            }

            echo json_encode($valUnit);
            exit;
        }



        $cat = $this->request->getQuery("cat");
       $condicao = "tipo = '$cat'";
       
       $res = $this->connection->newQuery()
       ->select('*')
       ->from('produtos');

       if($cat){
        $res = $res->where($condicao);
       }

       $res = $res->order('produtos.nome')
       ->execute()
       ->fetchAll('assoc');

       if ($this->retorno == 'json'){
           echo json_encode($res);
           exit;
       }
       else{
           $this->set('produtos', $res);           
           $this->addTableClass();
       }

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
}