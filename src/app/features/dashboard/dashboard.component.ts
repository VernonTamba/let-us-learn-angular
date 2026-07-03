/**
 * =============================================================================
 * DASHBOARD.COMPONENT.TS - Main Dashboard (Smart Component)
 * =============================================================================
 *
 * 📘 KONSEP: Smart/Container Component Pattern
 *
 * Dashboard ini adalah "Smart Component" yang:
 * - Mengambil data dari services
 * - Mengelola state
 * - Mengirim data ke "Dumb/Presentational" child components
 *
 * ============ KONSEP YANG DICOVER ============
 *
 * 1. Smart vs Dumb Components
 * 2. Signals (signal, computed, effect)
 * 3. New Control Flow (@if, @for, @switch)
 * 4. OnPush Change Detection
 * 5. inject() function
 * 6. Lifecycle hooks
 * 7. Async data loading pattern
 *
 * 💡 TIP INTERVIEW:
 * "Apa itu Smart vs Dumb component?"
 * - Smart (Container): Tahu tentang services, manage state, no UI logic
 * - Dumb (Presentational): Hanya terima @Input, emit @Output, pure UI
 * - Separation of concerns → easier to test & maintain
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, interval } from 'rxjs';

import { WellDataService } from '@core/services/well-data.service';
import { WebSocketService } from '@core/services/websocket.service';
import { WellSummary, WellStatus, DrillingParameters } from '@core/models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { UnitConversionPipe } from '@shared/pipes/unit-conversion.pipe';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

// ===== STATUS CARD INTERFACE =====
interface StatusCard {
  title: string;
  count: number;
  icon: string;
  color: string;
  status: WellStatus;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    RouterLink,
    LoadingSpinnerComponent,
    UnitConversionPipe,
    TimeAgoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styles: [`
    :host {
      display: block;
    }

    .status-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .status-card {
      border-left: 4px solid;
    }

    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-info {
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }

    .card-count {
      font-size: 32px;
      font-weight: 500;
    }

    .realtime-section {
      background: white;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }
    }

    .live-badge {
      font-size: 10px;
      background: #d32f2f;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: 8px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    .metric-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .metric-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 500;
      color: #1a237e;
    }

    .metric-unit {
      font-size: 11px;
      color: #999;
    }

    .connection-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      color: #666;

      &.error {
        color: #d32f2f;
      }
    }

    .wells-section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
      }
    }

    .wells-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .well-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .well-details {
      margin-top: 12px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 13px;

      .label { color: #666; }
      .value { font-weight: 500; }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: #999;

      mat-icon { font-size: 48px; width: 48px; height: 48px; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {

  // ===== DEPENDENCY INJECTION (🟢 NEW WAY) =====
  readonly wellService = inject(WellDataService);
  readonly wsService = inject(WebSocketService);

  // ===== SIGNALS-BASED STATE =====

  /** Wells data - read from service signal */
  readonly wells = this.wellService.wells;

  /** Latest drilling parameters from WebSocket */
  readonly latestDrillingData = signal<DrillingParameters | null>(null);

  /** Computed: Status cards derived from wells data */
  readonly statusCards = computed<StatusCard[]>(() => {
    const byStatus = this.wellService.wellsByStatus();
    return [
      {
        title: 'Drilling',
        count: byStatus.drilling.length,
        icon: 'construction',
        color: '#2e7d32',
        status: WellStatus.Drilling
      },
      {
        title: 'Producing',
        count: byStatus.producing.length,
        icon: 'water_drop',
        color: '#0277bd',
        status: WellStatus.Producing
      },
      {
        title: 'Suspended',
        count: byStatus.suspended.length,
        icon: 'pause_circle',
        color: '#ff6f00',
        status: WellStatus.Suspended
      },
      {
        title: 'Total Active',
        count: this.wellService.activeWellCount(),
        icon: 'oil_barrel',
        color: '#1a237e',
        status: WellStatus.Completed // placeholder
      }
    ];
  });

  /** Computed: Format drilling data for display */
  readonly drillingMetrics = computed(() => {
    const data = this.latestDrillingData();
    if (!data) return [];

    return [
      { label: 'Bit Depth', value: data.bitDepth, unit: 'm' },
      { label: 'ROP', value: data.rateOfPenetration, unit: 'ft/hr' },
      { label: 'WOB', value: data.weightOnBit, unit: 'klbs' },
      { label: 'RPM', value: data.rotaryRPM, unit: 'rpm' },
      { label: 'Torque', value: data.torque, unit: 'kft-lbs' },
      { label: 'Pump Pressure', value: data.pumpPressure, unit: 'psi' },
      { label: 'Flow Rate', value: data.pumpRate, unit: 'gpm' },
      { label: 'Mud Wt In', value: data.mudWeightIn, unit: 'ppg' },
    ];
  });

  // ===== LIFECYCLE =====
  private destroy$ = new Subject<void>();

  /**
   * 📘 KONSEP: ngOnInit vs constructor
   *
   * 💡 TIP INTERVIEW:
   * - constructor: DI only, no logic (Angular hasn't set up inputs yet)
   * - ngOnInit: Component is fully initialized, inputs are available
   * - Signals/inject() mengubah ini sedikit karena inject() di field OK
   */
  ngOnInit(): void {
    this.loadWells();
    this.startMockDataStream();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== METHODS =====

  private loadWells(): void {
    // Use mock data for development
    this.wellService.getMockWells()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private startMockDataStream(): void {
    // Simulate real-time data
    this.wsService.getMockSensorStream('well-001')
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.latestDrillingData.set(data);
      });
  }

  connectStream(): void {
    this.wsService.connect('well-001');
  }

  reconnect(): void {
    this.wsService.disconnect();
    this.wsService.connect('well-001');
  }
}
