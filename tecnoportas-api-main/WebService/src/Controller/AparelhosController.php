<?php
namespace App\Controller;

class AparelhosController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Aparelhos";
        $this->pagRef[0] = "aparelhos";
        $this->pagRef[1] = "lista de aparelhos";
        $this->set('thisUser', $this->user);
        $this->set('ref', $this->pagRef);
    }
    public function index(){
        $res = $this->connection->newQuery()
        ->select("usuarios.username, aparelhos.id as apId, aparelhos.usuario_id, aparelhos.modelo, aparelhos.uuid, aparelhos.plataforma, aparelhos.is_aprovado, pessoas.id, nome, sobrenome, email, ddd, telefones.numero, cidade, uf, usuarios.id as user_id, usuarios.acesso as acesso, usuarios.username")
        ->from('aparelhos')
        ->join(
            [
                'table' => 'usuarios',
                'type' => 'LEFT',
                'conditions' => 'usuarios.id = aparelhos.usuario_id'
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
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = pessoas.id'
            ]
        )
        
        ->execute()
        ->fetchAll("assoc");
      
        $this->set('aparelhos', $res);
        $this->set('title', $this->pageTitle);
        
        $this->addTableClass();
        
    }
    public function desativa(){
        $aparelho_id = $this->request->getQuery('aid');
        $res = $this->connection->update('aparelhos', ['is_aprovado' => '0'] , ['id' => $aparelho_id]);
        $this->setMessage('success','Aparelho desativado',true);
        $this->redireciona('aparelhos');
    }
    public function ativa(){
        $aparelho_id = $this->request->getQuery('aid');
        $res = $this->connection->update('aparelhos', ['is_aprovado' => '1'] , ['id' => $aparelho_id]);
        $this->setMessage('success','Aparelho ativado',true);
        $this->redireciona('aparelhos');
    }
    public function detalhes(){
        $serralheiro_id = $this->request->getQuery('sid');
            
        $res = $this->connection->newQuery()
        ->select('pessoas.id, pessoas.nome, pessoas.sobrenome, aparelhos.id as aparelho_id, pessoas.tipo, desconto_max, acrecimo_max, usuarios.id as us_id, username, email, ddd, telefones.numero as tel_num, cep, logradouro, enderecos.numero, complemento, cidade, uf, bairro, username, vendedor_id, contato.nome as ct_nome, contato.sobrenome as ct_snome')
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
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = pessoas.id'
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
                'table' => 'serralheiro_vendedores',
                'type' => 'LEFT',
                'conditions' => 'serralheiro_vendedores.serralheiro_id = pessoas.id'
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
        ->where('pessoas.id = '.$serralheiro_id)
        ->execute()
        ->fetchAll('assoc');

        if (!empty($res[0]['aparelho_id'])){
            $ap = $this->connection->newQuery()
            ->select('modelo, plataforma, uuid, versao, fabricante, is_virtual, serial')
            ->from('aparelhos')
            ->where('id = '.$res[0]['aparelho_id'])
            ->execute()
            ->fetchAll('assoc');
            
            $this->set('aparelho', $ap[0]);
        }

        $acs = $this->connection->newQuery()
        ->select('dt_acesso, ip_acesso')
        ->from('logins')
        ->where('usuario_id = '.$res[0]['us_id'])
        ->execute()
        ->fetchAll('assoc');

        $numOrcs = $this->connection->newQuery()
        ->select('count(serralheiro_id) as num')
        ->from('orcamento_pessoas')
        ->where('serralheiro_id = '.$serralheiro_id)
        ->execute()
        ->fetchAll('assoc');

        $ttlOrcs = $this->connection->newQuery()
        ->select('ROUND(SUM(valor_total), 2) as ttal')
        ->from('orcamentos')
        ->join(
            [
                'table'=>'orcamento_pessoas',
                'type'=>"LEFT",
                'conditions'=>'orcamento_id = orcamentos.id'
            ]
        )
        ->where('serralheiro_id = '.$serralheiro_id)
        ->where('valor_total IS NOT NULL')
        ->execute()
        ->fetchAll('assoc');

        $ulOrc = $this->connection->newQuery()
        ->select("dt_cadastro")
        ->from('orcamentos')
        ->join(
            [
                'table'=>'orcamento_pessoas',
                'type'=>"LEFT",
                'conditions'=>'orcamento_id = orcamentos.id'
            ]
        )
        ->where('serralheiro_id = '.$serralheiro_id)
        ->order('orcamentos.id desc')
        ->limit("1")
        ->execute()
        ->fetchAll('assoc');

        $cliCads = $this->connection->newQuery()
        ->select('count(serralheiro_id) as num')
        ->from('serralheiro_clientes')
        ->where('serralheiro_id = '.$serralheiro_id)
        ->execute()
        ->fetchAll('assoc');
        
        $this->pageTitle = "Detalhes do Revendedor ".$res[0]['id'];
        $this->set('serralheiro', $res[0]);
        $this->set('resumo', [
            'orcamentos'=>$numOrcs[0]['num'],
            'vl_orcamentos'=>$ttlOrcs[0]['ttal'],
            'u_orcamento'=>count($ulOrc) ? $ulOrc[0]['dt_cadastro'] : null,
            'clientes'=>$cliCads[0]['num'],
            'acessos'=>count($acs),
            'u_acesso'=>count($ulOrc) ? $acs[count($acs) - 1] : null
        ]);
        $this->set('acessos', $acs);
        $this->set('title', $this->pageTitle);
        
        $this->addTableClass();
    }
}