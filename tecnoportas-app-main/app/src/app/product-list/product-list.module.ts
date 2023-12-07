import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductsSelectModule } from '../global/components/products-select/products-select.module';
import { ProductCartModule } from './components/product-cart/product-cart.module';
import { ProductDetailsModule } from './components/product-details/product-details.module';
import { ProductListPageRoutingModule } from './product-list-routing.module';
import { ProductListPage } from './product-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductListPageRoutingModule,
    ProductCartModule,
    ProductDetailsModule,
    ProductsSelectModule,
  ],
  declarations: [ProductListPage]
})
export class ProductListPageModule {}
