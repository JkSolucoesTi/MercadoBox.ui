import { ItemCarrinho } from "../carrinho/itemCarrinho";
import { StatusE } from "../enum/statusE";

export class Compra {

  id?: number;
  idmercado?: number;
  data?: string;
  itens: ItemCarrinho[];

  constructor(itens: ItemCarrinho[] = []) {
    this.itens = itens
  }

  getItens(): ItemCarrinho[] {
    return this.itens;
  }


  addItem(item: ItemCarrinho) {
    this.itens.push(item);
  }

  getTotalPrecoPadrao(): number {
    return this.itens.reduce((total, item) => {
      return total + ((item.preco ?? 0) * (item.quantidade ?? 1));
    }, 0);
  }

}