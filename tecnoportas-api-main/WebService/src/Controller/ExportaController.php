<?php
namespace App\Controller;

class ExportaController extends AppController
{

    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Exportar";
        $this->pagRef[0] = "exportar";
        $this->set('thisUser', $this->user);
        $this->set('ref', $this->pagRef);
        $this->set('title', $this->pageTitle);
    }

    public function index(){
        
    }

    public function exportar(){        
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
        $database = 'apptecnoportas';
        $user = 'apptecnoportas';
        $pass = 'Tecnoportas@10';
        $host = 'apptecnoportas.mysql.dbaas.com.br';
        $dir = dirname(__FILE__) . '/dump.sql';
        exec("mysqldump --user={$user} --password={$pass} --host={$host} {$database} --result-file={$dir} 2>&1");
        $this->autoRender = false;
        header('Content-Type: text/x-sql');
        header('Content-Disposition: attachment; filename=dump.sql');
        header('Pragma: no-cache');
        readfile($dir);
        unlink($dir) or die("Couldn't delete file");
        exit;
    }
}
