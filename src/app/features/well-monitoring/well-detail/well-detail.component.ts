/**
 * =============================================================================
 * WELL-DETAIL.COMPONENT.TS - Well Detail View
 * =============================================================================
 *
 * 📘 KONSEP: Route Parameters, Component Input Binding, Resolver Pattern
 *
 * Concepts demonstrated:
 * - Route parameter binding via input() (withComponentInputBinding)
 * - Signal-based data fetching
 * - Tab-based layout
 * - Parent-child communication
 *
 * ============ PERBANDINGAN ============
 *
 * 🔴 OLD WAY (reading route params):
 * ```typescript
 * constructor(private route: ActivatedRoute) {}
 * ngOnInit() {
 *   this.route.params.subscribe(params => {
 *     this.wellId = params['id'];
 *     this.loadWell(this.wellId);
 *   });
 * }
 * ```
 *
 * 🟢 NEW WAY (withComponentInputBinding):
 * Route params automatically bound to component inputs!
 * { path: ':id', component: WellDetailComponent }
 * → input 'id' akan otomatis di-bind ke route param 'id'
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  computed,
  effect,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { WellDataService } from '@core/services/well-data.service';
import { WebSocketService } from '@core/services/websocket.service';
import { WellSummary, DrillingParameters } from '@core/models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { UnitConversionPipe } from '@shared/pipes/unit-conversion.pipe';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-well-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterLink,
    LoadingSpinnerComponent,
    UnitConversionPipe,
    TimeAgoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './well-detail.component.html',
  styles: [`
    .well-detail-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .back-btn {
      margin-bottom: 16px;
    }

    .well-header {
      margin-bottom: 24px;

      .header-info {
        display: flex;
        align-items: center;
        gap: 12px;

        h1 { margin: 0; }
      }

      .field-info {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #666;
        margin-top: 4px;
      }
    }

    .tab-content {
      padding: 24px 0;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .live-indicator {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 10px;
      background: #eee;
      color: #999;

      &.active {
        background: #e8f5e9;
        color: #2e7d32;
        animation: pulse 2s infinite;
      }
    }

    .realtime-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 12px 0;
    }

    .metric {
      text-align: center;

      .metric-label { display: block; font-size: 11px; color: #666; }
      .metric-value { display: block; font-size: 24px; font-weight: 500; }
      .metric-unit { display: block; font-size: 11px; color: #999; }
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 24px;
    }

    @media (max-width: 768px) {
      .overview-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WellDetailComponent implements OnDestroy {

  private wellService = inject(WellDataService);
  private wsService = inject(WebSocketService);
  private destroy$ = new Subject<void>();

  /**
   * 🟢 NEW: Route param bound directly to input!
   *
   * Karena di app.config.ts kita menggunakan withComponentInputBinding(),
   * route parameter :id otomatis di-bind ke input 'id' ini.
   *
   * 🔴 OLD WAY:
   * private route = inject(ActivatedRoute);
   * ngOnInit() { this.route.params.subscribe(p => this.loadWell(p['id'])); }
   */
  id = input.required<string>();

  // State
  well = signal<WellSummary | null>(null);
  drillingData = signal<DrillingParameters | null>(null);
  isStreaming = signal(false);

  constructor() {
    // Effect: Load well data when id changes
    effect(() => {
      const wellId = this.id();
      if (wellId) {
        this.loadWellData(wellId);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopStreaming();
    this.destroy$.next();
    this.destroy$.complete();
  }

  startStreaming(): void {
    this.isStreaming.set(true);
    this.wsService.getMockSensorStream(this.id())
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.drillingData.set(data);
      });
  }

  stopStreaming(): void {
    this.isStreaming.set(false);
    this.drillingData.set(null);
  }

  private loadWellData(wellId: string): void {
    // In real app: this.wellService.getWellById(wellId)
    this.wellService.getMockWells()
      .pipe(takeUntil(this.destroy$))
      .subscribe(wells => {
        const found = wells.find(w => w.uid === wellId);
        this.well.set(found || null);
      });
  }
}
