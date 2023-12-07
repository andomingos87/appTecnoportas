import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AuthService, IUserData } from 'src/app/global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from 'src/app/global/global.constants';

import { CustomerFormComponent } from '../components/customer-form/customer-form.component';
import { CustomersService, ICustomerData, ICustomerResponse } from '../customers.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.page.html',
  styleUrls: ['./edit-customer.page.scss'],
})
export class EditCustomerPage implements OnInit {
  @ViewChild('form')
  public formComponent: CustomerFormComponent;

  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public loggedUser: IUserData;
  public customerData: ICustomerResponse;

  public saving = false;

  public form: { [key: string]: FormControl };

  public customerId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private customerService: CustomersService,
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
  }

  async getCustomerData() {
    this.customerData = undefined;

    Object.keys(this.form).forEach(key => this.form[key].disable());

    this.customerData = (
      await this.customerService.getOne(this.customerId, this.loggedUser)
    ).cliente;

    if (this.customerData) {
      this.formComponent.setCustomerData(this.customerData);
    }

    Object.keys(this.form).forEach(key => this.form[key].enable());
  }

  async getForm(data: { [key: string]: FormControl }) {
    this.form = data;
    this.customerId = this.route.snapshot.paramMap.get('id');
    await this.getCustomerData();
  }

  async onSubmit(data: { [key: string]: FormControl }) {
    this.form = data;

    this.saving = true;
    Object.keys(this.form).forEach(key => this.form[key].disable());

    try {
      await this.customerService.update(
        this.customerId,
        this.formComponent.getFormData(),
        this.loggedUser,
      );

      const toast = await this.toastController.create({
        color: 'success',
        message: `Cadastro atualizado com sucesso!`,
        duration: 2000,
      });
      await toast.present();
      this.router.navigate(['/my-customers']);
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível salvar agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.saving = false;
    Object.keys(this.form).forEach(key => this.form[key].enable());
  }

  onBackClick() {
    this.router.navigate(['/my-customers']);
  }

}
