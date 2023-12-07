/* eslint-disable @typescript-eslint/naming-convention */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

export interface ISignUpData {
  tipo: string;
  cpf?: string;
  rg?: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  numero?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  senha: string;
  nomeUsuario: string;
}
export interface IUserData {
  id: string;
  tipo: string;
  nome: string;
  sobrenome: string;
  email: string;
  acesso: string;
  pessoa_id: string;
  aparelho_id: string;
  username: string;
  ie: string;
  cnpj: string;
  nivel: string;
  is_aprovado: string;
  ddd: string;
  tel_num: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  numero?: string;
  logradouro: string;
  complemento: string | null;
  bairro: string | null;
  ct_nome: string | null;
  ct_snome: string | null;
  ve_ddd: string | null;
  ve_numero: string | null;
  vend_email: string | null;
  vend_nome: string | null;
  vend_snome: string | null;
  desconto_aut: string;
  desconto_ent: string;
  desconto_mto: string;
  desconto_opc: string;
  desconto_prf: string;
  desconto_ptr: string;
  desconto_tst: string;
  desconto_seletivo: string;
  desconto_max: string | null;
  acrecimo_max: string | null;
  foto: string | null;
  dt_login: number | null;
  password_login: string | null;
}

let loggedUserListeners: { id: number; callback: (data: IUserData) => void }[] = [];

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginUrl = `${environment.apiUrl}login`;
  private readonly sendDeviceInfoUrl = `${environment.apiUrl}login/aparelho`;
  private readonly signUpUrl = `${environment.apiUrl}usuarios/novo`;
  private readonly deleteAccountUrl = `${environment.apiUrl}usuarios/excluir`;
  private readonly recoveryPasswordUpUrl = `${environment.apiUrl}login/alteraSenha`;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private alert: AlertController,
    private http: HttpClient,
  ) { }

  onLoggedUserChange(callback: (data: IUserData) => void): number {
    const id = new Date().getTime();
    loggedUserListeners.push({ id, callback });
    return id;
  }

  removeLoggedUserListener(id: number) {
    loggedUserListeners = loggedUserListeners.filter(item => item.id !== id);
  }

  getLoggedUser(): IUserData {
    const loggedUserStorage = this.document.defaultView.localStorage.getItem('auth_data');

    if (!loggedUserStorage) {
      this.logout();
      return undefined;
    }

    let userData: IUserData;

    try {
      userData = JSON.parse(loggedUserStorage);
    }
    catch (e) {
      this.logout();
      return undefined;
    }

    return this.fixLoggedUserData(userData);
  }

  getMaxPriceIncrement() {
    const logged = this.getLoggedUser();
    if (logged) {
      return Number(logged.acrecimo_max) || 0;
    }
    return undefined;
  }

  getMinPriceIncrement() {
    const logged = this.getLoggedUser();
    if (logged) {
      let result = Number(logged.desconto_max) || 0;

      if (logged.desconto_seletivo === '1') {
        const allDiscounts: number[] = [];
        allDiscounts.push(Number(logged.desconto_aut));
        allDiscounts.push(Number(logged.desconto_ent));
        allDiscounts.push(Number(logged.desconto_mto));
        allDiscounts.push(Number(logged.desconto_opc));
        allDiscounts.push(Number(logged.desconto_prf));
        allDiscounts.push(Number(logged.desconto_ptr));
        allDiscounts.push(Number(logged.desconto_tst));

        allDiscounts.sort((a, b) => a - b);
        result = allDiscounts[0];
      }

      return result;
    }
    return undefined;
  }

  async checkLoggedUser(): Promise<IUserData> {
    let userData = this.getLoggedUser();

    if (!userData) {
      return undefined;
    }

    try {
      userData = await this.login(userData.email, userData.password_login);

      const result = await this.sendDeviceInfo(userData);

      userData.aparelho_id = result.id;

      if (result.bloqueado) {
        const alert = await this.alert.create({
          message: 'Detectamos que o seu usuário não foi autenticado neste aparelho,' +
            ' por favor entre em contato com os administradores para solicitar a liberação do dispositivo',
          header: 'Atenção!',
        });

        await alert.present();
        this.logout();
        return undefined;
      }
    }
    catch (e) {
      this.logout();
      return undefined;
    }

    return this.fixLoggedUserData(userData);
  }

  async sendDeviceInfo(userData: IUserData) {
    const info = await Device.getInfo();
    const id = await Device.getId();
    const deviceData = {
      modelo: info.model,
      plataforma: info.platform,
      uuid: id.uuid,
      versao: info.osVersion,
      fabricante: info.manufacturer,
      is_virtual: info.isVirtual,
      serial: id.uuid
    };

    const form = new FormData();

    form.append('retorno', 'json');
    form.append('userid', userData.id);
    form.append('aparelho', JSON.stringify(deviceData));


    return this.http.post<{ id: string; bloqueado: boolean }>(this.sendDeviceInfoUrl, form).toPromise();
  }

  async signUp(data: ISignUpData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('preCad', 'true');

    form.append('user[tipo]', data.tipo);
    form.append('user[cpf]', data.cpf || null);
    form.append('user[rg]', data.rg || null);
    form.append('user[nome]', data.nome);
    form.append('user[sobrenome]', data.sobrenome);
    form.append('user[email]', data.email);
    form.append('user[telefone]', data.telefone ? `(${data.telefone.substring(0, 2)})${data.telefone.substring(2)}` : null);
    form.append('user[endereco]', data.endereco || null);
    form.append('user[numero]', data.numero || null);
    form.append('user[cep]', data.cep || null);
    form.append('user[cidade]', data.cidade || null);
    form.append('user[estado]', data.estado || null);
    form.append('user[senha]', data.senha);
    form.append('user[nomeUsuario]', data.nomeUsuario);

    return this.http.post<{ pessoa_id: number }>(this.signUpUrl, form).toPromise();
  }

  async login(username: string, password: string): Promise<IUserData> {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('username', username);
    form.append('senha', password);
    form.append('nivel', '0');

    let result: unknown;

    try {
      result = await this.http.post<IUserData[]>(this.loginUrl, form).toPromise();
      if ((result as IUserData[])?.length) {
        const userData = Object.assign({}, result[0]) as IUserData;

        userData.dt_login = new Date().getTime();
        userData.password_login = password;

        this.saveLoggedUser(userData);
        return this.fixLoggedUserData(result[0]);
      }
    }
    catch (e) {
      console.log('auth error', e);
      result = e;
    }

    throw new Error(((result as any)?.error || (result as any)?.message) || result);
  }

  async recoveryPassword(usernameOrEmail: string) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('usuarioES', usernameOrEmail);

    await this.http.post(this.recoveryPasswordUpUrl, form).toPromise();
  }

  logout() {
    this.document.defaultView.localStorage.clear();
    loggedUserListeners.forEach(item => item.callback(undefined));
  }

  deleteAccount(userData: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', userData.pessoa_id);

    return this.http.post<{ success: boolean }>(this.deleteAccountUrl, form).toPromise();
  }

  private saveLoggedUser(userData: IUserData) {
    this.document.defaultView.localStorage.clear();
    this.document.defaultView.localStorage.setItem('auth_data', JSON.stringify(userData));
    loggedUserListeners.forEach(item => item.callback(userData));
  }

  private fixLoggedUserData(data: IUserData) {
    return {
      ...data,
      foto: data.foto ? `${environment.apiUrl}files?name=${data.foto}` : null,
      tipo: data.tipo.toLowerCase(),
    };
  }
}
