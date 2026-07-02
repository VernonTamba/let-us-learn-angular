/**
 * =============================================================================
 * NOT-FOUND.COMPONENT.TS - 404 Page
 * =============================================================================
 *
 * 📘 KONSEP: Wildcard Route & Simple Standalone Component
 * =============================================================================
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found-container">
      <mat-icon class="error-icon">explore_off</mat-icon>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The well you're looking for doesn't exist in our database.</p>
      <a mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        Back to Dashboard
      </a>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 24px;
    }

    .error-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ccc;
      margin-bottom: 16px;
    }

    h1 {
      font-size: 72px;
      color: #1a237e;
      margin: 0;
    }

    h2 {
      color: #666;
      margin-bottom: 8px;
    }

    p {
      color: #999;
      margin-bottom: 24px;
    }
  `]
})
export class NotFoundComponent {}
