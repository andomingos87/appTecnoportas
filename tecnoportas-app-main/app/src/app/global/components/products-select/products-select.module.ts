import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProductsSelectComponent } from './products-select.component';

@NgModule({
  declarations: [ProductsSelectComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ProductsSelectComponent],
})
export class ProductsSelectModule { }
