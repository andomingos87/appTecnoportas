/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface INewsResponse {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  dt_cadastro: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private readonly url = `${environment.apiUrl}informacoes`;

  constructor(private http: HttpClient) { }

  async getAll(): Promise<INewsResponse[]> {
    const form = new FormData();
    form.append('retorno', 'json');
    return this.createImagesLink(await this.http.post<INewsResponse[]>(this.url, form).toPromise());
  }

  private createImagesLink(items: INewsResponse[]) {
    return items.map(item => ({ ...item, imagem: `${environment.apiUrl}files?name=${item.imagem}` }));
  }
}
