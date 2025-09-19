import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CarrinhoStoreService {

  constructor() { }

   private compraGuid: string | null = null;

  setCompraGuid(guid: string) {
    this.compraGuid = guid;
  }

  getCompraGuid(): string | null {
    return this.compraGuid;
  }

  clearCompraGuid() {
    this.compraGuid = null;
  }

}
