/**
 * =============================================================================
 * ADVANCED OVERVIEW - Signals, Change Detection, @defer, Performance
 * =============================================================================
 *
 * 📘 KONSEP ADVANCED YANG DICOVER:
 * 1. Signals Deep Dive (signal, computed, effect, linkedSignal)
 * 2. Change Detection Strategies (Default vs OnPush)
 * 3. Deferrable Views (@defer)
 * 4. Content Projection (ng-content, ng-template)
 * 5. Dynamic Components
 * 6. Performance Optimization Techniques
 * 7. Zoneless Angular (future)
 *
 * 💡 TIP INTERVIEW:
 * Advanced topics menunjukkan bahwa kamu memahami Angular pada level yang dalam.
 * Interviewer suka bertanya tentang Change Detection, Signals, dan Performance.
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  untracked,
  inject,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  contentChild,
  contentChildren,
  viewChild,
  viewChildren,
  TemplateRef,
  ElementRef,
  afterNextRender,
  afterRender,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';

@Component({
  selector: 'app-advanced-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './advanced-overview.component.html',
  styleUrl: './advanced-overview.component.scss'
})
export class AdvancedOverviewComponent {

  // ===== LIVE DEMO STATE =====

  counter = signal(0);
  depthMeters = signal(3500);
  depthFeet = computed(() => this.depthMeters() * 3.28084);
  isDeepWell = computed(() => this.depthMeters() > 4000);

  effectRunCount = signal(0);
  private effectTrigger = signal(0);

  constructor() {
    // Demo effect
    effect(() => {
      const trigger = this.effectTrigger();
      if (trigger > 0) {
        this.effectRunCount.update(c => c + 1);
        console.log(`[Effect Demo] Triggered! Count: ${this.effectRunCount()}`);
      }
    });
  }

  triggerEffect(): void {
    this.effectTrigger.update(v => v + 1);
  }
}
