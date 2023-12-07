import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonModal, ToastController } from '@ionic/angular';

import { AuthService, IUserData } from '../../../../global/auth.service';
import { IEngineData, IQuoteData, IQuoteDetailsResponse, IQuoteItem, IQuoteItemTypes, IQuoteProduct } from '../../../quotes.interfaces';
import { QuotesService } from '../../../quotes.service';
import { IProductResponse } from 'src/app/product-list/product.interfaces';
import { GeneralService } from 'src/app/global/general.service';
import { ProductService } from 'src/app/product-list/product.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quote-edit',
  templateUrl: './quote-edit.component.html',
  styleUrls: ['./quote-edit.component.scss'],
})
export class QuoteEditComponent implements OnInit {
  @Output()
  public closeClick = new EventEmitter();

  @Output()
  public openPdf = new EventEmitter<Blob>();

  @Input()
  public loggedUser: IUserData;

  @Input()
  public selectedQuote?: IQuoteData;

  @ViewChild('editPaint')
  private paintEditModal: IonModal;

  @ViewChild('editProduct')
  private productEditModal: IonModal;

  public quoteDetails: IQuoteDetailsResponse;
  public quoteItems: { [key: string]: (IQuoteItem | IProductResponse)[] } = {
    installTypes: [],
    doorTypes: [],
    doorSizes: [],
    engineCategories: [],
    engineAutomators: [],
    additionalPortholes: [],
    portholePositions: [],
    doorPaints: [],
  };

  public products: IQuoteProduct[] = [];
  public noProducts = false;
  public productsSettings: { expand: boolean }[] = [];
  public loading = false;
  public saving = false;
  public invalidSize = false;
  public currentCategory = 'Tudo';
  public currentItemUpdateIndex = -1;
  public profiles = [];

  public maxPriceIncrement: number;
  public minPriceIncrement: number;
  public priceIncrementOptions: { label: string; value: number }[] = [];

  public formVisual = {
    status: 0,
    doors: '',
    is_dentro_vao: '',
    height: '',
    width: '',
    rolo: '',
  };

  public quoteData: { [key: string]: IProductResponse | IEngineData } = {
    doorProfile: undefined,
    engine: undefined,
    engineHeader: undefined,
    doorPVC: undefined,
    additionalPorthole: undefined,
  };

  public quoteForm = {
    height: new FormControl(undefined, [Validators.required, Validators.min(0.01)]),
    width: new FormControl(undefined, [Validators.required, Validators.min(0.01)]),
    doors: new FormControl(1, [Validators.required]),
    typeOfInstall: new FormControl(undefined, [Validators.required]),
    doorType: new FormControl(undefined, [Validators.required]),
    doorSize: new FormControl(undefined, [Validators.required]),
    engineCategory: new FormControl(undefined, [Validators.required]),
    engineAutomator: new FormControl('null'),
    additionalPorthole: new FormControl('null'),
    portholePosition: new FormControl('null'),
    additionalPaint: new FormControl('null'),
    finalPriceIncrement: new FormControl(0),
  };

  public allStatus: string[] = [];

  public loaderModal;

  constructor(
    private router: Router,
    private quotesService: QuotesService,
    private alertController: AlertController,
    private toastController: ToastController,
    private general: GeneralService,
    private authService: AuthService,
    private productService: ProductService,
    private http: HttpClient,
  ) {
    this.maxPriceIncrement = this.authService.getMaxPriceIncrement();
    this.minPriceIncrement = this.authService.getMinPriceIncrement();

    for (let i = this.maxPriceIncrement; i >= 0; i -= 5) {
      this.priceIncrementOptions.push({
        label: `${i}%`,
        value: i,
      });
    }

    for (let i = 5; i <= this.minPriceIncrement; i += 5) {
      this.priceIncrementOptions.push({
        label: `-${i}%`,
        value: i * -1,
      });
    }

    this.allStatus = this.quotesService.allStatus;
  }


