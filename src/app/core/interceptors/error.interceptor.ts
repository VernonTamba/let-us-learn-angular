/**
 * =============================================================================
 * ERROR.INTERCEPTOR.TS - Global Error Handling Interceptor
 * =============================================================================
 *
 * 📘 KONSEP: Global Error Handling
 *
 * Interceptor ini menangkap semua HTTP errors secara global:
 * - Transform error responses ke format standar
 * - Show notifications untuk user
 * - Log errors untuk debugging
 * - Handle specific error codes (429 Too Many Requests, 500 Server Error, etc.)
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (Class-based):
 * ```typescript
 * @Injectable()
 * export class ErrorInterceptor implements HttpInterceptor {
 *   constructor(
 *     private notification: NotificationService,
 *     private router: Router
 *   ) {}
 *
 *   intercept(req: HttpRequest<any>, next: HttpHandler) {
 *     return next.handle(req).pipe(
 *       catchError(error => this.handleError(error))
 *     );
 *   }
 * }
 * ```
 *
 * 🟢 NEW WAY (Functional - Angular 15+):
 * Lebih concise, functional approach
 * =============================================================================
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

/**
 * 🟢 NEW WAY: Functional Error Interceptor
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    // 📘 KONSEP: retry operator
    // Retry pada network errors (tapi jangan retry pada 4xx errors)
    retry({
      count: 1,
      delay: (error, retryCount) => {
        // Only retry on server errors (5xx) or network errors
        if (error instanceof HttpErrorResponse && error.status < 500 && error.status !== 0) {
          return throwError(() => error); // Don't retry client errors
        }
        return timer(1000 * retryCount); // Exponential backoff
      }
    }),

    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side / network error
        errorMessage = `Network Error: ${error.error.message}`;
        notificationService.error('Connection Error', errorMessage);
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your network.';
            notificationService.error('Connection Failed', errorMessage);
            break;

          case 400:
            errorMessage = error.error?.message || 'Invalid request';
            notificationService.warning('Bad Request', errorMessage);
            break;

          case 401:
            // Handled by auth interceptor, but log here
            errorMessage = 'Your session has expired. Please login again.';
            // Don't show notification here - auth interceptor handles it
            break;

          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            notificationService.error('Access Denied', errorMessage);
            router.navigate(['/unauthorized']);
            break;

          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            notificationService.warning('Not Found', errorMessage);
            break;

          case 409:
            errorMessage = error.error?.message || 'Conflict - resource already exists';
            notificationService.warning('Conflict', errorMessage);
            break;

          case 422:
            errorMessage = 'Validation error. Please check your input.';
            notificationService.warning('Validation Error', errorMessage);
            break;

          case 429:
            errorMessage = 'Too many requests. Please wait a moment.';
            notificationService.warning('Rate Limited', errorMessage);
            break;

          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            notificationService.error('Server Error', errorMessage);
            break;

          case 502:
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            notificationService.error('Service Unavailable', errorMessage);
            break;

          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
            notificationService.error('Error', errorMessage);
        }
      }

      // Log error for debugging (in production, send to error tracking service)
      console.error('[HTTP Error]', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });

      // Re-throw the error so individual services can also handle it
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};
