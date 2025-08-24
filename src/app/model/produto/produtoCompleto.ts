import { ProdutoBase } from "./produtoBase";

export interface ProdutoCompleto extends ProdutoBase {
  descricao?: string;
}