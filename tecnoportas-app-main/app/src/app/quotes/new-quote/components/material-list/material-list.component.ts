import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonInput, IonModal } from '@ionic/angular';
import { Big } from 'big.js';

import { AuthService, IUserData } from '../../../../global/auth.service';
import { numberToDecimalFormat } from '../../../../global/global.helpers';
import { IButtonData } from '../../../../global/global.interfaces';
import { ICustomerResponse } from '../../../../my-customers/customers.service';
import { IProductResponse } from '../../../../product-list/product.interfaces';
import { ProductService } from '../../../../product-list/product.service';
import {
  ICreateQuoteParams,
  IEngineConditionParams,
  IEngineData,
  IProductsConditionParams,
  IQuoteItem,
  IQuoteItemsValues,
  IQuoteProductSettings,
} from '../../../quotes.interfaces';
import { QuotesService } from '../../../quotes.service';

/* eslint-disable @typescript-eslint/naming-convention */
@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
})
export class MaterialListComponent implements AfterViewInit {

  @ViewChild('productsSelect')
  public productsModal: IonModal;

  @Input()
  public quoteForm: { [key: string]: FormControl };

  @Input()
  public loggedUser: IUserData;

  @Input()
  public quoteItems: { [key: string]: (IQuoteItem | IProductResponse)[] };

  @Input()
  public quoteData: { [key: string]: IProductResponse | IEngineData };

  @Input()
  public selectedCustomerData: ICustomerResponse;

  @Input()
  public doorProfileM2Weight: string;

  @Input()
  public loading: boolean;

  @Input()
  public saving: boolean;

  @Output()
  public previewsClick = new EventEmitter();

  @Output()
  public changeSaving = new EventEmitter<boolean>();

  public settingsForm = {
    height: new FormControl(undefined, [Validators.required, Validators.min(0.01)]),
    width: new FormControl(undefined, [Validators.required, Validators.min(0.01)]),
    doors: new FormControl(1, [Validators.required]),
    typeOfInstall: new FormControl(undefined, [Validators.required]),
  };

  public productItemsButtons: IButtonData[] = [{
    label: 'Adicionar',
    icon: 'add-outline',
    color: 'success',
    handler: (item) => this.onAddProduct.bind(this)(item),
  }];

  public priceIncrementOptions: { label: string; value: number }[] = [];
  public maxPriceIncrement: number;
  public minPriceIncrement: number;

  public finalProductList: (IProductResponse | IEngineData)[] = [];
  public productsSettings: IQuoteProductSettings[];
  public selectedProductToChange: IProductResponse | IEngineData = undefined;
  public selectedProductType: string = undefined;
  public optionalProducts: { [key: string]: IProductResponse } = {};

  public updateDoorSettings = false;
  public quoteDoors = new Array(9);

  constructor(
    private ngZone: NgZone,
    private quotesService: QuotesService,
    private productService: ProductService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private ref: ChangeDetectorRef,
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
  }

  ngAfterViewInit() {
  }

  async createFinalProductList() {
    this.loading = true;
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());

    this.finalProductList = [];
    this.productsSettings = [];
    this.optionalProducts = {};

    let products = Object.assign([], this.finalProductList);
    const configs = Object.assign([], this.productsSettings);
    const defaultConfig: IQuoteProductSettings = { expand: false, quantity: 1, priceIncrement: 0 };

    const height = this.quoteForm.height.value;
    const width = this.quoteForm.width.value;
    const doors = Number(this.quoteForm.doors.value);

    products.push(...[
      this.quoteData.doorProfile,
      this.quoteData.engine,
    ]);

    if (this.quoteData.engineHeader) {
      products.push(this.quoteData.engineHeader);
    }

    if (this.quoteData.doorPVC) {
      products.push(this.quoteData.doorPVC);
    }

    if (this.quoteForm.engineAutomator.value !== 'null') {
      const engineAutomator = this.quoteItems.engineAutomators?.find(item => item.id === this.quoteForm.engineAutomator.value);
      if (engineAutomator) {
        products.push(engineAutomator as IProductResponse);
      }
    }

