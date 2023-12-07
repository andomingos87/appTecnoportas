import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { AuthService } from '../global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loading = false;
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public form = {
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  };

  constructor(
    private platform: Platform,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
  }

  async onSubmitClick() {
    const username = this.form.username.value;
    const password = this.form.password.value;

    if (!username || !password) {
      const alert = await this.alertController.create({
        header: 'Por favor...',
        message: 'Preencha os campos corretamente.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.loading = true;
    this.form.username.disable();
    this.form.password.disable();

    try {
      const result = await this.auth.login(username, password);
      const toast = await this.toastController.create({
        message: `Olá ${result.nome}`,
        duration: 2000,
      });
      await toast.present();
      this.router.navigate(['/home'], { replaceUrl: true });
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível acessar a sua conta agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.loading = false;
    this.form.username.enable();
    this.form.password.enable();
  }
}
