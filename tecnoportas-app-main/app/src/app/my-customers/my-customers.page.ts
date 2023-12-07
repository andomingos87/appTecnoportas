import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';

import { AuthService, IUserData } from '../global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';
import { CustomersService, ICustomerResponse } from './customers.service';

@Component({
  selector: 'app-my-customers',
  templateUrl: './my-customers.page.html',
  styleUrls: ['./my-customers.page.scss'],
})
export class MyCustomersPage implements OnInit, OnDestroy {
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public loggedUser: IUserData;
  public form = {
    search: new FormControl(''),
  };

  public customersList: ICustomerResponse[] = [];

  public empty = false;
  public searchTerm: string;

  private searchTime: any;
  private customerListener: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private platform: Platform,
    private customersService: CustomersService,
    private alertController: AlertController,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    await this.getAllCustomers();
    this.customerListener = this.customersService.onCustomersChange((() => {
      this.customersList = [];
      setTimeout(this.getAllCustomers.bind(this), 1000);
    }).bind(this));
  }

  ngOnDestroy(): void {
    this.customersService.removeCustomersChangeListener(this.customerListener);
  }

  async getAllCustomers() {
    this.empty = false;
    this.searchTime = undefined;
    this.customersList = [];

    this.form.search.disable();

    const customers = this.filterBySearch(await this.customersService.getAll(this.loggedUser));
    this.customersList = customers;

    if (this.form.search.value) {
      this.searchTerm = `Clientes com: ${this.form.search.value}`;
    }

    if (this.customersList.length === 0) {
      this.empty = true;
    }

    this.form.search.enable();
  }

  getItemButtons(customer: ICustomerResponse) {
    return [
      {
        label: 'Editar',
        icon: 'pencil',
        color: 'tertiary',
        handler: () => { this.onEditClick(customer); },
      },
      {
        label: 'Deletar',
        icon: 'trash',
        color: 'danger',
        handler: () => { this.onDeleteCustomerClick(customer); },
      },
    ];
  }

  onEditClick(customer: ICustomerResponse) {
    this.router.navigate(['/my-customers', 'edit-customer', customer.id]);
  }

  async onDeleteCustomerClick(customer: ICustomerResponse) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Desseja mesmo deletar esse cliente? Essa operação não poderá ser desfeita.',
      buttons: ['Cancelar', {
        text: 'Ok',
        handler: (() => {
          this.customersService.delete(customer.id, this.loggedUser);
        }).bind(this),
      }]
    });

    await alert.present();
  }

  onNewCustomerClick() {
    this.router.navigate(['/my-customers', 'add-customer']);
  }

  onSearchChange() {
    if (this.searchTime) {
      clearInterval(this.searchTime);
      this.searchTime = undefined;
    }
    this.searchTime = setTimeout(this.getAllCustomers.bind(this), 1000);
  }

  private filterBySearch(items: ICustomerResponse[]): ICustomerResponse[] {
    const search = this.form.search.value?.trim()?.toLowerCase();
    let result = items;

    if (search) {
      result = items.filter(
        item => Object.keys(item).filter(
          key => item[key]?.toLowerCase().indexOf(search) > -1
        ).length,
      );
    }

    return result;
  }

}
