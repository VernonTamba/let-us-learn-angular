/**
 * =============================================================================
 * LEARNING HOME - Landing page for Learning Center
 * =============================================================================
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-learning-home',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="learning-home">
      <h1>Angular Learning Center</h1>
      <p class="subtitle">Belajar Angular dari Basic sampai Advanced dengan real-world examples</p>

      <div class="modules-grid">
        <mat-card class="module-card basics" routerLink="basics">
          <mat-card-header>
            <mat-icon mat-card-avatar>school</mat-icon>
            <mat-card-title>01 - Basics</mat-card-title>
            <mat-card-subtitle>Fundamentals Angular</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <ul>
              <li>Components & Templates</li>
              <li>Data Binding (4 types)</li>
              <li>Directives & Pipes</li>
              <li>Services & DI</li>
              <li>Lifecycle Hooks</li>
              <li>Basic Routing</li>
              <li>Template-Driven Forms</li>
            </ul>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">START LEARNING</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="module-card intermediate" routerLink="intermediate">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>02 - Intermediate</mat-card-title>
            <mat-card-subtitle>Patterns & Architecture</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <ul>
              <li>Reactive Forms (Advanced)</li>
              <li>HTTP Client & Interceptors</li>
              <li>RxJS Operators & Patterns</li>
              <li>Component Communication</li>
              <li>Lazy Loading & Guards</li>
              <li>State Management</li>
              <li>Error Handling</li>
            </ul>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">START LEARNING</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="module-card advanced" routerLink="advanced">
          <mat-card-header>
            <mat-icon mat-card-avatar>rocket_launch</mat-icon>
            <mat-card-title>03 - Advanced</mat-card-title>
            <mat-card-subtitle>Performance & New APIs</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <ul>
              <li>Signals (New Reactivity)</li>
              <li>New Control Flow</li>
              <li>Change Detection Deep Dive</li>
              <li>Dynamic Components</li>
              <li>Content Projection</li>
              <li>NgRx & Signal Store</li>
              <li>Performance Optimization</li>
              <li>Deferrable Views</li>
            </ul>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">START LEARNING</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .learning-home {
      max-width: 1000px;
      margin: 0 auto;
      text-align: center;
    }

    h1 { margin-bottom: 4px; }
    .subtitle { color: #666; margin-bottom: 32px; }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .module-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      text-align: left;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      ul {
        padding-left: 20px;
        li { margin-bottom: 4px; font-size: 13px; color: #555; }
      }

      &.basics { border-top: 4px solid #4caf50; }
      &.intermediate { border-top: 4px solid #ff9800; }
      &.advanced { border-top: 4px solid #f44336; }
    }
  `]
})
export class LearningHomeComponent {}