    if (this.quoteForm.additionalPorthole.value !== 'null') {
      const porthole = this.quoteData.additionalPorthole;
      if (porthole) {
        products.push(porthole as IProductResponse);
      }
    }

    if (this.quoteForm.additionalPaint.value !== 'null') {
      const paint = this.quoteItems.doorPaints?.find(item => item.id === this.quoteForm.additionalPaint.value);
      if (paint) {
        products.push(paint as IProductResponse);
      }
    }

    const defaultItems = await this.quotesService.getValidDefaultProducts({
      ...this.getQuoteConditionalVariables(),
      products: (await this.quotesService.getDoorDefaultItems(this.loggedUser)),
    } as IProductsConditionParams);

    if (defaultItems.length) {
      products.push(...defaultItems);
      defaultItems.forEach(item => this.optionalProducts[item.id] = item);
    }

    products = this.quotesService.orderProductsList(products);
    configs.push(...products.map(item => {
      let expand = false;
      if (item.valor_unitario === '0.00') {
        expand = true;
      }

      const blockEdit = true;
      return {
        ...defaultConfig, expand, blockEdit,
        quantity: this.quotesService.getProductQuantity(item, {
          height, width, doors,
        }),
      };
    }));

    this.finalProductList = products;
    this.productsSettings = configs;

