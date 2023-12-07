import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CustomerDetailsComponent } from './customer-details.component';

@NgModule({
    declarations: [CustomerDetailsComponent],
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [CustomerDetailsComponent],
})
export class CustomerDetailsModule { }
