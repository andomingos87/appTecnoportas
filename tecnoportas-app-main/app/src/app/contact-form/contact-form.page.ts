import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { AuthService, IUserData } from '../global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.page.html',
  styleUrls: ['./contact-form.page.scss'],
})
export class ContactFormPage implements OnInit, OnDestroy {
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public loggedUser: IUserData;
  public saving = false;

  public form = {
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required]),
  };

  private loggedUserListenerId: number;

  constructor(
    private router: Router,
    private platform: Platform,
    private authService: AuthService,
    private contactService: ContactService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    this.loggedUserListenerId = this.authService.onLoggedUserChange((data => this.loggedUser = data).bind(this));

    if (this.loggedUser) {
      this.form.name.setValue(this.loggedUser.nome);
      this.form.email.setValue(this.loggedUser.email);
    }
  }

  ngOnDestroy(): void {
    this.authService.removeLoggedUserListener(this.loggedUserListenerId);
  }

  formIsValid() {
    return Object.keys(this.form).filter(key => (this.form[key] as FormControl).invalid).length === 0;
  }

  async onSubmitClick() {
    if (!this.formIsValid()) {
      return;
    }

    this.saving = true;
    Object.keys(this.form).forEach(key => this.form[key].disable());

    try {
      await this.contactService.send({
        nome: this.form.name.value,
        email: this.form.email.value,
        mensagem: this.form.message.value,
      }, this.loggedUser);
      const toast = await this.toastController.create({
        color: 'success',
        message: `Mensagem enviada, responderemos no seu e-mail o mais rápido possível!`,
        duration: 2000,
      });
      await toast.present();
      this.router.navigate(['/home']);
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível enviar agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.saving = false;
    Object.keys(this.form).forEach(key => this.form[key].enable());
  }

}
