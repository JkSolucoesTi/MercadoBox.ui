import { ApiResponse } from './../model/apiResponse/apiResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MercadoResponse } from '../model/Dto/response/mercadoResponse';
import { API_CONFIG } from '../core/config/api.config';
import { ApiUrlHelper } from '../core/helpers/api-url.helper';
import { MercadoSignature } from '../model/Dto/signature/mercadoSignature';

export interface Mercado {
  id?: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cnpj: string;
  telefone: string;
  descricao: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoService {

  private apiUrl = ApiUrlHelper.getUrl(API_CONFIG.endpoints.mercados)

  constructor(private http: HttpClient) { }

  listar(): Observable<ApiResponse<MercadoResponse[]>> {
    return this.http.get<ApiResponse<MercadoResponse[]>>(`${this.apiUrl}/GetAll`);
  }

  buscarPorId(id: number): Observable<Mercado> {
    return this.http.get<Mercado>(`${this.apiUrl}/${id}`);
  }

  criar(mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.post<ApiResponse<MercadoResponse>>(this.apiUrl, mercado);
  }

  atualizar(id: number, mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.put<ApiResponse<MercadoSignature>>(`${this.apiUrl}/${id}`, mercado);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