  async ngOnInit() {
    this.setLoader();
    this.profiles = await this.productService.getAll({
      search: undefined,
      category: 'perfis',
    }, this.loggedUser);

    this.formVisual.status = this.allStatus.indexOf(this.selectedQuote.status);
    await this.getQuoteItems();
    await this.getQuoteDetails();
    this.removeLoader();
  }

  async getQuoteDetails() {
    this.loading = true;
    this.noProducts = false;
    this.products = [];

    this.quoteDetails = await this.quotesService.getOne(this.selectedQuote.id, this.loggedUser);
    this.products = this.quoteDetails.produtos;
    this.productsSettings = this.products.map(() => ({ expand: false }));

    if (this.products.length === 0) {
      this.noProducts = true;
    }

    const isDentroVao = this.quoteDetails.orcamento.is_dentro_vao === 'Dentro do Vão' ? 'sim' : 'nao';

    //Formulário necessário para utilizar os modais do orcamento
    this.quoteForm.doors.setValue(Number(this.quoteDetails.orcamento.portas));
    this.quoteForm.height.setValue(this.quoteDetails.orcamento.altura);
    this.quoteForm.width.setValue(this.quoteDetails.orcamento.largura);

    //Formulário com as infos exibidas na tela
    this.formVisual.is_dentro_vao = isDentroVao;
    this.formVisual.doors = this.quoteDetails.orcamento.portas;
    this.formVisual.height = this.quoteDetails.orcamento.altura;
    this.formVisual.width = this.quoteDetails.orcamento.largura;


    const profile = this.quoteDetails.produtos.find((produto) => produto.tipo == 'prf');
    // const profile = this.quoteItems.doorTypes.find((profile) => profile.id == this.quoteDetails.orcamento.tpi_id);

    this.quoteData.doorProfile = profile;

    this.getAdditionalHeight();
    this.loading = false;
  }

  async getQuoteItems() {
    const logged = this.loggedUser;
    this.loading = true;

    const items = Object.assign({}, this.quoteItems);

    const allItems: { [key: string]: IQuoteItemTypes } = {
      installTypes: 'tpi',
      doorTypes: 'chp',
      additionalPortholes: 'ent'
    };

    await Promise.all(Object.keys(allItems).map(
      async key => items[key] = await this.quotesService.getQuoteItems(
        logged,
        allItems[key],
      )
    ));

    if (items.installTypes.length) {
      this.quoteForm.typeOfInstall.setValue(items.installTypes[0].id);
    }

    if (items.doorTypes.length) {
      this.quoteForm.doorType.setValue(items.doorTypes[0].id);
    }

    items.engineCategories = await this.quotesService.getEngineCategories(logged);

    if (items.engineCategories.length) {
      this.quoteForm.engineCategory.setValue(items.engineCategories[0].id);
    }

    const configs = await this.general.getAllAppConfigs();
    const defaultProfileId = configs.perfil_id;

    items.doorSizes = await this.quotesService.getQuoteItems(logged, undefined, defaultProfileId);

    if (items.doorSizes.length) {
      this.quoteForm.doorSize.setValue(items.doorSizes[0].id);
    }

    items.doorPaints = await this.quotesService.getDoorPaints(logged);

    this.quoteItems = items;

    this.loading = false;
  }

  closePaintModal(){
    this.paintEditModal.dismiss();
  }

  updatePaint(){
    const pinturaIndex = this.products.findIndex((produto) => produto.tipo == "ptr");

    const newPaint = this.quoteItems.doorPaints.find((paint) => paint.id == this.quoteForm.additionalPaint.value);

    const newPaintQuantidade = (((this.quoteForm.width.value * this.quoteForm.height.value) * this.quoteForm.doors.value) );
    const newPaintProduct : IQuoteProduct = {
      id: newPaint.id,
      acrescimo: '0.00',
      descricao: newPaint.descricao,
      imagem: newPaint.imagem,
      nome: newPaint.nome,
      preco_unitario: (newPaintQuantidade * Number(newPaint.valor_unitario)).toFixed(2),
      quantidade: newPaintQuantidade.toFixed(2),
      tipo: 'ptr',
    }

    if(pinturaIndex > -1){
      this.products[pinturaIndex] = newPaintProduct;
    }else{
      this.products.push(newPaintProduct);
    }

    this.paintEditModal.dismiss();
  }

