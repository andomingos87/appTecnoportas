<?php
namespace App\Controller;

class RepresentantesController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }

        $this->pageTitle = "Pontos de Venda";
        $this->set('title', $this->pageTitle);
        $this->pagRef[0] = "Pontos de Venda";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $id = $this->request->getQuery("id");

        $lat = $this->request->getQuery("lat");
        $lng = $this->request->getQuery("lng");
        $dist = $this->request->getQuery("dist");

        $uf = $this->request->getQuery("uf");
        $cidade = $this->request->getQuery("cidade");
        
        $condicao = "";
        $having = "";

        $order = "p.nome";

        $select = array(
            "r.id", "r.pessoa_id", "sc.serralheiro_id as sId", "sc.contato_id as cId", 
            "ps.nome as razao_social", "ps.sobrenome as nome_fantasia", "ps.cnpj", "ps.ie", 
            "p.nome", "p.sobrenome", "p.dt_cadastro", "e.email", "en.referencia", "en.cep", "en.logradouro", 
            "en.numero", "en.complemento", "en.bairro", "en.cidade", "en.uf", "en.pais", "en.lat", "en.lng", 
            "t.ddd", "t.numero as telefone", "ps.foto as foto"
        );      

        if (!empty($id)){
            $condicao = "r.id = $id";
        }
        else if (!empty($uf) && !empty($cidade)){
            $condicao = "en.uf = '$uf' AND en.cidade = '$cidade'";            
        }
        else if (!empty($lat) && !empty($lng)){
            $select[] = "111.045 * DEGREES(ACOS(COS(RADIANS($lat)) * COS(RADIANS(en.lat)) * COS(RADIANS(en.lng) - RADIANS($lng)) + SIN(RADIANS($lat)) * SIN(RADIANS(en.lat)))) AS distancia";
            $having = "distancia < " . (!empty($dist) ? $dist : "5");
            $order = "distancia";
        }

        $res = $this->connection->newQuery()
        ->select($select)
        ->from("representantes r")        
        ->join([
            'table'=>'serralheiro_contato sc',
            'type'=>'LEFT',
            'conditions'=>'sc.serralheiro_id = r.pessoa_id'
        ])
        ->join([
            'table'=>'pessoas p',
            'type'=>'LEFT',
            'conditions'=>'p.id = sc.contato_id'
        ])
        ->join([
            'table'=>'pessoas ps',
            'type'=>'LEFT',
            'conditions'=>'ps.id = sc.serralheiro_id'
        ])
        ->join([
            "table"=>"emails e",
            "type"=>"LEFT",
            "conditions"=>"e.pessoa_id = ps.id"
        ])
        ->join([
            "table"=>"telefones t",
            "type"=>"LEFT",
            "conditions"=>"t.pessoa_id = ps.id"
        ])
        ->join([
            "table"=>"enderecos en",
            "type"=>"LEFT",
            "conditions"=>"en.pessoa_id = ps.id"
        ])
        ->where($condicao)
        ->having($having)
        ->order($order)
        ->execute()
        ->fetchAll("assoc");

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        $this->set("representantes", $res);
        $this->addTableClass();
    }

    public function listaRevendedores(){
        $id = $this->request->getQuery("id");

        $uf = $this->request->getQuery("uf");
        $cidade = $this->request->getQuery("cidade");
        $not = $this->request->getQuery("n");
        
        $condicao = "";

        $order = "p.nome";

        $select = array(
            "sc.serralheiro_id as sId", "sc.contato_id as cId", 
            "ps.nome as razao_social", "ps.sobrenome as nome_fantasia", "ps.cnpj", "ps.ie", 
            "p.nome", "p.sobrenome", "p.dt_cadastro", "e.email", "en.id as endId","en.referencia", "en.cep", "en.logradouro", 
            "en.numero", "en.complemento", "en.bairro", "en.cidade", "en.uf", "en.pais", "en.lat", "en.lng", 
            "t.ddd", "t.numero as telefone", "ps.foto as foto"
        );
        if(!empty($not)){
            $condicao = "r.pessoa_id is null";
        }else if (!empty($id)){
            $condicao = "sc.serralheiro_id = $id";
        }
        else if (!empty($uf) && !empty($cidade)){
            $condicao = "en.uf = '$uf' AND en.cidade = '$cidade'";            
        }

        $res = $this->connection->newQuery()
        ->select($select)
        ->from("serralheiro_contato sc")
        ->join([
            'table'=>'pessoas p',
            'type'=>'LEFT',
            'conditions'=>'p.id = sc.contato_id'
        ])
        ->join([
            'table'=>'pessoas ps',
            'type'=>'LEFT',
            'conditions'=>'ps.id = sc.serralheiro_id'
        ])
        ->join([
            "table"=>"emails e",
            "type"=>"LEFT",
            "conditions"=>"e.pessoa_id = ps.id"
        ])
        ->join([
            "table"=>"telefones t",
            "type"=>"LEFT",
            "conditions"=>"t.pessoa_id = ps.id"
        ])
        ->join([
            "table"=>"enderecos en",
            "type"=>"LEFT",
            "conditions"=>"en.pessoa_id = ps.id"
        ])
        ->join([
            "table"=>"representantes r",
            "type"=>"LEFT",
            "conditions"=>"r.pessoa_id = sc.serralheiro_id"
        ])
        ->where($condicao)
        ->order($order)
        ->execute()
        ->fetchAll("assoc");

        if ($this->retorno == 'json'){
            echo json_encode($res);
            exit;
        }
        $this->set("representantes", $res);
        $this->addTableClass();
    }

    public function novo(){
        $repId = $this->request->getData("rId");

        
        if (!empty($repId)){

            $res = $this->getThisJsonData("representantes/listaRevendedores?id=".$repId);
            
            if(!empty($res)){
                $res = $res[0];
                if(empty($res['lat']) || empty($res['lng'])){
                    $endId = $res["endId"];
                    $rua = $res["logradouro"];
                    $numero = $res["numero"];
                    $bairro = $res["bairro"];
                    $cidade = $res["cidade"];
                    $estado = $res["uf"];
                    $cep = $res["cep"];
                    $pais = $res["pais"];
        
                    $res = $this->buscaGoogleMaps($rua, $numero, $bairro, $cidade, $estado, $cep, $pais);
                    if (!empty($res)){
                        $loc = $res[0]["geometry"]["location"];
                        $lat = $loc["lat"];
                        $lng = $loc["lng"];
        
                        $arrayEndereco = array(
                            "lat" => $lat,
                            "lng" => $lng
                        );
                        
                        $res = $this->connection->update("enderecos", $arrayEndereco, array("id" => $endId));
                        $arrayRepr = array(
                            "pessoa_id" => $repId
                        );
                        $res = $this->connection->insert("representantes", $arrayRepr);
        
                        $this->setMessage("success", "O Representante com ID : $repId foi cadastrado como um ponto de venda!", true);
                        $this->redireciona("representantes");
                    }
                    else{
                        $this->setError(0, "Endereço inválido!");
                    }
                }else{
                    $arrayRepr = array(
                        "pessoa_id" => $repId
                    );
                    $res = $this->connection->insert("representantes", $arrayRepr);
    
                    $this->setMessage("success", "O Representante com ID : $repId foi cadastrado como um ponto de venda!", true);
                    $this->redireciona("representantes");
                }

            }
           
        }else{
            $reven = $this->getThisJsonData("representantes/listaRevendedores?n=1");
            $this->set('revendedores', $reven);
            $this->pageTitle = "Novo Ponto de Venda";
            $this->set('title', $this->pageTitle);
            $this->pagRef[1] = "Novo Ponto de Venda";
            $this->set('ref', $this->pagRef);
            $this->addFormsClass();
        }

        
    }
    
    public function excluir(){
        $id = $this->request->getQuery("id");

        if (!empty($id)){
            $rData = $this->getThisJsonData("representantes/listaRevendedores?id=".$id);
            
            if (count($rData)){
                $rData = $rData[0];
                    
                $this->connection->delete("representantes", array(
                    "pessoa_id" => $id
                ));
                
                $this->setMessage("success", "O Ponto de Venda ($id) foi excluido!", true);
            }
            else{
                $this->setMessage("danger", "O Ponto de Venda $id não existe!", true);
            }
        }
        else{
            $this->setMessage("danger", "Id do Ponto de Venda não recebido!", true);
        }
        $this->redireciona("representantes");
    }
    /*Api */
    public function getEstados(){
        if ($this->retorno == "json"){
            $res = $this->connection->newQuery()
            ->select("e.uf")
            ->from("enderecos e")
            ->join([
                "table" => "pessoas p",
                "type" => "LEFT",
                "conditions" => "e.pessoa_id = p.id"
            ])
            ->join([
                "table" => "representantes r",
                "type" => "LEFT",
                "conditions" => "r.pessoa_id = p.id"
            ])
            ->where("r.id IS NOT NULL")
            ->group("e.uf")
            ->execute()
            ->fetchAll("assoc");
    
            echo json_encode($res);
            exit;
        }
    }
    public function getCidades(){
        if ($this->retorno == "json"){
            $uf = $this->request->getQuery("uf");

            if (!empty($uf)){
                $res = $this->connection->newQuery()
                ->select("e.cidade")
                ->from("enderecos e")
                ->join([
                    "table" => "pessoas p",
                    "type" => "LEFT",
                    "conditions" => "e.pessoa_id = p.id"
                ])
                ->join([
                    "table" => "representantes r",
                    "type" => "LEFT",
                    "conditions" => "r.pessoa_id = p.id"
                ])
                ->where("r.id IS NOT NULL AND e.uf = '$uf'")
                ->group("e.cidade")
                ->execute()
                ->fetchAll("assoc");
        
                echo json_encode($res);
            }
            else{
                echo json_encode(array(
                    "error" => "Estado Não Recebido"
                ));
            }
            exit;
        }
    }
}