import { ProdutoBase } from "../produto/produtoBase";

export class ItemCarrinho extends ProdutoBase {

  constructor(){
    super()
  }
  guid?: string | null;
  produtoId?: number;
  quantidade?: number;
  promocao?: boolean;
  valorPromocional?: number;
}