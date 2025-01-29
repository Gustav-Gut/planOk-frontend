import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Si obtenemos un 401, intentamos refrescar el token
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            authService.setToken(newToken); // Guarda el nuevo token
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(retryRequest); // Reenvía la solicitud original
          }),
          catchError((refreshError) => {
            // Si no se puede renovar el token, cerrar sesión o manejar el error
            authService.logout();
            return throwError(refreshError);
          })
        );
      }
      return throwError(error); // Si no es un 401, lanza el error original
    })
  );
};
