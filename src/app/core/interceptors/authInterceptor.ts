import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, throwError } from 'rxjs';
import { AuthServiceService } from 'src/app/pages/login/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  debugger;

  const token = authService.obterToken();

  if (!token) {
    return next(req);
  }

  // 🔥 Verifica expiração do token
  const payload: any = jwtDecode(token);
  const tempoAtual = Math.floor(Date.now() / 1000); // em segundos

  if (payload.exp && payload.exp < tempoAtual) {
    // Token expirado!
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado'));
  }

  // 🔥 Token válido → adiciona no header
  const reqComToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(reqComToken).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        // Backend pode mandar 401 → forçar logout
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    })
  );
};
