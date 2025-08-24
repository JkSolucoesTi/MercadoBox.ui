import { Injectable } from '@angular/core';
import { Compra } from '../model/compra/compra';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrinho } from '../model/carrinho/itemCarrinho';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoStoreService {

  private compra: Compra = new Compra();
  private compraSubject = new BehaviorSubject<Compra>(this.compra);

  constructor() { }

  getCompra$():Observable<Compra>{
    return this.compraSubject.asObservable();
  }

  addItem(item: ItemCarrinho){
    this.compra.addItem(item);
    this.compraSubject.next(this.compra);
  }

  removeItem(index:number){
    this.compra.itens.splice(index,1);
    this.compraSubject.next(this.compra);
  }

  clear(){
    this.compra = new Compra();
    this.compraSubject.next(this.compra);
  }

    getTotalPadrao(): number {
    return this.compra.getTotalPrecoPadrao();
  }

}
