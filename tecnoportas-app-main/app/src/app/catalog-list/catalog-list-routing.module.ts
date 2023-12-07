import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogListPage } from './catalog-list.page';

const routes: Routes = [
  {
    path: '',
    component: CatalogListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogListPageRoutingModule { }
