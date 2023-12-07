import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerDetailsModule } from '../global/components/customer-details/customer-details.module';
import { MyCustomersPageRoutingModule } from './my-customers-routing.module';
import { MyCustomersPage } from './my-customers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CustomerDetailsModule,
    MyCustomersPageRoutingModule
  ],
  declarations: [MyCustomersPage]
})
export class MyCustomersPageModule {}
