function CalcFormula(formula, variaveis) {
    /*Variáveis Locais*/
    var self = this, Formula = formula, resultado,
        ops = { 
            '+': ['MAIS'], 
            '-': ['MENOS'], 
            '*': ['X', 'VEZES'], 
            '/': ['DIVIDIDO'] ,
            '==': ['IGUAL'],
            '!=': ['<>', 'DIFERENTE'],
            '>': ['MAIOR'],
            '<': ['MENOR'],
            '>=': ['MAIORIGUAL'],
            '<=': ['MENORIGUAL'],
            '&&': ['E'],
            '||': ['OU']
        };
    /*Funções Locais*/
    var subVars = function () {
        for (var chave in variaveis) {
            var reg = new RegExp(chave, "gi");
            Formula = Formula.replace(reg, variaveis[chave]);
        }
    };
    var subOps = function () {
        for (var chave in ops) {
            for (var i = 0; i < ops[chave].length; i++) {
                var reg = new RegExp(ops[chave][i], "gi");
                Formula = Formula.replace(reg, chave);
            }
        }
    };
    var checaFormula = function () {
        return !/^[^0-9.+*/&|!=><-]+$/.test(Formula);
    };
    /*Funções Globais*/
    self.calcula = function () {
        subVars(); subOps();
        if (checaFormula()) {
            Formula = "resultado = " + Formula + ";";
            eval(Formula);
            return resultado;
        }
        else {
            return "Erro: Caracteres inválidos encontrados!";
        }
    };
};