import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerFormModule } from '../components/customer-form/customer-form.module';
import { AddCustomerPageRoutingModule } from './add-customer-routing.module';
import { AddCustomerPage } from './add-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCustomerPageRoutingModule,
    CustomerFormModule,
  ],
  declarations: [AddCustomerPage]
})
export class AddCustomerPageModule {}
