import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCustomersPage } from './my-customers.page';

const routes: Routes = [
  {
    path: '',
    component: MyCustomersPage
  },
  {
    path: 'add-customer',
    loadChildren: () => import('./add-customer/add-customer.module').then( m => m.AddCustomerPageModule)
  },
  {
    path: 'edit-customer/:id',
    loadChildren: () => import('./edit-customer/edit-customer.module').then( m => m.EditCustomerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCustomersPageRoutingModule {}
