/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { IUserData } from '../global/auth.service';

export interface ICustomerData {
  nome: string;
  sobrenome: string;
  email: string;
  ddd: string;
  numero: string;
  tipo: string;
  cnpj: string;
}

export interface ICustomerAddressData {
  cidade: string;
  uf: string;
  pais: string;
  referencia: string;
  numero: string;
  endNumero?: string;
  logradouro: string;
}

export interface ICustomerForm {
  cli: ICustomerData;
  end: ICustomerAddressData;
}

export interface ICustomerUpdateResponse extends ICustomerForm {
  cliente_id: string;
}

export interface ICustomerResponse extends ICustomerData, ICustomerAddressData {
  id: string;
}

let customersChangeListeners: { id: number; callback: () => void }[] = [];

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private readonly customersUrl = `${environment.apiUrl}clientes?sid=`;
  private readonly addCustomerUrl = `${environment.apiUrl}clientes/novo`;
  private readonly editCustomerUrl = `${environment.apiUrl}clientes/editar`;
  private readonly getCustomerUrl = `${environment.apiUrl}clientes/ver`;
  private readonly deleteCustomersUrl = `${environment.apiUrl}clientes/excluir`;

  constructor(private http: HttpClient) { }

  onCustomersChange(callback: () => void): number {
    const id = new Date().getTime();
    customersChangeListeners.push({ id, callback });
    return id;
  }

  removeCustomersChangeListener(id: number) {
    customersChangeListeners = customersChangeListeners.filter(item => item.id !== id);
  }

  async getAll(loggedUser: IUserData): Promise<ICustomerResponse[]> {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    return this.fixCustomersData(
      await this.http.post<ICustomerResponse[]>(
        `${this.customersUrl}${loggedUser.pessoa_id}`,
        form,
      ).toPromise()
    );
  }

  async getOne(id: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('cliente_id', id);

    const response = await this.http.post<{ cliente: ICustomerResponse; orcamentos: Record<string, string>[] }>(
      `${this.getCustomerUrl}`,
      form,
    ).toPromise();

    response.cliente = this.fixCustomersData([response.cliente])[0];
    return response;
  }

  async create(data: ICustomerForm, loggedUser: IUserData): Promise<{ cliente_id: string }> {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    form.append('cli[nome]', data.cli.nome);
    form.append('cli[sobrenome]', data.cli.sobrenome);
    form.append('cli[email]', data.cli.email);
    form.append('cli[ddd]', data.cli.ddd);
    form.append('cli[numero]', data.cli.numero);
    form.append('cli[tipo]', data.cli.tipo);
    form.append('cli[cnpj]', data.cli.cnpj);

    form.append('end[uf]', data.end.uf);
    form.append('end[cidade]', data.end.cidade);
    form.append('end[logradouro]', data.end.logradouro);
    form.append('end[numero]', data.end.numero);
    form.append('end[referencia]', data.end.referencia);
    form.append('end[pais]', data.end.pais);

    const result = await this.http.post<{ cliente_id: string }>(this.addCustomerUrl, form).toPromise();
    this.setChanged();
    return result;
  }

  async delete(id: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('id', id);

    const result = await this.http.post<{ deleta: boolean }>(this.deleteCustomersUrl, form).toPromise();
    this.setChanged();
    return result;
  }

  async update(id: string, data: ICustomerForm, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('cliente_id', id);

    form.append('cli[nome]', data.cli.nome);
    form.append('cli[sobrenome]', data.cli.sobrenome);
    form.append('cli[email]', data.cli.email);
    form.append('cli[ddd]', data.cli.ddd);
    form.append('cli[numero]', data.cli.numero);
    form.append('cli[tipo]', data.cli.tipo);
    form.append('cli[cnpj]', data.cli.cnpj);

    form.append('end[uf]', data.end.uf);
    form.append('end[cidade]', data.end.cidade);
    form.append('end[logradouro]', data.end.logradouro);
    form.append('end[numero]', data.end.numero);
    form.append('end[referencia]', data.end.referencia);
    form.append('end[pais]', data.end.pais);

    const result = await this.http.post<ICustomerUpdateResponse>(this.editCustomerUrl, form).toPromise();
    this.setChanged();
    return result;
  }

  private setChanged() {
    customersChangeListeners.forEach(item => item.callback());
  }

  private fixCustomersData(items: ICustomerResponse[]): ICustomerResponse[] {
    return items.map(item => ({ ...item, tipo: item.tipo.toLowerCase() }));
  }
}