  closeTrocaModal(){
    this.productEditModal.dismiss();
  }

  updateProduct(updateProduct){
    const prodIndex = this.currentItemUpdateIndex;
    this.currentItemUpdateIndex = -1;

    this.productEditModal.dismiss();

    if(prodIndex > -1 && updateProduct.tipo != 'opc'){
      updateProduct.quantidade = this.products[prodIndex].quantidade;
      updateProduct.preco_unitario = (updateProduct.quantidade * updateProduct.valor_unitario).toFixed(2);
      updateProduct.tipo = this.products[prodIndex].tipo;
    }else{
      updateProduct.quantidade = '1';
      updateProduct.preco_unitario = Number(updateProduct.valor_unitario).toFixed(2);
    }

    updateProduct.id = updateProduct.produto_id ?? updateProduct.id;
    updateProduct.acrescimo = '0.00';

    if(prodIndex > -1){
      this.products[prodIndex] = updateProduct;
    }else{
      this.products.push(updateProduct);
      this.productsSettings.push({expand: false});
    }

  }

  checkDoorSize(){
    this.invalidSize = false;

    if(this.quoteForm.width.value > 9.5 || this.quoteForm.height.value > 6.5){
        this.invalidSize = true;
    }
  }

  finalPrice(){
    let price = 0;
    this.products.forEach((product) => {
      if(product.preco_unitario != '0.00'){
        price+= Number(product.preco_unitario) + (Number(product.preco_unitario) * (Number(product.acrescimo) / 100));
      }
    });
    return price.toFixed(2);
  }

  changeProduct(product){
    this.currentItemUpdateIndex = this.products.findIndex((element) => element.id == product.id);
    switch(product.tipo){
      case 'ptr':
        this.openPaintModal();
        break;
      case 'mto':
        this.currentCategory = 'Motores';
        this.openProductEditModal();
        break;
      case 'prf':
        this.currentCategory = 'Perfis';
        this.openProductEditModal();
        break;
      case 'tst':
        this.currentCategory = 'Testeiras';
        this.openProductEditModal();
        break;
      case 'opc':
        this.currentCategory = 'Componentes';
        this.openProductEditModal();
        break;
      case 'ent':
        this.currentCategory = 'Entradas';
        this.openProductEditModal();
        break;
      case 'aut':
        this.currentCategory = 'Acionadores';
        this.openProductEditModal();
        break;
    }

  }

