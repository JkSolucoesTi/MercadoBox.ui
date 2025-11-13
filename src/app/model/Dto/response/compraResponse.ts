import { ItemCarrinho } from "../../carrinho/itemCarrinho";

export class CompraReponse{

    constructor() {
        this.itens = []        
    }
    guid?: string;
    data?: string;
    itens: ItemCarrinho[]=[]
    totalSemDesconto?: number;
    totalComDesconto?: number;
    totalItens?:number;
}