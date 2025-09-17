import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/model/categoria/categoria';
import { ProdutoCompleto } from '../model/produto/produtoCompleto';
import { ProdutoSignature } from '../model/Dto/signature/produtoSignature';
import { ProdutoResponse } from '../model/Dto/response/produtoResponse';
import { ApiUrlHelper } from '../core/helpers/api-url.helper';
import { API_CONFIG } from '../core/config/api.config';
import { ProdutoPesquisaSignature } from '../model/Dto/signature/produtoPesquisaSignature';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private apiUrl = ApiUrlHelper.getUrl(API_CONFIG.endpoints.produtos)

  constructor(private http: HttpClient) { }

  listar(): Observable<ProdutoResponse[]> {
    return this.http.get<ProdutoResponse[]>(`${this.apiUrl}/GetAll`);
  }

  buscarPorId(id: number): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.apiUrl}/${id}`);
  }

  searchByCodigo(signature: ProdutoPesquisaSignature): Observable<ProdutoResponse[]> {
    return this.http.post<ProdutoResponse[]>(`${this.apiUrl}/searchByCodigo`, signature);
  }

  criar(produto: ProdutoSignature): Observable<ProdutoResponse> {
    return this.http.post<ProdutoSignature>(`${this.apiUrl}/Create` , produto);
  }

  atualizar(produto: ProdutoCompleto): Observable<ProdutoCompleto> {
    return this.http.put<ProdutoCompleto>(`${this.apiUrl}/${produto.id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
