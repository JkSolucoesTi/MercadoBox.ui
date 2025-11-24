import { ApiResponse } from '../../model/apiResponse/apiResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MercadoResponse } from '../../model/Dto/response/mercadoResponse';
import { API_CONFIG } from '../../core/config/api.config';
import { ApiUrlHelper } from '../../core/helpers/api-url.helper';
import { MercadoSignature } from '../../model/Dto/signature/mercadoSignature';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../../model/Dto/response/paginacoResponse';

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


  private controller : string = "Mercados";

  constructor(private http: HttpClient) { }

  listar(): Observable<ApiResponse<MercadoResponse[]>> {
    return this.http.get<ApiResponse<MercadoResponse[]>>(`${environment.apiUrl}/${this.controller}/GetAll`);
  }

    listarMercadoPaginado(pagina: number, tamanhoPagina: number , filtro: string = "") : Observable<PaginatedResult<MercadoResponse>> {
  
      const params = new HttpParams()
        .set('page', pagina)
        .set('pageSize', tamanhoPagina)     
        .set('filtro',filtro) 
    
        return this.http.get<PaginatedResult<MercadoResponse>>(`${environment.apiUrl}/${this.controller}/GetMercados`, { params });
  }

  buscarPorId(id: number): Observable<Mercado> {
    return this.http.get<Mercado>(`${environment.apiUrl}/${this.controller}/${id}`);
  }

  criar(mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.post<ApiResponse<MercadoResponse>>(`${environment.apiUrl}/${this.controller}/Create`, mercado);
  }

  atualizar(id: number, mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.put<ApiResponse<MercadoSignature>>(`${environment.apiUrl}/${this.controller}/${id}`, mercado);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.controller}/${id}`);
  }
}
