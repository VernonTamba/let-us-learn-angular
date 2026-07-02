/**
 * =============================================================================
 * APP.ROUTES.TS - Root Routing Configuration
 * =============================================================================
 *
 * 📘 KONSEP: Routing & Lazy Loading
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (Module-based lazy loading):
 * ```typescript
 * const routes: Routes = [
 *   {
 *     path: 'dashboard',
 *     loadChildren: () => import('./features/dashboard/dashboard.module')
 *       .then(m => m.DashboardModule)
 *   }
 * ];
 *
 * @NgModule({
 *   imports: [RouterModule.forRoot(routes)],
 *   exports: [RouterModule]
 * })
 * export class AppRoutingModule { }
 * ```
 *
 * 🟢 NEW WAY (Standalone - loadComponent):
 * - Tidak perlu RouterModule atau NgModule
 * - Lazy load individual components langsung
 * - Route configuration sebagai plain array
 * - Lebih granular lazy loading
 * =============================================================================
 */

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ===== REDIRECT DEFAULT =====
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // ===== DASHBOARD =====
  // 🟢 NEW: loadComponent untuk lazy load standalone component
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(c => c.DashboardComponent),
    title: 'Dashboard - WITSML Monitor'  // 🟢 NEW: Route-level title
  },

  // ===== WELL MONITORING =====
  // Dengan child routes dan guards
  {
    path: 'wells',
    canActivate: [authGuard],  // 🟢 NEW: Functional guard (bukan class-based)
    loadChildren: () => import('./features/well-monitoring/well-monitoring.routes')
      .then(r => r.WELL_MONITORING_ROUTES),
    title: 'Well Monitoring'
  },

  // ===== DATA STREAMING =====
  {
    path: 'streaming',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./features/data-streaming/data-streaming.component')
      .then(c => c.DataStreamingComponent),
    title: 'Real-time Data Streaming'
  },

  // ===== REPORTS =====
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reports/reports.component')
      .then(c => c.ReportsComponent),
    title: 'Reports & Analytics'
  },

  // ===== LEARNING SECTION =====
  {
    path: 'learning',
    loadChildren: () => import('./learning/learning.routes')
      .then(r => r.LEARNING_ROUTES),
    title: 'Angular Learning'
  },

  // ===== WILDCARD (404) =====
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(c => c.NotFoundComponent)
  }
];
