/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface IGeneralConfigs {
  catalogo: string;
  perfil_id: string;
  material_id: string;
  destinatario: string;
  remetente: string;
  email_atendimento: string;
  nome_empresa: string;
  pd_automatizador_med: string;
  pd_cor_fita: string;
  pd_entrada_med: string;
  pd_motor_med: string;
  pd_perfil_med: string;
  pd_pintura_med: string;
  pd_testeira_med: string;
  sobre_nos: string;
  termos_uso: string;
  termos_garantia_pdf: string;
}

export interface IFileResult {
  id: string;
  nome: string;
  descricao: string;
  f_id: string;
  f_nome: string;
  imagem: string;
  imagem_id: string;
  img_nome: string;
  arquivo: string;
  dt_cad: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private readonly configsUrl = `${environment.apiUrl}ajustes/gerais`;
  private readonly filesUrl = `${environment.apiUrl}arquivos`;

  private appSettings: IGeneralConfigs;

  constructor(private http: HttpClient) { }

  async getAllAppConfigs(): Promise<IGeneralConfigs> {
    if (!this.appSettings) {
      const form = new FormData();
      form.append('retorno', 'json');
      this.appSettings = await this.http.post<IGeneralConfigs>(this.configsUrl, form).toPromise();
    }

    return this.appSettings;
  }

  async getApiFilesByType(typeId?: string) {
    const form = new FormData();
    form.append('retorno', 'json');
    return this.createFilesLink(
      await this.http.post<IFileResult[]>(this.filesUrl + (typeId ? `?t_id=${typeId}` : ''), form).toPromise()
    );
  }

  async downloadFile(url: string): Promise<Blob> {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        map((result: any) => result)
      ).toPromise();
  }

  private createFilesLink(items: IFileResult[]) {
    return items.map(item => ({
      ...item,
      imagem: `${environment.apiUrl}files?name=${item.imagem}`,
      arquivo: `${environment.apiUrl}files?name=${item.arquivo}`,
    }));
  }
}
