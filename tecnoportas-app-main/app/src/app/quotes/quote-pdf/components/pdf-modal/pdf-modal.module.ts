import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { PdfModalComponent } from './pdf-modal.component';


@NgModule({
  declarations: [PdfModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    PdfJsViewerModule,
  ],
  exports: [PdfModalComponent],
})
export class PdfModalModule { }
