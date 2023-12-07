import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUserData } from 'src/app/global/auth.service';

import { CustomersService, ICustomerResponse } from '../../customers.service';

@Component({
  selector: 'app-customer-select',
  templateUrl: './customer-select.component.html',
  styleUrls: ['./customer-select.component.scss'],
})
export class CustomerSelectComponent implements OnInit, OnDestroy {
  @Input()
  public placeholder = 'selecione um cliente';

  @Input()
  public loggedUser: IUserData;

  @Input()
  public selectedId: string;

  @Output()
  private customerChange = new EventEmitter<string>();

  public select = new FormControl('');

  public customersList: ICustomerResponse[] = [];
  public loading = false;

  private updateCustomerListener: number;

  constructor(
    private customersService: CustomersService,
  ) { }

  ngOnInit() {
    this.getAllCustomers();
    this.updateCustomerListener = this.customersService.onCustomersChange((() => {
      this.customersList = [];
      setTimeout(this.getAllCustomers.bind(this), 1000);
    }).bind(this));
  }

  ngOnDestroy() {
    this.customersService.removeCustomersChangeListener(this.updateCustomerListener);
  }

  async getAllCustomers() {
    this.loading = true;
    this.customersList = [];
    this.select.disable();

    this.customersList = await this.customersService.getAll(this.loggedUser);

    if (this.customersList?.length && this.selectedId) {
      this.select.setValue(this.selectedId);
    }

    this.select.enable();
  }

  onSelectChange() {
    this.customerChange.emit(this.select.value);
  }
}