    this.loading = false;
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
  }

  formIsValid() {
    return Object.keys(this.settingsForm)
      .filter(key => (this.quoteForm[key] as FormControl).invalid).length === 0;
  }

  getCategoryByProductType(type: string) {
    if (type !== undefined) {
      switch (type) {
        case 'doorPaints': return 'Pinturas';
        case 'engineAutomators': return 'Acionadores';
        case 'additionalPorthole': return 'Entradas';
        case 'engine': return 'Motores';
        default: return 'Componentes';
      }
    }
    return 'Tudo';
  }

  getItemIncrementOptions() {
    return Object.assign([], this.priceIncrementOptions).reverse();
  }

  getProductsTotal() {
    const prices = this.finalProductList.map(product => this.getItemTotalPrice(product));
    let total = '0.00';
    prices.forEach(price => {
      if (total === '0.00') {
        total = price;
        return;
      }
      total = Big(total).add(price).toFixed(2);
    });
    return total;
  }

  getItemTotalPrice(product: IProductResponse | IEngineData | IQuoteItem) {
    const index = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product as IProductResponse));
    if(index < 0){
      return '0.00';
    }

    const quantity = this.productsSettings[index].quantity;
    const increment = this.productsSettings[index].priceIncrement;

    let price = (product as IProductResponse).valor_unitario;

    if (price !== '0.00') {
      if (Number(price) && quantity > 1) {
        price = Big(price).times(quantity).toFixed(2);
      }

      if (Number(price) && increment > 0) {
        price = Big(price).add(Big(price).times(increment / 100)).toFixed(2);
      }

      if (Number(price) && increment < 0) {
        price = Big(price).sub(Big(price).times((increment * -1) / 100)).toFixed(2);
      }
    }
    else {
      price = this.productsSettings[index].price || '0.00';
    }

    return price || '0.00';
  }

  getQuoteConditionalVariables() {
    const height = this.quoteForm.height.value;
    const width = this.quoteForm.width.value;

    return {
      ...this.quotesService.calculateDoorSettings(
        height, width, this.doorProfileM2Weight,
      ),
      doors: this.quoteForm.doors.value.toString(),
      doorTypeId: this.quoteForm.doorType.value,
      typeOfInstallId: this.quoteForm.typeOfInstall.value,
    };
  }

  getProductType(product: IProductResponse | IEngineData) {
    const hasProductIndex = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product));
    let productType: string;
    if (hasProductIndex > -1) {
      productType = Object.keys(this.quoteData).find(
        key => this.quoteData[key] && this.productService.compareProducts(this.quoteData[key], product)
      );

      if (!productType) {
        switch (product.tipo) {
          case 'opc': productType = 'optionals'; break;
          default: productType = Object.keys(this.quoteItems).find(key => {
            const has = this.quoteItems[key] && this.quoteItems[key].find(
              item => this.productService.compareProducts(item as IProductResponse, product)
            );
            return has ? true : false;
          });
        }
      }
    }
    return productType;
  }

  getProductQuantity(product: IProductResponse | IEngineData | IQuoteItem) {
    const index = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product as IProductResponse));

    if(index < 0){
      return '0.00';
    }

    const quantity = this.productsSettings[index].quantity?.toString();
    if (quantity?.indexOf('.') > -1) {
      const decimals = quantity.split('.')[1];
      if (decimals.length > 2) {
        return Big(quantity).toFixed(2);
      }
    }
    return quantity;
  }

  getProductIncrement(product: IProductResponse | IEngineData | IQuoteItem) {
    const index = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product as IProductResponse));

    if(index < 0){
      return '0.00';
    }

    const increment = this.productsSettings[index].priceIncrement;
    return increment.toString();
  }

  getTypeOfInstallName() {
    const item = this.quoteItems.installTypes.find(
      (type) => type.id === this.quoteForm.typeOfInstall.value,
    );

    return item?.nome || '';
  }

  getCustomerButtons() {
    return [{
      label: 'Alterar',
      icon: 'pencil',
      color: 'tertiary',
      handler: () => { this.onPreviews(); },
    }];
  }

  onAddOne(product: IProductResponse | IEngineData) {
    const hasProductIndex = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product));

    if (hasProductIndex > -1) {
      this.ngZone.run(() => {
        const settings = this.productsSettings;
        settings[hasProductIndex].quantity++;
        this.productsSettings = settings;
      });
    }
  }

  onRemoveOne(product: IProductResponse | IEngineData) {
    const hasProductIndex = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product));

    if (hasProductIndex > -1) {
      this.ngZone.run(() => {
        const settings = this.productsSettings;
        settings[hasProductIndex].quantity--;
        this.productsSettings = settings;
      });
    }
  }

  onExpandItemClick(index: number) {
    this.ngZone.run(() => {
      this.productsSettings[index] = {
        ...this.productsSettings[index],
        expand: !this.productsSettings[index].expand,
      };
    });
  }

  onProductPriceIncrementChange(productIndex: number, value: string) {
    const settings = this.productsSettings;
    settings[productIndex].priceIncrement = Number(value);
    this.productsSettings = settings;
    this.ref.detectChanges();
  }

  onPriceIncrementChange() {
    const value = this.quoteForm.finalPriceIncrement.value;
    this.productsSettings = this.productsSettings.map(item => ({ ...item, priceIncrement: value }));
    this.ref.detectChanges();
  }

  onProductPriceChange(object: IonInput, product: IProductResponse) {
    numberToDecimalFormat(object, '.', 2);
    const hasProductIndex = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product));
    if (hasProductIndex > -1) {
      this.ngZone.run(() => {
        const settings = this.productsSettings;
        settings[hasProductIndex].price = object.value.toString();
        this.productsSettings = settings;
      });
    }
  }

  async deleteProductFromQuote(product: IProductResponse | IEngineData) {
    const hasProductIndex = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product));

    if (hasProductIndex > -1) {
      const productFrom = this.getProductType(product);
      this.ngZone.run(() => {
        const productsList = this.finalProductList;
        const productSettings = this.productsSettings;
        switch (productFrom) {
          case 'doorProfile':
            this.quoteData.doorProfile = undefined;
            break;
          case 'engine':
            this.quoteData.engine = undefined;
            break;
          case 'engineHeader':
            this.quoteData.engineHeader = undefined;
            break;
          case 'doorPVC':
            this.quoteData.doorPVC = undefined;
            break;
          case 'engineAutomators':
            this.quoteForm.engineAutomator.setValue('null');
            break;
          case 'doorPaints':
            this.quoteForm.additionalPaint.setValue('null');
            break;
          case 'additionalPorthole':
            this.quoteData.additionalPorthole = undefined;
            break;
          case 'optionals':
            delete this.optionalProducts[product.id];
            break;
        }
        productsList.splice(hasProductIndex, 1);
        productSettings.splice(hasProductIndex, 1);
        this.finalProductList = productsList;
        this.productsSettings = productSettings;
      });
    }
  }

  async onDeleteProductClick(product: IProductResponse | IEngineData) {
    const hasProductIndex = this.finalProductList.findIndex(item => this.productService.compareProducts(item, product));

    if (hasProductIndex > -1) {
      const alert = await this.alertController.create({
        header: 'Confirmar Operação',
        subHeader: 'Essa operação não poderá ser desfeita.',
        message: `Deseja mesmo remover ${product.nome} desse orçamento?`,
        buttons: ['Não', {
          text: 'Sim',
          handler: () => this.deleteProductFromQuote(product)
        }]
      });

      await alert.present();
    }
  }

  onOpenProductsModelClick() {
    this.selectedProductToChange = undefined;
    this.selectedProductType = undefined;
    this.productsModal.present();
  }

  onChangeProductClick(product: IProductResponse | IEngineData) {
    const type = this.getProductType(product);
    this.selectedProductToChange = product;
    this.selectedProductType = type;
    this.productsModal.present();
  }

  onAddProduct(product: IProductResponse) {
    if (product) {
      this.ngZone.run(async () => {
        const configs = this.productsSettings;
        const products = this.finalProductList;
        const hasOpc = this.optionalProducts[product.id] ?
          this.productService.compareProducts(product, this.optionalProducts[product.id]) :
          false;

        if (this.selectedProductToChange !== undefined || hasOpc) {
          if (hasOpc && this.selectedProductType === undefined) {
            this.selectedProductType = 'optionals';
          }
          const index = this.finalProductList.findIndex(
            item => this.productService.compareProducts(item, this.selectedProductToChange || product)
          );
          if (index > -1) {
            switch (this.selectedProductType) {
              case 'doorProfile':
                this.quoteData.doorProfile = { ...product, tipo: 'prf' };
                break;
              case 'engine':
                this.quoteData.engine = { ...product, tipo: 'mto' };
                break;
              case 'engineHeader':
                this.quoteData.engineHeader = { ...product, tipo: 'tst' };
                break;
              case 'doorPVC':
              this.quoteData.doorPVC = product;
                break;
              case 'engineAutomators':
                this.quoteForm.engineAutomator.setValue('null');
                break;
              case 'doorPaints':
                this.quoteForm.additionalPaint.setValue('null');
                break;
              case 'additionalPorthole':
                this.quoteData.additionalPorthole = { ...product, tipo: 'ent' };
                break;
              case 'optionals':
                this.optionalProducts[product.id] = product;
                if(this.selectedProductToChange){
                  delete this.optionalProducts[this.selectedProductToChange.id];
                }
                break;
            }
            products[index] = product;
          }
        }
        else {
          const newConfig: IQuoteProductSettings = {
            expand: false,
            quantity: 1,
            priceIncrement: 0,
          };

          if (product.valor_unitario === '0.00') {
            newConfig.expand = true;
          }

          this.optionalProducts[product.id] = product;
          configs.push(newConfig);
          products.push(product);
        }

        this.productsSettings = configs;
        this.finalProductList = products;
      });
      this.selectedProductToChange = undefined;
      this.selectedProductType = undefined;
    }
    this.closeProductsModal();
  }

  async closeProductsModal() {
    await this.productsModal.dismiss(null, 'cancel');
  }

  async onCancelUpdateDoorSettingsClick() {
    this.ngZone.run(() => {
      Object.keys(this.settingsForm).forEach(
        key => this.settingsForm[key].setValue(this.quoteForm[key].value)
      );
      this.updateDoorSettings = false;
    });
  }

  onUpdateDoorSettingsClick() {
    this.ngZone.run(async () => {
      if (!this.updateDoorSettings) {
        Object.keys(this.settingsForm).forEach(
          key => this.settingsForm[key].setValue(this.quoteForm[key].value)
        );
      }

      if (this.updateDoorSettings) {
        this.changeSaving.emit(true);

        Object.keys(this.settingsForm).forEach(
          key => this.quoteForm[key].setValue(this.settingsForm[key].value)
        );

        // updating door PVC
        let paintId = this.quoteForm.additionalPaint.value;

        if (paintId === 'null') {
          paintId = null;
        }

        const pvcs = await this.quotesService.getValidDefaultProducts({
          ...this.getQuoteConditionalVariables(),
          products: (await this.quotesService.getDoorPVCItems(paintId, this.loggedUser)),
        } as IProductsConditionParams);

        if (pvcs.length) {
          this.quoteData.doorPVC = pvcs[0];
        }
        else {
          this.quoteData.doorPVC = undefined;
        }

        // updating engine and engineHeader
        const engines = await this.quotesService.getEngines(
          this.quoteForm.engineCategory.value,
          this.loggedUser,
        );

        if (engines.length > 0) {
          for (const engine of engines) {
            const conditionsResult = await this.quotesService.engineConditionsCalculate({
              ...this.getQuoteConditionalVariables(),
              engine,
            } as IEngineConditionParams);

            if (conditionsResult === true) {
              this.quoteData.engine = engine;
              break;
            }
          }

          if (!this.quoteData.engine) {
            this.quoteData.engine = undefined;
            const message = await this.alertController.create({
              header: 'Atenção:',
              message: 'Nenhum motor adequado para o seu portão foi encontrado! Tente usar outros atributos para continuar seu orçamento.',
              buttons: ['OK'],
            });
            await message.present();
          }
          else {
            const engineHeader = await this.quotesService.getEngineHeader(this.quoteData.engine.id, this.loggedUser);

            if (!engineHeader) {
              this.quoteData.engineHeader = undefined;
              const message = await this.alertController.create({
                header: 'Atenção:',
                message: 'Não encontramos a testeira adequada para seu portão! Tente usar outros atributos para continuar seu orçamento.',
                buttons: ['OK'],
              });
              await message.present();
            }
            else {
              this.quoteData.engineHeader = { ...engineHeader, tipo: 'tst' };
            }
          }
        }
        else {
          const message = await this.alertController.create({
            header: 'Atenção:',
            message: 'Nenhum Motor Encontrado! Tente novamente mais tarde.',
            buttons: ['OK'],
          });
          await message.present();
          this.quoteData.engine = undefined;
          this.quoteData.engineHeader = undefined;
        }

        this.changeSaving.emit(false);

        this.createFinalProductList();
      }
      this.updateDoorSettings = !this.updateDoorSettings;
    });
  }

  onDecimalChange(object: IonInput) {
    numberToDecimalFormat(object, '.', 2);
  }

  async onFinishQuoteClick() {
    this.changeSaving.emit(true);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());
    try{
      const result = await this.sendQuote();
      this.router.navigate(['/quote-pdf', result.orcamento_data.id, 'open']);
    }catch(e){
      console.log(e);
      const message = await this.alertController.create({
        header: 'Erro',
        message: e.error.text,
        buttons: ['OK'],
      });
      await message.present();
    }

    this.changeSaving.emit(false);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
  }

  async sendQuote(){
    if (this.finalProductList.length) {
      const vars = this.getQuoteConditionalVariables();

      const quoteData: Partial<ICreateQuoteParams> = {
        cliente_id: this.selectedCustomerData.id,
      };
      const orc: Partial<ICreateQuoteParams['orc']> = {
        portas: vars.doors,
        altura: vars.totalHeight,
        largura: vars.width,
        tpi: this.quoteForm.typeOfInstall.value,
        opcionais: this.optionalProducts,
        valor_total: this.getProductsTotal(),
      };

      const prices: IQuoteItemsValues = { opcionais: {} };
      const quantities: IQuoteItemsValues = { opcionais: {} };
      const additionalPrices: IQuoteItemsValues = { opcionais: {} };

      if (this.quoteData.doorProfile?.id) {
        orc.perfil = this.quoteData.doorProfile.id;
        prices.perfil = this.getItemTotalPrice(this.quoteData.doorProfile);
        quantities.perfil = this.getProductQuantity(this.quoteData.doorProfile);
        additionalPrices.perfil = this.getProductIncrement(this.quoteData.doorProfile);
      }

      if (Object.keys(this.optionalProducts).length) {
        Object.keys(this.optionalProducts).forEach(key => {
          prices.opcionais[key] = this.getItemTotalPrice(this.optionalProducts[key]);
          quantities.opcionais[key] = this.getProductQuantity(this.optionalProducts[key]);
          additionalPrices.opcionais[key] = this.getProductIncrement(this.optionalProducts[key]);
        });
      }

      if (this.quoteData.engine?.id) {
        orc.motor = this.quoteData.engine.id;
        prices.motor = this.getItemTotalPrice(this.quoteData.engine);
        quantities.motor = this.getProductQuantity(this.quoteData.engine);
        additionalPrices.motor = this.getProductIncrement(this.quoteData.engine);
      }

      if (this.quoteData.engineHeader?.id) {
        orc.testeira = this.quoteData.engineHeader.id;
        prices.testeira = this.getItemTotalPrice(this.quoteData.engineHeader);
        quantities.testeira = this.getProductQuantity(this.quoteData.engineHeader);
        additionalPrices.testeira = this.getProductIncrement(this.quoteData.engineHeader);
      }

      if (this.quoteForm.engineAutomator.value !== 'null') {
        const engineAutomator = this.quoteItems.engineAutomators.find(
          item => item.id === this.quoteForm.engineAutomator.value,
        );
        if (engineAutomator) {
          orc.automatizador = this.quoteForm.engineAutomator.value;
          prices.automatizador = this.getItemTotalPrice(engineAutomator);
          quantities.automatizador = this.getProductQuantity(engineAutomator);
          additionalPrices.automatizador = this.getProductIncrement(engineAutomator);
        }
      }

      if (this.quoteData.additionalPorthole?.id) {
        orc.entrada = this.quoteData.additionalPorthole.id;
        prices.entrada = this.getItemTotalPrice(this.quoteData.additionalPorthole);
        quantities.entrada = this.getProductQuantity(this.quoteData.additionalPorthole);
        additionalPrices.entrada = this.getProductIncrement(this.quoteData.additionalPorthole);
      }

      if (this.quoteForm.additionalPaint.value !== 'null') {
        const doorPaint = this.quoteItems.doorPaints.find(
          item => item.id === this.quoteForm.additionalPaint.value,
        );
        if (doorPaint) {
          orc.pintura = this.quoteForm.additionalPaint.value;
          prices.pintura = this.getItemTotalPrice(doorPaint);
          quantities.pintura = this.getProductQuantity(doorPaint);
          additionalPrices.pintura = this.getProductIncrement(doorPaint);
        }
      }

      if (this.quoteData.doorPVC?.id) {
        orc.fita = this.quoteData.doorPVC.id;
        prices.fita = this.getItemTotalPrice(this.quoteData.doorPVC);
        quantities.fita = this.getProductQuantity(this.quoteData.doorPVC);
        additionalPrices.fita = this.getProductIncrement(this.quoteData.doorPVC);
      }

      orc.valores = prices;
      orc.quantidades = quantities;
      orc.acrescimos = additionalPrices;

      quoteData.orc = orc as ICreateQuoteParams['orc'];

      return await this.quotesService.create(quoteData as ICreateQuoteParams, this.loggedUser);

    }
  }

  onPreviews() {
    this.previewsClick.emit();
  }

}
