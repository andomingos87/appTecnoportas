import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { AuthService } from '../global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {
  public loading = false;
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public form = {
    username: new FormControl('', [Validators.required]),
  };

  constructor(
    private platform: Platform,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
  }

  async onSubmitClick() {
    const username = this.form.username.value;

    this.loading = true;
    this.form.username.disable();

    try {
      await this.auth.recoveryPassword(username);
      const toast = await this.toastController.create({
        message: `Se estiver tudo certo, as instruções para recuperação da sua senha foram enviadas para seu e-mail cadastrado.`,
        buttons: ['OK'],
      });
      await toast.present();
      this.router.navigate(['/login']);
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível recuperar sua senha agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.loading = false;
    this.form.username.enable();
  }
}
