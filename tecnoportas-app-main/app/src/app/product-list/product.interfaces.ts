/* eslint-disable @typescript-eslint/naming-convention */

export type ProductType = 'prf' | 'mto' | 'aut' | 'ent' | 'tst' | 'ptr' | 'opc';

export interface IProductResponse {
  id: string;
  nome: string;
  codigo?: string;
  descricao: string;
  imagem: string;
  produto_id?: string;
  tipo: ProductType;
  unNome?: string;
  medida?: string;
  peso_m2?: string;
  valor_unitario?: string;
}

export interface IProductParams {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  isDefault?: boolean;
}
