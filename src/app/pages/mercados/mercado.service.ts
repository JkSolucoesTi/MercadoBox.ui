import { ApiResponse } from '../../model/apiResponse/apiResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { MercadoResponse } from '../../model/Dto/response/mercadoResponse';
import { API_CONFIG } from '../../core/config/api.config';
import { ApiUrlHelper } from '../../core/helpers/api-url.helper';
import { MercadoSignature } from '../../model/Dto/signature/mercadoSignature';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../../model/Dto/response/paginacoResponse';

import { MercadoProximo } from '../../model/mercado/mercado-proximo.model';

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
  ativo:boolean;
}

interface MercadosProximosCache {
  latitude: number;
  longitude: number;
  raioMetros: number;
  timestamp: number;
  data: MercadoProximo[];
}

@Injectable({
  providedIn: 'root'
})
export class MercadoService {

  private controller : string = "Mercados";
  private cacheProximos: MercadosProximosCache | null = null;
  private readonly CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos
  private readonly DISTANCIA_MAX_REUSO_METROS = 400; // reusa cache se deslocamento for menor que 400m

  constructor(private http: HttpClient) { }

  listar(): Observable<ApiResponse<MercadoResponse[]>> {
    return this.http.get<ApiResponse<MercadoResponse[]>>(`${environment.apiUrl}/${this.controller}/GetAll`);
  }

  listarMercadoPaginado(pagina: number, tamanhoPagina: number , filtro: string = "") : Observable<PaginatedResult<MercadoResponse>> {

    const params = new HttpParams()
      .set('page', pagina)
      .set('pageSize', tamanhoPagina)     
      .set('filtro',filtro); 
  
    return this.http.get<PaginatedResult<MercadoResponse>>(`${environment.apiUrl}/${this.controller}/GetMercados`, { params });
  }

  buscarPorId(id: number): Observable<ApiResponse<Mercado>> {
    return this.http.get<ApiResponse<Mercado>>(`${environment.apiUrl}/${this.controller}/${id}`);
  }

  criar(mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.post<ApiResponse<MercadoResponse>>(`${environment.apiUrl}/${this.controller}/Criar`, mercado);
  }

  obterOuCriar(mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.post<ApiResponse<MercadoResponse>>(`${environment.apiUrl}/${this.controller}/ObterOuCriar`, mercado);
  }

  atualizar(id: number, mercado: MercadoSignature): Observable<ApiResponse<MercadoResponse>> {
    return this.http.put<ApiResponse<MercadoSignature>>(`${environment.apiUrl}/${this.controller}/${id}`, mercado);
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.controller}/${id}`);
  }

  /**
   * Obtém mercados próximos com suporte a cache inteligente de coordenadas.
   * Se forçar for falso e o usuário tiver se deslocado menos de 400m no mesmo raio, reaproveita o cache.
   */
  obterMercadosProximos(
    latitude: number,
    longitude: number,
    raioMetros: number = 3000,
    forceRefresh: boolean = false
  ): Observable<ApiResponse<MercadoProximo[]>> {
    const agora = Date.now();

    if (
      !forceRefresh &&
      this.cacheProximos &&
      this.cacheProximos.raioMetros === raioMetros &&
      agora - this.cacheProximos.timestamp < this.CACHE_TTL_MS &&
      this.calcularDistanciaMetros(latitude, longitude, this.cacheProximos.latitude, this.cacheProximos.longitude) <= this.DISTANCIA_MAX_REUSO_METROS
    ) {
      return of({
        success: true,
        message: 'Mercados próximos obtidos do cache local',
        data: this.cacheProximos.data
      });
    }

    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('raioMetros', raioMetros.toString());

    return this.http.get<ApiResponse<MercadoProximo[]>>(`${environment.apiUrl}/${this.controller}/proximos`, { params }).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.cacheProximos = {
            latitude,
            longitude,
            raioMetros,
            timestamp: agora,
            data: response.data
          };
        }
      })
    );
  }

  public limparCacheProximos(): void {
    this.cacheProximos = null;
  }

  /**
   * Fórmula de Haversine para calcular a distância em metros entre duas coordenadas.
   */
  private calcularDistanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Raio da Terra em metros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

