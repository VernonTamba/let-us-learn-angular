/**
 * =============================================================================
 * LOADING-SPINNER.COMPONENT.TS - Reusable Loading Indicator
 * =============================================================================
 *
 * 📘 KONSEP: Reusable Shared Components
 *
 * Shared components adalah components yang digunakan di banyak tempat.
 * Best practices:
 * - Standalone: true (independent dari module)
 * - Configurable via @Input / input()
 * - Minimal dependencies
 * - Presentational only (no business logic)
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD: @Input() decorator
 * 🟢 NEW: input() signal function
 * =============================================================================
 */

import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      📘 NEW Control Flow: @if
      🔴 OLD: *ngIf="show"
      🟢 NEW: @if (show()) { ... }
    -->
    @if (show()) {
      <div class="spinner-overlay" [class.fullscreen]="overlay()">
        <div class="spinner-container">
          <mat-spinner [diameter]="diameterValue()" [color]="color()"></mat-spinner>
          @if (message()) {
            <p class="spinner-message">{{ message() }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;

      &.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        z-index: 1000;
      }
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .spinner-message {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  `]
})
export class LoadingSpinnerComponent {

  /**
   * 🟢 NEW WAY: input() signal function
   *
   * 🔴 OLD WAY:
   * @Input() show: boolean = true;
   * @Input() message: string = '';
   * @Input() diameter: number = 40;
   * @Input() overlay: boolean = false;
   * @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
   *
   * 🟢 NEW WAY: Signal-based inputs
   * - Type-safe
   * - Reactive (signal-based)
   * - Required inputs: input.required<T>()
   * - Transform: input(defaultValue, { transform: ... })
   */

  // Optional inputs with defaults
  show = input<boolean>(true);
  message = input<string>('');
  diameter = input<number | string>(40);
  overlay = input<boolean>(false);
  color = input<'primary' | 'accent' | 'warn'>('primary');

  // Computed: transform diameter to number
  diameterValue = computed(() => {
    const d = this.diameter();
    return typeof d === 'string' ? parseInt(d, 10) : d;
  });
}
