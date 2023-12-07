<?php
namespace App\Controller;

use Cake\Datasource\ConnectionManager;
use Cake\Controller\Controller;
use Cake\Event\Event;
use Cake\Mailer\Email;
use Cake\Http\Client;



class AppController extends Controller
{

    public $gMapsKey = "AIzaSyBOY3xCtgx4QT-y_QK1be2sPkvaK9QKL54";
    public $pageTitle;
    public $scripts;
    public $styles;
    public $pagRef;
    public $user;
    public $connection;
    public $retorno;
    public $destinatario;

    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('RequestHandler', [
            'enableBeforeRedirect' => false,
        ]);
        $this->loadComponent('Flash');

        $this->connection = ConnectionManager::get('default');

        $this->user = $this->isLogado();

        $this->retorno = $this->request->getData('retorno');
        if ($this->retorno != 'json') {
            $this->start_session();
            if (isset($_SESSION['thisMsg'])) {
                if (!isset($_SESSION['thisMsgStatus'])) {
                    $this->set('thisMsg', $_SESSION['thisMsg']);
                }
                else{
                    unset($_SESSION['thisMsgStatus']);
                }
                unset($_SESSION['thisMsg']);
            }
        }
        header('X-Robots-Tag: noindex');
        header('Access-Control-Allow-Origin: *');

        $this->scripts = array();
        $this->styles = array();
        /*
         * Enable the following component for recommended CakePHP security settings.
         * see https://book.cakephp.org/3.0/en/controllers/components/security.html
         */
        //$this->loadComponent('Security');

