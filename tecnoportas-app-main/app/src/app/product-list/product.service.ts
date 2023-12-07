/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { IUserData } from '../global/auth.service';
import { IProductParams, IProductResponse } from './product.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly productsUrl = `${environment.apiUrl}produtos/buscaprodutos`;

  private readonly categoryLinks = {
    motores: 'motores/index',
    acionadores: 'motores/automatizadores',
    testeiras: 'motores/testeiras',
    entradas: 'portoes/entradas',
    pinturas: 'portoes/pinturas',
    componentes: 'portoes/componentes',
    perfis: 'portoes/perfis'
  };

  constructor(private http: HttpClient) { }

  async getAll(params: IProductParams, loggedUser: IUserData) {
    const { category, limit, offset, search, isDefault } = params;
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    if (isDefault === true) {
      form.append('is_padrao', '1');
    }

    let url = `${this.productsUrl}?limit=${limit || 10}&offset=${offset || 0}${search ? `&search=${search}` : ''}`;
    let categoryLink: string;

    if (category) {
      categoryLink = this.categoryLinks[category.toLowerCase()];
    }

    if (!search && categoryLink) {
      url = `${environment.apiUrl}${categoryLink}`;
    }

    return this.fixProductsList(
      await this.http.post<IProductResponse[]>(url, form).toPromise(), url
    );
  }

  compareProducts(product1: IProductResponse, product2: IProductResponse) {
    return (
      product1.produto_id && product1.produto_id === product2.produto_id
    ) || (
        product1.codigo && product1.codigo === product2.codigo
      );
  }

  private fixProductsList(items: IProductResponse[], url: string) {
    let result = items.map(item => ({ ...item, imagem: `${environment.apiUrl}files?name=${item.imagem}` }));
    if (url.indexOf('buscaprodutos') > -1) {
      result = result.map(item => ({
        ...item,
        produto_id: item.id,
      }));
    }
    return result;
  }
}
