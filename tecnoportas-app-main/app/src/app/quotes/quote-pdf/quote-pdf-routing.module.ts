import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotePdfPage } from './quote-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: QuotePdfPage
  },
  {
    path: ':action',
    component: QuotePdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotePdfPageRoutingModule {}
