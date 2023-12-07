import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { IUserData } from '../global/auth.service';

export interface IContactData {
  nome: string;
  email: string;
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly contactUrl = `${environment.apiUrl}atendimento`;

  constructor(private http: HttpClient) { }

  send(data: IContactData, loggedUser?: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');

    if (loggedUser) {
      form.append('serralheiro_id', loggedUser.pessoa_id);
    }

    form.append('atendimento[nome]', data.nome);
    form.append('atendimento[email]', data.email);
    form.append('atendimento[mensagem]', data.mensagem);

    return this.http.post(this.contactUrl, form).toPromise();
  }
}
