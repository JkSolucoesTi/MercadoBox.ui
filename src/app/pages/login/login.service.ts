import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiResponse/apiResponse';
import { LoginResponse } from 'src/app/model/Dto/response/loginResponse';
import { LoginSignature } from 'src/app/model/Dto/signature/loginSignature';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private controller: string = "Autenticacao"

  constructor(private http: HttpClient) { }

  login(login: LoginSignature): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/${this.controller}/Autenticar`, login);
  }

}
