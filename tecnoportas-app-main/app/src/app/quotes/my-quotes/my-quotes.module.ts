import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PdfModalModule } from '../quote-pdf/components/pdf-modal/pdf-modal.module';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';
import { MyQuotesPageRoutingModule } from './my-quotes-routing.module';
import { MyQuotesPage } from './my-quotes.page';
import { QuoteEditComponent } from './components/quote-edit/quote-edit.component';
import { QuoteEditProductsComponent } from './components/quote-edit-products/quote-edit-products.component';
import { DoorPaintModule } from '../new-quote/components/door-paint/door-paint.module';
import { DoorEngineTypeModule } from '../new-quote/components/door-engine-type/door-engine-type.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PdfModalModule,
    MyQuotesPageRoutingModule,
    DoorPaintModule,
    DoorEngineTypeModule,
  ],
  declarations: [
    MyQuotesPage,
    QuoteDetailsComponent,
    QuoteEditComponent,
    QuoteEditProductsComponent
  ]
})
export class MyQuotesPageModule {}
