import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private atualizarCarrinhoSource = new BehaviorSubject<boolean>(false);
  atualizarCarrinhoSource$ = this.atualizarCarrinhoSource.asObservable();
  

  notificarAtualizacao(param: boolean){
    this.atualizarCarrinhoSource.next(param);
  }

}
