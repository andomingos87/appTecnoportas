import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { CatalogListPageRoutingModule } from './catalog-list-routing.module';
import { CatalogListPage } from './catalog-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfJsViewerModule,
    CatalogListPageRoutingModule
  ],
  declarations: [CatalogListPage]
})
export class CatalogListPageModule {}
