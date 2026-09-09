import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';
import { UsuarioSignature } from 'src/app/model/Dto/signature/usuarioSignature';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private controller: string = 'Autenticacao';

  constructor(private http: HttpClient) {}

  cadastrar(signature: UsuarioSignature): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${environment.apiUrl}/${this.controller}/Cadastrar`,
      signature
    );
  }
}
