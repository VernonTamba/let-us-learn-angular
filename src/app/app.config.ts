/**
 * =============================================================================
 * APP.CONFIG.TS - Application Configuration
 * =============================================================================
 *
 * 📘 KONSEP: Application Configuration (Standalone Approach)
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (NgModule-based):
 * ```typescript
 * @NgModule({
 *   declarations: [AppComponent],
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     HttpClientModule,
 *     RouterModule.forRoot(routes),
 *     StoreModule.forRoot(reducers),
 *     EffectsModule.forRoot([])
 *   ],
 *   providers: [
 *     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
 *     { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
 *   ],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 *
 * 🟢 NEW WAY (Standalone - Angular 16+):
 * Semua configuration dilakukan melalui `ApplicationConfig` object.
 * Providers didaftarkan menggunakan fungsi `provide*`.
 * Lebih modular, tree-shakeable, dan mudah di-test.
 * =============================================================================
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// 🟢 NEW WAY: ApplicationConfig object
export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js change detection (akan diganti zoneless di masa depan)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router configuration dengan fitur tambahan
    provideRouter(
      routes,
      withComponentInputBinding(),  // Auto-bind route params ke @Input()
      withViewTransitions()          // Animasi transisi antar halaman
    ),

    // HTTP Client dengan functional interceptors (NEW WAY!)
    // 🔴 OLD: { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    // 🟢 NEW: withInterceptors([authInterceptor, errorInterceptor])
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    // Animations (async = lazy load animation code)
    provideAnimationsAsync(),
  ]
};
