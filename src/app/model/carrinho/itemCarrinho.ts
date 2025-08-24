import { ProdutoBase } from "../produto/produtoBase";

export class ItemCarrinho extends ProdutoBase {

  constructor(){
    super()
  }
  quantidade?: number;
  promocao?: boolean;
  valorPromocional?: number;
}