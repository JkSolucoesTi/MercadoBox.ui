import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string;
  sub: string;       
  permissoes: string[]; 
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

private TOKEN_KEY = 'mb_token';

constructor() { }

isAdmin(): boolean {
  return this.possuiPermissao('ADMIN');
}

  salvarToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  obterToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  obterPayload(): JwtPayload | null {
    const token = this.obterToken();

    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  obterPermissoes(): string[] {
    const payload = this.obterPayload();
    return payload?.permissoes ?? [];
  }

  possuiPermissao(perm: string): boolean {
    return this.obterPermissoes().includes(perm);
  }

  estaLogado(): boolean {
    return !!this.obterToken();
  }
}
