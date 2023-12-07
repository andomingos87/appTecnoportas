import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrMaskerModule } from 'br-mask';

import { CustomerDetailsModule } from '../../global/components/customer-details/customer-details.module';
import { ProductsSelectModule } from '../../global/components/products-select/products-select.module';
import { StepsModule } from '../../global/components/steps/steps.module';
import { CustomerFormModule } from '../../my-customers/components/customer-form/customer-form.module';
import { CustomerSelectModule } from '../../my-customers/components/customer-select/customer-select.module';
import { DoorAutomatorComponent } from './components/door-automator/door-automator.component';
import { DoorEngineTypeComponent } from './components/door-engine-type/door-engine-type.component';
import { DoorPortholeComponent } from './components/door-porthole/door-porthole.component';
import { DoorSettingsComponent } from './components/door-settings/door-settings.component';
import { DoorTypeComponent } from './components/door-type/door-type.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { NewQuotePageRoutingModule } from './new-quote-routing.module';
import { NewQuotePage } from './new-quote.page';
import { DoorPaintModule } from './components/door-paint/door-paint.module';
import { DoorEngineTypeModule } from './components/door-engine-type/door-engine-type.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrMaskerModule as any,
    IonicModule,
    NewQuotePageRoutingModule,
    StepsModule,
    CustomerSelectModule,
    CustomerFormModule,
    CustomerDetailsModule,
    ReactiveFormsModule,
    ProductsSelectModule,
    DoorPaintModule,
    DoorEngineTypeModule,
  ],
  declarations: [
    NewQuotePage,
    DoorSettingsComponent,
    DoorTypeComponent,
    DoorAutomatorComponent,
    DoorPortholeComponent,
    MaterialListComponent,
  ],
})
export class NewQuotePageModule { }
