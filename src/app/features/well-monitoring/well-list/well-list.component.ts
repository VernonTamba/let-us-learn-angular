/**
 * =============================================================================
 * WELL-LIST.COMPONENT.TS - Well List with Filtering & Sorting
 * =============================================================================
 *
 * 📘 KONSEP: Reactive Forms, Signal-based state, Component Communication
 *
 * Features demonstrated:
 * - Reactive Forms for filters
 * - Signal-based local state
 * - Computed signals for derived data
 * - New control flow syntax
 * - Template reference variables
 * - Event handling
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
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { WellDataService } from '@core/services/well-data.service';
import { WellSummary, WellStatus, WellType } from '@core/models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-well-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    LoadingSpinnerComponent,
    TimeAgoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './well-list.component.html',
  styles: [`
    .well-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;

      h1 { margin: 0; }
      .subtitle { color: #666; margin: 4px 0 0; }
    }

    .filters-section {
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filter-form {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex-wrap: wrap;

      .search-field { flex: 1; min-width: 200px; }
    }

    .active-filters {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #eee;

      .filter-label { font-size: 12px; color: #666; }
      .result-count { font-size: 12px; color: #999; margin-left: auto; }
    }

    .wells-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .well-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      overflow: hidden;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .status-bar {
      height: 4px;
      &.status-drilling { background: #2e7d32; }
      &.status-producing { background: #0277bd; }
      &.status-suspended { background: #ff6f00; }
      &.status-abandoned { background: #d32f2f; }
    }

    .well-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h3 { margin: 0; font-size: 16px; }
    }

    .well-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;

      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #999; }
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: #999;

      mat-icon { font-size: 64px; width: 64px; height: 64px; }
    }

    .reset-btn {
      height: 56px;
    }
  `]
})
export class WellListComponent implements OnInit, OnDestroy {

  // Services
  readonly wellService = inject(WellDataService);

  // Filter form
  readonly filterForm = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<WellStatus[]>([]),
    type: new FormControl<WellType[]>([])
  });

  // Constants for dropdowns
  readonly wellStatuses = Object.values(WellStatus);
  readonly wellTypes = Object.values(WellType);

  // Local state
  private searchTerm = signal('');
  private statusFilter = signal<WellStatus[]>([]);
  private typeFilter = signal<WellType[]>([]);

  // Computed: filtered wells
  readonly filteredWells = computed(() => {
    let wells = this.wellService.wells();
    const search = this.searchTerm().toLowerCase();
    const statuses = this.statusFilter();
    const types = this.typeFilter();

    if (search) {
      wells = wells.filter(w =>
        w.name.toLowerCase().includes(search) ||
        w.field.toLowerCase().includes(search)
      );
    }

    if (statuses.length > 0) {
      wells = wells.filter(w => statuses.includes(w.status));
    }

    if (types.length > 0) {
      wells = wells.filter(w => types.includes(w.type));
    }

    return wells;
  });

  // Computed: check if any filters active
  readonly hasActiveFilters = computed(() =>
    this.searchTerm().length > 0 ||
    this.statusFilter().length > 0 ||
    this.typeFilter().length > 0
  );

  // Computed: active filter labels for chips
  readonly activeFilterLabels = computed(() => {
    const labels: string[] = [];
    if (this.searchTerm()) labels.push(`Search: "${this.searchTerm()}"`);
    this.statusFilter().forEach(s => labels.push(`Status: ${s}`));
    this.typeFilter().forEach(t => labels.push(`Type: ${t}`));
    return labels;
  });

  // Cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Load mock data
    this.wellService.getMockWells()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    // React to form changes
    this.filterForm.get('search')!.valueChanges.pipe(
      debounceTime(300),       // Wait 300ms after last keystroke
      distinctUntilChanged(),   // Only emit if value actually changed
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.searchTerm.set(value || '');
    });

    this.filterForm.get('status')!.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.statusFilter.set(value || []);
    });

    this.filterForm.get('type')!.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.typeFilter.set(value || []);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.searchTerm.set('');
    this.statusFilter.set([]);
    this.typeFilter.set([]);
  }
}
