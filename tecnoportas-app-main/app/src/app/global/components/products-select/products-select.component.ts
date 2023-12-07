import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonInfiniteScroll } from '@ionic/angular';

import { IProductResponse } from '../../../product-list/product.interfaces';
import { ProductService } from '../../../product-list/product.service';
import { IUserData } from '../../auth.service';
import { ALL_PRODUCT_CATEGORIES } from '../../global.constants';
import { IButtonData } from '../../global.interfaces';

@Component({
  selector: 'app-products-select',
  templateUrl: './products-select.component.html',
  styleUrls: ['./products-select.component.scss'],
})
export class ProductsSelectComponent implements OnInit {

  @Input()
  public headerButton: IButtonData;

  @Input()
  public showSearch = true;

  @Input()
  public showCategories = true;

  @Input()
  public itemButtons: IButtonData[] = [];

  @Input()
  public loggedUser: IUserData;

  @Input()
  public defaultSearch = '';

  @Input()
  public defaultCategory = 'Tudo';

  @Output()
  public productClick = new EventEmitter<IProductResponse>();

  public allCategories = ALL_PRODUCT_CATEGORIES;

  public form = {
    search: new FormControl(''),
    category: new FormControl('Tudo'),
  };

  public products: IProductResponse[] = [];
  public productsSettings: { expand: boolean }[] = [];
  public empty = false;
  public searchTerm: string;

  private limit = 10;
  private offset = 0;
  private searchTime: any;

  constructor(
    private productService: ProductService
  ) { }

  async ngOnInit() {
    this.form.category.setValue(this.defaultCategory);
    this.form.search.setValue(this.defaultSearch);
    await this.getAllProducts();
  }

  async getAllProducts() {
    this.offset = 0;
    this.empty = false;
    this.searchTime = undefined;
    this.products = [];
    this.searchTerm = undefined;

    this.form.search.disable();
    this.form.category.disable();

    this.products = await this.productService.getAll({
      limit: this.limit,
      offset: this.offset,
      search: this.form.search.value || undefined,
      category: this.form.category.value || undefined,
    }, this.loggedUser);

    this.productsSettings = this.products.map(() => ({ expand: false }));

    if (this.form.search.value) {
      this.searchTerm = `Produtos com: ${this.form.search.value}`;
    }
    else if (this.form.category.value && this.form.category.value !== 'Tudo') {
      this.searchTerm = `Mostrando ${this.form.category.value}`;
    }

    if (this.products.length === 0) {
      this.empty = true;
    }

    this.form.search.enable();
    this.form.category.enable();
  }

  onExpandClick(index: number) {
    this.productsSettings[index] = {
      ...this.productsSettings[index],
      expand: !this.productsSettings[index].expand,
    };
  }

  onSearchChange() {
    if (this.searchTime) {
      clearInterval(this.searchTime);
      this.searchTime = undefined;
    }
    this.searchTime = setTimeout(this.getAllProducts.bind(this), 1000);
  }

  async onCategoryChange() {
    await this.getAllProducts();
  }

  async onLoadMoreData(event: Event) {
    const target = event.target as unknown as IonInfiniteScroll;
    this.offset = this.products.length;

    this.form.search.disable();
    this.form.category.disable();

    const newProducts = await this.productService.getAll({
      limit: this.limit,
      offset: this.offset,
      search: this.form.search.value || undefined,
    }, this.loggedUser);

    const newSettings = newProducts.map(() => ({ expand: false }));
    this.productsSettings = [
      ...this.productsSettings,
      ...newSettings,
    ];
    this.products = [
      ...this.products,
      ...newProducts,
    ];
    await target.complete();

    this.form.search.enable();
    this.form.category.enable();
  }

  async onProductClick(product: IProductResponse) {
    this.productClick.emit(product);
  }

}
