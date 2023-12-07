<?php
namespace App\Controller;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class SerralheirosController  extends AppController
{
    public function initialize()
    {
        parent::initialize();

        if (!$this->user) {
            $this->redireciona('login');
        }
        $this->pageTitle = "Revendedores";
        $this->pagRef[0] = "revendedores";
        $this->pagRef[1] = "lista de revendedores";
        $this->set('thisUser', $this->user);
        $this->set('ref', $this->pagRef);
    }
    public function index()
    {
        $condicao = null;
        $recusados = $this->request->getQuery('recusados');

        $this->pageTitle = $recusados ? "Revendedores Recusados" : "Revendedores Ativos";
        $this->pagRef[1] = $recusados ? "lista de revendedores recusados" : "lista de revendedores";
        $this->set('ref', $this->pagRef);
        $this->set('recusado', $recusados ? true : false);

        $cidade = $this->request->getQuery('cid');
        $estado = $this->request->getQuery('est');

        if ($this->user[0]['acesso'] == 2) {
            if ($estado) {
                $condicao = 'pessoas.nivel = "SE" and serralheiro_vendedores.vendedor_id =' . $this->user[0]['pessoa_id'] . ' and uf = "' . $estado . '"';
                if ($cidade) {
                    $condicao .= " and cidade = '" . $cidade . "'";
                }
            }

            if($condicao){
                $condicao .= $recusados ? " and ( usuarios.preCad = 1 and usuarios.recusado > 0 OR (aparelhos.is_aprovado = 0 and usuarios.dt_atualizado < '2019-12-16' and usuarios.recusado > 0 ) ) " : " and ( usuarios.preCad = '0' and usuarios.aprovado = '1' and (usuarios.acesso = 0 || usuarios.acesso = 9)) ";
            }else{
                $condicao = $recusados ? " usuarios.preCad = 1 and usuarios.recusado > 0 OR (aparelhos.is_aprovado = 0 and usuarios.dt_atualizado < '2019-12-16' and usuarios.recusado > 0 ) " : "usuarios.preCad = '0' and usuarios.aprovado = '1' and (usuarios.acesso = 0 || usuarios.acesso = 9)";
            }

            $res = $this->connection->newQuery()
                ->select("aparelhos.is_aprovado,aparelhos.id as apId, enderecos.uf, enderecos.cidade, pessoas.id, pessoas.nome, pessoas.sobrenome, pessoas.dt_cadastro, email, ddd, telefones.numero, cidade, uf, usuarios.id as user_id, usuarios.acesso as acesso, contato.nome as ct_nome, contato.sobrenome as ct_snome,pessoas.tipo, SUM(orcamentos.valor_total) as total_orcamentos")
                ->from('pessoas')
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
                        'table' => 'usuarios',
                        'type' => 'LEFT',
                        'conditions' => 'usuarios.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'aparelhos',
                        'type' => 'LEFT',
                        'conditions' => 'aparelhos.usuario_id = usuarios.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'serralheiro_contato',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro_contato.serralheiro_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'pessoas as contato',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro_contato.contato_id = contato.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'serralheiro_vendedores',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro_vendedores.serralheiro_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'orcamento_pessoas',
                        'type' => 'LEFT',
                        'conditions' => 'orcamento_pessoas.serralheiro_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'orcamentos',
                        'type' => 'LEFT',
                        'conditions' => 'orcamento_pessoas.orcamento_id = orcamentos.id'
                    ]
                )
                ->where('usuarios.active = 1');
            if ($condicao) {
                $res = $res->andWhere($condicao);
            } else {
                $res = $res->andWhere('pessoas.nivel = "SE" and serralheiro_vendedores.vendedor_id =' . $this->user[0]['pessoa_id']);
            }


            $res = $res->execute()
                ->fetchAll("assoc");
            $_SESSION['exporta'] = $res;

