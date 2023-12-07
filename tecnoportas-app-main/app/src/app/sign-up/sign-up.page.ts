import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { AuthService, ISignUpData } from '../global/auth.service';
import { GeneralService } from '../global/general.service';
import { ADDRESS_STATES_BR, DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public saving = false;

  public states: string[] = [];

  public form = {
    personType: new FormControl('f', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern(/^([a-zA-Z]+\s[a-zA-Z]+)/)]),
    companyName: new FormControl('', [Validators.required, Validators.pattern(/^([a-zA-Z]+\s[a-zA-Z]+)/)]),
    companyNickName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.minLength(14)]),
    rg: new FormControl('', [Validators.minLength(12)]),
    cnpj: new FormControl('', [Validators.required, Validators.minLength(18)]),
    ie: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.minLength(14)]),
    cep: new FormControl('', [Validators.minLength(9)]),
    city: new FormControl(''),
    state: new FormControl(''),
    address: new FormControl(''),
    addressNumber: new FormControl(''),
    termsAccepted: new FormControl(false, [Validators.requiredTrue]),
  };

  private appTermsOfUse: string;

  constructor(
    private router: Router,
    private platform: Platform,
    private general: GeneralService,
    private toastController: ToastController,
    private alertController: AlertController,
    private auth: AuthService,
  ) {
    this.states = Object.keys(ADDRESS_STATES_BR).map(key => key);
  }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
  }

  formIsValid() {
    const personType = this.form.personType.value;
    const ignoreFields = {
      f: ['companyName', 'companyNickName', 'cnpj', 'ie'],
      j: ['name', 'cpf', 'rg'],
    };
    return Object.keys(this.form).filter(
      key => ignoreFields[personType].indexOf(key) === -1,
    ).filter(key => (this.form[key] as FormControl).invalid).length === 0;
  }

  async getFormData(): Promise<ISignUpData> {
    const invalidFields: string[] = [];
    const personType = this.form.personType.value;
    const phone = this.form.phone.value.replace(/[)(\s-]/g, '');
    const result: Partial<ISignUpData> = {};

    result.cep = this.form.cep.value;
    result.cidade = this.form.city.value;
    result.estado = this.form.state.value;
    result.numero = this.form.addressNumber.value;
    result.endereco = this.form.address.value;
    result.email = this.form.email.value;
    result.nomeUsuario = this.form.username.value;
    result.telefone = phone;

    if (this.form.password.value === this.form.confirmPassword.value) {
      result.senha = this.form.password.value;
    }
    else {
      invalidFields.push('Confirmar Senha');
    }

    if (personType === 'j') {
      result.nome = this.form.companyName.value;
      result.sobrenome = this.form.companyNickName.value;
      result.cpf = this.form.cnpj.value;
      result.rg = this.form.ie.value;

      if (!result.cpf) {
        invalidFields.push('CNPJ');
      }

      if (!result.rg) {
        invalidFields.push('IE');
      }

      if (!result.telefone) {
        invalidFields.push('Telefone');
      }

      if (!result.cep) {
        invalidFields.push('CEP');
      }

      if (!result.cidade) {
        invalidFields.push('Cidade');
      }

      if (!result.estado) {
        invalidFields.push('Estado');
      }

      if (!result.endereco) {
        invalidFields.push('Logradouro');
      }

      if (!result.numero) {
        invalidFields.push('Número');
      }
    }

    if (personType === 'f') {
      const fullNameSplit = this.form.name.value?.split(' ');

      result.sobrenome = fullNameSplit.splice(fullNameSplit.length - 1, 1).join('');
      result.nome = fullNameSplit.join(' ');
      result.cpf = this.form.cpf.value;
      result.rg = this.form.rg.value;
    }

    if (invalidFields.length > 0) {
      const alert = await this.alertController.create({
        header: 'Atenção:',
        message: `Para realizar seu cadastro, por favor verifique os seguintes campos: ${invalidFields.join(', ')}`,
        buttons: ['ok'],
      });

      await alert.present();
      return undefined;
    }

    return result as ISignUpData;
  }

  async onTermsClick(event: MouseEvent) {
    event.preventDefault();

    const loading = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Carregando os termos...`,
      backdropDismiss: false,
    });

    if (!this.appTermsOfUse) {
      await loading.present();
    }

    try {
      this.appTermsOfUse = (await this.general.getAllAppConfigs()).termos_uso?.replace(/\n/g, '<br/>');

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Termos de Uso',
        message: this.appTermsOfUse,
        buttons: ['ok'],
      });

      await alert.present();
    }
    catch (e) {
      await loading.dismiss();

      const errorMessage = await this.alertController.create({
        header: 'Erro ao carregar os termos!',
        message: `Não foi possível obter os termos no momento, tente novamente mais tarde.`,
        buttons: ['OK'],
      });

      await errorMessage.present();
    }
  }

  async onSubmitClick() {
    const formData = await this.getFormData();

    if (!this.formIsValid() || !formData) {
      return;
    }

    this.saving = true;
    Object.keys(this.form).forEach(key => this.form[key].disable());

    try {
      await this.auth.signUp(formData);

      const toast = await this.toastController.create({
        color: 'success',
        message: `
        Pré-Cadastro realizado com sucesso, você já pode iniciar sessão em nosso aplicativo, 
        mas para ter acesso completo aguarde o contato de nossos administradores.
        `,
        buttons: ['OK'],
        duration: 5000,
      });
      await toast.present();
      this.router.navigate(['/home']);
    }
    catch (e) {
      console.log(e);
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.error?.text || e?.message || 'Não foi possível cadastrar agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.saving = false;
    Object.keys(this.form).forEach(key => this.form[key].enable());
  }
}
