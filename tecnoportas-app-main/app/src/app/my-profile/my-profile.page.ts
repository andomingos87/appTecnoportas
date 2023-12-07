import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';

import { AuthService, IUserData } from '../global/auth.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public loggedUser: IUserData;

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private alertController: AlertController,
    private router: Router,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
  }

  async onDeleteConfirmClick(event: { username: string }) {
    if (event.username !== this.loggedUser.username) {
      const error = await this.alertController.create({
        message: 'Para excluir sua conta, por favor preencha seu nome de usuário corretamente.',
        buttons: ['OK'],
      });
      await error.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Excluindo sua conta.`,
      backdropDismiss: false,
    });

    await alert.present();

    try {
      const result = await this.authService.deleteAccount(this.loggedUser);

      if (result.success === false) {
        const message = await this.alertController.create({
          header: 'Erro ao excluir sua conta!',
          message: `Não foi possível excluir sua conta no momento, tente novamente mais tarde.`,
          buttons: ['OK'],
        });

        await message.present();
        alert.dismiss();
        return;
      }

      alert.dismiss();
      this.authService.logout();
      this.router.navigate(['/home']);
    }
    catch (e) {
      alert.dismiss();

      const errorMessage = await this.alertController.create({
        header: 'Erro ao excluir sua conta!',
        message: e?.error?.text || e?.message || `Não foi possível excluir sua conta no momento, tente novamente mais tarde.`,
        buttons: ['OK'],
      });

      await errorMessage.present();
    }
  }

  async onDeleteAccountClick() {
    const message = await this.alertController.create({
      header: 'ATENÇÃO: ISSO NÃO PODERÁ SER DESFEITO!',
      message: 'Se você excluir sua conta perderá o acesso ao nosso app e não poderá fazer orçamentos novamente!',
      inputs: [{
        name: 'username',
        placeholder: 'Nome de usuário',
        type: 'text',
      }],
      buttons: [
        'Cancelar',
        {
          text: 'Excluir',
          handler: this.onDeleteConfirmClick.bind(this),
          cssClass: 'danger',
        },
      ]
    });

    await message.present();
  }

}
