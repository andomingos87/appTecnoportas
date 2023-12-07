import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonModal, Platform, ToastController } from '@ionic/angular';

import { AuthService, IUserData } from '../global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';
import { numberToDecimalFormat } from '../global/global.helpers';
import { IButtonData } from '../global/global.interfaces';
import { ICustomerResponse } from '../my-customers/customers.service';
import { IQuoteProductSettings } from '../quotes/quotes.interfaces';
import { IProductResponse } from './product.interfaces';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  @ViewChild('productDetails')
  private productDetailsModal: IonModal;

  @ViewChild('cart')
  private cartModal: IonModal;

  public loggedUser: IUserData;

  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public cartProducts: IProductResponse[] = [];
  public cartProductsSettings: IQuoteProductSettings[] = [];
  public cartSelectedCustomerData: ICustomerResponse;

  public selectedProduct: IProductResponse;
  public searchTerm: string;

  public headerButton: IButtonData = {
    label: 'Ver Carrinho',
    handler: () => this.onViewCartClick.bind(this)(),
  };

  public itemButtons: IButtonData[] = [
    {
      label: 'Detalhes',
      color: 'medium',
      icon: 'ellipsis-vertical',
      handler: (item) => this.onDetailsClick.bind(this)(item),
    },
    {
      label: 'Carrinho',
      color: 'success',
      icon: 'add',
      handler: (item) => this.addToCart.bind(this)(item),
    },
  ];

  private isCartOpen = false;

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    private toastController: ToastController,
    private authService: AuthService,
    private productService: ProductService,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
  }

  async addToCart(product: IProductResponse, quantity?: number, showToast?: boolean) {
    const hasProductIndex = this.cartProducts.findIndex(item => item.id === product.id);

    const totalQuantity = quantity || 1;

    this.ngZone.run(() => {
      if (hasProductIndex > -1) {
        const settings = this.cartProductsSettings;
        settings[hasProductIndex].quantity += totalQuantity;
        this.cartProductsSettings = settings;
      }

      if (hasProductIndex === -1) {
        const settings = { expand: false, quantity: totalQuantity, priceIncrement: 0 };
        if (product.valor_unitario === '0.00') {
          settings.expand = true;
        }
        this.cartProductsSettings = [
          ...this.cartProductsSettings,
          settings,
        ];
        this.cartProducts = [
          ...this.cartProducts,
          product,
        ];
      }
    });

    if (showToast !== false) {
      const toast = await this.toastController.create({
        message: 'Produto adicionado ao carrinho',
        color: 'success',
        buttons: [
          {
            text: 'Ver Carrinho',
            handler: this.onViewCartClick.bind(this),
          }
        ],
        duration: 2000,
      });

      await toast.present();
    }
  }

  removeOneFromCart(product: IProductResponse) {
    const hasProductIndex = this.cartProducts.findIndex(item => item.id === product.id);

    if (hasProductIndex === -1) {
      return;
    }

    this.ngZone.run(() => {
      const settings = this.cartProductsSettings;
      let quantity = settings[hasProductIndex].quantity;

      if (quantity > 1) {
        quantity--;
      }

      settings[hasProductIndex].quantity = quantity;
      this.cartProductsSettings = settings;
    });
  }

  async removeFromCart(product: IProductResponse) {
    const hasProductIndex = this.cartProducts.findIndex(item => item.id === product.id);

    if (hasProductIndex === -1) {
      return;
    }

    this.ngZone.run(() => {
      this.cartProducts = this.cartProducts.filter((item, index) => index !== hasProductIndex);
      this.cartProductsSettings = this.cartProductsSettings.filter((item, index) => index !== hasProductIndex);
    });
    const toast = await this.toastController.create({
      message: 'Produto removido ao carrinho',
      color: 'success',
      buttons: [
        {
          text: 'Ver Carrinho',
          handler: this.onViewCartClick.bind(this),
        }
      ],
      duration: 2000,
    });

    await toast.present();
  }

  async closeDetailsModal() {
    await this.productDetailsModal.dismiss(null, 'cancel');
  }

  async closeCartModal() {
    await this.cartModal.dismiss(null, 'cancel');
    this.isCartOpen = false;
  }

  onExpandCartItemClick(index: number) {
    this.ngZone.run(() => {
      this.cartProductsSettings[index] = {
        ...this.cartProductsSettings[index],
        expand: !this.cartProductsSettings[index].expand,
      };
    });
  }

  onCartPriceIncrementChange(value: number) {
    this.ngZone.run(() => {
      this.cartProductsSettings = this.cartProductsSettings.map(item => ({ ...item, priceIncrement: value }));
    });
  }

  onCartProductPriceIncrementChange(data: { index: number; value: string }) {
    this.ngZone.run(() => {
      const settings = this.cartProductsSettings;
      settings[data.index].priceIncrement = Number(data.value);
      this.cartProductsSettings = settings;
    });
  }

  onCartProductPriceChange(data: { input: IonInput; product: IProductResponse }) {
    numberToDecimalFormat(data.input, '.', 2);
    const index = this.cartProducts.findIndex(item => this.productService.compareProducts(item, data.product));
    if (index > -1) {
      this.ngZone.run(() => {
        const settings = this.cartProductsSettings;
        settings[index].price = data.input.value.toString();
        this.cartProductsSettings = settings;
      });
    }
  }

  async onDetailsClick(product: IProductResponse) {
    if (this.isCartOpen) {
      await this.closeCartModal();
    }

    this.selectedProduct = product;
    await this.productDetailsModal.present();
  }

  async onViewCartClick() {
    await this.cartModal.present();
    this.isCartOpen = true;
  }

  onCartSelectCustomer(data: ICustomerResponse) {
    this.cartSelectedCustomerData = data;
  }

}
