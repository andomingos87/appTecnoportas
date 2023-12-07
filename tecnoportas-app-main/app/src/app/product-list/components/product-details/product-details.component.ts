import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IProductResponse } from '../../product.interfaces';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  @Output()
  public closeClick = new EventEmitter();

  @Output()
  public addToCart = new EventEmitter<{ product: IProductResponse; quantity: number }>();

  @Input()
  public selectedProduct?: IProductResponse;

  public form = {
    quantity: new FormControl(1),
  };

  constructor() { }

  ngOnInit() {}

  onAddToCartClick(quantity: number) {
    this.addToCart.emit({ product: this.selectedProduct, quantity });
  }

  onCloseClick() {
    this.form.quantity.setValue(1);
    this.closeClick.emit();
  }

}
