/**
 * =============================================================================
 * AUTH.INTERCEPTOR.TS - Authentication HTTP Interceptor
 * =============================================================================
 *
 * 📘 KONSEP: HTTP Interceptors
 *
 * Interceptor mencegat setiap HTTP request/response untuk:
 * - Menambahkan Authorization header
 * - Handle token refresh
 * - Add common headers
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (Class-based Interceptor):
 * ```typescript
 * @Injectable()
 * export class AuthInterceptor implements HttpInterceptor {
 *   constructor(private authService: AuthService) {}
 *
 *   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 *     const token = this.authService.getToken();
 *     if (token) {
 *       req = req.clone({
 *         setHeaders: { Authorization: `Bearer ${token}` }
 *       });
 *     }
 *     return next.handle(req);
 *   }
 * }
 *
 * // Registration di NgModule:
 * providers: [
 *   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
 * ]
 * ```
 *
 * 🟢 NEW WAY (Functional Interceptor - Angular 15+):
 * - Pure function, lebih simple
 * - Menggunakan inject() untuk DI
 * - Registered via withInterceptors() di provideHttpClient()
 * - Lebih mudah di-test
 *
 * 💡 TIP INTERVIEW:
 * "Apa itu HTTP Interceptor dan kapan digunakan?"
 * - Authentication (attach tokens)
 * - Logging
 * - Error handling
 * - Caching
 * - Loading indicators
 * - Request transformation
 * =============================================================================
 */

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * 🟢 NEW WAY: Functional Interceptor
 *
 * Signature: (req, next) => Observable<HttpEvent<unknown>>
 * - req: HttpRequest yang akan dikirim
 * - next: Function untuk meneruskan request ke interceptor berikutnya atau backend
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  // 🟢 inject() bisa digunakan di functional interceptor
  const authService = inject(AuthService);

  // Skip auth header untuk public endpoints
  const publicPaths = ['/auth/login', '/auth/register', '/public'];
  const isPublicPath = publicPaths.some(path => req.url.includes(path));

  if (isPublicPath) {
    return next(req); // Pass through tanpa modification
  }

  // Get token from auth service
  const token = authService.getToken();

  if (token) {
    // Clone request dan tambahkan Authorization header
    // HttpRequest adalah immutable, jadi harus clone
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return next(clonedReq).pipe(
      catchError(error => {
        // Handle 401 Unauthorized - token expired
        if (error.status === 401 && !req.url.includes('/auth/refresh')) {
          return handleTokenRefresh(authService, req, next);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

/**
 * Handle token refresh ketika mendapat 401
 */
function handleTokenRefresh(
  authService: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return authService.refreshToken().pipe(
    switchMap(newToken => {
      // Retry original request dengan token baru
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken.accessToken}`
        }
      });
      return next(clonedReq);
    }),
    catchError(error => {
      // Refresh failed - logout user
      authService.logout();
      return throwError(() => error);
    })
  );
}
