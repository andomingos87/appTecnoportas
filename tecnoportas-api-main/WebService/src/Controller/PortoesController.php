<?php
namespace App\Controller;

class PortoesController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Produtos";
        $this->pagRef[0] = "produtos";
        $this->set('thisUser', $this->user);
    }
    public function entradas(){
        $chapa_id = $this->request->getData('chapa_id');
        $perfil_id = $this->request->getData('perfil_id');
        $material_id = $this->request->getData('material_id');
        $ent_id = $this->request->getData('ent_id');
        $pos_id = $this->request->getData('pos_id');

        $res = $this->connection->newQuery()
        ->select('entradas.id, produto_id, produtos.codigo, produtos.nome, produtos.tipo, descricao, imagem, unidades_medida.nome as medida, unidades_medida.nome as unMedida, valor_unitario')
        ->from('entradas')
        ->join(
            [
                'table' => 'produtos',
                'type' => 'LEFT',
                'conditions' => 'produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]
        );
        if (!empty($ent_id) && !empty($chapa_id) && !empty($perfil_id) && !empty($material_id)){
            $arrayAtts = array(
                'ent_id'=>$ent_id,
                'chapa_id'=>$chapa_id,
                'perfil_id'=>$perfil_id,
                'material_id'=>$material_id
            );
            if (!empty($pos_id)){
                $arrayAtts["pos_id"] = $pos_id;
            }            
            $res = $res->where($arrayAtts);
        }
        $res = $res->where("produtos.deletado = 0")
        ->order('produtos.nome')
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Entradas";
            $this->set('entradas', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "entradas";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addEntrada(){
        $configs = $this->getConfiguracoes();
        $entrada = $this->request->getData('entrada');
        $chp = $this->request->getData('chp');
        $prf = $this->request->getData('prf');
        $mat = $this->request->getData('mat');
        $ent = $this->request->getData('ent');
        $pos = $this->request->getData('pos');

        if (!empty($entrada) && !empty($chp) && !empty($prf) && !empty($mat) && !empty($ent)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$entrada['codigo'],
                'imagem'=>$entrada['imagem'],
                'tipo'=>'ent',
                'nome'=>$entrada['nome'],
                'descricao'=>$entrada['descricao'],
                'is_padrao'=>'0',
                'unidade_medida_id'=>$configs['pd_entrada_med'],
                'valor_unitario'=>$entrada['valor_unitario']
            ));
            if ($produto_id){
                $arrayEntrada = array(
                    'produto_id'=>$produto_id,
                    'ent_id'=>$ent,
                    'pos_id'=>$pos,
                    'chapa_id'=>$chp,
                    'perfil_id'=>$prf,
                    'material_id'=>$mat
                );

                $res = $this->connection->insert('entradas', $arrayEntrada);
                $entrada_id = $res->lastInsertId('entradas');

                if ($this->retorno == 'json'){
                    echo json_encode(array('entrada_id' => $entrada_id));
                    exit;
                }
                else{
                    $this->setMessage("success", "Entrada adicionada com sucesso!", true);
                    $this->redireciona('portoes/entradas');
                }
            }
            else{
                $this->setError(0, "Erro ao adicionar a Entrada!");
            }
        }
        else{
            $chp = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "chp"')
            ->execute()
            ->fetchAll('assoc');

            $prf = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "prf"')
            ->execute()
            ->fetchAll('assoc');

            $mat = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "mat"')
            ->execute()
            ->fetchAll('assoc');
            
            $ent = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "ent"')
            ->execute()
            ->fetchAll('assoc');
            
            $pos = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "pos"')
            ->execute()
            ->fetchAll('assoc');

            $this->set('chp', $chp);
            $this->set('prf', $prf);
            $this->set('mat', $mat);
            $this->set('ent', $ent);
            $this->set('pos', $pos);
        }
        $this->pageTitle = "Nova Entrada";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "entradas";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editEntrada(){
        $entrada_id = $this->request->getQuery('eid');

        if (!empty($entrada_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('entradas')
            ->where('id = '.$entrada_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                $entrada = $this->request->getData('entrada');
                $chp = $this->request->getData('chp');
                $prf = $this->request->getData('prf');
                $mat = $this->request->getData('mat');
                $ent = $this->request->getData('ent');
                $pos = $this->request->getData('pos');

                if (!empty($entrada) && !empty($chp) && !empty($prf) && !empty($mat) && !empty($ent)){
                    $res = $this->editProduto(array(
                        'codigo'=>$entrada['codigo'],
                        'imagem'=>$entrada['imagem'],
                        'tipo'=>'ent',
                        'nome'=>$entrada['nome'],
                        'descricao'=>$entrada['descricao'],
                        'valor_unitario'=>$entrada['valor_unitario']
                    ), $entrada_id);
                    if ($res){
                        $arrayEntrada = array(
                            'ent_id'=>$ent,
                            'pos_id'=>$pos,
                            'chapa_id'=>$chp,
                            'perfil_id'=>$prf,
                            'material_id'=>$mat
                        );
                        $this->connection->update("entradas", $arrayEntrada, array("id" => $entrada_id));

                        if ($this->retorno == 'json'){
                            echo json_encode(array('entrada_id' => $entrada_id));
                            exit;
                        }
                        else{
                            $this->setMessage("success", "Entrada editada!", true);
                            $this->redireciona('portoes/entradas');
                        }
                    }
                    else{
                        $this->setError(0, "Erro ao editar a Entrada!");                  
                    }
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('nome, codigo, descricao, imagem, valor_unitario, ent_id, pos_id, chapa_id, perfil_id, material_id')
                    ->from('entradas')
                    ->join(
                        [
                            'table'=>'produtos',
                            'type'=>'LEFT',
                            'conditions'=>'produtos.id = produto_id'
                        ]
                    )
                    ->where('entradas.id = '.$entrada_id)
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $chp = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "chp"')
                    ->execute()
                    ->fetchAll('assoc');

                    $prf = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "prf"')
                    ->execute()
                    ->fetchAll('assoc');

                    $mat = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "mat"')
                    ->execute()
                    ->fetchAll('assoc');
                
                    $ent = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "ent"')
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $pos = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "pos"')
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('chp', $chp);
                    $this->set('prf', $prf);
                    $this->set('mat', $mat);
                    $this->set('ent', $ent);
                    $this->set('pos', $pos);

                    $this->set('entrada', $res[0]);
                }
                $this->pageTitle = "Editar Entrada ".$entrada_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "entradas";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage("danger", "Entrada não encontrada!", true);
                $this->redireciona('portoes/entradas');
            }
        }
        else{
            $this->redireciona('portoes/entradas');
        }
    }
    public function deletaEntrada($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('entradas')
        ->join(
            [
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produtos.id = produto_id'
            ]
        )
        ->where('entradas.id = '.$id)
        ->execute()
        ->fetchAll('assoc');
        
        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage("danger", "Entrada não encontrada!", true);
            $this->redireciona('portoes/entradas');
            }
    }
    public function delEntrada(){        
        $entrada_id = $this->request->getQuery('eid');
        $this->deletaEntrada($entrada_id);
        $this->setMessage("success", "Entrada excluída!", true);
        $this->redireciona('portoes/entradas');
    }
    public function perfis(){
        $chapa_id = $this->request->getData('chapa_id');
        $perfil_id = $this->request->getData('perfil_id');
        $espessura_id = $this->request->getData('espessura_id');
        $material_id = $this->request->getData('material_id');

        $res = $this->connection->newQuery()
        ->select('perfis.id, produto_id, produtos.nome, produtos.codigo, unidades_medida.nome as medida, descricao, imagem, peso_m2, valor_unitario')
        ->from('perfis')
        ->join(
            [
                'table' => 'produtos',
                'type' => 'LEFT',
                'conditions' => 'produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]
        );
        if (!empty($chapa_id) && !empty($perfil_id) && !empty($espessura_id) && !empty($material_id)){
            $res = $res->where(array(
                'chapa_id'=>$chapa_id,
                'perfil_id'=>$perfil_id,
                'espessura_id'=>$espessura_id,
                'material_id'=>$material_id
            ));
        }
        $res = $res->where("produtos.deletado = 0")
        ->order('produtos.nome')
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Perfis";
            $this->set('perfis', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "perfis";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addPerfil(){
        $configs = $this->getConfiguracoes();
        $perfil = $this->request->getData('perfil');
        $chp = $this->request->getData('chp');
        $prf = $this->request->getData('prf');
        $esp = $this->request->getData('esp');
        $mat = $this->request->getData('mat');

        if (!empty($perfil) && !empty($chp) && !empty($prf) && !empty($esp) && !empty($mat)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$perfil['codigo'],
                'imagem'=>$perfil['imagem'],
                'tipo'=>'prf',
                'nome'=>$perfil['nome'],
                'descricao'=>$perfil['descricao'],
                'is_padrao'=>'1',
                'peso_m2'=>$perfil['peso_m2'],
                'unidade_medida_id'=>$configs['pd_perfil_med'],
                'valor_unitario'=>$perfil['valor_unitario']
            ));
            if ($produto_id){
                $arrayPerfil = array(
                    'produto_id'=>$produto_id,
                    'chapa_id'=>$chp,
                    'perfil_id'=>$prf,
                    'espessura_id'=>$esp,
                    'material_id'=>$mat
                );
                $res = $this->connection->insert('perfis', $arrayPerfil);
                $perfil_id = $res->lastInsertId('perfis');

                if ($this->retorno == 'json'){
                    echo json_encode(array('perfil_id' => $perfil_id));
                    exit;
                }
                else{
                    $this->setMessage('success','Perfil adicionado com sucesso!',true);
                    $this->redireciona('portoes/perfis');
                }
            }
            else{
                $this->setError(0, "Erro ao adicionar o Perfil!");
            }
        }
        else{
            $chp = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "chp"')
            ->execute()
            ->fetchAll('assoc');

            $prf = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "prf"')
            ->execute()
            ->fetchAll('assoc');

            $mat = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "mat"')
            ->execute()
            ->fetchAll('assoc');
            
            $esp = $this->connection->newQuery()
            ->select('id, nome, imagem')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "esp"')
            ->execute()
            ->fetchAll('assoc');

            $this->set('chp', $chp);
            $this->set('prf', $prf);
            $this->set('mat', $mat);
            $this->set('esp', $esp);
        }
        $this->pageTitle = "Novo Perfil";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "perfis";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editPerfil(){
        $perfil_id = $this->request->getQuery('pid');

        if (!empty($perfil_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('perfis')
            ->where('id = '.$perfil_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){

                $perfil = $this->request->getData('perfil');
                $chp = $this->request->getData('chp');
                $prf = $this->request->getData('prf');
                $esp = $this->request->getData('esp');
                $mat = $this->request->getData('mat');
                
                if (!empty($perfil) && !empty($chp) && !empty($prf) && !empty($esp) && !empty($mat)){
                    $res = $this->editProduto(array(
                        'codigo'=>$perfil['codigo'],
                        'imagem'=>$perfil['imagem'],
                        'tipo'=>'prf',
                        'nome'=>$perfil['nome'],
                        'descricao'=>$perfil['descricao'],
                        'peso_m2'=>$perfil['peso_m2'],
                        'valor_unitario'=>$perfil['valor_unitario']
                    ), $perfil_id);
                    
                    $arrayPerfil = array(
                        'chapa_id'=>$chp,
                        'perfil_id'=>$prf,
                        'espessura_id'=>$esp,
                        'material_id'=>$mat
                    );
                    $res = $this->connection->update('perfis', $arrayPerfil, array("id"=>$perfil_id));
                    
                    if ($res){
                        if ($this->retorno == 'json'){
                            echo json_encode(array('perfil_id' => $perfil_id));
                            exit;
                        }
                        else{
                            $this->setMessage('success','Perfil editado',true);
                            $this->redireciona('portoes/perfis');
                        }
                    }
                    else{
                        $this->setError(0, "Erro ao editar o Perfil!");
                    }
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('nome, codigo, descricao, imagem, peso_m2, valor_unitario, chapa_id, perfil_id, espessura_id, material_id')
                    ->from('perfis')
                    ->join(
                        [
                            'table'=>'produtos',
                            'type'=>'LEFT',
                            'conditions'=>'produtos.id = produto_id'
                        ]
                    )
                    ->where('perfis.id = '.$perfil_id)
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $chp = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "chp"')
                    ->execute()
                    ->fetchAll('assoc');

                    $prf = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "prf"')
                    ->execute()
                    ->fetchAll('assoc');

                    $mat = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "mat"')
                    ->execute()
                    ->fetchAll('assoc');
                    
                    $esp = $this->connection->newQuery()
                    ->select('id, nome, imagem')
                    ->from('atributos')
                    ->where("active = 1")
                    ->andWhere('tipo = "esp"')
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('chp', $chp);
                    $this->set('prf', $prf);
                    $this->set('mat', $mat);
                    $this->set('esp', $esp);
                    $this->set('perfil', $res[0]);
                }
                $this->pageTitle = "Editar Perfil ".$perfil_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "perfis";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage("danger", "Perfil não encontrado!", true);
                $this->redireciona('portoes/perfis');
            }
        }
        else{
            $this->redireciona('portoes/perfis');
        }
    }
    public function deletaPerfil($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('perfis')
        ->join(
            [
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produtos.id = produto_id'
            ]
        )
        ->where('perfis.id = '.$id)
        ->execute()
        ->fetchAll('assoc');

        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage('danger','Perfil não encontrado!',true);
            $this->redireciona('portoes/perfis');
        }
        
    }
    public function delPerfil(){
        $perfil_id = $this->request->getQuery('pid');

        $this->deletaPerfil($perfil_id);
        $this->setMessage('success','Perfil excluído com sucesso',true);
        $this->redireciona('portoes/perfis');
        
    }
    public function pinturas(){
        $order = "agrupamento";
        $res = $this->connection->newQuery()
        ->select('pinturas.grupo_id as agrupamento, pinturas.id, produto_id, produtos.tipo, produtos.nome, produtos.codigo, unidades_medida.nome as medida, unidades_medida.nome as unNome, descricao, imagem, valor_unitario')
        ->from('pinturas')
        ->join(
            [
                'table' => 'produtos',
                'type' => 'LEFT',
                'conditions' => 'produto_id = produtos.id'
            ]
        )
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]
        )
        ->where("produtos.deletado = 0")
        ->order($order)
        ->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Pinturas";
            $this->set('pinturas', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "pinturas";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addPintura(){
        $configs = $this->getConfiguracoes();
        $pintura = $this->request->getData('pintura');
        $fita_cor = $this->request->getData('fitas');
        $grupo_cor = $this->request->getData('grupo');
        if (!empty($pintura)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$pintura['codigo'],
                'imagem'=>$pintura['imagem'],
                'tipo'=>'ptr',
                'nome'=>$pintura['nome'],
                'descricao'=>$pintura['descricao'],
                'is_padrao'=>'0',
                'unidade_medida_id'=>$configs['pd_pintura_med'],
                'valor_unitario'=>$pintura['valor_unitario']
            ));
            if ($produto_id){

                $res = $this->connection->insert('pinturas', array('produto_id'=>$produto_id,'cor_id'=>$fita_cor, 'grupo_id'=>$grupo_cor));
                $pintura_id = $res->lastInsertId('pinturas');

                if ($this->retorno == 'json'){
                    echo json_encode(array('pintura_id' => $pintura_id));
                    exit;
                }
                else{
                    $this->setMessage('success','Pintura adicionada com sucesso',true);
                    $this->redireciona('portoes/pinturas');
                }
            }
        }else{
            $res = $this->connection->newQuery()
            ->select("fitaPVC.id, produto_id, atributos.nome as cor_nome, atributos.id as cor_id, produtos.nome, produtos.codigo, produtos.valor_unitario")
            ->from("fitaPVC")
            ->join([
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produto_id = produtos.id'
            ])
            ->join([
                'table'=>'atributos',
                'type'=>'LEFT',
                'conditions'=>'atributos.id = cor_id'
            ])
            ->where("produtos.deletado = 0 AND atributos.tipo = 'cor' AND atributos.active = 1")
            ->group("cor_id")
            ->execute()
            ->fetchAll("assoc");
            
           
            $this->set('fitas',$res);

        }
        $this->pageTitle = "Nova Pintura";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "pinturas";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editPintura(){
        $pintura_id = $this->request->getQuery('pid');

        if (!empty($pintura_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('pinturas')
            ->where('id = '.$pintura_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                $pintura = $this->request->getData('pintura');
                $fita_cor = $this->request->getData('fitas');
                $grupo_cor = $this->request->getData('grupo');

                if (!empty($pintura)){
                    $res = $this->editProduto(array(
                        'codigo'=>$pintura['codigo'],
                        'imagem'=>$pintura['imagem'],
                        'tipo'=>'ptr',
                        'nome'=>$pintura['nome'],
                        'descricao'=>$pintura['descricao'],
                        'valor_unitario'=>$pintura['valor_unitario']
                    ), $pintura_id);
                    if ($res){
                        $this->connection->update('pinturas',array("cor_id" => $fita_cor, "grupo_id" => $grupo_cor), array('id'=>$pintura_id));

                        if ($this->retorno == 'json'){
                            echo json_encode(array('pintura_id' => $pintura_id));
                            exit;
                        }
                        else{
                            $this->redireciona('portoes/pinturas');
                        }
                    }
                    else{
                        $this->setError(0, "Erro ao editar a Pintura!");
                    }
                }
                else{
                    $res = $this->connection->newQuery()
                    ->select('grupo_id, nome, codigo, descricao, cor_id, imagem, valor_unitario')
                    ->from('pinturas')
                    ->join(
                        [
                            'table'=>'produtos',
                            'type'=>'LEFT',
                            'conditions'=>'produtos.id = produto_id'
                        ]
                    )
                    ->where('pinturas.id = '.$pintura_id)
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('pintura', $res[0]);

                    $res2 = $this->connection->newQuery()
                    ->select("fitaPVC.id, produto_id, atributos.nome as cor_nome, atributos.id as cor_id, produtos.nome, produtos.codigo")
                    ->from("fitaPVC")
                    ->join([
                        'table'=>'produtos',
                        'type'=>'LEFT',
                        'conditions'=>'produto_id = produtos.id'
                    ])
                    ->join([
                        'table'=>'atributos',
                        'type'=>'LEFT',
                        'conditions'=>'atributos.id = cor_id'
                    ])
                    ->where("produtos.deletado = 0 AND atributos.tipo = 'cor' AND atributos.active = 1")
                    ->group("atributos.id")
                    ->execute()
                    ->fetchAll("assoc");
                    
                
                    $this->set('fitas',$res2);
                }
                $this->pageTitle = "Editar Pintura ".$pintura_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "pinturas";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage('danger','Pintura não encontrada',true);
                $this->redireciona('portoes/pinturas');
            }
        }
        else{
            $this->redireciona('portoes/pinturas');
        }
    }
    public function deletaPintura($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('pinturas')
        ->join(
            [
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produtos.id = produto_id'
            ]
        )
        ->where('pinturas.id = '.$id)
        ->execute()
        ->fetchAll('assoc');
        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage('danger','Pintura não encontrada',true);
            $this->redireciona('portoes/pinturas');
        }
        
    }
    public function delPintura(){
        $pintura_id = $this->request->getQuery('pid');
        $this->deletaPintura($pintura_id);
        $this->setMessage('success','Pintura excluída',true);
        $this->redireciona('portoes/pinturas');
    }

    public function fitaPVC(){
        $pintura_id = $this->request->getQuery('pintura_id');
        if(!$pintura_id){
            $pintura_id = $this->request->getData('pintura_id');
        }
        $condicao = "produtos.deletado = 0";
        if($pintura_id){
            $condicao .= " and pinturas.id = " . $pintura_id;
            $res = $this->connection->newQuery()
            ->select('fitaPVC.id, fitaPVC.produto_id, produtos.condicao, produtos.tipo, produtos.nome, produtos.codigo, unidades_medida.nome as medida, descricao, imagem, valor_unitario')
            ->from('fitaPVC')
            ->join(
                [
                    'table' => 'produtos',
                    'type' => 'LEFT',
                    'conditions' => 'produto_id = produtos.id'
                ]
            )
            ->join(
                [
                    'table' => 'pinturas',
                    'type' => 'LEFT',
                    'conditions' => 'pinturas.cor_id = fitaPVC.cor_id'
                ]
            )
            ->join(
                [
                    'table' => 'unidades_medida',
                    'type' => 'LEFT',
                    'conditions' => 'unidade_medida_id = unidades_medida.id'
                ]
            );
            $res = $res->where($condicao);
            $res = $res->execute()
            ->fetchAll('assoc');
        }else{
            $res = $this->connection->newQuery()
            ->select('fitaPVC.id, produto_id,produtos.condicao, produtos.tipo, produtos.nome, produtos.codigo, unidades_medida.nome as medida, descricao, imagem, valor_unitario')
            ->from('fitaPVC')
            ->join(
                [
                    'table' => 'produtos',
                    'type' => 'LEFT',
                    'conditions' => 'produto_id = produtos.id'
                ]
            )
            ->join(
                [
                    'table' => 'unidades_medida',
                    'type' => 'LEFT',
                    'conditions' => 'unidade_medida_id = unidades_medida.id'
                ]
            );
            $res = $res->where($condicao);
            $res = $res->execute()
            ->fetchAll('assoc');
        }

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Fita PVC";
            $this->set('fitas', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "Fita PVC";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }

    public function fitaPadrao(){
        $configs = $this->getConfiguracoes();
       
        if($configs['pd_cor_fita']){
            $condicao = "produtos.deletado = 0 and fitaPVC.cor_id = " .$configs['pd_cor_fita'];
            $res = $this->connection->newQuery()
            ->select('fitaPVC.id, fitaPVC.produto_id, produtos.condicao, produtos.tipo, produtos.nome, produtos.codigo, unidades_medida.nome as medida, descricao, imagem, valor_unitario')
            ->from('fitaPVC')
            ->join(
                [
                    'table' => 'produtos',
                    'type' => 'LEFT',
                    'conditions' => 'produto_id = produtos.id'
                ]
            )
            ->join(
                [
                    'table' => 'unidades_medida',
                    'type' => 'LEFT',
                    'conditions' => 'unidade_medida_id = unidades_medida.id'
                ]
            );
            $res = $res->where($condicao);
            $res = $res->execute()
            ->fetchAll('assoc');
        }

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
    }

    public function addFitaPVC(){
        $fita = $this->request->getData('fita');
        $pinturas = $this->request->getData('pinturas');
        if (!empty($fita)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$fita['codigo'],
                'imagem'=>$fita['imagem'],
                'tipo'=>'opc',
                'nome'=>$fita['nome'],
                'descricao'=>$fita['descricao'],
                'is_padrao'=>'0',
                'unidade_medida_id'=>'14',
                'valor_unitario'=>$fita['valor_unitario'],
                'condicao'=>$fita['formula']
            ));
            if ($produto_id){
                $res = $this->connection->insert('fitaPVC', array('produto_id'=>$produto_id,'cor_id'=>$fita['cor']));
                $fita_id = $res->lastInsertId('fitaPVC');
                if ($this->retorno == 'json'){
                    echo json_encode(array('fita_id' => $fita_id));
                    exit;
                }
                else{
                    $this->setMessage('success','Fita adicionada com sucesso!',true);
                    $this->redireciona('portoes/fitaPvc');
                }
            }
        }else{
            $res = $this->connection->newQuery()
            ->select('id, tipo, nome')
            ->from('atributos')
            ->where("active = 1")
            ->andWhere('tipo = "cor"')
            ->execute()
            ->fetchAll('assoc');

            $this->set('atributos', $res);

        }
        $this->pageTitle = "Nova fita";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "fitas";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editFitaPvc(){
        $fita_id = $this->request->getQuery('fid');
        if (!empty($fita_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('fitaPVC')
            ->where('id = '.$fita_id)
            ->execute()
            ->fetchAll();
            if(count($res)>0){
            $fita = $this->request->getData('fita');
            $prod_id = $this->request->getData('id_prod');

            if (!empty($fita)){
                $res = $this->editProduto(array(
                    'codigo'=>$fita['codigo'],
                    'imagem'=>$fita['imagem'],
                    'tipo'=>'opc',
                    'nome'=>$fita['nome'],
                    'descricao'=>$fita['descricao'],
                    'valor_unitario'=>$fita['valor_unitario'],
                    'condicao'=>$fita['formula']
                ), $prod_id);

                $arrayFita = array(
                    'cor_id'=>$fita['cor']
                );

                $this->connection->update("fitaPVC", $arrayFita, array("id" => $fita_id));
                if ($res){
                    if ($this->retorno == 'json'){
                        echo json_encode(array('fita_id' => $fita_id));
                        exit;
                    }
                    else{
                        $this->setMessage('success','Fita editada com sucesso!',true);
                        $this->redireciona('portoes/fitaPvc');
                    }
                }
                else{
                    $this->setError(0, "Erro ao editar a Pintura!");
                }
            }
            else{
                $res = $this->connection->newQuery()
                ->select('fitaPVC.id, fitaPVC.produto_id as prod_id, fitaPVC.cor_id as cor, produtos.nome, produtos.codigo, produtos.descricao, produtos.imagem, produtos.valor_unitario, produtos.condicao as formula')
                ->from('produtos')
                ->join(
                    [
                        'table'=>'fitaPVC',
                        'type'=>'LEFT',
                        'conditions'=>'produtos.id = fitaPVC.produto_id '
                    ]
                )
                ->join(
                    [
                        'table'=>'atributos',
                        'type'=>'LEFT',
                        'conditions'=>'fitaPVC.cor_id = atributos.id'
                    ]
                )
                ->where('fitaPVC.id = '.$fita_id)
                ->execute()
                ->fetchAll('assoc');
                $this->set('fita', $res[0]);

                $res2 = $this->connection->newQuery()
                ->select('id, tipo, nome')
                ->from('atributos')
                ->where("active = 1")
                ->andWhere('tipo = "cor"')
                ->execute()
                ->fetchAll('assoc');

                $this->set('atributos', $res2);
            }
            $this->pageTitle = "Editar Fita ".$fita_id;
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "Fitas";
            $this->set('ref', $this->pagRef);

            $this->addFormsClass();
            }else{
                $this->setMessage('danger','Fita PVC não encontrada!',true);
                $this->redireciona('portoes/fitaPvc');
            }
        }
        else{
            $this->redireciona('portoes/fitaPvc');
        }
    }
    public function deletaFitaPvc($id){
        $res = $this->connection->newQuery()
        ->select('produto_id')
        ->from('fitaPVC')
        ->join(
            [
                'table'=>'produtos',
                'type'=>'LEFT',
                'conditions'=>'produtos.id = produto_id'
            ]
        )
        ->where('fitaPVC.id = '.$id)
        ->execute()
        ->fetchAll('assoc');
        if(count($res)>0){
            $produto_id = $res[0]['produto_id'];
            $this->connection->update('produtos',array("deletado" => 1), array('id'=>$produto_id));
        }else{
            $this->setMessage('danger','Fita PVC não encontrada!',true);
            $this->redireciona('portoes/fitaPvc');
        }
    }
    public function delFitaPvc(){
        $fita_id = $this->request->getQuery('fid');
        $this->deletaFitaPvc($fita_id);
        $this->setMessage('success','Fita PVC excluída!',true);
        $this->redireciona('portoes/fitaPvc');
    }
    public function componentes(){
        $padrao = $this->request->getData('is_padrao');
        $rodape = $this->request->getData('is_rodape');

        $condicao = 'tipo = "opc" and produtos.deletado = 0';
        if(!empty($rodape) || $rodape === "0" || $rodape === 0){
            $condicao .= ' and is_rodape ='. $rodape;
        }
        if(!empty($padrao) || $padrao === "0" || $padrao === 0){
            $condicao .= ' and is_padrao ='. $padrao;
        }

        $res = $this->connection->newQuery()
        ->select('produtos.id, produtos.nome, is_rodape, produtos.codigo, descricao, imagem, is_padrao, unidades_medida.nome as medida, unidades_medida.nome as unNome,formula, condicao, valor_unitario, tipo')
        ->from('produtos')
        ->join(
            [
                'table' => 'unidades_medida',
                'type' => 'LEFT',
                'conditions' => 'unidade_medida_id = unidades_medida.id'
            ]   
        );
        $res = $res->where($condicao);
        $res = $res->order('produtos.codigo');
        $res = $res->execute()
        ->fetchAll('assoc');

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        else{
            $this->pageTitle = "Componentes";
            $this->set('componentes', $res);
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "componentes";
            $this->set('ref', $this->pagRef);
            
            $this->addTableClass();
        }
    }
    public function addComponente(){
        $componente = $this->request->getData('componente');

        if (!empty($componente)){
            $produto_id = $this->addProduto(array(
                'codigo'=>$componente['codigo'],
                'imagem'=>$componente['imagem'],
                'tipo'=>'opc',
                'nome'=>$componente['nome'],
                'descricao'=>$componente['descricao'],
                'is_padrao'=>isset($componente['is_padrao']) ? '1' : '0',
                'is_rodape'=>isset($componente['is_rodape']) ? '1' : '0',
                'unidade_medida_id'=>$componente['unidade_medida_id'],
                'valor_unitario'=>$componente['valor_unitario'],
                'formula'=>$componente['formula'],
                'condicao'=>$componente['condicao']
            ));
            if ($produto_id){
                if ($this->retorno == 'json'){
                    echo json_encode(array('opcional_id' => $produto_id));
                    exit;
                }
                else{
                    $this->setMessage('success','Componente adicionado com sucesso!',true);
                    $this->redireciona('portoes/componentes');
                }
            }
        }
        else{
            $res = $this->connection->newQuery()
            ->select('id, nome')
            ->from('unidades_medida')
            ->execute()
            ->fetchAll('assoc');

            $this->set('unidades', $res);
        }
        $this->pageTitle = "Novo Componente";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "componentes";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editComponente(){
        $componente_id = $this->request->getQuery('cid');
        if (!empty($componente_id)){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('produtos')
            ->where('id = '.$componente_id)
            ->execute()
            ->fetchAll();

            if(count($res)>0){
                $componente = $this->request->getData('componente');
                if (!empty($componente)){
                    $res = $this->editProduto(array(
                        'codigo'=>$componente['codigo'],
                        'imagem'=>$componente['imagem'],
                        'tipo'=>'opc',
                        'nome'=>$componente['nome'],
                        'descricao'=>$componente['descricao'],
                        'is_padrao'=>isset($componente['is_padrao']) ? '1' : '0',
                        'is_rodape'=>isset($componente['is_rodape']) ? '1' : '0',
                        'valor_unitario'=>$componente['valor_unitario'],
                        'unidade_medida_id'=>$componente['unidade_medida_id'],
                        'formula'=>$componente['formula'],
                        'condicao'=>$componente['condicao']
                    ), $componente_id);
                    if ($res){
                        if ($this->retorno == 'json'){
                            echo json_encode(array('componente_id' => $componente_id));
                            exit;
                        }
                        else{
                            $this->setMessage('success','Componente editado com sucesso!',true);
                            $this->redireciona('portoes/componentes');
                        }
                    }
                    else{
                        $this->setError(0, "Erro ao editar o Componente!");
                    }
                }
                else{
                    $unidades = $this->connection->newQuery()
                    ->select('id, nome')
                    ->from('unidades_medida')
                    ->execute()
                    ->fetchAll('assoc');

                    $res = $this->connection->newQuery()
                    ->select('nome, codigo, descricao, imagem, is_padrao, is_rodape, unidade_medida_id, formula, condicao, valor_unitario')
                    ->from('produtos')
                    ->where('id = '.$componente_id)
                    ->execute()
                    ->fetchAll('assoc');

                    $this->set('unidades', $unidades);
                    $this->set('componente', $res[0]);
                }
                $this->pageTitle = "Editar Componente ".$componente_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "componentes";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            }else{
                $this->setMessage('danger','Componente não encontrado!',true);
                $this->redireciona('portoes/componentes');
            }
        }
        else{
            $this->redireciona('portoes/componentes');
        }
    }
    public function delComponente(){
        $componente_id = $this->request->getQuery('cid');

        $res = $this->connection->newQuery()
        ->select('id')
        ->from('produtos')
        ->where('id = '.$componente_id)
        ->execute()
        ->fetchAll();

        if(count($res)>0){
            $this->connection->update('produtos', array("deletado" => 1), array('id'=>$componente_id));
            $this->setMessage('success','Componente excluído',true);
            $this->redireciona('portoes/componentes');
        }else{
            $this->setMessage('danger','Componente não encontrado',true);
            $this->redireciona('portoes/componentes');
        }
        
    }
}