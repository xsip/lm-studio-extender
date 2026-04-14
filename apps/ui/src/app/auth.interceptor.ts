import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  // Don't intercept auth endpoints
  if (req.url.includes('/auth/') && !req.url.includes('/auth/me')) {
    return next(req);
  }

  const token = localStorage.getItem('jwt_token');

  if (!token) {
    router.navigate(['/login']);
    return throwError(() => new Error('No token'));
  }

  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
