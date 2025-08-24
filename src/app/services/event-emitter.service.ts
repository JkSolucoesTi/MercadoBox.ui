import { Injectable } from '@angular/core';
import { ItemCarrinho } from '../model/carrinho/itemCarrinho';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }

  private itemAdicionadoSubject = new Subject<ItemCarrinho>();

  itemAdicionadoSubject$: Observable<ItemCarrinho> = this.itemAdicionadoSubject.asObservable();

  emitirProduto(produto: ItemCarrinho) {
    this.itemAdicionadoSubject.next(produto);
  }
}
