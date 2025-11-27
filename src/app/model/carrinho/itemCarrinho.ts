import { ProdutoBase } from "../produto/produtoBase";

export class ItemCarrinho extends ProdutoBase {

  constructor(){
    super()
  }
  guid?: string | null;
  compraId?: number;
  produtoId?: number;
  quantidade?: number;
  promocao?: boolean;
  valor?:number;
  valorPromocional?: number;
}