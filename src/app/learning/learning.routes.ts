/**
 * =============================================================================
 * LEARNING.ROUTES.TS - Routes for Learning Center
 * =============================================================================
 */

import { Routes } from '@angular/router';

export const LEARNING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./learning-home.component')
      .then(c => c.LearningHomeComponent),
    title: 'Learning Center'
  },
  {
    path: 'basics',
    loadComponent: () => import('./01-basics/basics-overview.component')
      .then(c => c.BasicsOverviewComponent),
    title: 'Angular Basics'
  },
  {
    path: 'intermediate',
    loadComponent: () => import('./02-intermediate/intermediate-overview.component')
      .then(c => c.IntermediateOverviewComponent),
    title: 'Angular Intermediate'
  },
  {
    path: 'advanced',
    loadComponent: () => import('./03-advanced/advanced-overview.component')
      .then(c => c.AdvancedOverviewComponent),
    title: 'Angular Advanced'
  }
];