            for ($i = 0; $i < count($res); $i++) {
                $resu = $this->connection->newQuery()
                    ->select("count(orcamento_id) as n_orcs")
                    ->from("orcamento_pessoas")
                    ->where("serralheiro_id = " . $res[$i]["id"])
                    ->execute()
                    ->fetchAll('assoc');

                $res[$i]['n_orcs'] = $resu[0]['n_orcs'];
            }
            $this->set('serralheiros', $res);
            $this->set('title', $this->pageTitle);

            $this->addTableClass();
        } else {
            if ($estado) {
                $condicao = "pessoas.nivel = 'SE' and uf = '" . $estado . "'";
                if ($cidade) {
                    $condicao .= " and cidade = '" . $cidade . "'";
                }
            }

            if($condicao){
                $condicao .= $recusados ? " and ( usuarios.preCad = 1 and usuarios.recusado > 0 OR (aparelhos.is_aprovado = 0 and usuarios.dt_atualizado < '2019-12-16' and usuarios.recusado > 0 ) ) " : " and ( usuarios.preCad = '0' and usuarios.aprovado = '1' and (usuarios.acesso = 0 || usuarios.acesso = 9)) ";
            }else{
                $condicao = $recusados ? " usuarios.preCad = 1 and usuarios.recusado > 0 OR (aparelhos.is_aprovado = 0 and usuarios.dt_atualizado < '2019-12-16' and usuarios.recusado > 0 ) " : "usuarios.preCad = '0' and usuarios.aprovado = '1' and (usuarios.acesso = 0 || usuarios.acesso = 9)";
            }

            $res = $this->connection->newQuery()
                ->select("aparelhos.is_aprovado, aparelhos.id as apId, pessoas.id, pessoas.nome, pessoas.sobrenome, pessoas.dt_cadastro, email, ddd, telefones.numero, cidade, uf, usuarios.id as user_id, usuarios.acesso as acesso, contato.nome as ct_nome, contato.sobrenome as ct_snome,pessoas.tipo, SUM(orcamentos.valor_total) as valor_total, MAX(orcamentos.dt_cadastro) as dt_ultimo_orcamento")
                ->from('pessoas')
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
                        'table' => 'usuarios',
                        'type' => 'LEFT',
                        'conditions' => 'usuarios.pessoa_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'aparelhos',
                        'type' => 'LEFT',
                        'conditions' => 'aparelhos.usuario_id = usuarios.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'orcamento_pessoas',
                        'type' => 'LEFT',
                        'conditions' => 'orcamento_pessoas.serralheiro_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'orcamentos',
                        'type' => 'LEFT',
                        'conditions' => 'orcamento_pessoas.orcamento_id = orcamentos.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'serralheiro_contato',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro_contato.serralheiro_id = pessoas.id'
                    ]
                )
                ->join(
                    [
                        'table' => 'pessoas as contato',
                        'type' => 'LEFT',
                        'conditions' => 'serralheiro_contato.contato_id = contato.id'
                    ]
                )
                ->where('usuarios.active = 1')
                ->group(
                    [
                        'aparelhos.is_aprovado',
                        'aparelhos.id',
                        'pessoas.id',
                        'emails.email',
                        'telefones.ddd',
                        'telefones.numero',
                        'enderecos.cidade',
                        'enderecos.uf',
                        'usuarios.id',
                        'contato.nome',
                        'contato.sobrenome'
                    ]);

            if ($condicao) {
                $res = $res->andWhere($condicao);
            } else {
                $res = $res->andWhere('pessoas.nivel = "SE"');
            }
            $res = $res->execute()
                ->fetchAll("assoc");
            $_SESSION['exporta'] = $res;

            // for ($i = 0; $i < count($res); $i++) {
            //     $resu = $this->connection->newQuery()
            //         ->select("count(orcamento_id) as n_orcs")
            //         ->from("orcamento_pessoas")
            //         ->where("serralheiro_id = " . $res[$i]["id"])
            //         ->execute()
            //         ->fetchAll('assoc');

            //     $res[$i]['n_orcs'] = $resu[0]['n_orcs'];
            // }

            if ($this->retorno == 'json') {
                echo json_encode($res);
                exit;
            } else {
                $this->set('serralheiros', $res);
                $this->set('title', $this->pageTitle);

                $this->addTableClass();
            }
        }
    }
    public function listaRevendedores()
    {
        require_once(ROOT . DS . 'vendor' . DS  . 'phpoffice' . DS . 'phpspreadsheet' . DS . 'src' . DS . 'PhpSpreadsheet' . DS . 'Spreadsheet.php');
        require_once(ROOT . DS . 'vendor' . DS  . 'phpoffice' . DS . 'phpspreadsheet' . DS . 'src' . DS . 'PhpSpreadsheet' . DS . 'Writer' . DS . 'Xlsx.php');
        $this->autoRender = false;
        /* $res = $this->connection->newQuery()
        ->select("pessoas.id, nome, sobrenome, email, ddd, telefones.numero, cidade, uf, usuarios.id as user_id, usuarios.acesso as acesso")
        ->from('pessoas')
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
                'table' => 'usuarios',
                'type' => 'LEFT',
                'conditions' => 'usuarios.pessoa_id = pessoas.id'
            ]
        )
        ->where('pessoas.nivel = "SE"')
        ->execute()
        ->fetchAll('assoc');
        */
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Revendedores');
        $i = 2;
        $res = $_SESSION['exporta'];
        foreach ($res as $key) {
            $sheet->setCellValue('A1', 'Nome');
            $sheet->setCellValue('A' . $i, $key['nome']);
            $sheet->setCellValue('B1', 'E-mail');
            $sheet->setCellValue('B' . $i, $key['email']);
            $sheet->setCellValue('C1', 'Telefone');
            $sheet->setCellValue('C' . $i, '(' . $key['ddd'] . ') ' . $key['numero']);
            $sheet->setCellValue('D1', 'Localização');
            $sheet->setCellValue('D' . $i, $key['cidade'] . ' - ' . $key['uf']);
            $sheet->setCellValue('E1', 'Status');
            $sheet->setCellValue('E' . $i, $key['acesso'] == 9  ? 'Desativado' : ($key['acesso'] == 0 ? 'Ativo' : 'Desconhecido'));

            $i++;
        }

        // OUTPUT
        $writer = new Xlsx($spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="lista_revendedores.xlsx"');
        header('Cache-Control: max-age=0');
        header('Expires: Fri, 11 Nov 2011 11:11:11 GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Cache-Control: cache, must-revalidate');
        header('Pragma: public');
        $writer->save('php://output');
    }

    public function novo()
    {
        $serralheiro = $this->request->getData('serralheiro');
        $pessoa = $this->request->getData('pessoa');
        $end = $this->request->getData('end');

        if (!empty($serralheiro) && !empty($pessoa) && !empty($end)) {

            $ckUser = $this->checaUser($serralheiro['username']);
            if ($ckUser) {
                $this->setError(0, "Já existe um usuário cadastrado com esse username", false, true);
                $this->redireciona('serralheiros/novo');
            }

            $ckEmail = $this->checaEmail($serralheiro['email']);
            if ($ckEmail) {
                $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!", false, true);
                $this->redireciona('serralheiros/novo');
            }

            $img = $this->upload($pessoa['foto'], array('gif', 'jpg', 'png', 'jpeg', 'svg'));

            $arrayPessoa = array(
                'nome' => $pessoa['nome'],
                'sobrenome' => $pessoa['sobrenome'],
                'tipo' => $pessoa['tipo'],
                'nivel' => 'SE',
                'cnpj' => $pessoa['cnpj'],
                'ie' => $pessoa['ie'],
                'ip_cadastro' => $this->userIP()
            );

            if (!isset($img['error'])) {
                $arrayPessoa['foto'] = $img;
            }

            $res = $this->connection->insert('pessoas', $arrayPessoa);
            $pessoa_id = $res->lastInsertId('pessoas');

            $arrayEmail = array(
                'email' => $serralheiro['email'],
                'pessoa_id' => $pessoa_id,
                'ip_atualizado' => $this->userIP()
            );
            $this->connection->insert('emails', $arrayEmail);

            $tele = [null, null];
            if (!empty($serralheiro['telefone'])) {
                $tele = $this->configTel($serralheiro['telefone']);
            }

            if ($tele[0] !== null) {
                $arrayTel = array(
                    'ddd' => $tele[0],
                    'numero' => $tele[1],
                    'pessoa_id' => $pessoa_id,
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('telefones', $arrayTel);
            } else {
                $arrayTel = array(
                    'ddd' => '',
                    'numero' => '',
                    'pessoa_id' => $pessoa_id,
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('telefones', $arrayTel);
            }

            if (!empty($end['cidade']) && !empty($end['uf'])) {
                $arrayEnd = array(
                    'pessoa_id' => $pessoa_id,
                    'cep' => $end['cep'],
                    'logradouro' => $end['logradouro'],
                    'numero' => $end['numero'],
                    'complemento' => $end['complemento'],
                    'bairro' => $end['bairro'],
                    'cidade' => $end['cidade'],
                    'uf' => $end['uf'],
                    'ip_atualizado' => $this->userIP()
                );
                $this->connection->insert('enderecos', $arrayEnd);
            }

            $this->connection->insert('serralheiro_vendedores', array('serralheiro_id' => $pessoa_id, 'vendedor_id' => $serralheiro['vendedor']));

            $arrayContato = array(
                'nome' => $serralheiro['nome'],
                'sobrenome' => $serralheiro['sobrenome'],
                'tipo' => "F",
                'nivel' => 'CT',
                'ip_cadastro' => $this->userIP()
            );

            $res = $this->connection->insert('pessoas', $arrayContato);
            $contato_id = $res->lastInsertId('pessoas');

            $this->connection->insert('serralheiro_contato', array('serralheiro_id' => $pessoa_id, 'contato_id' => $contato_id));

            $arrayUser = array(
                'pessoa_id' => $pessoa_id,
                'username' => $serralheiro['username'],
                'desconto_max' => isset($serralheiro['desconto_max']) ? $serralheiro['desconto_max'] : 0,
                'acrecimo_max' => $serralheiro['acrecimo_max'],
                'desconto_aut' => $serralheiro['desconto_aut'],
                'desconto_seletivo' => isset($serralheiro['desconto_seletivo']) ? $serralheiro['desconto_seletivo'] : 0,
                'desconto_ptr' => $serralheiro['desconto_ptr'],
                'desconto_opc' => $serralheiro['desconto_opc'],
                'desconto_mto' => $serralheiro['desconto_mto'],
                'desconto_ent' => $serralheiro['desconto_ent'],
                'desconto_prf' => $serralheiro['desconto_prf'],
                'desconto_tst' => $serralheiro['desconto_tst'],
                'senha' => md5($serralheiro['senha']),
                'ip_atualizado' => $this->userIP()
            );
            $this->connection->insert('usuarios', $arrayUser);

            if ($this->retorno == 'json') {
                echo json_encode(array('serralheiro_id' => $pessoa_id));
                exit;
            } else {
                $this->setMessage('success', 'Revendedor adicionado com sucesso!', true);
                $this->redireciona('serralheiros');
            }
        } else {
            $res = $this->connection->newQuery()
                ->select("pessoas.id, nome, sobrenome")
                ->from('pessoas')
                ->where('pessoas.nivel = "VE"')
                ->execute()
                ->fetchAll("assoc");

            $this->set('vendedores', $res);
        }

        $this->pageTitle = "Novo Revendedor";
        $this->set('title', $this->pageTitle);
        $this->pagRef[1] = "novo revendedor";
        $this->set('ref', $this->pagRef);

        $this->addFormsClass();
    }
    public function editar()
    {
        $serralheiro_id = $this->request->getQuery('sid');

        if (!empty($serralheiro_id)) {
            $res = $this->connection->newQuery()
                ->select('pessoas.id,emails.email')
                ->from('pessoas')
                ->join(
                    [
                        'table' => 'emails',
                        'type' => 'LEFT',
                        'conditions' => 'emails.pessoa_id = ' . $serralheiro_id
                    ]
                )
                ->where('pessoas.id = ' . $serralheiro_id)
                ->execute()
                ->fetchAll('assoc');

            if (count($res) > 0) {
                $serralheiro = $this->request->getData('serralheiro');
                $pessoa = $this->request->getData('pessoa');
                $end = $this->request->getData('end');

                if (!empty($serralheiro) && !empty($pessoa) && !empty($end)) {

                    if (isset($serralheiro['username'])) {
                        $ckUser = $this->checaUser($serralheiro['username']);
                        if ($ckUser) {
                            $this->setError(0, "Já existe um usuário cadastrado com esse username", false, true);
                            $this->redireciona('serralheiros/editar?sid=' . $serralheiro_id);
                        }
                    }
                    if ($res[0]['email'] != $serralheiro['email']) {
                        $ckEmail = $this->checaEmail($serralheiro['email']);
                        if ($ckEmail) {
                            $this->setError(0, "Já existe um usuário cadastrado com esse e-mail!!", false, true);
                            $this->redireciona('serralheiros/editar?sid=' . $serralheiro_id);
                        }
                    }


                    $arrayPessoa = array(
                        'nome' => $pessoa['nome'],
                        'sobrenome' => $pessoa['sobrenome'],
                        'cnpj' => $pessoa['cnpj'],
                        'ie' => $pessoa['ie'],
                        'tipo' => $pessoa['tipo']
                    );

                    $isImg = !empty($pessoa['foto']);
                    if ($isImg) {
                        $isImg = !empty($pessoa['foto']['name']);
                        if (!$isImg) {
                            unset($pessoa['foto']);
                        }
                    }
                    $img_ant = null;

                    if ($isImg) {
                        $res = $this->connection->newQuery()
                            ->select('foto')
                            ->from('pessoas')
                            ->where('id = ' . $serralheiro_id)
                            ->execute()
                            ->fetchAll('assoc');

                        $img_ant = $res[0]['foto'];

                        $img = $this->upload($pessoa['foto'], array('gif', 'jpg', 'png', 'jpeg', 'svg'), $img_ant);

                        if (!isset($img['error'])) {
                            $arrayPessoa['foto'] = $img;
                        }
                    }

                    $res = $this->connection->update('pessoas', $arrayPessoa, ['id' => $serralheiro_id]);

                    $arrayEmail = array(
                        'email' => $serralheiro['email'],
                        'ip_atualizado' => $this->userIP()
                    );
                    $this->connection->update('emails', $arrayEmail, ['pessoa_id' => $serralheiro_id]);

                    $tele = [null, null];
                    if (!empty($serralheiro['telefone'])) {
                        $tele = $this->configTel($serralheiro['telefone']);
                    }

                    if ($tele[0] !== null) {
                        $arrayTel = array(
                            'ddd' => $tele[0],
                            'numero' => $tele[1],
                            'pessoa_id' => $serralheiro_id,
                            'ip_atualizado' => $this->userIP()
                        );
                        $this->connection->update('telefones', $arrayTel, ['pessoa_id' => $serralheiro_id]);
                    }

                    if (!empty($end['cidade']) && !empty($end['uf'])) {
                        $arrayEnd = array(
                            'cep' => $end['cep'],
                            'logradouro' => $end['logradouro'],
                            'numero' => $end['numero'],
                            'complemento' => $end['complemento'],
                            'bairro' => $end['bairro'],
                            'cidade' => $end['cidade'],
                            'uf' => $end['uf'],
                            'ip_atualizado' => $this->userIP()
                        );
                        $this->connection->update('enderecos', $arrayEnd, ['pessoa_id' => $serralheiro_id]);
                    }

                    $ve_dds = $this->connection->newQuery()
                        ->select('vendedor_id')
                        ->from('serralheiro_vendedores')
                        ->where('serralheiro_id = ' . $serralheiro_id)
                        ->execute()
                        ->fetchAll('assoc');

                    if (count($ve_dds)) {
                        $this->connection->update('serralheiro_vendedores', array('vendedor_id' => $serralheiro['vendedor']), array('serralheiro_id' => $serralheiro_id));
                    } else {
                        $this->connection->insert('serralheiro_vendedores', array('serralheiro_id' => $serralheiro_id, 'vendedor_id' => $serralheiro['vendedor']));
                    }

                    $arrayContato = array(
                        'nome' => $serralheiro['nome'],
                        'sobrenome' => $serralheiro['sobrenome']
                    );

                    $res = $this->connection->newQuery()
                        ->select("contato_id")
                        ->from('serralheiro_contato')
                        ->where('serralheiro_id = ' . $serralheiro_id)
                        ->execute()
                        ->fetchAll('assoc');

                    if (count($res) > 0) {
                        $this->connection->update('pessoas', $arrayContato, array('id' => $res[0]['contato_id']));
                    } else {
                        $arrayContato["tipo"] = "F";
                        $arrayContato["nivel"] = "CT";
                        $arrayContato["ip_cadastro"] = $this->userIP();

                        $res = $this->connection->insert('pessoas', $arrayContato);
                        $contato_id = $res->lastInsertId('pessoas');

                        $this->connection->insert('serralheiro_contato', array('serralheiro_id' => $serralheiro_id, 'contato_id' => $contato_id));
                    }

                    $arrayUser = array(
                        'desconto_max' => isset($serralheiro['desconto_max']) ? $serralheiro['desconto_max'] : 0,
                        'acrecimo_max' => $serralheiro['acrecimo_max'],
                        'desconto_aut' => $serralheiro['desconto_aut'],
                        'desconto_ptr' => $serralheiro['desconto_ptr'],
                        'desconto_opc' => $serralheiro['desconto_opc'],
                        'desconto_mto' => $serralheiro['desconto_mto'],
                        'desconto_ent' => $serralheiro['desconto_ent'],
                        'desconto_prf' => $serralheiro['desconto_prf'],
                        'desconto_tst' => $serralheiro['desconto_tst'],
                        'desconto_seletivo' => isset($serralheiro['desconto_seletivo']) ? $serralheiro['desconto_seletivo'] : 0,
                        'ip_atualizado' => $this->userIP()
                    );
                    if (!empty($serralheiro['senha'])) {
                        $arrayUser['senha'] = md5($serralheiro['senha']);
                    }
                    $this->connection->update('usuarios', $arrayUser, ['pessoa_id' => $serralheiro_id]);
                    if ($this->retorno == 'json') {
                        echo json_encode(array('serralheiro_id' => $serralheiro_id));
                        exit;
                    } else {
                        $this->setMessage('success', 'Revendedor ('.$serralheiro_id.') editado com sucesso!', true);
                        $this->redireciona('serralheiros');
                    }
                } else {
                    $res = $this->connection->newQuery()
                        ->select('pessoas.nome, pessoas.sobrenome, pessoas.foto, pessoas.tipo, desconto_max, acrecimo_max, username, pessoas.cnpj, pessoas.ie, emails.email, ddd, telefones.numero as tel_num, cep, logradouro, enderecos.numero, complemento, cidade, uf, bairro, username, vendedor_id, contato.nome as ct_nome, contato.sobrenome as ct_snome, desconto_seletivo, desconto_aut, desconto_ptr, desconto_opc, desconto_mto, desconto_ent, desconto_prf, desconto_tst ')
                        ->from('pessoas')
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
                                'table' => 'usuarios',
                                'type' => 'LEFT',
                                'conditions' => 'usuarios.pessoa_id = pessoas.id'
                            ]
                        )
                        ->join(
                            [
                                'table' => 'serralheiro_vendedores',
                                'type' => 'LEFT',
                                'conditions' => 'serralheiro_vendedores.serralheiro_id = pessoas.id'
                            ]
                        )
                        ->join(
                            [
                                'table' => 'serralheiro_contato',
                                'type' => 'LEFT',
                                'conditions' => 'serralheiro_contato.serralheiro_id = pessoas.id'
                            ]
                        )
                        ->join(
                            [
                                'table' => 'pessoas as contato',
                                'type' => 'LEFT',
                                'conditions' => 'serralheiro_contato.contato_id = contato.id'
                            ]
                        )
                        ->where('pessoas.id = ' . $serralheiro_id)
                        ->execute()
                        ->fetchAll('assoc');

                    $ved = $this->connection->newQuery()
                        ->select("pessoas.id, nome, sobrenome")
                        ->from('pessoas')
                        ->where('pessoas.nivel = "VE"')
                        ->execute()
                        ->fetchAll("assoc");

                    $this->set('vendedores', $ved);
                    $this->set('serralheiro', $res[0]);
                }
                $this->pageTitle = "Editar Revendedor " . $serralheiro_id;
                $this->set('title', $this->pageTitle);
                $this->pagRef[1] = "editar revendedor";
                $this->set('ref', $this->pagRef);

                $this->addFormsClass();
            } else {
                $this->setMessage('danger', 'Revendedor não encontrado!', true);
                $this->redireciona('serralheiros');
            }
        } else {
            $this->redireciona('serralheiros');
        }
    }

    public function deleta()
    {
        $serralheiro_id = $this->request->getQuery('sid');

        $res = $this->connection->newQuery()
            ->select('id')
            ->from('pessoas')
            ->where('id = ' . $serralheiro_id . ' and nivel = "SE"')
            ->execute()
            ->fetchAll();

        if (count($res) > 0) {

            $this->apagaOrcs("serralheiros", $serralheiro_id);

                $res = $this->connection->newQuery()
                    ->select('contato_id, cliente_id')
                    ->from("pessoas")
                    ->join(
                        [
                            'table' => 'serralheiro_contato',
                            'type' => 'LEFT',
                            'conditions' => 'serralheiro_contato.serralheiro_id = pessoas.id'
                        ]
                    )
                    ->join(
                        [
                            'table' => 'serralheiro_clientes',
                            'type' => 'LEFT',
                            'conditions' => 'serralheiro_clientes.serralheiro_id = pessoas.id'
                        ]
                    )
                    ->where('pessoas.id = ' . $serralheiro_id)
                    ->execute()
                    ->fetchAll('assoc');

                foreach ($res as $dd) {
                    if (!empty($dd["contato_id"])) {
                        $this->connection->delete('pessoas', array('id' => $dd["contato_id"]));
                    }
                    if (!empty($dd["cliente_id"])) {
                        $this->connection->delete('pessoas', array('id' => $dd["cliente_id"]));
                    }
                }

                $this->connection->delete('pessoas', array('id' => $serralheiro_id));

            $this->redireciona('serralheiros');
        } else {
            $this->setMessage('danger', 'Revendedor não encontrado', true);
            $this->redireciona('serralheiros');
        }
    }

    public function desativa()
    {
        $serralheiro_id = $this->request->getQuery('sid');
        $res = $this->connection->update('usuarios', ['acesso' => '9'], ['id' => $serralheiro_id]);
        $this->setMessage('success', 'Revendedor desativado!', true);
        $this->redireciona('serralheiros');
    }
    public function ativa()
    {
        $serralheiro_id = $this->request->getQuery('sid');
        $res = $this->connection->update('usuarios', ['acesso' => '0'], ['id' => $serralheiro_id]);
        $this->setMessage('success', 'Revendedor ativado!', true);
        $this->redireciona('serralheiros');
    }
    public function detalhes()
    {
        $serralheiro_id = $this->request->getQuery('sid');

        $res = $this->connection->newQuery()
            ->select('pessoas.id, pessoas.nome, pessoas.sobrenome, aparelhos.id as aparelho_id, pessoas.tipo, desconto_max, acrecimo_max, usuarios.id as us_id, username, email, ddd, telefones.numero as tel_num, cep, logradouro, enderecos.numero, complemento, cidade, uf, bairro, username, vendedor_id, contato.nome as ct_nome, contato.sobrenome as ct_snome')
            ->from('pessoas')
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
                    'table' => 'usuarios',
                    'type' => 'LEFT',
                    'conditions' => 'usuarios.pessoa_id = pessoas.id'
                ]
            )
            ->join(
                [
                    'table' => 'serralheiro_vendedores',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_vendedores.serralheiro_id = pessoas.id'
                ]
            )
            ->join(
                [
                    'table' => 'serralheiro_contato',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_contato.serralheiro_id = pessoas.id'
                ]
            )
            ->join(
                [
                    'table' => 'pessoas as contato',
                    'type' => 'LEFT',
                    'conditions' => 'serralheiro_contato.contato_id = contato.id'
                ]
            )
            ->join(
                [
                    'table' => 'aparelhos',
                    'type' => 'LEFT',
                    'conditions' => 'aparelhos.usuario_id = usuarios.id'
                ]
            )
            ->where('pessoas.id = ' . $serralheiro_id)
            ->execute()
            ->fetchAll('assoc');

        if (!empty($res[0]['us_id'])) {
            $ap = $this->connection->newQuery()
                ->select('modelo, plataforma, uuid, versao, fabricante, is_virtual, serial, is_aprovado')
                ->from('aparelhos')
                ->where('usuario_id = ' . $res[0]['us_id'])
                ->execute()
                ->fetchAll('assoc');

            $this->set('aparelho', $ap);
        }

        $acs = $this->connection->newQuery()
            ->select('dt_acesso, ip_acesso')
            ->from('logins')
            ->where('usuario_id = ' . $res[0]['us_id'])
            ->execute()
            ->fetchAll('assoc');

        $numOrcs = $this->connection->newQuery()
            ->select('count(serralheiro_id) as num')
            ->from('orcamento_pessoas')
            ->where('serralheiro_id = ' . $serralheiro_id)
            ->execute()
            ->fetchAll('assoc');

        $ttlOrcs = $this->connection->newQuery()
            ->select('ROUND(SUM(valor_total), 2) as ttal')
            ->from('orcamentos')
            ->join(
                [
                    'table' => 'orcamento_pessoas',
                    'type' => "LEFT",
                    'conditions' => 'orcamento_id = orcamentos.id'
                ]
            )
            ->where('serralheiro_id = ' . $serralheiro_id)
            ->where('valor_total IS NOT NULL')
            ->execute()
            ->fetchAll('assoc');

        $ulOrc = $this->connection->newQuery()
            ->select("dt_cadastro")
            ->from('orcamentos')
            ->join(
                [
                    'table' => 'orcamento_pessoas',
                    'type' => "LEFT",
                    'conditions' => 'orcamento_id = orcamentos.id'
                ]
            )
            ->where('serralheiro_id = ' . $serralheiro_id)
            ->order('orcamentos.id desc')
            ->limit("1")
            ->execute()
            ->fetchAll('assoc');

        $cliCads = $this->connection->newQuery()
            ->select('count(serralheiro_id) as num')
            ->from('serralheiro_clientes')
            ->where('serralheiro_id = ' . $serralheiro_id)
            ->execute()
            ->fetchAll('assoc');

        $this->pageTitle = "Detalhes do Revendedor " . $res[0]['id'];
        $this->set('serralheiro', $res[0]);
        $this->set('resumo', [
            'orcamentos' => $numOrcs[0]['num'],
            'vl_orcamentos' => $ttlOrcs[0]['ttal'],
            'u_orcamento' => count($ulOrc) ? $ulOrc[0]['dt_cadastro'] : null,
            'clientes' => $cliCads[0]['num'],
            'acessos' => count($acs),
            'u_acesso' => count($ulOrc) ? $acs[count($acs) - 1] : null
        ]);
        $this->set('acessos', $acs);
        $this->set('title', $this->pageTitle);

        $this->addTableClass();
    }
}
