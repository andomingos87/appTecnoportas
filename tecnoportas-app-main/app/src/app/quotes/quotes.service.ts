/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import Big from 'big.js';
import { environment } from 'src/environments/environment';

import { IUserData } from '../global/auth.service';
import { GeneralService } from '../global/general.service';
import { ALL_QUOTE_STATUS, CONDITIONAL_OPERATORS } from '../global/global.constants';
import { IProductResponse } from '../product-list/product.interfaces';
import { ProductService } from '../product-list/product.service';
import {
  ICalculateParams,
  ICreateQuoteParams,
  IDefaultProduct,
  IEngineConditionParams,
  IEngineData,
  IGetPortholesParams,
  IProductsConditionParams,
  IQuoteData,
  IQuoteDetailsResponse,
  IQuoteDoorSettings,
  IQuoteFilters,
  IQuoteItem,
  IQuoteItemTypes,
  IQuotePdfResponse,
  IQuoteProduct,
} from './quotes.interfaces';

let quotesChangeListeners: { id: number; callback: () => void }[] = [];

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  readonly allStatus = ALL_QUOTE_STATUS;

  private readonly quotesUrl = `${environment.apiUrl}orcamentos?sid=`;
  private readonly quoteDetailsUrl = `${environment.apiUrl}orcamentos/abrir`;
  private readonly quotePdfDataUrl = `${environment.apiUrl}orcamentos/geraPDF`;
  private readonly quoteUploadPdfUrl = `${environment.apiUrl}orcamentos/upPdf`;
  private readonly quoteSendEmailUrl = `${environment.apiUrl}orcamentos/enviarEmail`;
  private readonly quoteAddUrl = `${environment.apiUrl}orcamentos/novo`;
  private readonly quoteItemsUrl = `${environment.apiUrl}atributos`;
  private readonly doorProfileUrl = `${environment.apiUrl}portoes/perfis`;
  private readonly doorPaintUrl = `${environment.apiUrl}portoes/pinturas`;
  private readonly doorPortholesUrl = `${environment.apiUrl}portoes/entradas`;
  private readonly doorPVCUrl = `${environment.apiUrl}portoes/fitaPVC`;
  private readonly doorDefaultPVCUrl = `${environment.apiUrl}portoes/fitaPadrao`;
  private readonly engineUrl = `${environment.apiUrl}motores`;
  private readonly engineHeadersUrl = `${environment.apiUrl}motores/testeiras`;
  private readonly engineCategoriesUrl = `${environment.apiUrl}motores/categorias`;
  private readonly engineAutomatorsUrl = `${environment.apiUrl}motores/automatizadores`;

  constructor(
    private http: HttpClient,
    private general: GeneralService,
    private productService: ProductService,
  ) { }

  calculateDoorSettings(
    doorHeight: string,
    doorWidth: string,
    doorWeightM2: string,
  ): Partial<ICalculateParams> {

    const totalHeight = Big(doorHeight).add(
      Big(doorWidth).cmp(8.5) < 0 ? 0.6 : 0.9
    ).toString();
    const totalWeight = Big(
      Big(
        Big(doorWidth).times(totalHeight),
      ).times(2),
    ).times(doorWeightM2).toString();

    const doorM2 = Big(totalHeight).times(doorWidth).toFixed(3);
    return {
      doorM2,
      height: doorHeight,
      width: doorWidth,
      totalHeight,
      totalWeight,
    };
  }

  async create(data: ICreateQuoteParams, loggedUser: IUserData) {
    let appVersion = 2;
    try {
      appVersion = Number((await App.getInfo()).version.replace(/[^0-9]/g, ''));
    }
    catch (e) {
      appVersion = 2;
    }

    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('cliente_id', data.cliente_id);
    form.append('appVer', appVersion.toString());
    form.append('orc[valor_total]', data.orc.valor_total);
    form.append('orc[opcionais]', JSON.stringify(data.orc.opcionais));
    form.append('orc[valores]', JSON.stringify(data.orc.valores));
    form.append('orc[quantidades]', JSON.stringify(data.orc.quantidades));
    form.append('orc[acrescimos]', JSON.stringify(data.orc.acrescimos));

    if (data.orc.portas) {
      form.append('orc[portas]', data.orc.portas);
    }
    if (data.orc.altura) {
      form.append('orc[altura]', data.orc.altura);
    }
    if (data.orc.largura) {
      form.append('orc[largura]', data.orc.largura);
    }
    if (data.orc.tpi) {
      form.append('orc[tpi]', data.orc.tpi);
    }
    if (data.orc.perfil) {
      form.append('orc[perfil]', data.orc.perfil);
    }
    if (data.orc.motor) {
      form.append('orc[motor]', data.orc.motor);
    }
    if (data.orc.testeira) {
      form.append('orc[testeira]', data.orc.testeira);
    }
    if (data.orc.automatizador) {
      form.append('orc[automatizador]', data.orc.automatizador);
    }
    if (data.orc.entrada) {
      form.append('orc[entrada]', data.orc.entrada);
    }
    if (data.orc.pintura) {
      form.append('orc[pintura]', data.orc.pintura);
    }
    if (data.orc.fita) {
      form.append('orc[fita]', data.orc.fita);
    }

    const response = await this.http.post<{ orcamento_data: Partial<IQuoteData> }>(
      this.quoteAddUrl,
      form,
    ).toPromise();

    this.setChanged();

    return response;
  }

  async calculateProductQuantity(product: IDefaultProduct, params: ICalculateParams) {
    if (product.formula) {
      const defaultVariables = await this.getConditionVariables(params);
      const variables = {
        ...defaultVariables,
        VL: product.valor_unitario,
      };
      let result = this.executeItemCondition(this.getItemCondition(product.formula, variables)) as number;
      if (product.nome.toLowerCase().indexOf('trava lâmina') > -1) {
        result = Math.ceil(result);
      }
      product.quantity = result;
    }
    return product;
  }

  async getValidDefaultProducts(params: IProductsConditionParams): Promise<IDefaultProduct[]> {
    const defaultVariables = await this.getConditionVariables(params);
    const results: IDefaultProduct[] = [];

    for (const product of params.products) {
      const variables = {
        ...defaultVariables,
        VL: product.valor_unitario,
      };

      const conditionResult = this.executeItemCondition(this.getItemCondition(product.condicao, variables));

      if (conditionResult === true || conditionResult === undefined) {
        results.push(await this.calculateProductQuantity(product, params));
      }
    }

    return results;
  }

  async engineConditionsCalculate(params: IEngineConditionParams): Promise<boolean> {
    const engineVariables = {
      ...(await this.getConditionVariables(params)),
      VL: params.engine.valor_unitario,
    };

    return this.executeItemCondition(
      this.getItemCondition(params.engine.condicao, engineVariables),
    ) as boolean;
  }

  onQuotesChange(callback: () => void): number {
    const id = new Date().getTime();
    quotesChangeListeners.push({ id, callback });
    return id;
  }

  removeQuotesChangeListener(id: number) {
    quotesChangeListeners = quotesChangeListeners.filter(item => item.id !== id);
  }

  async getAll(loggedUser: IUserData, filters?: IQuoteFilters): Promise<IQuoteData[]> {
    let uri = `${this.quotesUrl}${loggedUser.pessoa_id}`;
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    if (filters?.month) {
      uri += '&month=' + filters.month;
    }

    if (filters?.status) {
      uri += '&status=' + filters.status;
    }

    if (filters?.year) {
      uri += '&year=' + filters.year;
    }

    return this.fixQuotesData(
      await this.http.post<IQuoteData[]>(
        uri,
        form,
      ).toPromise()
    );
  }

  async getDoorDefaultItems(loggedUser: IUserData) {
    return this.productService.getAll({
      isDefault: true,
      category: 'componentes',
    }, loggedUser);
  }

  async getDoorPVCItems(paintId: string | null, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    if (paintId !== null) {
      form.append('pintura_id', paintId);
    }

    let pvcs = await this.http.post<IDefaultProduct[]>(
      paintId !== null ? this.doorPVCUrl : this.doorDefaultPVCUrl,
      form,
    ).toPromise();

    if (!pvcs?.length && paintId !== null) {
      pvcs = await this.http.post<IDefaultProduct[]>(
        this.doorDefaultPVCUrl,
        form,
      ).toPromise();
    }

    return this.fixQuoteItems(pvcs) as unknown as IDefaultProduct[];
  }

  async getEngines(categoryId: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('categoria', categoryId);

    return this.fixQuoteItems(await this.http.post<IEngineData[]>(
      this.engineUrl,
      form,
    ).toPromise()) as unknown as IEngineData[];
  }

  async getEngineHeader(engineId: string, loggedUser: IUserData): Promise<IEngineData> {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('motor_id', engineId);

    return (this.fixQuoteItems(await this.http.post<IEngineData[]>(
      this.engineHeadersUrl,
      form,
    ).toPromise()))[0] as unknown as IEngineData;
  }

  async getEngineCategories(loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    return this.fixQuoteItems(await this.http.post<IQuoteItem[]>(
      this.engineCategoriesUrl,
      form,
    ).toPromise()) as IQuoteItem[];
  }

  async getEngineAutomators(engineCategoryId: string | undefined, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    if (engineCategoryId) {
      form.append('catmotor_id', engineCategoryId);
    }

    return (this.fixQuoteItems(await this.http.post<IProductResponse[]>(
      this.engineAutomatorsUrl,
      form,
    ).toPromise()) as IProductResponse[]).map((item) => ({ ...item, tipo: 'aut' }));
  }

  async getQuoteItems(loggedUser: IUserData, type?: IQuoteItemTypes, parentId?: string) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    if (parentId) {
      form.append('atributo_id', parentId);
    }

    return this.fixQuoteItems(await this.http.post<IQuoteItem[]>(
      this.quoteItemsUrl + (type ? '?tipo=' + type : ''),
      form,
    ).toPromise()) as IQuoteItem[];
  }

  async getDoorPaints(loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);

    return this.fixQuoteItems(await this.http.post<IProductResponse[]>(
      this.doorPaintUrl,
      form,
    ).toPromise());
  }

  async getDoorPortholes(params: IGetPortholesParams, loggedUser: IUserData) {
    const configs = await this.general.getAllAppConfigs();

    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('perfil_id', configs.perfil_id);
    form.append('material_id', configs.material_id);
    form.append('chapa_id', params.doorTypeId);
    form.append('ent_id', params.typeId);

    if (params.positionId) {
      form.append('pos_id', params.positionId);
    }

    return this.fixQuoteItems(await this.http.post<IProductResponse[]>(
      this.doorPortholesUrl,
      form,
    ).toPromise()) as unknown as IDefaultProduct[];
  }

  async getDoorProfile(doorTypeId: string, sizeId: string, loggedUser: IUserData) {
    const configs = await this.general.getAllAppConfigs();

    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('perfil_id', configs.perfil_id);
    form.append('material_id', configs.material_id);
    form.append('chapa_id', doorTypeId);
    form.append('espessura_id', sizeId);

    return this.fixQuoteItems(await this.http.post<IProductResponse[]>(
      this.doorProfileUrl,
      form,
    ).toPromise())[0] as IProductResponse;
  }

  async getOne(id: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('orcamento_id', id);

    const quoteData = await this.fixQuoteDetails(await this.http.post<IQuoteDetailsResponse>(
      this.quoteDetailsUrl,
      form,
    ).toPromise());

    if (quoteData) {
      quoteData.produtos = this.orderProductsList(quoteData.produtos) as IQuoteProduct[];
    }

    return quoteData;
  }

  async getPdfData(id: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('orcamento_id', id);

    const result = await this.fixQuotePdfData(await this.http.post<IQuotePdfResponse>(
      this.quotePdfDataUrl,
      form,
    ).toPromise());

    if (result) {
      result.produtos = this.orderProductsList(result.produtos) as IQuoteProduct[];
    }

    return result;
  }

  async updateStatus(id: string, newStatus: string, loggedUser: IUserData, motivo_cancelamento? : string) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('orcamento_id', id);
    form.append('status', newStatus);

    if(motivo_cancelamento){
      form.append('motivo_cancelamento', motivo_cancelamento);
    }

    const response = await this.http.post<{ msg: string; AltStatus?: number; status?: number }>(
      this.quoteDetailsUrl,
      form,
    ).toPromise();

    this.setChanged();

    return response;
  }

  async uploadPdfDocument(id: string, pdfBase64: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('orcamento_id', id);
    form.append('arquivo', pdfBase64);

    const response = await this.http.post<string>(
      `${this.quoteUploadPdfUrl}?oid=${id}`,
      form,
    ).toPromise();

    this.setChanged();
    return response;
  }

  async sendEmailWithPDF(id: string, pdf: string, loggedUser: IUserData) {
    const form = new FormData();
    form.append('retorno', 'json');
    form.append('serralheiro_id', loggedUser.pessoa_id);
    form.append('orcamento_id', id);
    form.append('pdf', pdf);

    await this.http.post(
      `${this.quoteSendEmailUrl}?oid=${id}`,
      form,
    ).toPromise();
  }

  getProductQuantity(product: IProductResponse | IEngineData, params: IQuoteDoorSettings) {
    const { height, width, doors } = params;

    const totalHeight = Big(height).add(
      Big(width).cmp(8.5) < 0 ? 0.6 : 0.9
    ).toString();
    const doorM2 = Big(totalHeight).times(width).toFixed(3);
    const m2Quantity = Big(doorM2).times(doors).toNumber();

    switch (product.tipo) {
      case 'prf':
      case 'ptr':
        return m2Quantity;
      case 'opc':
        return Big((product as IDefaultProduct).quantity || 1).times(doors).toNumber() || doors;
      default:
        return doors;
    }
  }

  orderProductsList(items: (IProductResponse | IEngineData)[]): (IProductResponse | IEngineData)[] {
    const products = Object.assign([], items);

    // Lamina
    const prfs = products.filter((item) => item.tipo === 'prf');

    // Entrada
    const ents = products.filter((item) => item.tipo === 'ent');

    // Pintura
    const ptrs = products.filter((item) => item.tipo === 'ptr');

    // Motor
    const mtos = products.filter((item) => item.tipo === 'mto');

    // Testeira
    const tsts = products.filter((item) => item.tipo === 'tst');

    // Central
    const auts = products.filter((item) => item.tipo === 'aut');

    const firstOpcs: (IProductResponse | IEngineData)[] = [];

    // Guia
    firstOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('guia') > -1 &&
          item.nome.toLowerCase().indexOf('telesc') === -1 &&
          item.nome.toLowerCase().indexOf('metal') === -1
      ),
    );

    // Soleira
    firstOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('soleira') > -1 &&
          item.nome.toLowerCase().indexOf('borracha') === -1
      ),
    );

    // Eixo
    firstOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('eixo') > -1 &&
          item.nome.toLowerCase().indexOf('solda') === -1
      ),
    );

    // Guia Telescópica, Metalão ou Tubo
    firstOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('guia telesc') > -1 ||
          item.nome.toLowerCase().indexOf('guia metal') > -1 ||
          item.nome.toLowerCase().indexOf('tubo') > -1
      ),
    );

    const secondOpcs: (IProductResponse | IEngineData)[] = [];

    // Borracha
    secondOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('borracha') > -1
      ),
    );

    // Fita PVC
    secondOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('fita pvc') > -1
      ),
    );

    // Trava Lâmina
    for (const item of products) {
      if (
        (item.nome.toLowerCase().indexOf('trava lâminas') > -1 || item.nome.toLowerCase().indexOf('trava laminas') > -1) &&
        item.tipo === 'opc'
      ) {
        secondOpcs.push(item);
      }
    }

    const thirdOpcs: (IProductResponse | IEngineData)[] = [];

    // Solda
    thirdOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('solda') > -1
      ),
    );

    // Instalação
    thirdOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('instala') > -1
      ),
    );

    // Transporte
    thirdOpcs.push(
      ...products.filter(item => item.tipo === 'opc').filter(
        (item) =>
          item.nome.toLowerCase().indexOf('transporte') > -1
      ),
    );

    const result: (IProductResponse | IEngineData)[] = [];

    result.push(
      ...prfs,
      ...firstOpcs,
      ...ents,
      ...ptrs,
      ...secondOpcs,
      ...mtos,
      ...tsts,
      ...auts
    );

    const others = products.filter(
      (product) => !result.find(
        (item) => item.nome === product.nome &&
          item.id === product.id &&
          item.produto_id === product.produto_id
      ),
    ).filter(
      (product) => !thirdOpcs.find(
        (item) => item.nome === product.nome &&
          item.id === product.id &&
          item.produto_id === product.produto_id
      ),
    );

    result.push(
      ...others,
      ...thirdOpcs,
    );

    return result;
  }

  private getItemCondition(itemCondition: string, variables: { [key: string]: string }) {
    const operations = CONDITIONAL_OPERATORS;
    let condition = itemCondition;

    if (itemCondition) {
      for (const key in variables) {
        if (variables[key]) {
          const reg = new RegExp(key, 'gi');
          condition = condition.replace(reg, variables[key]);
        }
      }

      for (const key in operations) {
        if (operations[key]) {
          for (const item of operations[key]) {
            const reg = new RegExp(item, 'gi');
            condition = condition.replace(reg, key);
          }
        }
      }
    }
    return condition;
  }

  private async getConditionVariables(params: ICalculateParams): Promise<{ [key: string]: string }> {
    const configs = await this.general.getAllAppConfigs();
    return {
      ATT: params.height,
      LGP: params.width,
      ATP: params.totalHeight,
      PTP: params.doors,
      PM2: params.doorM2,
      PKG: params.totalWeight,
      PRF: configs.perfil_id,
      MAT: params.doorTypeId,
      TPI: params.typeOfInstallId,
    };
  }

  private executeItemCondition(condition: string): boolean | number {
    try {
      if (!/^[^0-9.+*/&|!=><-]+$/.test(condition)) {
        // eslint-disable-next-line no-eval
        return eval(condition);
      }
    }
    catch (e) { }
    return false;
  }

  private setChanged() {
    quotesChangeListeners.forEach(item => item.callback());
  }

  private fixQuotePdfData(quote: IQuotePdfResponse) {
    return {
      ...quote,
      orcamento_data: {
        ...quote.orcamento_data,
        cli_tipo: quote.orcamento_data.cli_tipo.toLowerCase(),
        se_tipo: quote.orcamento_data.se_tipo.toLowerCase(),
        pdf: `${environment.apiUrl}files?name=${quote.orcamento_data.pdf}`,
      },
      produtos: quote.produtos.map(item => ({
        ...item,
        imagem: `${environment.apiUrl}files?name=${item.imagem}`,
      })),
    };
  }

  private fixQuoteDetails(quote: IQuoteDetailsResponse): IQuoteDetailsResponse {
    return {
      ...quote,
      orcamento: {
        ...quote.orcamento,
        cli_tipo: quote.orcamento.cli_tipo.toLowerCase(),
        se_tipo: quote.orcamento.se_tipo.toLowerCase(),
        pdf: quote.orcamento.pdf ? `${environment.apiUrl}files?name=${quote.orcamento.pdf}` : null,
      },
      produtos: quote.produtos.map(item => ({
        ...item,
        imagem: `${environment.apiUrl}files?name=${item.imagem}`,
      })),
    };
  }

  private fixQuoteItems(items: (IQuoteItem | IProductResponse)[]) {
    return items.map(item => ({
      ...item,
      imagem: item.imagem ? `${environment.apiUrl}files?name=${item.imagem}` : null,
      aciona_padrao_img: (item as IQuoteItem).aciona_padrao_img ?
        `${environment.apiUrl}files?name=${(item as IQuoteItem).aciona_padrao_img}` :
        null,
    }));
  }

  private fixQuotesData(items: IQuoteData[]): IQuoteData[] {
    return items.map(item => ({
      ...item,
      tipo: item.tipo.toLowerCase(),
      status: this.allStatus[item.status],
    }));
  }
}
