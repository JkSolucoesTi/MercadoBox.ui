import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/model/categoria/categoria';
import { ProdutoCompleto } from '../model/produto/produtoCompleto';
import { ProdutoSignature } from '../model/Dto/signature/produtoSignature';
import { ProdutoResponse } from '../model/Dto/response/produtoResponse';
import { ApiUrlHelper } from '../core/helpers/api-url.helper';
import { API_CONFIG } from '../core/config/api.config';
import { ProdutoPesquisaSignature } from '../model/Dto/signature/produtoPesquisaSignature';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../model/Dto/response/paginacoResponse';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private controller : string = "Produtos"

  constructor(private http: HttpClient) { }

  listar(): Observable<ProdutoResponse[]> {
    return this.http.get<ProdutoResponse[]>(`${environment.apiUrl}/${this.controller}/GetAll`);
  }

  listarProdutosPaginado(pagina: number, tamanhoPagina: number , filtro: string = "") : Observable<PaginatedResult<ProdutoResponse>> {

    const params = new HttpParams()
      .set('page', pagina)
      .set('pageSize', tamanhoPagina)     
      .set('filtro',filtro) 
  
      return this.http.get<PaginatedResult<ProdutoResponse>>(`${environment.apiUrl}/Produtos/GetProdutos`, { params });
}

  buscarPorId(id: number): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${environment.apiUrl}/${this.controller}/${id}`);
  }

  searchByCodigo(signature: ProdutoPesquisaSignature): Observable<ProdutoResponse[]> {
    return this.http.post<ProdutoResponse[]>(`${environment.apiUrl}/${this.controller}/searchByCodigo`, signature);
  }

  searchByName(signature: ProdutoPesquisaSignature): Observable<ProdutoResponse[]> {
    return this.http.post<ProdutoResponse[]>(`${environment.apiUrl}/${this.controller}/searchByCodigo`, signature);
  }

  criar(produto: ProdutoSignature): Observable<ProdutoResponse> {
    return this.http.post<ProdutoSignature>(`${environment.apiUrl}/${this.controller}/Create` , produto);
  }

  atualizar(produto: ProdutoCompleto): Observable<ProdutoCompleto> {
    return this.http.put<ProdutoCompleto>(`${environment.apiUrl}/${this.controller}/${produto.id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.controller}/${id}`);
  }

}
