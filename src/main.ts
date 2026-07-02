/**
 * =============================================================================
 * MAIN.TS - Application Entry Point
 * =============================================================================
 *
 * 📘 KONSEP: Entry Point Angular Application
 *
 * File ini adalah titik awal dari Angular application.
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (Angular ≤15 - Module-based):
 * ```typescript
 * import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 * import { AppModule } from './app/app.module';
 *
 * platformBrowserDynamic().bootstrapModule(AppModule)
 *   .catch(err => console.error(err));
 * ```
 *
 * 🟢 NEW WAY (Angular 16+ - Standalone):
 * Menggunakan `bootstrapApplication` yang lebih ringan dan tidak memerlukan NgModule.
 * Configuration dilakukan melalui `appConfig` yang berisi providers.
 * =============================================================================
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// 🟢 NEW WAY: Bootstrap standalone component langsung
// Tidak perlu AppModule lagi!
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
