import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../model/compra/compra';
import { CompraSignature } from '../model/Dto/signature/compraSignature';
import { CompraReponse } from '../model/Dto/response/compraResponse';
import { CompraTokenSignature } from '../model/Dto/signature/compraTokenSignature';
import { ItemCarrinhoSignature } from '../model/Dto/signature/itemCarrinhoSignature';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private controller : string = "Compras"

  constructor(private http: HttpClient) { }

  criarCompra(compra: CompraSignature): Observable<CompraReponse> {
    return this.http.post<CompraReponse>(`${environment.apiUrl}/${this.controller}/Create` , compra);
  }

  AdicionarItemCarrinho(itemCarrinhoSignature: ItemCarrinhoSignature): Observable<Compra> {
    return this.http.post<Compra>(`${environment.apiUrl}/${this.controller}/AddItemCarrinho`,itemCarrinhoSignature);
  }

  atualizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${environment.apiUrl}/${this.controller}/${compra.id}`, compra);
  }

  finalizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${environment.apiUrl}/${this.controller}/${compra.id}`, compra);
  }

  buscarPorId(singnature:CompraTokenSignature): Observable<CompraReponse> {
    return this.http.post<CompraReponse>(`${environment.apiUrl}/${this.controller}/GetCompraByToken`,singnature);
  }

  listarCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${environment.apiUrl}/${this.controller}/ListarCompras`);
  }

  atualizarStatusCompra(singnature:CompraTokenSignature) : Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${this.controller}/AtualizarStatus`,singnature);
  }
}