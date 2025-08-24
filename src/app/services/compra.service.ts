import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../model/compra/compra';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost:3000/compras'; 

  constructor(private http: HttpClient) { }

  criarCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, compra);
  }

  atualizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${this.apiUrl}/${compra.id}`, compra);
  }

  finalizar(compra: Compra): Observable<Compra> {
    return this.http.patch<Compra>(`${this.apiUrl}/${compra.id}`, compra);
  }

  buscarPorId(id: number | string): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  listarCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }


}