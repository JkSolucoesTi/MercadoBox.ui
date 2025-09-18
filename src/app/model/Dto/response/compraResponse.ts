import { ItemCarrinho } from "../../carrinho/itemCarrinho";

export class CompraReponse{

    constructor() {
        this.itens = []        
    }
    guid?: string;
    itens: ItemCarrinho[]=[]
    totalSemDesconto?: number;
    totalComDesconto?: number;
}