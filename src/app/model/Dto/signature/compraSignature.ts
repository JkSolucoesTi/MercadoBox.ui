import { ItemCarrinho } from "../../carrinho/itemCarrinho";

export class CompraSignature {

      id?: number;
      mercadoId?: number;
      data?: string;
      itens: ItemCarrinho[] = [];

  public Create(idMercado: number, data: string, itens: ItemCarrinho[]): CompraSignature {
    const compra = new CompraSignature();
    compra.mercadoId = idMercado;
    compra.data = data;
    compra.itens = itens;
    return compra;
  }  

    public adicionarItem(item: ItemCarrinho): void {
    this.itens.push(item);
  }

  public adicionarItens(novosItens: ItemCarrinho[]): void {
    this.itens.push(...novosItens);
  }
}