import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, throwError } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);
  const token = authService.obterToken();

  if (!token) {
    return next(req);
  }

  const payload: any = jwtDecode(token);
  const tempoAtual = Math.floor(Date.now() / 1000); 

  if (payload.exp && payload.exp < tempoAtual) {
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Token expirado'));
  }

  const reqComToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(reqComToken).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    })
  );
};
