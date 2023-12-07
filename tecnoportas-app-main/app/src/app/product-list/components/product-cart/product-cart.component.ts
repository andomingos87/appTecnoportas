/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonInput, ToastController } from '@ionic/angular';
import Big from 'big.js';

import { AuthService, IUserData } from '../../../global/auth.service';
import { StepsComponent } from '../../../global/components/steps/steps.component';
import { CustomerFormComponent } from '../../../my-customers/components/customer-form/customer-form.component';
import { CustomerSelectComponent } from '../../../my-customers/components/customer-select/customer-select.component';
import { CustomersService, ICustomerResponse } from '../../../my-customers/customers.service';
import { IQuoteItemsValues, IQuoteProductSettings } from '../../../quotes/quotes.interfaces';
import { QuotesService } from '../../../quotes/quotes.service';
import { IProductResponse } from '../../product.interfaces';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.scss'],
})
export class ProductCartComponent implements AfterViewInit {
  @ViewChild('steps')
  public steps: StepsComponent;

  @ViewChild('form')
  public formComponent: CustomerFormComponent;

  @ViewChild('customerSelector')
  public customerSelector: CustomerSelectComponent;

  @Output()
  public closeClick = new EventEmitter();

  @Output()
  public addOneToCart = new EventEmitter<IProductResponse>();

  @Output()
  public removeOneToCart = new EventEmitter<IProductResponse>();

  @Output()
  public removeItem = new EventEmitter<IProductResponse>();

  @Output()
  public itemDetails = new EventEmitter<IProductResponse>();

  @Output()
  public expandItem = new EventEmitter<number>();

  @Output()
  public selectCustomer = new EventEmitter<ICustomerResponse>();

  @Output()
  public itemPriceIncrementChange = new EventEmitter<{ index: number; value: string }>();

  @Output()
  public itemPriceChange = new EventEmitter<{ input: IonInput; product: IProductResponse }>();

  @Output()
  public priceIncrementChange = new EventEmitter<number>();

  @Input()
  public loggedUser: IUserData;

  @Input()
  public products: IProductResponse[] = [];

  @Input()
  public productsSettings: IQuoteProductSettings[];

  @Input()
  public selectedCustomerData: ICustomerResponse;

  public saving = false;
  public loading = false;

  public maxPriceIncrement: number;
  public minPriceIncrement: number;
  public priceIncrementOptions: { label: string; value: number }[] = [];
  public form: { [key: string]: FormControl };
  public cartForm = {
    finalPriceIncrement: new FormControl(0),
  };

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private customersService: CustomersService,
    private alertController: AlertController,
    private toastController: ToastController,
    private quotesService: QuotesService,
    private productService: ProductService,
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

  async ngAfterViewInit(): Promise<void> {
    if (this.selectedCustomerData) {
      this.formComponent.setCustomerData(this.selectedCustomerData);
    }
  }

  async getForm(data: { [key: string]: FormControl }) {
    this.form = data;
  }

  getItemIncrementOptions() {
    return Object.assign([], this.priceIncrementOptions).reverse();
  }