        $this->set('scripts', $this->scripts);
        $this->set('styles', $this->styles);
    }
    public function checaUser($user){
        $res = $this->connection->newQuery()
        ->select("username")
        ->from("usuarios")
        ->where("active = 1")
        ->andWhere("username = '".$user."'")
        ->execute()
        ->fetch("assoc");

        if($res){
            return true;
        }else{
            return false;
        }
    }
    public function checaEmail($email, $id = 0)
    {
        $res = $this->connection->newQuery()
            ->select(
                "email, emails.pessoa_id, usuarios.active"
            )
            ->from(
                "emails"
            )
            ->join(
                [
                    'table' => 'serralheiro_clientes',
                    'type' => 'LEFT',
                    'conditions' => 'emails.pessoa_id = serralheiro_clientes.cliente_id'
                ]
            )
            ->join(
                [
                    'table' => 'usuarios',
                    'type' => 'LEFT',
                    'conditions' => 'emails.pessoa_id = usuarios.pessoa_id'
                ]
            )
            ->where(
                "email = '" . $email . "' AND serralheiro_clientes.serralheiro_id IS NULL"
            )
            ->execute()
            ->fetch("assoc");

        if ($res) {
            if ($res['email'] == $email && $res['pessoa_id'] != $id && $res['active'] == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function buscaGoogleMaps($rua, $numero = null, $bairro, $cidade, $estado, $cep, $pais){
		$arrayResu = array();

		$res = $this->getUrlData("get", "https://maps.googleapis.com/maps/api/geocode/json"
		."?key=".$this->gMapsKey."&address=". urlencode($rua.(!empty($numero) ? ", ".$numero : "")." - ".$bairro.", ".$cidade." - ".$estado.", ".$cep.", ".$pais));

		if (count($res["results"])){
			$arrayResu = $res["results"];
		}
		return $arrayResu;
	}


    public function getThisJsonData($pagina)
	{
		$url = $this->getLink($pagina);
		return $this->getUrlData("post", $url, array(
			"retorno" => "json"
		));
    }

    public function getUrlData($method, $url, $data = array(), $encodeData = false, $header = array(), $returnType = "json"){
        $res = "";
        $http = new Client();

        if ($encodeData){
            $data = json_encode($data);
		}

        switch($method){
            case "post":
                $res = $http->post($url, $data, $header);
            break;
            case "get":
                $res = $http->get($url, $data, $header);
            break;
            case "put":
                $res = $http->put($url, $data, $header);
            break;
		}

        if ($returnType == "json"){
          return json_decode($res->getBody(), true);
        }
        return $res->getBody();
    }

    function hasId($objs, $id, $key = "id"){
		if (gettype($objs) == "object" || gettype($objs) == "array"){
			if (isset($objs[$key])){
				if ($objs[$key] == $id){
					return $key;
				}
			}
			else{
				foreach($objs as $k => $obj){
					if (isset($obj[$key])){
						if ($obj[$key] == $id){
							return $k;
						}
					}
					else if (gettype($obj) == "object" || gettype($obj) == "array") {
						return $this->hasId($obj, $id, $key);
					}
				}
			}
		}
		return false;
    }

    public function limpaObjKeys($obj = array(), $keys = array()){
        foreach($keys as $key){
            unset($obj[$key]);
        }
        return $obj;
    }

    public function addCliente($cli, $end, $serralheiro_id){
        $cliArray = array(
            'nome'=>$cli['nome'], 'sobrenome'=>$cli['sobrenome'], 'tipo'=>$cli['tipo'], 'nivel'=>'CF', 'ip_cadastro'=>$this->userIP()
        );

        if($cli['cnpj']){
            $cliArray['cnpj'] = $cli['cnpj'];
        }

        $res = $this->connection->insert('pessoas', $cliArray);
        $cliente_id = $res->lastInsertId('pessoas');
        if (!empty($cli['email'])){
            $this->connection->insert('emails', array('email'=>$cli['email'], 'pessoa_id'=>$cliente_id));
        }
        if (!empty($end)){
            $endArray = array('cidade'=>$end['cidade'], 'uf'=>$end['uf'], 'pessoa_id'=>$cliente_id);

            if(isset($end['pais'])){
                $endArray['pais'] = $end['pais'];
            }

            if(isset($end['referencia'])){
                $endArray['referencia'] = $end['referencia'];
            }
            if(isset($end['numero'])){
                $endArray['numero'] = $end['numero'];
            }
            if(isset($end['logradouro'])){
                $endArray['logradouro'] = $end['logradouro'];
            }

            $this->connection->insert('enderecos', $endArray);
        }
        if (!empty($serralheiro_id)){
            $this->connection->insert('serralheiro_clientes', array('serralheiro_id'=>$serralheiro_id, 'cliente_id'=>$cliente_id));
        }
        if (!empty($cli['ddd']) && !empty($cli['numero'])){
            $this->connection->insert('telefones', array('ddd'=>$cli['ddd'], 'numero'=>$cli['numero'], 'pessoa_id'=>$cliente_id, 'ip_atualizado'=>$this->userIP()));
        }
        return $cliente_id;
    }
    public function editCliente($cliente_id, $cli, $end){
        $cliArray = array(
            'nome'=>$cli['nome'], 'sobrenome'=>$cli['sobrenome'], 'tipo'=>$cli['tipo'], 'nivel'=>'CF'
        );

        if($cli['cnpj']){
            $cliArray['cnpj'] = $cli['cnpj'];
        }

        $this->connection->update('pessoas', $cliArray, array('id'=>$cliente_id));
        if (!empty($cli['email'])){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('emails')
            ->where('pessoa_id = '.$cliente_id)
            ->execute()
            ->fetchAll("assoc");

            if(count($res)>0){
                $res = $this->connection->update('emails', array('email'=>$cli['email'], 'pessoa_id'=>$cliente_id), array('pessoa_id'=>$cliente_id));
            }else{
                $this->connection->insert('emails', array('email'=>$cli['email'], 'pessoa_id'=>$cliente_id));
            }

        }
        if (!empty($end)){
            $endArray = array('cidade'=>$end['cidade'], 'uf'=>$end['uf'], 'pessoa_id'=>$cliente_id);

            if(isset($end['pais'])){
                $endArray['pais'] = $end['pais'];
            }

            if(isset($end['referencia'])){
                $endArray['referencia'] = $end['referencia'];
            }
            if(isset($end['numero'])){
                $endArray['numero'] = $end['numero'];
            }
            if(isset($end['logradouro'])){
                $endArray['logradouro'] = $end['logradouro'];
            }

            $this->connection->update('enderecos', $endArray, array('pessoa_id'=>$cliente_id));
        }

        if (!empty($cli['ddd']) && !empty($cli['numero'])){
            $res = $this->connection->newQuery()
            ->select('id')
            ->from('telefones')
            ->where("pessoa_id = $cliente_id")
            ->execute()
            ->fetchAll('assoc');
            if (count($res) > 0) {
                $this->connection->update('telefones', array('ddd'=>$cli['ddd'], 'numero'=>$cli['numero'], 'pessoa_id'=>$cliente_id, 'ip_atualizado'=>$this->userIP()), array('pessoa_id'=>$cliente_id));
            }else{
                $this->connection->insert('telefones', array('ddd'=>$cli['ddd'], 'numero'=>$cli['numero'], 'pessoa_id'=>$cliente_id, 'ip_atualizado'=>$this->userIP()));
            }
        }
        return $cliente_id;
    }
    public function addPortao($portao, $tipo_chapa, $serralheiro_id){
        $portao['altura'] = $this->corrigeNum($portao['altura']);
        $portao['largura'] = $this->corrigeNum($portao['largura']);

        $arrayData = array('referencia'=>$portao['referencia'], 'portas'=>$portao['portas'], 'altura'=>$portao['altura'], 'largura'=>$portao['largura'],'is_dentro_vao'=>$portao['is_dentro_vao']);

        if (!empty($tipo_chapa)){
            $arrayData['chapa_id'] = $tipo_chapa['chapa_id'];
            $arrayData['perfil_id'] = $tipo_chapa['perfil_id'];
            $arrayData['espessura_id'] = $tipo_chapa['espessura_id'];
        }

        $res = $this->connection->insert('portoes', $arrayData);
        $portao_id = $res->lastInsertId('portoes');
        if (!empty($serralheiro_id)){
            $this->connection->insert('serralheiro_portoes', array('portao_id'=>$portao_id, 'serralheiro_id'=>$serralheiro_id));
        }
        return $portao_id;
    }
    public function editPortao($portao_id, $portao, $tipo_chapa){
        $arrayData = array();

        if (!empty($tipo_chapa)){
            $arrayData['chapa_id'] = $tipo_chapa['chapa_id'];
            $arrayData['perfil_id'] = $tipo_chapa['perfil_id'];
            $arrayData['espessura_id'] = $tipo_chapa['espessura_id'];
        }

        if (!empty($portao)){
            $arrayData['referencia'] = $portao['referencia'];
            $arrayData['portas'] = $portao['portas'];
            $arrayData['altura'] = $this->corrigeNum($portao['altura']);
            $arrayData['largura'] = $this->corrigeNum($portao['largura']);
            $arrayData['is_dentro_vao'] = $portao['is_dentro_vao'];
        }

        $this->connection->update('portoes', $arrayData, array('id'=>$portao_id));
        return $portao_id;
    }
    public function addProduto($dados){
        if (isset($dados['imagem'])){
            $img = $this->upload($dados['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));

            if (isset($img['error'])){
                if ($img['error'] == 0){
                    $img = null;
                }
                else {
                    if ($img['error'] == 1){
                        $this->setError(1);
                    }
                    else{
                        $this->setError(2);
                    }
                    return false;
                }
            }
            $dados['imagem'] = $img;
        }
        $dados['valor_unitario'] = $this->corrigeNum($dados['valor_unitario']);
        $dados['ip_atualizado'] = $this->userIP();
        $res = $this->connection->insert('produtos', $dados);
        return $res->lastInsertId('produtos');
    }
    public function editProduto($dados, $id){
        $tipo = $dados['tipo'];
        $isImg = isset($dados['imagem']);
        if ($isImg){
            $isImg = !empty($dados['imagem']['name']);
            if (!$isImg){
                unset($dados['imagem']);
            }
        }
        $img_ant = null;
        $produto_id = $id;

        if ($tipo != 'opc'){
            $tabelas = array(
                'prf'=>'perfis',
                'mto'=>'motores',
                'aut'=>'automatizadores',
                'ent'=>'entradas',
                'tst'=>'testeiras',
                'ptr'=>'pinturas',
            );
            $tabela = $tabelas[$tipo];

            $res = $this->connection->newQuery()
            ->select('produto_id'.($isImg ? ', imagem' : ''))
            ->from($tabela);
            if ($isImg){
                $res = $res->join(
                    [
                        'table'=>'produtos',
                        'type'=>'LEFT',
                        'conditions'=>'produtos.id = produto_id'
                    ]
                );
            }
            $res = $res->where($tabela.'.id = '.$id)
            ->execute()
            ->fetchAll('assoc');

            $produto_id = $res[0]['produto_id'];
            if ($isImg){
                $img_ant = $res[0]['imagem'];
            }
        }
        else{
            $res = $this->connection->newQuery()
            ->select('imagem')
            ->from('produtos')
            ->where('id = '.$produto_id)
            ->execute()
            ->fetchAll('assoc');

            $img_ant = $res[0]['imagem'] | false;
        }
        if ($isImg){
            $img = null;

            if (!empty($dados['imagem']['name'])){
                $img = $this->upload($dados['imagem'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $img_ant);

                if (isset($img['error'])){
                    if ($img['error'] == 1){
                        $this->setError(1);
                    }
                    else{
                        $this->setError(2);
                    }
                    return false;
                }
                $dados['imagem'] = $img;
            }
        }
        $dados['dt_atualizado'] = $this->getCurrentTimeStamp();
        $dados['ip_atualizado'] = $this->userIP();

        $res = $this->connection->update('produtos', $dados, array('id'=>$produto_id));
        return $id;
    }
    public function addTableClass(){
        array_push($this->styles, '/js/advanced-datatable/css/demo_page.css', '/js/advanced-datatable/css/demo_table.css', '/js/data-tables/DT_bootstrap.css');
        array_push($this->scripts, '/js/advanced-datatable/js/jquery.dataTables.js', '/js/data-tables/DT_bootstrap.js','/js/dynamic_table_init.js');
        $this->set('scripts', $this->scripts);
        $this->set('styles', $this->styles);
    }
    public function addFormsClass(){
        array_push($this->styles, '/js/bootstrap-wysihtml5/bootstrap-wysihtml5.css', '/js/bootstrap-wysihtml5/wysiwyg-color.css', '/js/dropzone/css/dropzone.css','/css/bootstrap-fileupload.min.css', '/js/jquery-multi-select/css/multi-select.css', '/js/ios-switch/switchery.css');
        array_push($this->scripts, '/js/bootstrap-wysihtml5/wysihtml5-0.3.0.js', '/js/bootstrap-wysihtml5/bootstrap-wysihtml5.js', '/js/dropzone/dropzone.js', '/js/ios-switch/switchery.js', '/js/ios-switch/ios-init.js','/js/jquery-multi-select/js/jquery.multi-select.js', '/js/jquery-multi-select/js/jquery.quicksearch.js', '/js/fuelux/js/spinner.min.js', '/js/spinner-init.js', '/js/bootstrap-fileupload.min.js', '/js/bootstrap-inputmask/bootstrap-inputmask.min.js');
        $this->set('scripts', $this->scripts);
        $this->set('styles', $this->styles);
    }
    public function corrigeNum($num){
        return str_replace(',', '.', $num);
    }
    public function configTel($tel){
        $ddd; $telefone;
        preg_match("/^\([0-9]{2}\)/", $tel, $ddd);
        if (isset($ddd[0])) {
          $telefone = str_replace($ddd[0], "", $tel);
          $telefone = str_replace("-", "", $telefone);
          $ddd = preg_replace("/[)(]/", "", $ddd[0]);
          return [$ddd, $telefone];
        }
        return [null, null];
    }
    public function start_session(){
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }
    public function isLink($link){
        $file_headers = @get_headers($link);
        if(!$file_headers || $file_headers[0] == 'HTTP/1.1 404 Not Found') {
            return false;
        }
        return true;
    }
    public function isLogado(){
        $this->start_session();
        if (isset($_SESSION['thisUser'])){
            return json_decode($_SESSION['thisUser'], true);
        }
        else{
            return false;
        }
    }
    public function setLogin($array){
        if ($this->retorno != 'json'){
            $this->start_session();
            $_SESSION['thisUser'] = json_encode($array);
        }
        $res = $this->connection->insert('logins', ['usuario_id' => $array[0]['id'], 'ip_acesso' => $this->userIP()]);
        return $res->lastInsertId('logins');
    }
    public function logout(){
        $this->start_session();
        unset($_SESSION['thisUser']);
    }
    public function userIP() {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP'])){
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        }
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else if(isset($_SERVER['HTTP_X_FORWARDED'])){
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        }
        else if(isset($_SERVER['HTTP_X_CLUSTER_CLIENT_IP'])){
            $ipaddress = $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
        }
        else if(isset($_SERVER['HTTP_FORWARDED_FOR'])){
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        }
        else if(isset($_SERVER['HTTP_FORWARDED'])){
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        }
        else if(isset($_SERVER['REMOTE_ADDR'])){
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        }
        else{
            $ipaddress = 'UNKNOWN';
        }
        return $ipaddress;
    }
    public function getLink($page){
        return "http://apptecnoportas.com.br/".$page;
    }
    public function redireciona($pagina){
        if ($this->retorno != 'json'){
            header('location: '.$this->getLink($pagina));
            exit;
        }
    }
    public function comprimirArquivo($nome, $uri, $qualidade = 60){
		$deleta = false;
		$imagem = false;

		$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));

		if ($ext == 'jpeg' || $ext == "jpg") {
		  $image = imagecreatefromjpeg($uri);
		  $imagem = true;
		}
		else if ($ext == 'png') {
		  $image = imagecreatefrompng($uri);
		  $deleta = true;
		  $imagem = true;
		}
		else{
		  return array($nome, $uri);
		}

		if ($deleta){
		  $this->deleteFile($uri);
		  if ($imagem){
			$uri = str_replace($ext, "jpg", $uri);
			$nome = str_replace($ext, "jpg", $nome);
		  }
		}

		if ($imagem){
		  imagejpeg($image, $uri, $qualidade);
		}

		return array($nome, $uri);
	}
	public function upload($file, $extensao, $substitui = false){
		$destinoPath = '../data_uploads/';
		if (!empty($file['name'])) {
			$nome = $file['name'];
			$ext = pathinfo($nome, PATHINFO_EXTENSION);
			if (in_array(strtolower($ext) , $extensao)) {
				$nomeFinal = md5(microtime() . rand()) . $nome;
				$pathFinal = $destinoPath . $nomeFinal;
				if (move_uploaded_file($file['tmp_name'], $pathFinal)) {
					if ($substitui) {
						$this->deleteFile($substitui);
					}

					$res = $this->comprimirArquivo($nomeFinal, $pathFinal);
					$nomeFinal = $res[0];
					return $nomeFinal;
				}
				else {
					return ['error' => 2];
				}
			}
			else {
				return ['error' => 1];
			}
		}
		else
		if (gettype($file) == "string") {
			if (strpos($file, ";base64,") !== false) {
				$data = explode(',', $file);
				$filedata = base64_decode($data[1]);
				$f = finfo_open();
				$fileType = finfo_buffer($f, $filedata, FILEINFO_MIME_TYPE);
				$ext = explode('/', $fileType) [1];
				$nomeFinal = md5(microtime() . rand()) . "." . $ext;
				$pathFinal = $destinoPath . $nomeFinal;
				$ifp = fopen($pathFinal, 'wb');
				fwrite($ifp, $filedata);
				fclose($ifp);
				$res = $this->comprimirArquivo($nomeFinal, $pathFinal);
				$nomeFinal = $res[0];
				return $nomeFinal;
			}
			else {
				return ['error' => 3];
			}
		}
		else {
			return ['error' => 0];
		}
	}
    public function deleteFile($nome){
        $destinoPath = '../data_uploads/';
        if (file_exists($destinoPath.$nome)){
            return unlink($destinoPath.$nome);
        }
        else{
            return false;
        }
    }
    public function setConfiguracoes($array){
        $path = '../tecnoportas.config';
        $file = fopen($path, 'w');
        $res = fwrite($file, json_encode($array));
        fclose($file);
        return $res;
    }
    public function getConfiguracoes(){
        $path = '../tecnoportas.config';
        if (file_exists($path)){
            $file = fopen($path, 'r');
            $res = "";
            while(!feof($file)){
                $res .= fgets($file);
            }
            fclose($file);
            return json_decode($res, true);
        }
        else{
            return array(
                'pd_perfil_med'=>"1",
                'pd_entrada_med'=>"4",
                'pd_testeira_med'=>"4",
                'pd_pintura_med'=>"1",
                'pd_motor_med'=>"4",
                'pd_automatizador_med'=>"4",
                'pd_cor_fita'=>"29",
                'remetente'=>'app@apptecnoportas.com.br',
                'destinatario'=>'app@apptecnoportas.com.br',
                'sobre_nos'=>"Inserir Texto",
                'email_atendimento'=>"app@apptecnoportas.com.br",
                'catalogo'=>"",
                'termos_uso'=>"Inserir Texto",
                'nome_empresa'=>"TECNOPORTAS"
            );
        }
    }
    public function getCurrentTimeStamp(){
        $res = $this->connection->newQuery()
        ->select('CURRENT_TIMESTAMP() as time')
        ->execute()
        ->fetchAll('assoc');

        return $res[0]['time'];
    }
    public function setError($code, $msg = null, $acao = false, $sessao = false){
        $erro = 'Erro desconhecido, Código ' . $code . ', Motivo: ' . $msg;
        switch ($code) {
            case 0:
                $erro = $msg;
                break;
            case 1:
                $erro = "A extenção da imagem não foi reconhecida, só são permitidas as extenções: jpg, png, jpeg, gif e svg!";
                break;
            case 2:
                $erro = "Não foi possível fazer o upload da Imagem";
                break;
            case 3:
                $erro = "Dados incompletos!";
                break;
            case 4:
                $erro = "Email já cadastrado!";
                break;
            case 5:
                $erro = "E-mail, Nome de Usuário ou Senha Inválido!";
                break;
            case 6:
                $erro = "Acesso não Autorizado!";
                break;
            case 23000:
                $erro = "Não foi possível " . ($acao === false ? 'excluir esse item' : $acao) . ", verifique se existem outros itens cadastrados que dependem deste.";
                break;
            case 23001:
                $erro = "Não foi possível " . ($acao === false ? 'alterar esse item' : $acao) . ", verifique se os dados enviados estão corretos.";
                break;
        }
        $this->setMessage("warning", $erro, $sessao, $code);
    }

    public function setMessage($tipo = "info", $texto, $sessao = false, $code = 0){
        $msg = "";
        if ($tipo == "success"){
            $msg = "<h4>Sucesso!</h4>";
        }
        else if ($tipo == "warning"){
            $msg = "<b>Atenção!</b> ";
        }
        else if ($tipo == "danger"){
            $msg = "<b>Erro!</b> ";
        }
        $msg .= $texto;


        if ($this->retorno == "json") {
            echo json_encode(array(
                "error" => strip_tags($msg),
                "code" => $code
            ));
            exit;
        } else {
            $this->start_session();
            if (!isset($_SESSION['thisMsg'])) {
                $_SESSION['thisMsg'] = array(
                    $tipo => $msg
                );
            } else {
                array_push($_SESSION['thisMsg'], array($tipo => $msg));
            }
            if ($sessao === false) {
                $this->set('thisMsg', $_SESSION['thisMsg']);
                $_SESSION['thisMsgStatus'] = !$sessao;
            }
        }

    }

    public function enviaSenhaEmail($username){
        $res = $this->connection->newQuery()
        ->select('usuarios.id,usuarios.username, acesso, nome, sobrenome, email, senha')
        ->from('usuarios')
        ->join(
            [
                'table' => 'pessoas',
                'type' => 'INNER',
                'conditions' => ['pessoas.id = usuarios.pessoa_id']
            ]
        )
        ->join(
            [
                'table' => 'emails',
                'type' => 'LEFT',
                'conditions' => ['emails.pessoa_id = pessoas.id']
            ]
        )
        ->where('username = "'.$username.'" or emails.email = "'.$username.'"')
        ->execute()
        ->fetchAll('assoc');

        if(empty($res[0]['email'])){
            $this->setError(0, "Email não encontrado");
            return false;
        }
        else{
            if (count($res)){
                $mensagem1 = '<h1>Sistema TecnoPortas</h1><br/>';
                $mensagem1 .= '<h2>Olá '.$res[0]['username'].' '.$res[0]['id'].'</h2>';
                $mensagem1 .= '<p>Você esqueceu sua senha? Não tem problema!<br/><br/>Clique no link abaixo para <b>alterar sua senha agora</b>:<br/>';
                $mensagem1 .= '<a href="http://apptecnoportas.com.br/login/alteraSenha?cod='.$res[0]['senha'].'&id='.$res[0]['id'].'&n='.$res[0]['acesso'].'">Alterar minha Senha</a></p>';

                $arrayEmail = array(
                    'assunto' => 'Altere sua Senha | Sistema TecnoPortas',
                    'mensagem' => $mensagem1,
                    'destinatario' => $res[0]['email']
                );
                $this->enviaEmail($arrayEmail);
                return true;
            }
            return false;
        }
    }

    public function sendPushNotification($texto, $titulo, $arrayReq, $condicao = "0")
	{
		$arrayKeys = array();

		$res = $this->connection->newQuery()
			->select("pushkey, usuario_id")
			->from("pushkeys")
			->where($condicao)
			->execute()
			->fetchAll("assoc");

		foreach ($res as $line) {
			if (!empty($line["pushkey"])) {
				$arrayKeys[] = $line["pushkey"];
			}
		}

		if (count($arrayKeys)) {
			$arrayData = [
				"notification" => array(
					'title' => $titulo,
					'body' => $texto,
					'sound' => 'default',
					'icon' => 'notification_icon',
				),
				'data' => $arrayReq,
				"registration_ids" => $arrayKeys,
			];
			$res = $this->getUrlData("post", "https://fcm.googleapis.com/fcm/send", $arrayData, true, array(
				'headers' => array(
					'Authorization' => 'key=AAAA7KnQEAo:APA91bGVWp_yhohEmweF44jJ0IEPPBGE7xtnGc9MycZt4d74hZ6NgsHqy4yTisCzHJEtza7o3wI9AlpVvpkeQvyJUEFRfDa6jO7zrkWenXiDKe4Ug1Kbh-iJSGvj0RMgegKbQs_ZQx7j',
					'Content-Type' => 'application/json'
				)
			), "html");
		}
		return $arrayKeys;
	}

    public function enviaEmail($array){
        $emailRem; $nomeRem;
		if( PATH_SEPARATOR ==';'){
			$br="\r\n";
		} elseif (PATH_SEPARATOR==':'){
			$br="\n";
        }
		$uid = md5(uniqid(time()));

        if (!isset($array['remetente'])){
            $configs = $this->getConfiguracoes();
            $emailRem = $configs['remetente'];
            $nomeRem = 'Sistema TecnoPortas';
        }
        else{
            $emailRem = $array['remetente'][0];
            $nomeRem = $array['remetente'][1];
        }
        ini_set('default_charset','UTF-8');
		$headers = "MIME-Version: 1.0$br";
		$headers .= "From: $nomeRem <$emailRem>$br";
		$headers .= "Return-Path: $emailRem$br";
		$headers .= "Content-Type: multipart/mixed; boundary=\"$uid\"$br";
		$headers .= "$uid" . $br . "";
		$mensagem = "--$uid".$br;
		$mensagem .= "Content-Transfer-Encoding: 8bits$br";
		$mensagem .= "Content-Type: text/html; charset=\"UTF-8\"" . $br . "" . $br . "";
        $mensagem .= $array['mensagem'];
		$mensagem .= $br."--$uid".$br;
        if (isset($array['anexos'])){
            foreach($array['anexos'] as $nome => $anexo){
				$data = file_get_contents($anexo);
				$base64 = base64_encode($data);

				$f = finfo_open();
                $fileType = mime_content_type($anexo);

				$mensagem .= "Content-Type: ". $fileType .";".$br;
				$mensagem .= "Content-Disposition: attachment; filename=\"". $nome . "\"$br";
				$mensagem .= "Content-Transfer-Encoding: base64$br".$br;
				$mensagem .= "$base64"."$br";
				$mensagem .= "--$uid"."$br";
            }
        }

		$res = mail($array['destinatario'], $array['assunto'], $mensagem, $headers,"-r".$emailRem);
		if(!$res){
			$res = mail($array['destinatario'], $array['assunto'], $mensagem, $headers);
        }
        return $res;
    }

    public function apagaOrcs($tipo = null, $id = null){
        if(!empty($tipo) && !empty($id)){
            $orcamentos = null;
            if($tipo == "cliente"){
                $orcamentos = $this->connection->newQuery()
                ->select('orcamento_id')
                ->from('orcamento_pessoas')
                ->where('orcamento_pessoas.cliente_id = ' . $id)
                ->execute()
                ->fetchAll('assoc');
                $this->connection->delete('orcamento_pessoas', array('cliente_id' => $id));

            }else if($tipo == "serralheiro"){
                $orcamentos = $this->connection->newQuery()
                ->select('orcamento_id')
                ->from('orcamento_pessoas')
                ->where('orcamento_pessoas.serralheiro_id = ' . $id)
                ->execute()
                ->fetchAll('assoc');
                $this->connection->delete('orcamento_pessoas', array('serralheiro_id' => $id));
            }else if($tipo == "vendedor"){
                $orcamentos = $this->connection->newQuery()
                ->select('orcamento_id')
                ->from('orcamento_pessoas')
                ->where('orcamento_pessoas.serralheiro_id = ' . $id)
                ->execute()
                ->fetchAll('assoc');
                $this->connection->delete('orcamento_pessoas', array('serralheiro_id' => $id));
            }

            if (count($orcamentos) > 0) {
                foreach ($orcamentos as $index => $orcamento) {
                    $this->connection->delete('orcamentos', array('id' => $orcamento['orcamento_id']));
                    $this->connection->delete('orcamento_portao', array('orcamento_id' => $orcamento['orcamento_id']));
                }
            }

            if($tipo == "serralheiro" || $tipo == "vendedor"){
                $clientes = $this->connection->newQuery()
                ->select('*')
                ->from('serralheiro_clientes')
                ->where("serralheiro_id = $id")
                ->execute()
                ->fetchAll("assoc");

                if(count($clientes)>0){
                    foreach ($clientes as $key => $cliente) {
                        $this->apagaOrcs('cliente',$cliente['cliente_id']);
                    }
                }

                if($tipo == "serralheiro"){
                    $this->connection->delete('serralheiro_vendedores', array('serralheiro_id' => $id));
                }

            }

        }
        return false;
        exit;
    }
}
