<?php
namespace App\View\Helper;

use Cake\View\Helper;

class LayoutHelper extends Helper
{
    public function getByAtt($att, $valor, $data){
        foreach ($data as $dt){
            if ($dt[$att] == $valor){
                return $dt;
            }
        }
        return null;
    }
    public function getLink($page){
        return "http://apptecnoportas.com.br/".$page;
    }
    public function getStyles($array){
        $res = "";
        for ($i = 0; $i < count($array); $i++){ 
            $res .= '<link href="'.$array[$i].'" rel="stylesheet" />';
        }
        return $res;
    }
    public function getScripts($array){
        $res = "";
        for ($i = 0; $i < count($array); $i++){ 
            $res .= '<script type="text/javascript" language="javascript" src="'.$array[$i].'" charset="UTF-8"></script>';
        }
        return $res;
    }
    public function isActive($pag, $ref, $isSubMenu = false){
        $att = $isSubMenu ? ' class="active"' : ' nav-active';
        return $ref[0] == $pag ? $att : (isset($ref[1]) ? ($ref[1] == $pag ? $att : '') : '');
    }    
    public function isLink($link, $texto = false){
        $file_headers = @get_headers($link);
        if(!$file_headers || $file_headers[0] == 'HTTP/1.1 404 Not Found') {
            if ($texto === false){
                return false;
            }
            else{
                return $texto;
            }
        }
        if ($texto === false){
            return true;
        }
        else{
            return "<a href='".$link."'>".$texto."</a>";
        }
    }
}