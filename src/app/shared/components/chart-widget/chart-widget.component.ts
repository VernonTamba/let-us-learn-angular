/**
 * =============================================================================
 * CHART-WIDGET.COMPONENT.TS - Reusable Chart Widget
 * =============================================================================
 *
 * 📘 KONSEP: Third-party Library Integration, Input Transform
 *
 * Component ini mendemonstrasikan:
 * - Integrasi dengan Chart.js via ng2-charts
 * - input.required() untuk mandatory inputs
 * - Input transforms
 * - ViewChild signal-based
 * - AfterViewInit lifecycle
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  effect,
  viewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut' | 'gauge';
  title: string;
  labels: string[];
  datasets: ChartDataset[];
  options?: Record<string, unknown>;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-widget" [style.height]="height()">
      <div class="chart-header">
        <h3 class="chart-title">{{ config().title }}</h3>
        @if (subtitle()) {
          <span class="chart-subtitle">{{ subtitle() }}</span>
        }
      </div>
      <div class="chart-body">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-widget {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .chart-title {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      color: #333;
    }

    .chart-subtitle {
      font-size: 12px;
      color: #999;
    }

    .chart-body {
      flex: 1;
      position: relative;
      min-height: 200px;
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class ChartWidgetComponent implements AfterViewInit {

  // ===== INPUTS =====

  /**
   * 🟢 input.required() - Component HARUS menerima input ini
   * Compile error jika parent tidak provide value
   *
   * 🔴 OLD WAY: @Input() config!: ChartConfig; (bisa lupa dan undefined)
   */
  config = input.required<ChartConfig>();

  /** Height dengan transform */
  height = input<string>('300px');
  subtitle = input<string>('');

  /**
   * 🟢 NEW WAY: viewChild() signal-based
   *
   * 🔴 OLD WAY:
   * @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
   *
   * 🟢 NEW WAY:
   * viewChild() returns a signal that resolves after view init
   */
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  constructor() {
    /**
     * 📘 KONSEP: effect()
     *
     * effect() automatically tracks signal dependencies
     * dan re-runs ketika signals berubah.
     *
     * Di sini, ketika config() berubah, chart akan di-update.
     */
    effect(() => {
      const canvas = this.chartCanvas();
      const config = this.config();
      if (canvas && config) {
        this.renderChart(canvas.nativeElement, config);
      }
    });
  }

  ngAfterViewInit(): void {
    // Chart will be rendered by effect() when canvas is available
  }

  private renderChart(canvas: HTMLCanvasElement, config: ChartConfig): void {
    // In a real implementation, this would use Chart.js
    // For learning purposes, we'll draw a simple representation
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple placeholder - in production use ng2-charts or Chart.js directly
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#666';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Chart: ${config.title} (${config.type})`,
      canvas.width / 2,
      canvas.height / 2
    );
    ctx.fillText(
      `${config.datasets.length} dataset(s), ${config.labels.length} points`,
      canvas.width / 2,
      canvas.height / 2 + 20
    );
  }
}
