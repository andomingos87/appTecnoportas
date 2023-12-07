import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerDetailsModule } from '../../../global/components/customer-details/customer-details.module';
import { StepsModule } from '../../../global/components/steps/steps.module';
import { CustomerSelectModule } from '../../../my-customers/components/customer-select/customer-select.module';
import { CustomerFormModule } from './../../../my-customers/components/customer-form/customer-form.module';
import { ProductCartComponent } from './product-cart.component';

@NgModule({
  declarations: [ProductCartComponent],
  imports: [
    CommonModule,
    IonicModule,
    StepsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerSelectModule,
    CustomerFormModule,
    CustomerDetailsModule,
  ],
  exports: [ProductCartComponent],
})
export class ProductCartModule { }
