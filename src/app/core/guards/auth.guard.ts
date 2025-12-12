import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

constructor(private auth:AuthServiceService,private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.auth.obterToken();

  if (!token || tokenExpirado(token)) {
    this.auth.logout();
    this.router.navigate(['/login']);
    return false;
  }

    try {
      const payload: any = jwtDecode(token);
      const agora = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < agora) {
        this.auth.logout();
        this.router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    const permissoesNecessarias = route.data['permissoes'] as string[];
    if (permissoesNecessarias && permissoesNecessarias.length > 0) {

      const usuarioPossuiTodas = permissoesNecessarias.every(p =>
        this.auth.possuiPermissao(p)
      );

      if (!usuarioPossuiTodas) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;

  }

}

function tokenExpirado(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);

    if (!decoded.exp) return true;

    const agora = Math.floor(Date.now() / 1000);
    return decoded.exp < agora;

  } catch (e) {
    return true;
  }
}
