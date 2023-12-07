import { Component, OnDestroy, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService, IUserData } from '../global/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public loggedUser: IUserData;

  private loggedUserListenerId: number;
  private backButtonSub: Subscription;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private alertController: AlertController,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ionViewDidEnter() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(
      10000,
      async () => {
        const message = await this.alertController.create({
          header: 'Sair...',
          message: 'Deseja mesmo sair de Tecnoportas?',
          buttons: ['Não', {
            text: 'Sim',
            handler: () => {
              try {
                App.exitApp();
              }
              catch (e) { }
            }
          }],
        });

        await message.present();
      }
    );
  }

  ionViewWillLeave() {
    this.backButtonSub.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.loggedUser = await this.authService.checkLoggedUser();
    this.loggedUserListenerId = this.authService.onLoggedUserChange((data => this.loggedUser = data).bind(this));
  }

  ngOnDestroy(): void {
    this.authService.removeLoggedUserListener(this.loggedUserListenerId);
  }

}
