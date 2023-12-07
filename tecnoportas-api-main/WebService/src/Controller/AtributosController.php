<?php
namespace App\Controller;

class AtributosController extends AppController
{
    public $arrayTipos = array(
        'chp'=>'Modelo', 
        'prf'=>'Perfil', 
        'mat'=>'Material', 
        'esp'=>'Chapa',
        'ent'=>'Entrada',
        'pos'=>'Posição da Entrada',
        'cor'=>'Cor',
        'tpi'=>'Tipo de Instalação'
    );

    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Atributos";
        $this->pagRef[0] = "atributos";
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $tipo = $this->request->getData('tipo');
        
        if (empty($tipo)) {
            $tipo = $this->request->getQuery('tipo');
        }
        $atrId = $this->request->getData('atributo_id');
        if (empty($atrId)) {
            $atrId = $this->request->getQuery('aid');
        }

        if (empty($atrId)){
            $res = $this->connection->newQuery()
            ->select('id, tipo, nome, imagem')
            ->from('atributos')
            ->where('active = 1');
            if (!empty($tipo)){
                $res = $res->andWhere("tipo = '".$tipo."'");
            }
            $res = $res->execute()
            ->fetchAll('assoc');
        }
        else{
            $arrayWhere = array(
                'atributo_id' => $atrId,
                'active' => 1,
            );
            if (!empty($tipo)){
                $arrayWhere['tipo'] = $tipo;
            }
            
            $res = $this->connection->newQuery()
            ->select("id, tipo, nome, imagem")
            ->from("atributos_ligacao")
            ->join(
                [
                    'table' => 'atributos',
                    'type' => 'LEFT',
                    'conditions' => 'atributos.id = ligacao_id'
                ]
            )
            ->where($arrayWhere)
            ->execute()
            ->fetchAll('assoc');
        }

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->set('atributos', $res);
            $this->set('arrayTipos', $this->arrayTipos);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "lista de atributos";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function novo(){
        $atributo = $this->request->getData('atributo');
        $ligacoes = $this->request->getData('ligacoes');
        if (empty($ligacoes)) { $ligacoes = array(); }
        
        if (!empty($atributo)){
            $img = $this->upload($atributo['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));
            if (isset($img['error'])){
                $img = null;
            }

            $arrayAtr = array(
                "tipo" => $atributo['tipo'],
                'nome' => $atributo['nome'],
                'active' => 1,
                'imagem' => $img,
                'ip_atualizado' => $this->userIP()
            );
            
            $res = $this->connection->insert('atributos', $arrayAtr);
            $atributo_id = $res->lastInsertId('atributos');

            for ($i = 0; $i < count($ligacoes); $i++){
                $this->connection->insert('atributos_ligacao', array('atributo_id'=>$atributo_id, 'ligacao_id'=>$ligacoes[$i]));
            }
            
            if ($this->retorno == 'json'){
                echo json_encode(array('atributo_id' => $atributo_id));
                exit;
            }
            else{
                $this->setMessage('success','Atributo adicionado com sucesso!',true);
                $this->redireciona('atributos');
            }
        }
        else{
            $prf = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where('tipo = "prf"')
            ->execute()
            ->fetchAll('assoc');

            $mat = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where('tipo = "mat"')
            ->execute()
            ->fetchAll('assoc');
            
            $esp = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where('tipo = "esp"')
            ->execute()
            ->fetchAll('assoc');
            
            $pos = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where('tipo = "pos"')
            ->execute()
            ->fetchAll('assoc');
            
            $this->set('prf', $prf);
            $this->set('mat', $mat);
            $this->set('esp', $esp);
            $this->set('pos', $pos);
            $this->set('arrayTipos', $this->arrayTipos);
        }
        $this->pageTitle = "Novo atributo";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "novo atributo";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editar(){
        $atributo_id = $this->request->getQuery('aid');

        if (!empty($atributo_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('atributos')
            ->where('active = 1')
            ->andWhere('id = '.$atributo_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                $atributo = $this->request->getData('atributo');
                $ligacoes = $this->request->getData('ligacoes');
                if (empty($ligacoes)) { $ligacoes = array(); }
                
                $res = $this->connection->newQuery()
                ->select('id, tipo, nome, imagem')
                ->from('atributos')
                ->where('id = '. $atributo_id)
                ->execute()
                ->fetchAll('assoc');
                
                $ligs_id = $this->connection->newQuery()
                ->select('ligacao_id')
                ->from('atributos_ligacao')
                ->where('atributo_id = '.$atributo_id)
                ->execute()
                ->fetchAll('assoc');

                $arrayLigs = array();

                foreach($ligs_id as $l_id){
                    $arrayLigs[] = $l_id['ligacao_id'];
                }
                
                if (!empty($atributo)){
                    $isImg = !empty($atributo['imagem']);
                    $img = null;
                    if ($isImg){
                        $img_ant = $res[0]['imagem'];
                        
                        $img = $this->upload($atributo['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $img_ant);
                        if (isset($img['error'])){
                            $img = null;
                        }
                    }
                    $arrayAtr = array(
                        "tipo" => $atributo['tipo'],
                        'nome' => $atributo['nome'],
                        'ip_atualizado' => $this->userIP(),
                        'dt_atualizado' => $this->getCurrentTimeStamp()
                    );
                    if ($img != null){
                        $arrayAtr['imagem'] = $img;
                    }
                    $this->connection->update('atributos', $arrayAtr, array('id'=>$atributo_id));

                    foreach ($ligs_id as $l_id){
                        if (in_array($l_id['ligacao_id'], $ligacoes)){
                            unset($ligacoes[array_search($l_id['ligacao_id'], $ligacoes)]);
                        }
                        else{
                            $this->connection->delete('atributos_ligacao', array('atributo_id'=>$atributo_id, 'ligacao_id'=>$l_id['ligacao_id']));
                        }
                    }
                    if (count($ligacoes)){
                        foreach ($ligacoes as $key => $valor){
                            $this->connection->insert('atributos_ligacao', array('atributo_id'=>$atributo_id, 'ligacao_id'=>$valor));
                        }
                    }
                    if ($this->retorno == 'json'){
                        echo json_encode(array('atributo_id' => $atributo_id));
                        exit;
                    }
                    else{
                        $this->setMessage('success','Atributo editado com sucesso!',true);
                        $this->redireciona('atributos');
                    }

                }
                else{
                    $prf = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where('tipo = "prf"')
                    ->execute()
                    ->fetchAll('assoc');
        
                    $mat = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where('tipo = "mat"')
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $esp = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where('tipo = "esp"')
                    ->execute()
                    ->fetchAll('assoc');
                
                    $pos = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where('tipo = "pos"')
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $this->set('prf', $prf);
                    $this->set('mat', $mat);
                    $this->set('esp', $esp);
                    $this->set('pos', $pos);
                    $this->set('atributo', $res[0]);
                    $this->set('ligacoes', $arrayLigs);
                    $this->set('arrayTipos', $this->arrayTipos);
                }
                $this->pageTitle = "Editar atributo ".$atributo_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "atributos";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage('danger','Atributo não encontrado',true);
                $this->redireciona('atributos');
            }
            
        }
        else{
            $this->redireciona('atributos');
        }
    }
    public function excluir(){
        $atributo_id = $this->request->getQuery('aid');

        $res = $this->connection->newQuery()
        ->select('imagem')
        ->from('atributos')
        ->where('id = '. $atributo_id)
        ->execute()
        ->fetchAll('assoc');

        if(count($res)>0){
            $arrayAtr = array(
                "active" => 0,
                'ip_atualizado' => $this->userIP(),
                'dt_atualizado' => $this->getCurrentTimeStamp()
            );
            $this->connection->update('atributos', $arrayAtr, array('id'=>$atributo_id));
            $this->setMessage('success','Atributo excluído com sucesso!',true);
            $this->redireciona('atributos');
        }else{
            $this->setMessage('danger','Atributo não encontrado!',true);
            $this->redireciona('atributos');
        }
        
    }
}