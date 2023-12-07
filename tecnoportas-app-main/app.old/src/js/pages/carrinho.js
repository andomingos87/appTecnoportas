"use strict";
var carrinho = {
  /*Variáveis Globais*/
  car: null,
  enviado: false,
  acrescimos: null,
  /*Elementos Globais*/
  listaProds: null,
  valor_total: null,
  btCli: null,
  vlTotal: 0,
  /*Eventos Iniciais*/
  inicializar: function () {
    app.securityCheck();
    this.listaProds = app.E("listaProds");
    this.btCli = app.E("btCli");

    var vg = new VarGlobal('carrinho');
    this.car = JSON.parse(vg.obterLocal());

    console.log(this.car);

    carrinho.setProdutos();

    this.btCli.addEventListener("click", function () {
      carrinho.onBtCliClick(carrinho.car);
    });
  },

  setProdutos: function () {
    console.log(this.listaProds);

    this.listaProds.innerHTML = "";
    this.vlTotal = 0;
    console.log(this.car.length);
    if (this.car.length > 0) {
      for (var i = 0; i < this.car.length; i++) {
        this.listaProds.appendChild(this.geraProdutos(this.car[i]));
      }
      app.E("valor_total").innerHTML = carrinho.vlTotal;
      app.E("btCli").style.display = 'flex';
    } else {
      console.log(this.listaProds);
      app.E("tableHead").style.display = "none";
      app.E("btCli").style.display = 'none';
      app.E("valor_total").innerHTML = carrinho.vlTotal;
      this.listaProds.innerHTML = "<h3>Nenhum produto encontrado</h3>";
    }
  },

  geraProdutos: function (dds) {
    var list_table, imageProduto, nome, tipo, preco, svgLixo;

    list_table = app.CE("div", { class: 'list-table', id: 'prod' + dds.id });
    imageProduto = app.CE("img", { src: "./img/loader.gif", alt: dds.nome, class: 'w-100' });
    nome = app.CE("div", { class: "nome" });
    tipo = app.CE("div", { class: "tipo" });
    preco = app.CE("div", { class: "preco" });
    svgLixo = app.CE("div", { id: 'divLixo' });
    svgLixo.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='icon w-100 mg -bm-md' viewBox='0 0 24 28'><path fill='white' d='M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z' style='width: 25px;height: 25px;'></path></svg>";

    carrinho.vlTotal = (parseFloat(carrinho.vlTotal) + (parseFloat(dds.valor_unitario) * parseInt(dds.quantidade))).toFixed(2);

    if (dds.img != null) {
      app.getImgFromApi(dds.img, function (res) {
        imageProduto.src = res;
      });
    } else {
      imageProduto.src = "./img/nenhum.png"
    }

    nome.innerHTML = dds.nome;
    tipo.innerHTML = dds.quantidade + "<br/>(" + dds.unidade_medida + ")";
    preco.innerHTML = "R$ " + dds.valor_unitario;

    (function (obj, dados) {
      obj.addEventListener("click", function () {
        carrinho.removeCart(dados.id, dados.nome);
      });
    })(svgLixo, dds);

    list_table.appendChild(imageProduto);
    list_table.appendChild(nome);
    list_table.appendChild(tipo);
    list_table.appendChild(preco);
    list_table.appendChild(svgLixo);

    console.log(list_table);

    return list_table;
  },

  removeCart: function (id, nome) {
    if (carrinho.enviado == false) {
      var vg = new VarGlobal('carrinho');
      carrinho.car = JSON.parse(vg.obterLocal());
      for (var i = 0; i < carrinho.car.length; i++) {
        console.log(carrinho.car[i].id);
        if (carrinho.car[i].id == id) {
          console.log(carrinho.car[i].id);
          carrinho.car.splice(i, 1);
          var msg = new Mensagem((nome + ' : removido do carrinho'), true);
          vg.salvarLocal(JSON.stringify(carrinho.car));
          carrinho.setProdutos();
        }
      }
    }
  },

  onBtCliClick: function (dds) {
    var arrayDados = {
      'origem': 'carrinho',
      'dados': dds
    }
    app.abrirPag('orcamento1', [arrayDados]);
  }
};