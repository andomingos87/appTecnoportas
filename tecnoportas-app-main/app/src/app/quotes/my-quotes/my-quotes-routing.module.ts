import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyQuotesPage } from './my-quotes.page';

const routes: Routes = [
  {
    path: '',
    component: MyQuotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyQuotesPageRoutingModule {}
