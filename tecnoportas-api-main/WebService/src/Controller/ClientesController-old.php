<?php
namespace App\Controller;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ClientesController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user) {
            $this->redireciona('login');
        }
        $this->pageTitle = "Clientes";

        $this->pagRef[0] = "revendedores";
        $this->pagRef[1] = "clientes";
        $this->set('ref', $this->pagRef);
        $this->set('thisUser', $this->user);
    }
    public function index()
    {
        $condicao = null;
        $cidade = $this->request->getQuery('cid');
        $estado = $this->request->getQuery('est');

        if ($this->user[0]['acesso'] == 2) {
            if ($estado) {
                $condicao = 'pessoas.nivel = "CF" and serralheiro_vendedores.vendedor_id = ';
                $condicao .= $this->user[0]['pessoa_id'] . (!empty($serralheiro_id) ? ' and serralheiro_clientes.serralheiro_id = ' . $serralheiro_id : '');
                $condicao .= ' and uf = "' . $estado . '"';
                if ($cidade) {
                    $condicao .= ' and cidade = "' . $cidade . '"';
                }
            }

            $res = $this->connection->newQuery()
                ->select('serralheiro_clientes.cliente_id as id, pessoas.nome, pessoas.sobrenome, pessoas.tipo, email, ddd, telefones.numero, uf, cidade')
                ->from('serralheiro_clientes')
                ->join(
                    [
                        'table' => 'pessoas',
                        'type' => 'LEFT',
                        'conditions' => 'pessoas.id = serralheiro_clientes.cliente_id'
                    ]
                )
                ->join(
                    [
                        'table' => 'emails',
                        'type' => 'LEFT',
                        'conditions' => 'emails.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'telefones',
                        'type' => 'LEFT',
                        'conditions' => 'telefones.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'enderecos',
                        'type' => 'LEFT',
                        'conditions' => 'enderecos.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'serralheiro_vendedores',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro_vendedores.serralheiro_id = serralheiro_clientes.serralheiro_id'
                    ]
                );
            if ($condicao) {
                $res = $res->where($condicao);
            } else {
                $res = $res->where('pessoas.nivel = "CF" and serralheiro_vendedores.vendedor_id = ' . $this->user[0]['pessoa_id'] . (!empty($serralheiro_id) ? ' and serralheiro_clientes.serralheiro_id = ' . $serralheiro_id : ''));
            }
            $res = $res->order('nome')
                ->execute()
                ->fetchAll('assoc');
            $_SESSION['exporta'] = $res;

            $this->set('clientes', $res);
            $this->set('title', $this->pageTitle);

            $this->addTableClass();
        } else {

            $serralheiro_id = $this->request->getData('serralheiro_id');
            if (empty($serralheiro_id)) {
                $serralheiro_id = $this->request->getQuery('sid');
            }

            if ($estado) {
                
                $condicao = 'pessoas.nivel = "CF"' . (!empty($serralheiro_id) ? 'and serralheiro_clientes.serralheiro_id = '. $serralheiro_id : '');
                $condicao .= ' and uf = "' . $estado . '"';
                if ($cidade) {
                    $condicao .= " and cidade = '" . $cidade . "'";
                }
            }

            $res = $this->connection->newQuery()
                ->select('serralheiro_clientes.cliente_id as id, pessoas.nome, pessoas.sobrenome, pessoas.tipo, email, ddd, telefones.numero, uf, cidade')
                ->from('serralheiro_clientes')
                ->join(
                    [
                        'table' => 'pessoas',
                        'type' => 'LEFT',
                        'conditions' => 'pessoas.id = serralheiro_clientes.cliente_id'
                    ]
                )
                ->join(
                    [
                        'table' => 'emails',
                        'type' => 'LEFT',
                        'conditions' => 'emails.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'telefones',
                        'type' => 'LEFT',
                        'conditions' => 'telefones.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'enderecos',
                        'type' => 'LEFT',
                        'conditions' => 'enderecos.pessoa_id = pessoas.id'
                    ]
                    );
                if($condicao){
                    $res = $res->where($condicao);
                }else{
                    $res = $res->where('pessoas.nivel = "CF"' . (!empty($serralheiro_id) ? ' and serralheiro_clientes.serralheiro_id = ' . $serralheiro_id : ''));
                }
                $res = $res->order('nome')
                ->execute()
                ->fetchAll('assoc');
            $_SESSION['exporta'] = $res;

            if ($this->retorno == 'json') {
                echo json_encode($res);
                exit;
            } else {
                $this->set('clientes', $res);
                $this->set('title', $this->pageTitle);

                $this->addTableClass();
            }
        }
    }

    public function listaClientes()
    {
        require_once(ROOT . DS . 'vendor' . DS  . 'phpoffice' . DS . 'phpspreadsheet' . DS . 'src' . DS . 'PhpSpreadsheet' . DS . 'Spreadsheet.php');
        require_once(ROOT . DS . 'vendor' . DS  . 'phpoffice' . DS . 'phpspreadsheet' . DS . 'src' . DS . 'PhpSpreadsheet' . DS . 'Writer' . DS . 'Xlsx.php');
        $this->autoRender = false;
        /*$res = $this->connection->newQuery()
        ->select('serralheiro_clientes.cliente_id as id, pessoas.nome, pessoas.sobrenome, pessoas.tipo, email, ddd, telefones.numero, uf, cidade')
        ->from('serralheiro_clientes')
        ->join(
            [
                'table' => 'pessoas',
                'type' => 'LEFT',
                'conditions' => 'pessoas.id = serralheiro_clientes.cliente_id'
            ]
        )
        ->join(
            [
                'table' => 'emails',
                'type' => 'LEFT',
                'conditions' => 'emails.pessoa_id = pessoas.id'
            ]
        )
        ->join(
            [
                'table' => 'telefones',
                'type' => 'LEFT',
                'conditions' => 'telefones.pessoa_id = pessoas.id'
            ]
        )
        ->join(
            [
                'table' => 'enderecos',
                'type' => 'LEFT',
                'conditions' => 'enderecos.pessoa_id = pessoas.id'
            ]
        )
        ->where('pessoas.nivel = "CF"'.(!empty($serralheiro_id) ? ' and serralheiro_clientes.serralheiro_id = '.$serralheiro_id : ''))
        ->order('nome')
        ->execute()
        ->fetchAll('assoc');
        */
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Clientes');
        $i = 2;
        $res = $_SESSION['exporta'];
        foreach ($res as $key) {
            $sheet->setCellValue('A1', 'Nome');
            $sheet->setCellValue('A' . $i, $key['nome'] . ' ' . $key['sobrenome']);
            $sheet->setCellValue('B1', 'Tipo');
            $sheet->setCellValue('B' . $i, $key['tipo'] == 'F' ? 'Pessoa Física' : 'Pessoa Jurídica');
            $sheet->setCellValue('C1', 'E-mail');
            $sheet->setCellValue('C' . $i, $key['email']);
            $sheet->setCellValue('D1', 'Telefone');
            $sheet->setCellValue('D' . $i, '(' . $key['ddd'] . ') ' . $key['numero']);
            $sheet->setCellValue('E1', 'Localização');
            $sheet->setCellValue('E' . $i, $key['cidade'] . ' - ' . $key['uf']);
            $i++;
        }

        // OUTPUT
        $writer = new Xlsx($spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="lista_clientes.xlsx"');
        header('Cache-Control: max-age=0');
        header('Expires: Fri, 11 Jan 2011 11:11:11 GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Cache-Control: cache, must-revalidate');
        header('Pragma: public');
        $writer->save('php://output');
    }

    public function ver()
    {
        $cliente_id = $this->request->getData('cliente_id');
        if (empty($cliente_id)) {
            $cliente_id = $this->request->getQuery('cid');
        }

        if (!empty($cliente_id)) {
            $res = $this->connection->newQuery()
                ->select('pessoas.id, pessoas.nome, pessoas.sobrenome, pessoas.tipo, email, ddd, telefones.numero, uf, cidade, serralheiro.nome as se_nome, serralheiro.sobrenome as se_sobrenome')
                ->from('serralheiro_clientes')
                ->join(
                    [
                        'table' => 'pessoas',
                        'type' => 'LEFT',
                        'conditions' => 'pessoas.id = serralheiro_clientes.cliente_id'
                    ]
                )
                ->join(
                    [
                        'table' => 'emails',
                        'type' => 'LEFT',
                        'conditions' => 'emails.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'telefones',
                        'type' => 'LEFT',
                        'conditions' => 'telefones.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'enderecos',
                        'type' => 'LEFT',
                        'conditions' => 'enderecos.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'pessoas as serralheiro',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro.id = serralheiro_clientes.serralheiro_id'
                    ]
                )
                ->where('pessoas.id = ' . $cliente_id)
                ->execute()
                ->fetchAll('assoc');

            $pessoa_id = $res[0]['id'];

            $orca = $this->connection->newQuery()
                ->select('orcamentos.id, dt_cadastro, valor_total, status')
                ->from('orcamento_pessoas')
                ->join(
                    [
                        'table' => 'orcamentos',
                        'type' => 'LEFT',
                        'conditions' => 'orcamentos.id = orcamento_pessoas.orcamento_id'
                    ]
                )
                ->where('orcamento_pessoas.cliente_id = ' . $pessoa_id)
                ->execute()
                ->fetchAll('assoc');

            if ($this->retorno == 'json') {
                echo json_encode(array('cliente' => $res[0], 'orcamentos' => $orca));
                exit;
            } else {
                $this->pageTitle = "Detalhes do Cliente " . $res[0]['id'];
                $this->set('cliente', $res[0]);
                $this->set('orcamentos', $orca);
                $this->set('title', $this->pageTitle);

                $this->addTableClass();
            }
        } else {
            $this->redireciona('clientes');
        }
    }
    public function novo()
    {
        $serralheiro_id = $this->request->getData('serralheiro_id');
        $cli = $this->request->getData('cli');
        $end = $this->request->getData('end');

        if (!empty($cli) && !empty($end) && !empty($serralheiro_id)) {

            $ckEmail = $this->checaEmail($cli['email']);
            if ($ckEmail) {
                $this->setError(4);
            } else {
                $cliente_id = $this->addCliente($cli, $end, $serralheiro_id);
                if ($this->retorno == 'json') {
                    echo json_encode(array('cliente_id' => $cliente_id));
                    exit;
                } else {
                    $this->redireciona('location: ../clientes');
                }
            }
        } else {
            $this->setError(3);
        }
        $this->pageTitle = "Novo Cliente Final";
        $this->set('title', $this->pageTitle);
    }
    public function editar()
    {
        $cliente_id = $this->request->getData('cliente_id');
        $cli = $this->request->getData('cli');
        $end = $this->request->getData('end');

        if (!empty($cliente_id) && !empty($cli) && !empty($end)) {

            $ckEmail = $this->checaEmail($cli['email']);
            if ($ckEmail) {
                $this->setError(4);
            } else {

                $this->editCliente($cliente_id, $cli, $end);
                if ($this->retorno == 'json') {
                    echo json_encode(array('cliente_id' => $cliente_id, 'cli' => $cli, 'end' => $end));
                    exit;
                } else {
                    $this->redireciona('location: ../clientes');
                }
            }
        } else {
            $this->setError(3);
        }
        $this->pageTitle = "Editar Cliente Final";
        $this->set('title', $this->pageTitle);
    }

    public function excluir()
    {
        $this->autoRender = false;
        $cliente_id = $this->request->getData('id');
        if (empty($cliente_id)) {
            $cliente_id = $this->request->getQuery('uid');
        }

        $orcamento = $this->connection->newQuery()
            ->select('orcamento_id')
            ->from('orcamento_pessoas')
            ->where('orcamento_pessoas.cliente_id = ' . $cliente_id)
            ->execute()
            ->fetchAll('assoc');

        if (count($orcamento) > 0) {
            $this->setError(0, 'Usuário possui orçamentos, não é possível excluir');
        } else {
            $this->connection->delete('pessoas', array('id' => $cliente_id));
            $this->connection->delete('emails', array('pessoa_id' => $cliente_id));

            if ($this->retorno == 'json') {
                echo json_encode(['deleta' => true]);
                exit;
            }
        }

        $this->redireciona('clientes');
    }
}
