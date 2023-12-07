<?php
namespace App\Controller;

class LogoutController extends AppController
{    
    public function initialize()
    {
        parent::initialize();
    }
    public function index(){
        $this->logout();
        $this->redireciona('login');
    }
}