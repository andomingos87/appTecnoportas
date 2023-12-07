import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { PdfModalModule } from './components/pdf-modal/pdf-modal.module';
import { QuotePdfPageRoutingModule } from './quote-pdf-routing.module';
import { QuotePdfPage } from './quote-pdf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    PdfModalModule,
    QuotePdfPageRoutingModule
  ],
  declarations: [QuotePdfPage],
})
export class QuotePdfPageModule { }
