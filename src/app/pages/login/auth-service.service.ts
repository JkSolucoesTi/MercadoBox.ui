import { Injectable } from '@angular/core';
import { LoginResponse } from 'src/app/model/Dto/response/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private TOKEN_KEY = 'mb_token';
  private PERMISSOES_KEY = 'mb_permissoes';

  constructor() { }

  salvarLogin(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.PERMISSOES_KEY, JSON.stringify(response.permissoes));
  }

  obterToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  obterPermissoes(): string[] {
    const p = localStorage.getItem(this.PERMISSOES_KEY);
    return p ? JSON.parse(p) : [];
  }

  possuiPermissao(permissao: string): boolean {
    return this.obterPermissoes().includes(permissao);
  }

  estaLogado(): boolean {
    return this.obterToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PERMISSOES_KEY);
  }
}
