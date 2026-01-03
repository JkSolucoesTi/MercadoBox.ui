import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../../model/compra/compra';
import { CompraSignature } from '../../model/Dto/signature/compraSignature';
import { CompraReponse } from '../../model/Dto/response/compraResponse';
import { CompraTokenSignature } from '../../model/Dto/signature/compraTokenSignature';
import { ItemCarrinhoSignature } from '../../model/Dto/signature/itemCarrinhoSignature';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../model/apiResponse/apiResponse';
import { PaginatedResult } from '../../model/Dto/response/paginacoResponse';
import { Utils } from 'src/app/util/utils';
import { ItemCarrinho } from 'src/app/model/carrinho/itemCarrinho';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private controller: string = "Compras"

  constructor(private http: HttpClient) { }

  criarCompra(compra: CompraSignature): Observable<ApiResponse<CompraReponse>> {
    return this.http.post<ApiResponse<CompraReponse>>(`${environment.apiUrl}/${this.controller}/Create`, compra);
  }

  AdicionarItemCarrinho(itemCarrinhoSignature: ItemCarrinhoSignature): Observable<Compra> {
    return this.http.post<Compra>(`${environment.apiUrl}/${this.controller}/AddItemCarrinho`, itemCarrinhoSignature);
  }

  atualizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${environment.apiUrl}/${this.controller}/${compra.id}`, compra);
  }

  finalizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${environment.apiUrl}/${this.controller}/${compra.id}`, compra);
  }

  buscarPorId(singnature: CompraTokenSignature): Observable<ApiResponse<CompraReponse>> {
    return this.http.post<ApiResponse<CompraReponse>>(`${environment.apiUrl}/${this.controller}/GetCompraByToken`, singnature);
  }

  listarCompras(): Observable<ApiResponse<Compra[]>> {
    return this.http.get<ApiResponse<Compra[]>>(`${environment.apiUrl}/${this.controller}/ListarCompras`);
  }

  atualizarStatusCompra(singnature: CompraTokenSignature): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}/${this.controller}/AtualizarStatus`, singnature);
  }

  listarCompraPaginado(pagina: number, tamanhoPagina: number, mercado_id: number, data_inicio: Date, data_fim: Date,id_usuario: number): Observable<PaginatedResult<CompraReponse>> {

    let params = new HttpParams()
      .set('page', pagina)
      .set('pageSize', tamanhoPagina)
      .set('mercado_id', mercado_id || '')
      .set('data_inicio', Utils.toDateString(data_inicio) )
      .set('data_fim', Utils.toDateString(data_fim))
      .set('id_usuario',id_usuario);

    return this.http.get<PaginatedResult<CompraReponse>>(`${environment.apiUrl}/${this.controller}/GetCompras`, { params });
  }

  removerItemCarrinho(compraId: number, itemId: number): Observable<ApiResponse<ItemCarrinho>>{
    return this.http.delete<ApiResponse<ItemCarrinho>>(`${environment.apiUrl}/${this.controller}/compra/${compraId}/item/${itemId}`);
  }
}