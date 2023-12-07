import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';

import { AuthService, IUserData } from './global/auth.service';

interface IAppPage {
  title: string;
  icon: string;
  url?: string;
  click?: () => void;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public loggedUser: IUserData;
  public appVersion: string;

  public appPages: IAppPage[] = [];

  private loggedUserListenerId: number;

  constructor(
    private platform: Platform,
    private router: Router,
    private authService: AuthService,
  ) {
    Chart.register(...registerables);
    this.setLoggedUser(this.authService.getLoggedUser());
  }

  async ngOnInit(): Promise<void> {
    try {
      this.appVersion = (await App.getInfo()).version;
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#2808a1' });
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.show();
    }
    catch (e) {
      this.appVersion = this.platform.platforms().filter(platform => this.platform.is(platform as any)).join(', ');
    }

    this.setLoggedUser(await this.authService.checkLoggedUser());
    this.loggedUserListenerId = this.authService.onLoggedUserChange(this.setLoggedUser.bind(this));
    await SplashScreen.hide();
  }

  ngOnDestroy(): void {
    this.authService.removeLoggedUserListener(this.loggedUserListenerId);
  }

  setLoggedUser(data: IUserData) {
    this.loggedUser = data;
    this.createMenuItems();
  }

  createMenuItems() {
    this.appPages = [{ title: 'Home', url: '/home', icon: 'home' }];

    if (this.loggedUser?.is_aprovado === '1') {
      this.appPages.push(...[
        { title: 'Novo Orçamento', url: '/new-quote', icon: 'document' },
        { title: 'Produtos', url: '/product-list', icon: 'cart' },
        { title: 'Meus Orçamentos', url: '/my-quotes', icon: 'file-tray-full' },
        { title: 'Meus Clientes', url: '/my-customers', icon: 'people' },
      ]);
    }

    this.appPages.push(...[
      { title: 'Catalogo', url: '/catalog-list', icon: 'book' },
      { title: 'Notícias', url: '/news', icon: 'newspaper' },
      { title: 'Atendimento', url: '/contact-form', icon: 'chatbubbles' },
      { title: 'Sobre Nós', url: '/about', icon: 'help-circle' },
    ]);

    if (this.loggedUser) {
      this.appPages.push(...[
        { title: 'Meu Perfil', url: '/my-profile', icon: 'person' },
        { title: 'Sair', click: this.onLogout.bind(this), icon: 'log-out' },
      ]);
    }

    if (!this.loggedUser) {
      this.appPages.push(...[
        { title: 'Entrar', url: '/login', icon: 'log-in' },
        { title: 'Cadastre-se', url: '/sign-up', icon: 'duplicate' },
      ]);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
