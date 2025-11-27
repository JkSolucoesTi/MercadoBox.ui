import { ItemCarrinho } from "../../carrinho/itemCarrinho";

export class CompraReponse{

    constructor() {
        this.itens = []        
    }
    nomeMercado?: string;
    guid?: string;
    data?: string;
    itens: ItemCarrinho[]=[]
    totalSemDesconto?: number;
    totalComDesconto?: number;
    totalItens?:number;
}