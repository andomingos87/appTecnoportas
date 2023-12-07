<?php
namespace App\Controller;

class GarantiaPdfController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user){
            $this->redireciona('login');
        }elseif($this->user[0]['acesso'] != 1){
            $this->redireciona('orcamentos');
        }
        $this->pageTitle = "Garantia PDF";

        $this->pagRef[0] = "ajustes";
        $this->pagRef[1] = "garantia pdf";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index(){
        $this->set('title', $this->pageTitle);

        $configs = $this->getConfiguracoes();
        $edit = $this->request->getQuery('edit');

        if(!empty($edit)){
            $valorPdf = $this->request->getData('content');

            $configs['termos_garantia_pdf'] = $valorPdf;

            $this->setConfiguracoes($configs);

        }


        $this->set('configs', $configs);
    }
}
