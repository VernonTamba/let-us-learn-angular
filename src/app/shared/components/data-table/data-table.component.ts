/**
 * =============================================================================
 * DATA-TABLE.COMPONENT.TS - Reusable Data Table with Sorting & Pagination
 * =============================================================================
 *
 * 📘 KONSEP: Generic Reusable Component, Content Projection, Generics
 *
 * Component ini mendemonstrasikan:
 * - Generic types di component
 * - Content Projection (ng-content)
 * - New input/output signals
 * - OnPush change detection
 * - TrackBy for performance
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD: @Input(), @Output(), EventEmitter, *ngFor with trackBy
 * 🟢 NEW: input(), output(), @for with track
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  contentChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// ===== INTERFACES =====

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown) => string;
}

export interface TableAction {
  icon: string;
  label: string;
  color?: string;
  action: string;
}

export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions: number[];
  showFirstLastButtons: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-container">
      <!-- Search Filter -->
      @if (searchable()) {
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput
            [placeholder]="searchPlaceholder()"
            (input)="onSearch($event)">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      }

      <!-- Table -->
      <div class="table-wrapper">
        <table mat-table [dataSource]="displayData()" matSort
          (matSortChange)="onSort($event)">

          <!--
            📘 NEW Control Flow: @for with track
            🔴 OLD: *ngFor="let col of columns(); trackBy: trackByKey"
            🟢 NEW: @for (col of columns(); track col.key) { ... }

            'track' expression menggantikan trackBy function.
            Wajib digunakan di @for (compile error kalau tidak ada).
          -->
          @for (col of columns(); track col.key) {
            <ng-container [matColumnDef]="col.key">
              <th mat-header-cell *matHeaderCellDef
                [mat-sort-header]="col.sortable ? col.key : ''"
                [disabled]="!col.sortable"
                [style.width]="col.width || 'auto'"
                [style.text-align]="col.align || 'left'">
                {{ col.label }}
              </th>
              <td mat-cell *matCellDef="let row"
                [style.text-align]="col.align || 'left'">
                <!-- Use format function if provided -->
                {{ col.format ? col.format(row[col.key]) : row[col.key] }}
              </td>
            </ng-container>
          }

          <!-- Actions Column -->
          @if (actions().length > 0) {
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let row">
                @for (action of actions(); track action.action) {
                  <button mat-icon-button
                    [color]="action.color || 'primary'"
                    [attr.aria-label]="action.label"
                    (click)="onAction(action.action, row)">
                    <mat-icon>{{ action.icon }}</mat-icon>
                  </button>
                }
              </td>
            </ng-container>
          }

          <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns()"
            [class.selected]="row === selectedRow()"
            (click)="onRowClick(row)"></tr>

          <!-- Empty State -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="displayedColumns().length">
              {{ emptyMessage() }}
            </td>
          </tr>
        </table>
      </div>

      <!-- Pagination -->
      @if (paginated()) {
        <mat-paginator
          [length]="totalItems()"
          [pageSize]="paginationConfig().pageSize"
          [pageSizeOptions]="paginationConfig().pageSizeOptions"
          [showFirstLastButtons]="paginationConfig().showFirstLastButtons"
          (page)="onPageChange($event)">
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-field {
      width: 100%;
      padding: 16px 16px 0;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    tr.selected {
      background: rgba(63, 81, 181, 0.05);
    }

    .no-data {
      text-align: center;
      padding: 48px !important;
      color: #999;
    }

    tr.mat-row:hover {
      background: rgba(0, 0, 0, 0.02);
      cursor: pointer;
    }
  `]
})
export class DataTableComponent {

  // ===== INPUTS (🟢 NEW WAY: signal-based) =====

  /** Data source */
  data = input.required<Record<string, unknown>[]>();

  /** Column configuration */
  columns = input.required<TableColumn[]>();

  /** Row actions */
  actions = input<TableAction[]>([]);

  /** Enable search */
  searchable = input<boolean>(true);
  searchPlaceholder = input<string>('Search...');

  /** Enable pagination */
  paginated = input<boolean>(true);
  totalItems = input<number>(0);
  paginationConfig = input<PaginationConfig>({
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showFirstLastButtons: true
  });

  /** Empty state message */
  emptyMessage = input<string>('No data available');

  /** Loading state */
  loading = input<boolean>(false);

  // ===== OUTPUTS (🟢 NEW WAY: output() function) =====

  /**
   * 🔴 OLD WAY:
   * @Output() rowClick = new EventEmitter<any>();
   * @Output() actionClick = new EventEmitter<{action: string, row: any}>();
   *
   * 🟢 NEW WAY: output() function
   */
  rowClick = output<Record<string, unknown>>();
  actionClick = output<{ action: string; row: Record<string, unknown> }>();
  searchChange = output<string>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();

  // ===== INTERNAL STATE =====

  selectedRow = signal<Record<string, unknown> | null>(null);
  private searchTerm = signal<string>('');

  // ===== COMPUTED =====

  /** All displayed column keys including actions */
  displayedColumns = computed(() => {
    const cols = this.columns().map(c => c.key);
    if (this.actions().length > 0) {
      cols.push('actions');
    }
    return cols;
  });

  /** Filtered data based on search */
  displayData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.data();

    return this.data().filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(term)
      )
    );
  });

  // ===== EVENT HANDLERS =====

  onRowClick(row: Record<string, unknown>): void {
    this.selectedRow.set(row);
    this.rowClick.emit(row);
  }

  onAction(action: string, row: Record<string, unknown>): void {
    this.actionClick.emit({ action, row });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }

  onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
