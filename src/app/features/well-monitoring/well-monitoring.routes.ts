/**
 * =============================================================================
 * WELL-MONITORING.ROUTES.TS - Child Routes for Well Monitoring Feature
 * =============================================================================
 *
 * 📘 KONSEP: Child Routes & Route Parameters
 *
 * Pattern ini mendemonstrasikan:
 * - Nested/child routes
 * - Route parameters (:id)
 * - Route resolvers (data pre-fetching)
 * - Multiple route configurations per feature
 *
 * ============ PERBANDINGAN ============
 *
 * 🔴 OLD: Feature modules with RouterModule.forChild(routes)
 * 🟢 NEW: Plain route arrays exported as constants
 * =============================================================================
 */

import { Routes } from '@angular/router';

export const WELL_MONITORING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./well-list/well-list.component')
      .then(c => c.WellListComponent),
    title: 'Well List'
  },
  {
    path: ':id',
    loadComponent: () => import('./well-detail/well-detail.component')
      .then(c => c.WellDetailComponent),
    title: 'Well Detail'
  }
];
