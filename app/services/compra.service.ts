import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../model/compra/compra';
import { CompraSignature } from '../model/Dto/signature/compraSignature';
import { API_CONFIG } from '../core/config/api.config';
import { ApiUrlHelper } from '../core/helpers/api-url.helper';
import { CompraReponse } from '../model/Dto/response/compraResponse';
import { CompraTokenSignature } from '../model/Dto/signature/compraTokenSignature';
import { ItemCarrinhoSignature } from '../model/Dto/signature/itemCarrinhoSignature';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private apiUrl = ApiUrlHelper.getUrl(API_CONFIG.endpoints.compras)


  constructor(private http: HttpClient) { }

  criarCompra(compra: CompraSignature): Observable<CompraReponse> {
    return this.http.post<CompraReponse>(`${this.apiUrl}/Create` , compra);
  }

  AdicionarItemCarrinho(itemCarrinhoSignature: ItemCarrinhoSignature): Observable<Compra> {
    return this.http.post<Compra>(`${this.apiUrl}/AddItemCarrinho`,itemCarrinhoSignature);
  }

  atualizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${this.apiUrl}/${compra.id}`, compra);
  }

  finalizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${this.apiUrl}/${compra.id}`, compra);
  }

  buscarPorId(singnature:CompraTokenSignature): Observable<CompraReponse> {
    return this.http.post<CompraReponse>(`${this.apiUrl}/GetCompraByToken`,singnature);
  }

  listarCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/ListarCompras`);
  }

  atualizarStatusCompra(singnature:CompraTokenSignature) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AtualizarStatus`,singnature);
  }
}