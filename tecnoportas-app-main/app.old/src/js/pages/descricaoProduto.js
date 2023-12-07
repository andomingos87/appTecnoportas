var descricaoProduto = {
  inicializar: function (descricaoDoProdutos) {
    console.log(descricaoDoProdutos.imagem);
    this.preencherDescricao(descricaoDoProdutos);
    this.adicionaEventoBotoes();

  },
  preencherDescricao: function (tmpDescricao) {
    app.E('#imagem').src = tmpDescricao.imagem;
    app.E('#id').innerHTML = 'ID : ' +  tmpDescricao.id;
    app.E('#nome').innerHTML = 'Nome : ' +  tmpDescricao.nome;
    app.E('#descricao').innerHTML = 'Descrição : ' +  tmpDescricao.descricao;
    app.E('#unidadeDeMedida').innerHTML = 'Unidade De Medida : ' +  tmpDescricao.unidadeDeMedida;
    app.E('#valor').innerHTML = 'Valor : ' +  tmpDescricao.valor;
  },
  adicionaEventoBotoes: function(){
    app.E('#btnVoltar').addEventListener('click',app.onBackButtonClick );
    // app.E('#addCarrinho').addEventListener('click',app.onBackButtonClick );
    
  },
  
}