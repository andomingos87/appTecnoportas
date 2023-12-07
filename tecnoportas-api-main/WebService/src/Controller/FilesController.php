<?php
namespace App\Controller;

class FilesController extends AppController
{
    public function initialize()
    {
        parent::initialize();
    }
    public function index(){
        $fileName = $this->request->getQuery('name');

        $origemPath = '../data_uploads/';
        $pathFinal = $origemPath.$fileName;

        $file = fopen($pathFinal, 'r');        
        $dados = fread($file, filesize($pathFinal));
        fclose($file);
        
        header("content-type: ".mime_content_type($pathFinal));

        echo $dados;
        exit;
    }
}