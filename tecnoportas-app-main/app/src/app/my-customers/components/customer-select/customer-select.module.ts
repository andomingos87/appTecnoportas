import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CustomerSelectComponent } from './customer-select.component';

@NgModule({
  declarations: [CustomerSelectComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: [CustomerSelectComponent],
})
export class CustomerSelectModule { }
