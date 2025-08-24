import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Mercado {
  id?: number;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cnpj: string;
  telefone: string;
  descricao:string;
  quantidade:number;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoService {
  private apiUrl = 'http://localhost:3000/mercados'; // endpoint do JSON Server

  constructor(private http: HttpClient) {}

  listar(): Observable<Mercado[]> {
    return this.http.get<Mercado[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Mercado> {
    return this.http.get<Mercado>(`${this.apiUrl}/${id}`);
  }

  criar(mercado: Mercado): Observable<Mercado> {
    return this.http.post<Mercado>(this.apiUrl, mercado);
  }

  atualizar(id: number, mercado: Mercado): Observable<Mercado> {
    return this.http.put<Mercado>(`${this.apiUrl}/${id}`, mercado);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
