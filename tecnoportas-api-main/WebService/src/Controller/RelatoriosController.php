<?php
namespace App\Controller;

class RelatoriosController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }
        $this->pageTitle = "Relatorios";
        
        $this->pagRef[0] = "relatorios";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }

    public function index(){

        $resC = $this->connection->newQuery()
        ->select('nome, sobrenome, id')
        ->from('pessoas')
        ->where('pessoas.nivel = "CF"')
        ->order('nome')
        ->execute()
        ->fetchAll('assoc');
        $this->set('clientes', $resC);

        $resR = $this->connection->newQuery()
        ->select("id, nome, sobrenome")
        ->from('pessoas')
        ->where('pessoas.nivel = "SE"')
        ->execute()
        ->fetchAll("assoc");
        $this->set('revendedores', $resR);

        $resV = $this->connection->newQuery()
        ->select('nome, sobrenome, id')
        ->from('pessoas')
        ->where('pessoas.nivel = "VE"')
        ->order('nome')
        ->execute()
        ->fetchAll('assoc');
        $this->set('vendedores', $resV);

        //Numero de orçamentos
        $dtAtual = $this->request->getData('de');
        $dt = $this->request->getData('para');
        $serralheiro_id = $this->request->getData('sid');
        $vendedor_id = $this->request->getData('vid');
        $cliente_id = $this->request->getData('cid');
        $estado = $this->request->getData('est');
        $cidade = $this->request->getData('cidade');
        if(!empty($dtAtual)){
            $dtAtual = strtotime($dtAtual);
            $dtAtual = date('Y-m-d',$dtAtual);
            if(empty($dt)){
                $dt = date("Y-m-01", strtotime("+1 month", strtotime($dtAtual)));
            }else{
            $dt = strtotime($dt);
            $dt = date('Y-m-d',$dt);
            }
        }else{
            $dtAtual = date("Y-m-01");
            $dt = date("Y-m-01", strtotime("+1 month", strtotime($dtAtual)));
        }

        $res = $this->connection->newQuery()
        ->select('orcamentos.id, enderecos.uf, enderecos.cidade')
        ->from('orcamentos')
        ->join(
            [
                'table' => 'orcamento_pessoas',
                'type' => 'LEFT',
                'conditions' => 'orcamentos.id = orcamento_pessoas.orcamento_id'
            ]
        )
        ->join(
            [
                'table' => 'serralheiro_vendedores',
                'type' => 'LEFT',
                'conditions' => 'orcamento_pessoas.serralheiro_id = serralheiro_vendedores.serralheiro_id'
            ]
        )
        ->join(
            [
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = serralheiro_vendedores.serralheiro_id'
            ]
        );
        if(!empty($serralheiro_id)){
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and orcamento_pessoas.serralheiro_id = '.$serralheiro_id);
        }elseif(!empty($vendedor_id)){
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and serralheiro_vendedores.vendedor_id = '.$vendedor_id);
        }elseif(!empty($cliente_id)){
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and orcamento_pessoas.cliente_id = '.$cliente_id);
        }else{
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'"');
        }
        if(!empty($estado)){
            $res = $res->where(' uf = "'.$estado.'"');
        }  
        if(!empty($cidade)){
            $res = $res->where(' cidade = "'.$cidade.'"');
        }
        $res = $res->execute()
        ->fetchAll('assoc');
        $nOrcs = count($res);

        $this->set('orcMes', $nOrcs);

        //Média do valor dos orçamentos
        
        $res = $this->connection->newQuery()
        ->select('ROUND( AVG(valor_total),2 ) as "Media"')
        ->from('orcamentos')
        ->join(
            [
                'table' => 'orcamento_pessoas',
                'type' => 'LEFT',
                'conditions' => 'orcamentos.id = orcamento_pessoas.orcamento_id'
            ]
        )
        ->join(
            [
                'table' => 'serralheiro_vendedores',
                'type' => 'LEFT',
                'conditions' => 'orcamento_pessoas.serralheiro_id = serralheiro_vendedores.serralheiro_id'
            ]
        )
        ->join(
            [
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = serralheiro_vendedores.serralheiro_id'
            ]
        );
        if(!empty($serralheiro_id)){
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and orcamento_pessoas.serralheiro_id = '.$serralheiro_id);
        }elseif(!empty($vendedor_id)){
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and serralheiro_vendedores.vendedor_id = '.$vendedor_id);
        }elseif(!empty($cliente_id)){
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and orcamento_pessoas.cliente_id = '.$cliente_id);
        }else{
            $res = $res->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'"');
        }       
        if(!empty($estado)){
            $res = $res->where(' uf = "'.$estado.'"');
        }  
        if(!empty($cidade)){
            $res = $res->where(' cidade = "'.$cidade.'"');
        }
        $res = $res->execute()
        ->fetch();
        $this->set('media', $res);
        
        //Ultimos 5 Meses
        $res2 = $this->connection->newQuery()
        ->select('MONTH(dt_cadastro) AS "Mes", YEAR(dt_cadastro) AS "Ano", count(id) AS "Qtd"')
        ->from('orcamentos')
        ->group('Mes')
        ->order('Mes,Ano Desc')
        ->limit(5)
        ->execute()
        ->fetchAll('assoc');
        $this->set('orcData5', $res2);
        $this->set('title', $this->pageTitle);

        //periodo
        $res3 = $this->connection->newQuery()
        ->select('MONTH(dt_cadastro) AS "Mes", YEAR(dt_cadastro) AS "Ano", count(orcamentos.id) AS "Qtd", enderecos.uf, enderecos.cidade')
        ->from('orcamentos')
        ->join(
            [
                'table' => 'orcamento_pessoas',
                'type' => 'LEFT',
                'conditions' => 'orcamentos.id = orcamento_pessoas.orcamento_id'
            ]
        )
        ->join(
            [
                'table' => 'serralheiro_vendedores',
                'type' => 'LEFT',
                'conditions' => 'orcamento_pessoas.serralheiro_id = serralheiro_vendedores.serralheiro_id'
            ]
        )
        ->join(
            [
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = serralheiro_vendedores.serralheiro_id'
            ]
        );
        if(!empty($serralheiro_id)){
            $res3 = $res3->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and orcamento_pessoas.serralheiro_id = '.$serralheiro_id);
        }elseif(!empty($vendedor_id)){
            $res3 = $res3->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and serralheiro_vendedores.vendedor_id = '.$vendedor_id);
        }elseif(!empty($cliente_id)){
            $res3 = $res3->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'" and orcamento_pessoas.cliente_id = '.$cliente_id);
        }else{
            $res3 = $res3->where('dt_cadastro >= "'.$dtAtual.'" and dt_cadastro <= "'.$dt.'"');
        }    
        if(!empty($estado)){
            $res3 = $res3->where(' uf = "'.$estado.'"');
        }  
        if(!empty($cidade)){
            $res3 = $res3->where(' cidade = "'.$cidade.'"');
        }   
        $res3 = $res3->group('Mes')
        ->order('Mes,Ano Desc')
        ->execute()
        ->fetchAll('assoc');
        $this->set('orcData', $res3);
        $this->set('title', $this->pageTitle);

        if ($this->retorno == 'json'){
            echo json_encode(array('orcMes'=>$nOrcs, 'media' => $res, 'orcData5'=>$res2, 'orcData'=>$res3));
            exit;
        }

    }
}
