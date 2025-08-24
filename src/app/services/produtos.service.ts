import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/model/categoria/categoria';
import { ProdutoCompleto } from '../model/produto/produtoCompleto';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  private apiUrl = 'http://localhost:3000/produtos';
  private apiUrlCategoria = 'http://localhost:3000/categorias';

  constructor(private http: HttpClient) {}

  buscarPorId(id: number): Observable<ProdutoCompleto> {
    return this.http.get<ProdutoCompleto>(`${this.apiUrl}/${id}`);
  }

  listar(): Observable<ProdutoCompleto[]> {
    return this.http.get<ProdutoCompleto[]>(this.apiUrl);
  }

  criar(produto: ProdutoCompleto): Observable<ProdutoCompleto> {
    return this.http.post<ProdutoCompleto>(this.apiUrl, produto);
  }

  atualizar(produto: ProdutoCompleto): Observable<ProdutoCompleto> {
    return this.http.put<ProdutoCompleto>(`${this.apiUrl}/${produto.id}`, produto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrlCategoria);  // Carrega as categorias do JSON server
  }
}
