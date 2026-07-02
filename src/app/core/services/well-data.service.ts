/**
 * =============================================================================
 * WELL-DATA.SERVICE.TS - Well Data Service
 * =============================================================================
 *
 * 📘 KONSEP: Services & Dependency Injection
 *
 * Service adalah class yang berisi business logic, data access, dan shared state.
 * Angular menggunakan DI (Dependency Injection) untuk menyediakan services.
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (providedIn or NgModule providers):
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * // ATAU di NgModule:
 * @NgModule({ providers: [WellDataService] })
 * ```
 *
 * 🟢 NEW WAY (masih sama, tapi inject() function lebih preferred):
 * - `providedIn: 'root'` masih best practice untuk singleton services
 * - Consumers menggunakan `inject()` daripada constructor injection
 *
 * 💡 TIP INTERVIEW:
 * - providedIn: 'root' = singleton, tree-shakeable
 * - providedIn: 'any' = one instance per lazy-loaded module
 * - Component-level = new instance per component
 * =============================================================================
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap, shareReplay, retry, delay } from 'rxjs/operators';

import { environment } from '@environments/environment';
import {
  Well,
  WellSummary,
  WellDetail,
  WellStatus,
  WellType,
  WellQueryParams,
  PaginatedResponse,
  MeasurementUnit,
  DepthInfo,
  GeoLocation
} from '../models';

@Injectable({
  providedIn: 'root' // Singleton - available everywhere, tree-shakeable
})
export class WellDataService {

  // ===== DEPENDENCY INJECTION =====

  /**
   * 🟢 NEW WAY: inject() function
   * Lebih clean, bisa digunakan di luar constructor
   */
  private http = inject(HttpClient);

  /**
   * 🔴 OLD WAY: Constructor injection
   * constructor(private http: HttpClient) { }
   *
   * Kedua cara masih valid, tapi inject() lebih flexible:
   * - Bisa digunakan di field initializers
   * - Bisa digunakan di factory functions
   * - Tidak perlu mengingat urutan parameter
   */

  private apiUrl = `${environment.apiUrl}/wells`;

  // ===== STATE MANAGEMENT DENGAN SIGNALS (NEW) =====

  /**
   * 🟢 NEW WAY: Menggunakan Signals untuk state management
   * Signals adalah synchronous reactive primitive yang baru di Angular 16+
   */
  private wellsSignal = signal<WellSummary[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private selectedWellSignal = signal<WellDetail | null>(null);

  // Computed signals (derived state)
  readonly wells = this.wellsSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedWell = this.selectedWellSignal.asReadonly();

  // Computed values - automatically recalculated when dependencies change
  readonly activeWellCount = computed(() =>
    this.wellsSignal().filter(w =>
      w.status === WellStatus.Drilling || w.status === WellStatus.Producing
    ).length
  );

  readonly wellsByStatus = computed(() => {
    const wells = this.wellsSignal();
    return {
      drilling: wells.filter(w => w.status === WellStatus.Drilling),
      producing: wells.filter(w => w.status === WellStatus.Producing),
      suspended: wells.filter(w => w.status === WellStatus.Suspended),
      abandoned: wells.filter(w => w.status === WellStatus.Abandoned)
    };
  });

  // ===== STATE MANAGEMENT DENGAN RXJS (OLD WAY - masih valid!) =====

  /**
   * 🔴 OLD WAY: BehaviorSubject untuk state management
   * Masih valid dan digunakan untuk async streams!
   */
  private wells$ = new BehaviorSubject<WellSummary[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);

  // Public observables (read-only)
  readonly wellsObservable$ = this.wells$.asObservable();
  readonly loadingObservable$ = this.loading$.asObservable();

  // ===== API METHODS =====

  /**
   * Get all wells with optional filtering
   *
   * 📘 KONSEP: HttpClient, HttpParams, Operators
   */
  getWells(params?: WellQueryParams): Observable<PaginatedResponse<WellSummary>> {
    this.loadingSignal.set(true); // Signal way
    this.loading$.next(true);     // RxJS way

    let httpParams = new HttpParams();

    if (params) {
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.status?.length) httpParams = httpParams.set('status', params.status.join(','));
      if (params.type?.length) httpParams = httpParams.set('type', params.type.join(','));
      if (params.field) httpParams = httpParams.set('field', params.field);
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<PaginatedResponse<WellSummary>>(this.apiUrl, { params: httpParams })
      .pipe(
        // retry 2 times with 1 second delay between retries
        retry({ count: 2, delay: 1000 }),

        // Side effects - update state
        tap(response => {
          this.wellsSignal.set(response.data);  // Signal way
          this.wells$.next(response.data);       // RxJS way
          this.loadingSignal.set(false);
          this.loading$.next(false);
          this.errorSignal.set(null);
        }),

        // Cache result
        shareReplay(1),

        // Error handling
        catchError(error => {
          this.loadingSignal.set(false);
          this.loading$.next(false);
          this.errorSignal.set(error.message || 'Failed to load wells');
          return throwError(() => error);
        })
      );
  }

  /**
   * Get single well detail
   */
  getWellById(uid: string): Observable<WellDetail> {
    this.loadingSignal.set(true);

    return this.http.get<WellDetail>(`${this.apiUrl}/${uid}`)
      .pipe(
        tap(well => {
          this.selectedWellSignal.set(well);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          this.loadingSignal.set(false);
          this.errorSignal.set(`Failed to load well: ${uid}`);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create new well
   */
  createWell(well: Omit<Well, 'uid' | 'lastUpdated'>): Observable<Well> {
    return this.http.post<Well>(this.apiUrl, well)
      .pipe(
        tap(() => {
          // Refresh wells list after creating
          this.getWells().subscribe();
        })
      );
  }

  /**
   * Update well
   */
  updateWell(uid: string, updates: Partial<Well>): Observable<Well> {
    return this.http.patch<Well>(`${this.apiUrl}/${uid}`, updates)
      .pipe(
        tap(updatedWell => {
          // Update local state
          this.wellsSignal.update(wells =>
            wells.map(w => w.uid === uid
              ? { ...w, ...updates } as WellSummary
              : w
            )
          );
        })
      );
  }

  /**
   * Delete well
   */
  deleteWell(uid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`)
      .pipe(
        tap(() => {
          // Remove from local state
          this.wellsSignal.update(wells => wells.filter(w => w.uid !== uid));
          this.wells$.next(this.wells$.value.filter(w => w.uid !== uid));
        })
      );
  }

  // ===== HELPER METHODS =====

  /**
   * Clear selected well
   */
  clearSelection(): void {
    this.selectedWellSignal.set(null);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  // ===== MOCK DATA (untuk development tanpa backend) =====

  /**
   * Generate mock wells for development
   * Dalam real app, ini akan dihapus dan diganti dengan actual API calls
   */
  getMockWells(): Observable<WellSummary[]> {
    const mockWells: WellSummary[] = [
      {
        uid: 'well-001',
        name: 'Kalimantan Deep-1',
        field: 'Mahakam Delta',
        status: WellStatus.Drilling,
        type: WellType.Oil,
        currentDepth: 3500,
        depthUnit: MeasurementUnit.Meters,
        lastUpdated: new Date()
      },
      {
        uid: 'well-002',
        name: 'Java Sea Explorer-3',
        field: 'Cepu Block',
        status: WellStatus.Producing,
        type: WellType.Gas,
        currentDepth: 4200,
        depthUnit: MeasurementUnit.Meters,
        lastUpdated: new Date()
      },
      {
        uid: 'well-003',
        name: 'Sumatra Light-7',
        field: 'Rokan Block',
        status: WellStatus.Producing,
        type: WellType.Oil,
        currentDepth: 2800,
        depthUnit: MeasurementUnit.Meters,
        lastUpdated: new Date()
      },
      {
        uid: 'well-004',
        name: 'Papua Deep Gas-2',
        field: 'Tangguh LNG',
        status: WellStatus.Drilling,
        type: WellType.Gas,
        currentDepth: 5100,
        depthUnit: MeasurementUnit.Meters,
        lastUpdated: new Date()
      },
      {
        uid: 'well-005',
        name: 'Natuna Injection-1',
        field: 'East Natuna',
        status: WellStatus.Suspended,
        type: WellType.Injection,
        currentDepth: 3200,
        depthUnit: MeasurementUnit.Meters,
        lastUpdated: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];

    // Simulate API delay
    return of(mockWells).pipe(delay(500));
  }
}
