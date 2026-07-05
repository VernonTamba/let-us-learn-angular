/**
 * =============================================================================
 * BASICS OVERVIEW - Comprehensive Angular Basics Learning Module
 * =============================================================================
 *
 * 📘 File ini mencover SEMUA konsep dasar Angular dalam satu component,
 * lengkap dengan perbandingan OLD vs NEW syntax.
 *
 * TOPICS COVERED:
 * 1. Component Basics & Decorators
 * 2. Data Binding (4 types)
 * 3. Structural Directives (*ngIf, *ngFor → @if, @for)
 * 4. Pipes (built-in)
 * 5. Lifecycle Hooks
 * 6. Template Reference Variables
 * 7. Component Communication (Input/Output)
 * 8. Services & Dependency Injection basics
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
  inject,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

// ===========================================================================
// CHILD COMPONENT DEMO (Dumb/Presentational Component)
// ===========================================================================

/**
 * 📘 KONSEP: Dumb/Presentational Component
 *
 * Component yang HANYA menerima data via input dan emit events via output.
 * Tidak tahu tentang services atau state management.
 */
@Component({
  selector: 'app-well-status-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './well-status-card.component.html',
  styleUrl: './well-status-card.component.scss'
})
export class WellStatusCardComponent {
  /**
   * ============ PERBANDINGAN: @Input/@Output vs input()/output() ============
   *
   * 🔴 OLD WAY:
   * @Input() wellName: string = '';
   * @Input() status: string = '';
   * @Input() depth: number = 0;
   * @Output() viewDetails = new EventEmitter<string>();
   *
   * 🟢 NEW WAY (Angular 17+):
   */
  wellName = input<string>('Unknown');
  status = input<string>('unknown');
  depth = input<number>(0);
  viewDetails = output<string>();

  // Computed: Derive status color from status input
  statusColor = computed(() => {
    switch (this.status()) {
      case 'drilling': return '#4caf50';
      case 'producing': return '#2196f3';
      case 'suspended': return '#ff9800';
      default: return '#666';
    }
  });

  isActive = computed(() =>
    this.status() === 'drilling' || this.status() === 'producing'
  );

  onViewDetails(): void {
    this.viewDetails.emit(this.wellName());
  }
}

// ===========================================================================
// MAIN BASICS COMPONENT
// ===========================================================================

@Component({
  selector: 'app-basics-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    WellStatusCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basics-overview.component.html',
  styleUrl: './basics-overview.component.scss'
})
export class BasicsOverviewComponent implements OnInit, OnDestroy {

  // ===== STATE (Signals - NEW WAY) =====
  wellName = signal('Kalimantan Deep-1');
  currentDepth = signal(3500);
  isLoading = signal(false);
  isConnected = signal(true);
  clickCount = signal(0);
  selectedWellName = signal('');
  buttonColor = signal<'primary' | 'accent' | 'warn'>('primary');

  // Two-way binding value (still uses plain property for ngModel)
  twoWayValue = '';
  currentStatus = 'drilling';
  today = new Date();

  // Demo wells
  demoWells = signal([
    { uid: '1', name: 'Kalimantan Deep-1', status: 'drilling', depth: 3500 },
    { uid: '2', name: 'Java Sea Explorer-3', status: 'producing', depth: 4200 },
    { uid: '3', name: 'Sumatra Light-7', status: 'suspended', depth: 2800 }
  ]);

  // Computed example
  depthInFeet = computed(() => this.currentDepth() * 3.28084);

  // ===== LIFECYCLE =====

  ngOnInit(): void {
    console.log('[BasicsOverview] ngOnInit - Component initialized');
  }

  ngOnDestroy(): void {
    console.log('[BasicsOverview] ngOnDestroy - Cleanup');
  }

  // ===== METHODS =====

  incrementDepth(): void {
    this.currentDepth.update(d => d + 10);
    this.clickCount.update(c => c + 1);
  }

  decrementDepth(): void {
    this.currentDepth.update(d => Math.max(0, d - 10));
    this.clickCount.update(c => c + 1);
  }

  toggleConnection(): void {
    this.isConnected.update(v => !v);
  }

  addDemoWell(): void {
    const id = Date.now().toString();
    this.demoWells.update(wells => [
      ...wells,
      { uid: id, name: `New Well-${wells.length + 1}`, status: 'drilling', depth: Math.round(Math.random() * 5000) }
    ]);
  }

  clearDemoWells(): void {
    this.demoWells.set([]);
  }

  onWellSelected(name: string): void {
    this.selectedWellName.set(name);
  }
}
