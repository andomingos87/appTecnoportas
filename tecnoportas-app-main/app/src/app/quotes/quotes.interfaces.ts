/* eslint-disable @typescript-eslint/naming-convention */
import { IProductResponse } from '../product-list/product.interfaces';

export interface IQuoteItemsValues {
    motor?: string;
    testeira?: string;
    fita?: string;
    automatizador?: string;
    entrada?: string;
    pintura?: string;
    perfil?: string;
    opcionais?: { [key: string]: string };
}

export interface ICreateQuoteParams {
    cliente_id: string;
    orc: {
        opcionais: { [key: string]: IProductResponse };
        valores: IQuoteItemsValues;
        quantidades: IQuoteItemsValues;
        acrescimos: IQuoteItemsValues;
        valor_total: string;
        portas?: string;
        altura?: string;
        largura?: string;
        tpi?: string;
        perfil?: string;
        motor?: string;
        testeira?: string;
        automatizador?: string;
        entrada?: string;
        pintura?: string;
        fita?: string;
    };
    appVer?: number;
}
export interface IQuoteFilters {
    status: number | null;
    month: number | null;
    year: string | null;
}

export type IQuoteItemTypes = 'tpi' | 'chp' | 'prf' | 'pos' | 'mat' | 'esp' | 'ent' | 'cor';

export interface IQuoteItem {
    id: string;
    imagem?: string;
    aciona_padrao_img?: string;
    nome: string;
    tipo: IQuoteItemTypes;
    descricao?: string;
    valor_unitario?: string;
}

export interface IQuoteProduct extends IProductResponse {
    acrescimo: string;
    preco_unitario: string;
    quantidade: string;
    tipo_medida?: string;
    aut_id?: string;
    cat_nome?: string;
    categoria_id?: string;
    mto_id?: string;
    mto_img?: string;
    peso_m2?: string;
    prf_id?: string;
    ptr_id?: string;
}

export interface IQuoteData {
    id: string;
    ocorrencias?: string;
    acesso: string;
    nome: string;
    sobrenome: string;
    revendedor: string;
    status: string;
    motivo_cancelamento;
    tipo: string;
    valor_total: string;
    dt_cadastro: string;
}

export interface IQuoteDetails extends IQuoteData {
    cli_id: string;
    cli_nome: string;
    cli_snome: string;
    cli_tipo: string;
    cli_cadastro: string;
    se_id: string;
    se_nome: string;
    se_snome: string;
    se_tipo: string;
    se_cadastro: string;
    pdf?: string;
    is_dentro_vao?: string;
    altura?: string;
    largura?: string;
    portas?: string;
    tpi_id?: string;
    dt_atualizado: string;
}

export interface IQuotePdfData extends IQuoteDetails {
    cidade: string;
    estado: string;
    bairro?: string;
    logradouro?: string;
    numero?: string;
    cep?: string;
    email: string;
    telefone_ddd: string;
    telefone_num: string;
}

export interface IQuoteDetailsResponse {
    orcamento: IQuoteDetails;
    produtos: IQuoteProduct[];
    entradas;
}

export interface IQuotePdfResponse {
    orcamento_data: IQuotePdfData;
    produtos: IQuoteProduct[];
}


export interface IEngineData extends IProductResponse {
    codigo: string;
    condicao: string;
    is_padrao: string;
    kg_max: string;
}

export interface IDefaultProduct extends IProductResponse {
    codigo: string;
    condicao?: string;
    formula: string;
    is_rodape: string;
    is_padrao: string;
    quantity?: number;
}

export interface ICalculateParams {
    height: string;
    totalHeight: string;
    width: string;
    doors: string;
    doorM2: string;
    totalWeight: string;
    doorTypeId: string;
    typeOfInstallId: string;
}

export interface IEngineConditionParams extends ICalculateParams {
    engine: IEngineData;
}

export interface IProductsConditionParams extends ICalculateParams {
    products: IDefaultProduct[];
}

export interface IGetPortholesParams {
    typeId: string;
    positionId?: string;
    doorTypeId: string;
}

export interface IQuoteProductSettings {
    expand: boolean;
    quantity: number;
    priceIncrement: number;
    price?: string;
}

export interface IQuoteDoorSettings {
    height: string | number;
    width: string | number;
    doors: number;
}
