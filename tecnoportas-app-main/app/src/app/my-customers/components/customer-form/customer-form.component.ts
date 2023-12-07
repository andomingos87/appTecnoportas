import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ADDRESS_STATES_BR } from 'src/app/global/global.constants';

import { ICustomerData, ICustomerForm, ICustomerResponse } from '../../customers.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {

  @Input()
  public addHeader = true;

  @Input()
  public addButtons = true;

  @Input()
  public loading = false;

  @Input()
  public saving = false;

  @Output()
  public getForm = new EventEmitter();

  @Output()
  public submitForm = new EventEmitter();

  @Output()
  public goBackClick = new EventEmitter();

  public states: string[] = [];

  public form = {
    personType: new FormControl('f', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern(/^([a-zA-Z]+\s[a-zA-Z]+)/)]),
    companyName: new FormControl('', [Validators.pattern(/^([a-zA-Z]+\s[a-zA-Z]+)/)]),
    companyNickName: new FormControl('', [Validators.required]),
    document: new FormControl(''),
    street: new FormControl(''),
    number: new FormControl(''),
    complement: new FormControl(''),
    country: new FormControl('Brasil'),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(14)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
  };

  constructor() {
    this.states = Object.keys(ADDRESS_STATES_BR).map(key => key);
  }

  ngOnInit() {
    this.getForm.emit(this.form);
  }

  setCustomerData(data: ICustomerResponse) {
    this.form.personType.setValue(data.tipo);
    this.form.name.setValue(data.nome + ' ' + data.sobrenome);
    this.form.companyName.setValue(data.nome);
    this.form.companyNickName.setValue(data.sobrenome);
    this.form.document.setValue(data.cnpj);
    this.form.street.setValue(data.logradouro);
    this.form.number.setValue(data.endNumero);
    this.form.complement.setValue(data.referencia);
    this.form.country.setValue(data.pais);
    this.form.email.setValue(data.email);
    this.form.phone.setValue( data.numero.length > 8 ? `${data.ddd}${data.numero.substring(0, 5)}${data.numero.substring(5)}` : `(${data.ddd})${data.numero.substring(0, 4)}${data.numero.substring(4)}`);
    this.form.city.setValue(data.cidade);
    this.form.state.setValue(data.uf);
  }

  getFormData(): ICustomerForm {
    const cli: Partial<ICustomerData> = {};
    const personType = this.form.personType.value;
    const phone = this.form.phone.value.replace(/[)(\s-]/g, '');

    cli.tipo = personType;

    if (personType === 'j') {
      cli.nome = this.form.companyName.value;
      cli.sobrenome = this.form.companyNickName.value;
    }

    if (personType === 'f') {
      const fullNameSplit = this.form.name.value?.split(' ');

      cli.sobrenome = fullNameSplit.splice(fullNameSplit.length - 1, 1).join('');
      cli.nome = fullNameSplit.join(' ');
    }

    cli.email = this.form.email.value;
    cli.ddd = phone.substring(0, 2);
    cli.numero = phone.substring(2);
    cli.cnpj = this.form.document.value ? this.form.document.value.replace(/[^\d]/g, "") : null;

    return {
      cli: cli as ICustomerData,
      end: {
        cidade: this.form.city.value,
        uf: this.form.state.value,
        logradouro: this.form.street.value,
        numero: this.form.number.value,
        referencia: this.form.complement.value,
        pais: this.form.country.value
      },
    };
  }

  clear() {
    Object.keys(this.form).forEach(key => this.form[key].setValue(''));
    this.form.personType.setValue('f');
  }

  formIsValid() {
    const personType = this.form.personType.value;
    const ignoreFields = {
      f: ['companyName', 'companyNickName'],
      j: ['name'],
    };
    return Object.keys(this.form).filter(
      key => ignoreFields[personType].indexOf(key) === -1,
    ).filter(key => (this.form[key] as FormControl).invalid).length === 0;
  }

  onBackClick() {
    this.goBackClick.emit();
  }

  async onSubmitClick() {
    if (!this.formIsValid()) {
      return;
    }

    this.submitForm.emit(this.form);
  }
}
