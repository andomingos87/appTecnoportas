import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerFormModule } from '../components/customer-form/customer-form.module';
import { EditCustomerPageRoutingModule } from './edit-customer-routing.module';
import { EditCustomerPage } from './edit-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCustomerPageRoutingModule,
    CustomerFormModule,
  ],
  declarations: [EditCustomerPage]
})
export class EditCustomerPageModule {}