  getCartItemTotal(product: IProductResponse): string {
    const index = this.products.findIndex(item => this.productService.compareProducts(item, product));
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

  formIsValid() {
    if (this.formComponent) {
      return this.formComponent.formIsValid();
    }

    return false;
  }

  getCartTotal() {
    const prices = this.products.map(product => this.getCartItemTotal(product));
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

  getCustomerButtons() {
    return [{
      label: 'Alterar',
      icon: 'pencil',
      color: 'tertiary',
      handler: () => { this.onPreviews(); },
    }];
  }

  getProductIncrement(product: IProductResponse) {
    const index = this.products.findIndex(item => this.productService.compareProducts(item, product));
    const increment = this.productsSettings[index].priceIncrement;
    return increment.toString();
  }

  onExpandItemClick(index: number) {
    this.expandItem.emit(index);
    this.ref.detectChanges();
  }

  onRemoveOneClick(product: IProductResponse) {
    this.removeOneToCart.emit(product);
  }

  onAddOneClick(product: IProductResponse) {
    this.addOneToCart.emit(product);
  }

  onDetailsClick(product: IProductResponse) {
    this.itemDetails.emit(product);
  }

  onRemoveClick(product: IProductResponse) {
    this.removeItem.emit(product);
  }

  onPriceIncrementChange() {
    const value = this.cartForm.finalPriceIncrement.value;
    this.priceIncrementChange.emit(value);
    this.ref.detectChanges();
  }

  onProductPriceIncrementChange(index: number, value: string) {
    this.itemPriceIncrementChange.emit({ index, value });
    this.ref.detectChanges();
  }

  onProductPriceChange(input: IonInput, product: IProductResponse) {
    this.itemPriceChange.emit({ input, product });
    this.ref.detectChanges();
  }

  async onCustomerChange(id: string) {
    this.loading = true;
    Object.keys(this.form).forEach(key => this.form[key].disable());
    let selectedUserData: ICustomerResponse;

    if (id) {
      selectedUserData = (await this.customersService.getOne(id, this.loggedUser)).cliente;

      if (selectedUserData) {
        this.selectCustomer.emit(selectedUserData);
        this.formComponent.setCustomerData(selectedUserData);
      }
    }
    else {
      this.selectCustomer.emit(undefined);
    }

    if (!selectedUserData) {
      this.formComponent.clear();
    }
    Object.keys(this.form).forEach(key => this.form[key].enable());
    this.loading = false;
  }

  async onCloseClick() {
    this.closeClick.emit();
  }

  onNextClick() {
    this.steps.next();
  }

  async onPreviews() {
    this.steps.previews();
  }

  async onSubmitCustomer() {
    this.saving = true;
    Object.keys(this.form).forEach(key => this.form[key].disable());

    const formData = this.formComponent.getFormData();
    try {
      if (this.selectedCustomerData) {
        const updateResult = await this.customersService.update(
          this.selectedCustomerData.id,
          formData,
          this.loggedUser,
        );

        const toast = await this.toastController.create({
          color: 'success',
          message: `Cadastro atualizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();

        this.selectCustomer.emit({
          ...updateResult.cli,
          ...updateResult.end,
          id: updateResult.cliente_id,
        });
      }
      else {
        const id = (await this.customersService.create(
          formData,
          this.loggedUser,
        )).cliente_id;

        const toast = await this.toastController.create({
          color: 'success',
          message: `Cadastro realizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();

        this.selectCustomer.emit({
          ...formData.cli,
          ...formData.end,
          id
        });
      }
      this.onNextClick();
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível salvar agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.saving = false;
    Object.keys(this.form).forEach(key => this.form[key].enable());
  }

  async onFinishQuoteClick() {
    this.saving = true;
    Object.keys(this.form).forEach(key => this.form[key].disable());

    if (this.products.length) {
      const prods: { [key: string]: IProductResponse } = {};
      const prices: IQuoteItemsValues = { opcionais: {} };
      const quantities: IQuoteItemsValues = { opcionais: {} };
      const additionalPrices: IQuoteItemsValues = { opcionais: {} };

      this.products.forEach((item, index) => {
        prods[item.id] = item;
        prices.opcionais[item.id] = this.getCartItemTotal(item);
        quantities.opcionais[item.id] = this.productsSettings[index].quantity.toString();
        additionalPrices.opcionais[item.id] = this.getProductIncrement(item);
      });

      try {
        const result = await this.quotesService.create({
          cliente_id: this.selectedCustomerData.id,
          orc: {
            opcionais: prods,
            valores: prices,
            quantidades: quantities,
            acrescimos: additionalPrices,
            valor_total: this.getCartTotal(),
          },
        }, this.loggedUser);

        this.onCloseClick();

        this.router.navigate(['/quote-pdf', result.orcamento_data.id, 'open']);
      }
      catch (e) {
        const error = await this.alertController.create({
          header: 'Erro:',
          message: e?.message || 'Não foi possível fechar o orçamento agora, tente novamente mais tarde.',
          buttons: ['OK'],
        });
        await error.present();
      }
    }

    this.saving = false;
    Object.keys(this.form).forEach(key => this.form[key].enable());
  }
}
