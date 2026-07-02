/**
 * =============================================================================
 * APP.COMPONENT.TS - Root Component
 * =============================================================================
 *
 * 📘 KONSEP: Standalone Component & Root Layout
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (NgModule-based):
 * ```typescript
 * @Component({
 *   selector: 'app-root',
 *   templateUrl: './app.component.html',
 *   styleUrls: ['./app.component.scss']
 * })
 * export class AppComponent {
 *   title = 'witsml-dashboard';
 * }
 * // Component harus di-declare di NgModule:
 * @NgModule({ declarations: [AppComponent], ... })
 * ```
 *
 * 🟢 NEW WAY (Standalone Component):
 * - `standalone: true` - Component mandiri tanpa NgModule
 * - `imports: [...]` - Import dependencies langsung di component
 * - Inline template/styles bisa digunakan untuk component kecil
 * - changeDetection: OnPush sebagai default best practice
 * =============================================================================
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,  // 🟢 NEW: Standalone component - tidak perlu NgModule
  imports: [         // 🟢 NEW: Import langsung di component
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, // 🟢 BEST PRACTICE: OnPush
  template: `
    <!-- ============================================================
         TEMPLATE - Layout dengan Sidebar Navigation
         ============================================================ -->
    <mat-sidenav-container class="sidenav-container">

      <!-- SIDEBAR -->
      <mat-sidenav #drawer class="sidenav"
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="!(isHandset$ | async)">

        <mat-toolbar class="sidenav-header">
          <span>🛢️ WITSML Monitor</span>
        </mat-toolbar>

        <mat-nav-list>
          <!-- Navigation Items -->
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/wells" routerLinkActive="active-link">
            <mat-icon matListItemIcon>oil_barrel</mat-icon>
            <span matListItemTitle>Well Monitoring</span>
          </a>
          <a mat-list-item routerLink="/streaming" routerLinkActive="active-link">
            <mat-icon matListItemIcon>stream</mat-icon>
            <span matListItemTitle>Data Streaming</span>
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active-link">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Reports</span>
          </a>

          <mat-divider></mat-divider>

          <!-- Learning Section -->
          <a mat-list-item routerLink="/learning" routerLinkActive="active-link">
            <mat-icon matListItemIcon>school</mat-icon>
            <span matListItemTitle>Learning Center</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- MAIN CONTENT -->
      <mat-sidenav-content>
        <!-- Top Toolbar -->
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon>menu</mat-icon>
          </button>
          <span>WITSML Well Data Dashboard</span>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button aria-label="Notifications">
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button aria-label="Settings">
            <mat-icon>settings</mat-icon>
          </button>
        </mat-toolbar>

        <!-- Router Outlet - Di sini child components akan di-render -->
        <main class="main-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100%;
    }
    .sidenav {
      width: 260px;
    }
    .sidenav-header {
      background: #1a237e;
      color: white;
      font-size: 16px;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .main-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }
    .active-link {
      background-color: rgba(63, 81, 181, 0.1);
      border-right: 3px solid #3f51b5;
    }
  `]
})
export class AppComponent {
  /**
   * 📘 KONSEP: inject() Function
   *
   * 🔴 OLD WAY (Constructor Injection):
   * constructor(private breakpointObserver: BreakpointObserver) { }
   *
   * 🟢 NEW WAY (inject function):
   * Lebih fleksibel, bisa digunakan di luar constructor,
   * dan memungkinkan injection di functions/guards.
   */
  private breakpointObserver = inject(BreakpointObserver);

  // Reactive responsive check menggunakan RxJS
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay() // Cache result agar tidak re-subscribe
    );
}
