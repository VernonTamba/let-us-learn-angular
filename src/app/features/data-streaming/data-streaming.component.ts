/**
 * =============================================================================
 * DATA-STREAMING.COMPONENT.TS - Real-time Data Streaming View
 * =============================================================================
 *
 * 📘 KONSEP: RxJS Real-time Patterns, WebSocket Integration
 *
 * Concepts demonstrated:
 * - WebSocket real-time data handling
 * - RxJS operators (bufferTime, throttleTime, scan)
 * - Signal-based reactive state
 * - Performance considerations for high-frequency updates
 * - @defer for lazy-loading heavy components
 *
 * 💡 TIP INTERVIEW:
 * "Bagaimana handle high-frequency data updates di Angular?"
 * - throttleTime/debounceTime untuk limit update rate
 * - bufferTime untuk batch updates
 * - OnPush + signals untuk minimize change detection
 * - requestAnimationFrame untuk sync dengan browser paint
 * - Virtual scrolling untuk large lists
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Subject, interval, takeUntil, scan } from 'rxjs';

import { WebSocketService } from '@core/services/websocket.service';
import { DrillingParameters } from '@core/models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

interface StreamDataPoint {
  timestamp: Date;
  data: DrillingParameters;
}

@Component({
  selector: 'app-data-streaming',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatSelectModule,
    MatFormFieldModule,
    LoadingSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-streaming.component.html',
  styles: [`
    .streaming-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
      h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
      }
      .subtitle { color: #666; margin: 4px 0 0; }
    }

    .control-panel {
      margin-bottom: 24px;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .connection-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #666;
      margin-left: auto;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
      &.active {
        background: #4caf50;
        animation: pulse 2s infinite;
      }
    }

    .live-badge {
      font-size: 10px;
      background: #d32f2f;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .params-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      padding: 12px 0;
    }

    .param-item {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      position: relative;
      transition: background-color 0.3s;

      &.alert {
        background: #fff3e0;
        border: 1px solid #ff6f00;
      }
    }

    .param-label { display: block; font-size: 11px; color: #666; text-transform: uppercase; }
    .param-value { display: block; font-size: 22px; font-weight: 500; color: #1a237e; }
    .param-unit { display: block; font-size: 11px; color: #999; }

    .trend-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 14px;
      width: 14px;
      height: 14px;
      &.up { color: #d32f2f; }
      &.down { color: #2e7d32; }
    }

    .chart-section { margin-top: 16px; }
    .chart-placeholder {
      padding: 48px 24px;
      text-align: center;
      background: #f5f5f5;
      border-radius: 8px;
      color: #666;
    }
    .chart-info { font-size: 12px; color: #999; }

    .placeholder-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 48px;
      color: #999;
    }

    .inactive-state {
      text-align: center;
      padding: 64px 24px;
      color: #999;
      mat-icon { font-size: 64px; width: 64px; height: 64px; }
    }

    .data-log {
      margin-top: 24px;
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .log-entries {
      max-height: 300px;
      overflow-y: auto;
    }

    .log-entry {
      display: flex;
      gap: 12px;
      padding: 6px 0;
      border-bottom: 1px solid #f0f0f0;
      font-family: monospace;
      font-size: 12px;

      .log-time { color: #999; white-space: nowrap; }
      .log-data { color: #333; }
    }
  `]
})
export class DataStreamingComponent implements OnInit, OnDestroy {

  private wsService = inject(WebSocketService);
  private destroy$ = new Subject<void>();

  // Configuration
  selectedWell = 'well-001';
  updateRate = 2000;

  // State
  isStreamActive = signal(false);
  currentData = signal<DrillingParameters | null>(null);
  previousData = signal<DrillingParameters | null>(null);
  dataHistory = signal<StreamDataPoint[]>([]);
  dataPointCount = signal(0);

  // Computed
  historySize = computed(() => this.dataHistory().length);

  formattedParams = computed(() => {
    const data = this.currentData();
    const prev = this.previousData();
    if (!data) return [];

    return [
      { key: 'bitDepth', label: 'Bit Depth', value: data.bitDepth, unit: 'm', trend: this.getTrend(prev?.bitDepth, data.bitDepth), isAlert: false },
      { key: 'rop', label: 'ROP', value: data.rateOfPenetration, unit: 'ft/hr', trend: this.getTrend(prev?.rateOfPenetration, data.rateOfPenetration), isAlert: data.rateOfPenetration > 35 },
      { key: 'wob', label: 'WOB', value: data.weightOnBit, unit: 'klbs', trend: this.getTrend(prev?.weightOnBit, data.weightOnBit), isAlert: data.weightOnBit > 28 },
      { key: 'rpm', label: 'RPM', value: data.rotaryRPM, unit: 'rpm', trend: this.getTrend(prev?.rotaryRPM, data.rotaryRPM), isAlert: false },
      { key: 'torque', label: 'Torque', value: data.torque, unit: 'kft-lbs', trend: this.getTrend(prev?.torque, data.torque), isAlert: data.torque > 11 },
      { key: 'pump', label: 'Pump Psi', value: data.pumpPressure, unit: 'psi', trend: this.getTrend(prev?.pumpPressure, data.pumpPressure), isAlert: data.pumpPressure > 3300 },
      { key: 'flow', label: 'Flow Rate', value: data.pumpRate, unit: 'gpm', trend: this.getTrend(prev?.pumpRate, data.pumpRate), isAlert: false },
      { key: 'mudWt', label: 'Mud Wt', value: data.mudWeightIn, unit: 'ppg', trend: this.getTrend(prev?.mudWeightIn, data.mudWeightIn), isAlert: false },
    ];
  });

  ngOnInit(): void {
    // Auto-start stream for demo
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleStream(active: boolean): void {
    if (active) {
      this.startStream();
    } else {
      this.stopStream();
    }
  }

  clearHistory(): void {
    this.dataHistory.set([]);
    this.dataPointCount.set(0);
  }

  private startStream(): void {
    this.isStreamActive.set(true);

    this.wsService.getMockSensorStream(this.selectedWell)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Update previous data for trend calculation
        this.previousData.set(this.currentData());

        // Update current data
        this.currentData.set(data);

        // Add to history (keep last 100)
        this.dataHistory.update(history => {
          const newHistory = [...history, { timestamp: new Date(), data }];
          return newHistory.slice(-100); // Keep last 100 entries
        });

        // Increment counter
        this.dataPointCount.update(count => count + 1);
      });
  }

  private stopStream(): void {
    this.isStreamActive.set(false);
    this.destroy$.next(); // Stop current subscription
  }

  private getTrend(previous: number | undefined, current: number): number {
    if (previous === undefined) return 0;
    const diff = current - previous;
    if (Math.abs(diff) < 0.5) return 0; // Threshold
    return diff > 0 ? 1 : -1;
  }
}
