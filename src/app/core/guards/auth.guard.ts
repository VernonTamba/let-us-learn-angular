/**
 * =============================================================================
 * AUTH.GUARD.TS - Route Guard for Authentication
 * =============================================================================
 *
 * 📘 KONSEP: Route Guards
 *
 * Route Guards menentukan apakah user bisa:
 * - canActivate: Mengakses route tertentu
 * - canActivateChild: Mengakses child routes
 * - canDeactivate: Meninggalkan route (unsaved changes warning)
 * - canMatch: Match route berdasarkan condition (pengganti canLoad)
 * - resolve: Load data sebelum component di-render
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (Class-based Guard):
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class AuthGuard implements CanActivate {
 *   constructor(
 *     private authService: AuthService,
 *     private router: Router
 *   ) {}
 *
 *   canActivate(
 *     route: ActivatedRouteSnapshot,
 *     state: RouterStateSnapshot
 *   ): boolean | UrlTree | Observable<boolean | UrlTree> {
 *     if (this.authService.isAuthenticated()) {
 *       return true;
 *     }
 *     return this.router.createUrlTree(['/login'], {
 *       queryParams: { returnUrl: state.url }
 *     });
 *   }
 * }
 *
 * // Usage:
 * { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent }
 * ```
 *
 * 🟢 NEW WAY (Functional Guard - Angular 15+):
 * - Pure function, lebih simple
 * - Menggunakan inject() untuk DI
 * - Lebih mudah di-test (just a function!)
 * - Type-safe dengan CanActivateFn
 *
 * 💡 TIP INTERVIEW:
 * "Jelaskan jenis-jenis Route Guards di Angular"
 * - canActivate: Protect route access
 * - canActivateChild: Protect child routes
 * - canDeactivate: Prevent leaving (unsaved data)
 * - canMatch: Conditionally match route (replaces canLoad)
 * - resolve: Pre-fetch data
 * =============================================================================
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * 🟢 NEW WAY: Functional Guard
 *
 * Simple function yang return boolean | UrlTree
 * - true: Allow navigation
 * - false: Block navigation
 * - UrlTree: Redirect ke route lain
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    // Additional check: is token expired?
    if (authService.isTokenExpired()) {
      // Token expired - redirect to login
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url, reason: 'expired' }
      });
    }
    return true; // Allow access
  }

  // Not authenticated - redirect to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * Guard untuk halaman yang hanya bisa diakses kalau BELUM login
 * (contoh: login page, register page)
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Already logged in - redirect to dashboard
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};

/**
 * CanDeactivate guard - untuk unsaved changes warning
 *
 * 📘 KONSEP: Mencegah user pergi dari halaman dengan data yang belum disimpan
 */
export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard = (
  component: CanDeactivateComponent
): boolean | Promise<boolean> => {
  if (component.canDeactivate) {
    return component.canDeactivate();
  }
  return true;
};
