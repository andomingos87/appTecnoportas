"use strict";
var lib = {
    /*Variáveis Globais */
    AjaxErros: [],
    ArquivoErros: [],

    /*Eventos Iniciais*/
    inicializar: function () {
        /*Atribuições Globais*/
        lib.AjaxErros[0] = "Sem conexão com o servidor (Erro 0).";
        lib.AjaxErros[404] = "Página não encontrada (Erro 404).";
        lib.AjaxErros[500] = "Erro interno do Servidor (Erro 500).";
        lib.AjaxErros['parsererror'] = "A análise da requisição JSON falhou.";
        lib.AjaxErros['timeout'] = "Tempo limite excedido.";
        lib.AjaxErros['abort'] = "A requisição foi abortada.";

        lib.ArquivoErros[1] = "Arquivo não encontrado (erro 1)";
        lib.ArquivoErros[2] = "Segurança violada (erro 2)";
        lib.ArquivoErros[3] = "Operção abortada (erro 3)";
        lib.ArquivoErros[4] = "Arquivo ilegível (erro 4)";
        lib.ArquivoErros[5] = "Erro de codificação (erro 5)";
        lib.ArquivoErros[6] = "Modificações não permitidas (erro 6)";
        lib.ArquivoErros[7] = "Status inválido (erro 7)";
        lib.ArquivoErros[8] = "Erro de Sintaxe (erro 8)";
        lib.ArquivoErros[9] = "Modificação inválida (erro 9)";
        lib.ArquivoErros[10] = "Quota excedida (erro 10)";
        lib.ArquivoErros[11] = "Tipo incompatível (erro 11)";
        lib.ArquivoErros[12] = "Endereço duplicado (erro 12)";
    }
};
lib.inicializar();