  async changeProductQuantity(product){
    const currentItemIndex = this.products.findIndex((element) => element.id == product.id);
    this.loading = true;
    const baseProduct = await this.productService.getAll({
      search: this.products[currentItemIndex].nome
    }, this.loggedUser);
    this.loading = false;

    let newQuantidade = null;
    const message = await this.alertController.create({
      header: 'Alteração de quantidade',
      inputs: [
        {
          placeholder: 'Quantidade',
          type: 'number',
          name: 'quantidade'
        }
      ],

      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            newQuantidade = alertData.quantidade;
            this.products[currentItemIndex].quantidade = newQuantidade;
            this.products[currentItemIndex].preco_unitario = (newQuantidade * Number(baseProduct[0].valor_unitario)).toFixed(2);
          }
        },
        {
          text: 'Cancelar',
        }
      ],
    });
    await message.present();
  }

  async changeProductValue(editProduct){
    const prodIndex = this.products.findIndex((product) => product.id == editProduct.id);

    const message = await this.alertController.create({
      header: 'Editar valor Mão de Obra',
      inputs: [
        {
          placeholder: 'Valor',
          type: 'number',
          name: 'valor'
        }
      ],

      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            const valor = alertData.valor.indexOf(".") == -1 ? alertData.valor + '.00' : alertData.valor;
            this.products[prodIndex].preco_unitario = valor;
          }
        },
        {
          text: 'Cancelar',
        }
      ],
    });
    await message.present();
  }

  async changeProductMargem(editProduct){
    const prodIndex = this.products.findIndex((product) => product.id == editProduct.id);

    let inputOption = [];

    this.priceIncrementOptions.forEach(option => {
      inputOption.push({
        label: option.label,
        type: 'radio',
        value: option.value
      })

    });
    inputOption = inputOption.reverse();
    const message = await this.alertController.create({
      header: 'Editar Margem',
      inputs: inputOption,
      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            this.products[prodIndex].acrescimo = alertData.toFixed(2);
          }
        },
        {
          text: 'Cancelar',
        }
      ],
    });

    await message.present();
  }

  async removeProduct(removedProduct){
    const message = await this.alertController.create({
      header: 'Remover Produto',
      message: 'Tem certeza de que deseja remover: ' + removedProduct.nome + ' ?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            const prodIndex = this.products.findIndex((product) => product.id == removedProduct.id)
            if(prodIndex > -1){
              this.products.splice(prodIndex, 1);
            }

            this.productsSettings.forEach((product) => {
              product.expand = false;
            });
          }
        },
        {
          text: 'Cancelar',
        }
      ],
    });

    await message.present();
  }

  async addProduct(){
    const message = await this.alertController.create({
      header: 'Adicionar Produto',
      inputs: [
        {
          label: 'Motores',
          type: 'radio',
          value: 'motores'
        },
        {
          label: 'Testeiras',
          type: 'radio',
          value: 'testeiras'
        },
        {
          label: 'Acionadores',
          type: 'radio',
          value: 'acionadores'
        },
        {
          label: 'Entradas',
          type: 'radio',
          value: 'entradas'
        },
        {
          label: 'Pinturas',
          type: 'radio',
          value: 'pinturas'
        },
        {
          label: 'Componentes',
          type: 'radio',
          value: 'componentes'
        },
      ],

      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            this.currentCategory = alertData;
            this.openProductEditModal();
          }
        },
        {
          text: 'Cancelar',
        }
      ],
    });
    await message.present();
  }

  async openPaintModal(){
    // this.selectedQuote = quote;
    await this.paintEditModal.present();
  }

  async openProductEditModal(){
    await this.productEditModal.present();
  }

  getProductQuantity(product: IQuoteProduct) {
    const split = product.quantidade.split('.');
    if (split[1] === '00') {
      return split[0];
    }
    return product.quantidade;
  }

  getDate() {
    const dt = new Date(this.selectedQuote.dt_cadastro);
    const year: any = dt.getFullYear();
    let day: any = dt.getDate();
    let month: any = dt.getMonth() + 1;

    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = '0' + month;
    }

    return `${day}/${month}/${year}`;
  }

  getTime() {
    return this.selectedQuote.dt_cadastro.split(' ')[1];
  }

  getColor() {
    if (this.formVisual.status === this.allStatus.indexOf('Pendente')) {
      return 'warning';
    }
    if (this.formVisual.status === this.allStatus.indexOf('Concluído')) {
      return 'success';
    }
    return 'danger';
  }

  getAdditionalHeight() {
    this.quoteForm.width.setValue(this.formVisual.width);
    this.quoteForm.height.setValue(this.formVisual.height);

    const perfil = this.products.findIndex((product) => product.tipo == 'prf');
    const perfilBase = this.profiles.find((perf) => perf.produto_id == this.products[perfil].id);
    if(perfil > -1){
      this.products[perfil].quantidade = ((Number(this.formVisual.width) * Number(this.formVisual.height)) * Number(this.formVisual.doors)).toFixed(2);
      this.products[perfil].preco_unitario = (perfilBase.valor_unitario * Number(this.products[perfil].quantidade)).toFixed(2);
    }

    this.checkDoorSize();

    this.formVisual.rolo = this.formVisual.width ? (
      Number(this.formVisual.width) < 8.5 ? '0.6' : '0.9'
    ) : '0';
  }

  async changeQuoteStatus(toStatusId: string) {
    const alert = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Atualizando o status do orçamento ${this.selectedQuote?.id}`,
      backdropDismiss: false,
    });

    await alert.present();

    const showErrorMessage = async () => {
      const errorMessage = await this.alertController.create({
        header: 'Erro ao atualizar o status!',
        message: `Não foi possível atualizar o status no momento, tente novamente mais tarde.`,
        buttons: ['OK'],
      });

      await errorMessage.present();
      this.formVisual.status = this.allStatus.indexOf(this.selectedQuote.status);
    };

    try {
      const result = await this.quotesService.updateStatus(
        this.selectedQuote?.id,
        toStatusId,
        this.loggedUser,
      );

      if (result.msg?.toLowerCase().indexOf('status alterado') > -1) {
        const toast = await this.toastController.create({
          color: 'success',
          message: `O status foi atualizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();
      }
      else {
        showErrorMessage();
      }
      alert.dismiss();
    }
    catch (e) {
      showErrorMessage();
      alert.dismiss();
    }
  }

  onExpandClick(index: number) {
    this.productsSettings[index] = {
      ...this.productsSettings[index],
      expand: !this.productsSettings[index].expand,
    };
  }

  onCloseClick() {
    this.closeClick.emit();
  }

  async onChangeStatus() {
    const newStatus = this.formVisual.status;
    const newStatusText = this.allStatus[newStatus];

    if (newStatusText !== this.selectedQuote?.status) {
      const alert = await this.alertController.create({
        header: 'Confirmar Alteração...',
        message: `Você quer confirmar a alteração do status do orçamento ${this.selectedQuote?.id}
         de ${this.selectedQuote?.status} para ${newStatusText}?`,
        buttons: [{
          text: 'Não',
          handler: async () => this.formVisual.status = this.allStatus.indexOf(this.selectedQuote.status),
        }, {
          text: 'Sim',
          handler: () => this.changeQuoteStatus(newStatus.toString()),
        }],
      });
      await alert.present();
    }
  }

  async showSaveAlert(){

    if(this.invalidSize){
      const alert = await this.alertController.create({
        header: 'Atenção!',
        message: `Para orçar portas com essa medida é necessário entrar em contato com seu Representante Tecnoportas!`,
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: `Tem certeza de que deseja editar o orçamento e enviar o PDF para o email do cliente?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => this.saveEditedOrc()
        },
        {
          text: 'Não'
        }
      ],
    });
    await alert.present();
  }

  async saveEditedOrc(){
    const orcamento_portao = {
      orcamento_id: this.selectedQuote.id,
      portas: Number(this.formVisual.doors),
      altura: Number(this.formVisual.height),
      largura: Number(this.formVisual.width),
      tpi_id: this.formVisual.is_dentro_vao == 'sim' ? 25 : 26
    }

    const orcamento_produtos = [];
    this.products.forEach((product) => {
      orcamento_produtos.push({
        produto_id: product.id,
        orcamento_id: this.selectedQuote.id,
        preco_unitario: Number(product.preco_unitario),
        quantidade: Number(product.quantidade),
        acrescimo: Number(product.acrescimo)
      })
    });

    const form = new FormData();
    form.append('retorno', 'json');
    form.append('orcamento_produtos', JSON.stringify(orcamento_produtos));
    form.append('orcamento_portao', JSON.stringify(orcamento_portao));
    form.append('valor_total', this.finalPrice());

    const quoteEditUrl = `${environment.apiUrl}orcamentos/editar`;

    this.setLoader();
    const response = await this.http.post<{ orcamento_data: Partial<IQuoteData> }>(
      quoteEditUrl,
      form,
    ).toPromise();

    await this.getQuoteDetails();
    this.removeLoader();
    this.router.navigate(['/quote-pdf', this.selectedQuote.id, 'open']);
  }

  async onOpenPdfClick() {
    if (this.quoteDetails.orcamento.pdf) {
      this.openPdf.emit();
    }
    else {
      this.onCloseClick();
      this.router.navigate(['/quote-pdf', this.quoteDetails.orcamento.id, 'open']);
    }
  }

  async setLoader(){
    this.loaderModal = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Carregando...`,
      backdropDismiss: false,
    });

    await this.loaderModal.present();
  }

  removeLoader(){
    this.loaderModal.dismiss();
  }

}
