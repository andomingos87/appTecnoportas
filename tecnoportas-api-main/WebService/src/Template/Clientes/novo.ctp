<form id='formClientes' method="POST">
    <table>
        <caption><?= $title ?></caption>
        <thead>
            <tr>
                <td>Dados do Cliente Final</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    Pessoa:
                    <input id='tbpfisica' type="radio" name="cli[tipo]" onchange="radioPessoaChange(this, 'formClientes');" value="F"/><label for="tbpfisica">Física</label> <input id="tbpjuridica" type="radio" name="cli[tipo]" onchange="radioPessoaChange(this, 'formClientes');" value="J"/><label for="tbpjuridica">Jurídica</label>
                </td>
            </tr>
            <tr>
                <td>
                    <label for='tbnome'>Nome:</label>
                    <input id='tbnome' type="text" name="cli[nome]"/>
                </td>
            </tr>
            <tr>
                <td>
                    <label for='tbsobrenome'>Sobrenome:</label>
                    <input id='tbsobrenome' type="text" name="cli[sobrenome]"/>
                </td>
            </tr>
            <tr>
                <td>
                    <label for='tbddd'>Telefone:</label>
                    <input id='tbddd' type="number" name="cli[ddd]"/> <input id="tbnumero" type="number" name="cli[numero]"/>
                </td>
            </tr>
            <tr>
                <td>
                    <label for='tbemail'>E-mail:</label>
                    <input id='tbemail' type="email" name="cli[email]"/>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="seestado">Estado:</label>
                    <select id="seestado" name="end[uf]">
                        <option value="0">- Selecione -</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    <label for='tbcidade'>Cidade:</label>
                    <input id='tbcidade' type="text" name="end[cidade]"/>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td><a href="<?= $this->Layout->getLink('clientes') ?>">Cancelar</a> <input type='submit' value='Salvar'/></td>
            </tr>
        </tfoot>
    </table>
</form>