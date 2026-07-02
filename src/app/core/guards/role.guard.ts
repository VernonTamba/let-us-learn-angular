/**
 * =============================================================================
 * ROLE.GUARD.TS - Role-based Access Control Guard
 * =============================================================================
 *
 * 📘 KONSEP: RBAC (Role-Based Access Control)
 *
 * Dalam Oil & Gas operation, different roles have different access:
 * - Admin: Full access
 * - Engineer: View & modify well data, run reports
 * - Operator: View real-time data, acknowledge alarms
 * - Viewer: Read-only access
 *
 * ============ ADVANCED PATTERN ============
 *
 * Menggunakan route.data untuk mendefinisikan required roles
 * sehingga guard bisa reusable untuk berbagai role combinations.
 *
 * ```typescript
 * // Di route config:
 * {
 *   path: 'admin',
 *   canActivate: [roleGuard],
 *   data: { roles: ['admin'] }
 * }
 * ```
 * =============================================================================
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * 🟢 Functional role guard
 *
 * Reads required roles from route.data.roles
 * Checks if current user has any of the required roles
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  // Get required roles from route data
  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;

  // If no roles specified, allow access (just needs authentication)
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user has required role
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Access denied
  notification.error(
    'Access Denied',
    `You need one of these roles: ${requiredRoles.join(', ')}`
  );

  // Redirect to unauthorized page or dashboard
  return router.createUrlTree(['/dashboard']);
};

/**
 * Guard factory - creates a guard for specific roles
 *
 * 📘 ADVANCED PATTERN: Guard Factory
 * Berguna ketika ingin membuat guard yang configurable
 *
 * Usage di routes:
 * ```typescript
 * {
 *   path: 'admin-panel',
 *   canActivate: [requireRole(UserRole.Admin)]
 * }
 * ```
 */
export function requireRole(...roles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notification = inject(NotificationService);

    if (authService.hasAnyRole(roles)) {
      return true;
    }

    notification.error(
      'Insufficient Permissions',
      `Required role: ${roles.join(' or ')}`
    );

    return router.createUrlTree(['/dashboard']);
  };
}

/**
 * Permission-based guard (lebih granular dari role-based)
 *
 * 📘 KONSEP: Fine-grained permissions
 * Dalam enterprise apps, seringkali tidak cukup dengan role saja.
 * Perlu permission/privilege checking.
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPermissions = route.data?.['permissions'] as string[] | undefined;

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // In real app, check permissions from user profile
  // For now, admin has all permissions
  if (authService.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
