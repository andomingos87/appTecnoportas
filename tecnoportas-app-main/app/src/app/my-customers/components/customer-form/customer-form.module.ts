import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';

import { CustomerFormComponent } from './customer-form.component';

@NgModule({
  declarations: [CustomerFormComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    BrMaskerModule as any,
  ],
  exports: [CustomerFormComponent],
})
export class CustomerFormModule { }
