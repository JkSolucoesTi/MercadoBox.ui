import { ItemCarrinho } from "../../carrinho/itemCarrinho";

export class CompraReponse{

    constructor() {
        this.itens = []        
    }
    guid?: string;
    itens: ItemCarrinho[]=[]
}