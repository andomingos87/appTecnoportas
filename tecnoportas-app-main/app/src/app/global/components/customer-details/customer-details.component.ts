import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';

import { ICustomerResponse } from '../../../my-customers/customers.service';
import { IButtonData } from '../../global.interfaces';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {

  @Input()
  public customer: ICustomerResponse;

  @Input()
  public personTypeLabel = true;

  @Input()
  public buttons: IButtonData[] = [];

  @Output()
  public itemClick = new EventEmitter();

  public expand = false;
  public currentButtons = [];

  constructor(
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.currentButtons = this.buttons;
  }

  // Evitar que o botão editar fique piscando ao realizar o scroll da tela na etapa 8
  ngOnChanges() {
    if(this.buttons.length != this.currentButtons.length){
      this.currentButtons = this.buttons;
    }
  }

  onItemClick() {
    this.itemClick.emit();
  }

  onExpandClick() {
    this.ngZone.run(() => {
      this.expand = !this.expand;
    });
  }
}
