/**
 * =============================================================================
 * INTERMEDIATE OVERVIEW - RxJS Patterns, State Management, HTTP Patterns
 * =============================================================================
 *
 * 📘 KONSEP INTERMEDIATE YANG DICOVER:
 * 1. RxJS Operators (switchMap, mergeMap, concatMap, exhaustMap, forkJoin)
 * 2. State Management patterns (Service-based vs NgRx)
 * 3. HTTP Client patterns (caching, retry, polling)
 * 4. Error handling strategies
 * 5. Component Communication via Services
 *
 * 💡 TIP INTERVIEW:
 * RxJS adalah salah satu topik paling sering ditanya di Angular interview!
 * Pahami perbedaan higher-order mapping operators (switchMap vs mergeMap vs concatMap vs exhaustMap)
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  OnDestroy,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import {
  Subject, BehaviorSubject, ReplaySubject, AsyncSubject,
  Observable, of, interval, timer, forkJoin, combineLatest, merge,
  throwError, EMPTY, from
} from 'rxjs';
import {
  switchMap, mergeMap, concatMap, exhaustMap,
  map, filter, tap, catchError, retry, retryWhen,
  debounceTime, throttleTime, distinctUntilChanged,
  take, takeUntil, takeWhile, skip, skipUntil,
  delay, timeout, startWith, pairwise,
  scan, reduce, bufferTime, bufferCount,
  shareReplay, share, publishReplay,
  finalize, first, last, withLatestFrom,
  combineLatestWith, exhaustAll
} from 'rxjs/operators';

@Component({
  selector: 'app-intermediate-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="intermediate-container">
      <h1>02 - Intermediate Angular</h1>
      <p class="subtitle">RxJS Mastery, State Management, HTTP Patterns</p>

      <mat-tab-group>
        <!-- ============================================================
             TAB 1: RXJS OPERATORS
             ============================================================ -->
        <mat-tab label="RxJS Operators">
          <div class="tab-content">
            <h2>Higher-Order Mapping Operators</h2>
            <p class="intro">
              Ini adalah operator yang paling penting dan paling sering ditanya di interview.
              Mereka meng-handle "Observable of Observables" (inner subscriptions).
            </p>

            <!-- switchMap -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>switchMap</mat-card-title>
                <mat-card-subtitle>Cancel previous, take latest only</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="operator-info">
                  <p><strong>Behavior:</strong> Ketika source emit, cancel inner observable sebelumnya dan subscribe ke yang baru.</p>
                  <p><strong>Use Case:</strong> Search autocomplete, route parameter changes, dropdown selection</p>
                  <p><strong>Analogy:</strong> Seperti remote TV - saat ganti channel, channel lama langsung berhenti.</p>
                </div>
                <pre class="code-block"><code>
// Search autocomplete - cancel pending request saat user ketik lagi
this.searchControl.valueChanges.pipe(
  debounceTime(300),           // Wait 300ms after last keystroke
  distinctUntilChanged(),       // Only if value actually changed
  switchMap(term =>             // Cancel previous API call!
    this.wellService.search(term)
  )
).subscribe(results => this.results = results);

// Route params - well detail page
this.route.params.pipe(
  switchMap(params =>           // Cancel if user navigates to different well
    this.wellService.getWellById(params['id'])
  )
).subscribe(well => this.well = well);
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- mergeMap -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>mergeMap (flatMap)</mat-card-title>
                <mat-card-subtitle>Run all in parallel, don't cancel</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="operator-info">
                  <p><strong>Behavior:</strong> Subscribe ke semua inner observables secara parallel. Tidak ada yang di-cancel.</p>
                  <p><strong>Use Case:</strong> Parallel API calls, file uploads, actions yang independent</p>
                  <p><strong>Analogy:</strong> Seperti multithread - semua berjalan bersamaan.</p>
                  <p class="warning">⚠️ Hati-hati memory leak! Bisa subscribe tanpa batas.</p>
                </div>
                <pre class="code-block"><code>
// Upload multiple files in parallel
this.filesToUpload$.pipe(
  mergeMap(file =>
    this.uploadService.upload(file),
    3  // concurrency limit = max 3 simultaneous uploads
  )
).subscribe(result => console.log('Uploaded:', result));

// Fetch data for multiple wells simultaneously
of('well-001', 'well-002', 'well-003').pipe(
  mergeMap(wellId => this.wellService.getWellById(wellId))
).subscribe(well => this.wells.push(well));
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- concatMap -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>concatMap</mat-card-title>
                <mat-card-subtitle>Queue & execute one by one (sequential)</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="operator-info">
                  <p><strong>Behavior:</strong> Queue inner observables. Tunggu yang sebelumnya selesai baru mulai yang berikutnya.</p>
                  <p><strong>Use Case:</strong> Sequential API calls, ordered operations, dependent requests</p>
                  <p><strong>Analogy:</strong> Seperti antrian - satu per satu sesuai urutan.</p>
                </div>
                <pre class="code-block"><code>
// Sequential operations - order matters!
this.actions$.pipe(
  concatMap(action => {
    // Each action waits for previous to complete
    return this.api.executeAction(action);
  })
).subscribe();

// Write sensor data in order (must maintain sequence)
this.sensorReadings$.pipe(
  concatMap(reading =>
    this.dataService.saveReading(reading) // Wait before saving next
  )
).subscribe();
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- exhaustMap -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>exhaustMap</mat-card-title>
                <mat-card-subtitle>Ignore new while current is running</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="operator-info">
                  <p><strong>Behavior:</strong> Ignore source emissions selama inner observable masih active.</p>
                  <p><strong>Use Case:</strong> Login button, form submit, prevent double-click</p>
                  <p><strong>Analogy:</strong> Seperti elevator - ignore button press saat elevator masih bergerak.</p>
                </div>
                <pre class="code-block"><code>
// Prevent double-submit
this.submitButton$.pipe(
  exhaustMap(() =>
    this.reportService.generateReport(this.formData)
    // Clicks during generation are IGNORED
  )
).subscribe(report => this.showReport(report));

// Login - ignore repeated clicks
this.loginClicks$.pipe(
  exhaustMap(() =>
    this.authService.login(this.credentials)
  )
).subscribe();
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- Quick Reference -->
            <mat-card class="concept-card summary-card">
              <mat-card-header>
                <mat-card-title>📋 Quick Reference: When to Use Which?</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="reference-table">
                  <thead>
                    <tr>
                      <th>Operator</th>
                      <th>Previous Inner</th>
                      <th>New Emissions</th>
                      <th>Use When</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>switchMap</strong></td>
                      <td>❌ Cancelled</td>
                      <td>✅ Subscribed</td>
                      <td>Only latest matters (search, navigation)</td>
                    </tr>
                    <tr>
                      <td><strong>mergeMap</strong></td>
                      <td>✅ Continues</td>
                      <td>✅ Subscribed</td>
                      <td>All matter, order doesn't (parallel uploads)</td>
                    </tr>
                    <tr>
                      <td><strong>concatMap</strong></td>
                      <td>✅ Continues</td>
                      <td>⏳ Queued</td>
                      <td>All matter, order matters (sequential writes)</td>
                    </tr>
                    <tr>
                      <td><strong>exhaustMap</strong></td>
                      <td>✅ Continues</td>
                      <td>❌ Ignored</td>
                      <td>Ignore while busy (form submit, login)</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 2: SUBJECT TYPES
             ============================================================ -->
        <mat-tab label="Subjects">
          <div class="tab-content">
            <h2>RxJS Subject Types</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Subject</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Behavior:</strong> Multicast observable. New subscribers only get future values.</p>
                <p><strong>Use Case:</strong> Event bus, custom events</p>
                <pre class="code-block"><code>
const subject = new Subject&lt;string&gt;();

subject.subscribe(v => console.log('A:', v));  // Gets: 'hello', 'world'
subject.next('hello');
subject.subscribe(v => console.log('B:', v));  // Gets: 'world' only
subject.next('world');
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>BehaviorSubject</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Behavior:</strong> Has initial value. New subscribers immediately get current value.</p>
                <p><strong>Use Case:</strong> State management, current user, connection status</p>
                <pre class="code-block"><code>
const user$ = new BehaviorSubject&lt;User | null&gt;(null);

user$.subscribe(u => console.log('A:', u));  // Gets: null immediately, then 'John'
user$.next({{ '{' }} name: 'John' {{ '}' }});
user$.subscribe(u => console.log('B:', u));  // Gets: 'John' immediately
user$.getValue(); // Synchronous access to current value
                </code></pre>
                <p class="tip">💡 Most common Subject type for Angular services (state management)</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>ReplaySubject</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Behavior:</strong> Replays N last values to new subscribers.</p>
                <p><strong>Use Case:</strong> Cache recent events, chat history</p>
                <pre class="code-block"><code>
const history$ = new ReplaySubject&lt;string&gt;(3); // Buffer last 3

history$.next('msg1');
history$.next('msg2');
history$.next('msg3');
history$.next('msg4');

history$.subscribe(v => console.log(v));
// Gets: 'msg2', 'msg3', 'msg4' (last 3)
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>AsyncSubject</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Behavior:</strong> Only emits the LAST value, and only when completed.</p>
                <p><strong>Use Case:</strong> HTTP request result (like Promise), computation result</p>
                <pre class="code-block"><code>
const result$ = new AsyncSubject&lt;number&gt;();

result$.subscribe(v => console.log(v)); // Nothing yet...
result$.next(1);  // Nothing emitted
result$.next(2);  // Nothing emitted
result$.next(3);  // Nothing emitted
result$.complete(); // NOW emits: 3 (last value only)
                </code></pre>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 3: STATE MANAGEMENT
             ============================================================ -->
        <mat-tab label="State Management">
          <div class="tab-content">
            <h2>State Management Patterns</h2>

            <!-- Service-based state -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Pattern 1: Service with BehaviorSubject</mat-card-title>
                <mat-card-subtitle>Simple, works for most apps</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// 🔴 OLD WAY (still valid & widely used)
&#64;Injectable({{ '{' }} providedIn: 'root' {{ '}' }})
export class WellStateService {{ '{' }}
  // Private mutable state
  private wellsSubject = new BehaviorSubject&lt;Well[]&gt;([]);
  private loadingSubject = new BehaviorSubject&lt;boolean&gt;(false);

  // Public read-only observables
  readonly wells$ = this.wellsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  // Derived state
  readonly activeWells$ = this.wells$.pipe(
    map(wells => wells.filter(w => w.status === 'drilling'))
  );

  // Actions
  loadWells(): void {{ '{' }}
    this.loadingSubject.next(true);
    this.http.get&lt;Well[]&gt;('/api/wells').pipe(
      tap(wells => this.wellsSubject.next(wells)),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  {{ '}' }}

  addWell(well: Well): void {{ '{' }}
    const current = this.wellsSubject.getValue();
    this.wellsSubject.next([...current, well]);
  {{ '}' }}
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- Signal-based state -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Pattern 2: Service with Signals</mat-card-title>
                <mat-card-subtitle>🟢 NEW - Angular 16+ approach</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// 🟢 NEW WAY - Signals-based state management
&#64;Injectable({{ '{' }} providedIn: 'root' {{ '}' }})
export class WellStateService {{ '{' }}
  // Private writable signals
  private wellsState = signal&lt;Well[]&gt;([]);
  private loadingState = signal(false);
  private errorState = signal&lt;string | null&gt;(null);

  // Public readonly signals
  readonly wells = this.wellsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Derived state (automatically recalculated)
  readonly activeWells = computed(() =>
    this.wellsState().filter(w => w.status === 'drilling')
  );
  readonly wellCount = computed(() => this.wellsState().length);

  // Actions
  loadWells(): void {{ '{' }}
    this.loadingState.set(true);
    this.http.get&lt;Well[]&gt;('/api/wells').subscribe({{ '{' }}
      next: wells => {{ '{' }}
        this.wellsState.set(wells);
        this.loadingState.set(false);
      {{ '}' }},
      error: err => {{ '{' }}
        this.errorState.set(err.message);
        this.loadingState.set(false);
      {{ '}' }}
    {{ '}' }});
  {{ '}' }}

  addWell(well: Well): void {{ '{' }}
    this.wellsState.update(wells => [...wells, well]);
  {{ '}' }}

  removeWell(id: string): void {{ '{' }}
    this.wellsState.update(wells => wells.filter(w => w.uid !== id));
  {{ '}' }}
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- NgRx comparison -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Pattern 3: NgRx Store</mat-card-title>
                <mat-card-subtitle>Enterprise-scale state (Redux pattern)</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p><strong>When to use NgRx:</strong></p>
                <ul>
                  <li>Large team, complex state interactions</li>
                  <li>Need time-travel debugging</li>
                  <li>Strict unidirectional data flow requirement</li>
                  <li>Complex side effects</li>
                </ul>
                <p><strong>When NOT to use:</strong></p>
                <ul>
                  <li>Small/medium apps (over-engineering)</li>
                  <li>Simple CRUD operations</li>
                  <li>When service-based state is sufficient</li>
                </ul>
                <pre class="code-block"><code>
// NgRx follows: Action → Reducer → State → Selector → Component

// Actions
export const loadWells = createAction('[Wells] Load');
export const loadWellsSuccess = createAction(
  '[Wells] Load Success',
  props&lt;{{ '{' }} wells: Well[] {{ '}' }}&gt;()
);

// Reducer
export const wellsReducer = createReducer(
  initialState,
  on(loadWells, state => ({{ '{' }} ...state, loading: true {{ '}' }})),
  on(loadWellsSuccess, (state, {{ '{' }} wells {{ '}' }}) =>
    ({{ '{' }} ...state, wells, loading: false {{ '}' }}))
);

// Selector
export const selectActiveWells = createSelector(
  selectWellsState,
  state => state.wells.filter(w => w.status === 'drilling')
);

// Component usage
wells$ = this.store.select(selectActiveWells);
loadWells() {{ '{' }} this.store.dispatch(loadWells()); {{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- Decision guide -->
            <mat-card class="concept-card summary-card">
              <mat-card-header>
                <mat-card-title>📋 Decision Guide: Which Pattern?</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="reference-table">
                  <thead>
                    <tr>
                      <th>Criteria</th>
                      <th>Service + BehaviorSubject</th>
                      <th>Service + Signals</th>
                      <th>NgRx</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Complexity</td>
                      <td>Low</td>
                      <td>Low</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>Boilerplate</td>
                      <td>Minimal</td>
                      <td>Minimal</td>
                      <td>Significant</td>
                    </tr>
                    <tr>
                      <td>Scalability</td>
                      <td>Medium</td>
                      <td>Medium-High</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>DevTools</td>
                      <td>❌</td>
                      <td>🔄 Coming</td>
                      <td>✅ Excellent</td>
                    </tr>
                    <tr>
                      <td>Team Size</td>
                      <td>Small</td>
                      <td>Small-Medium</td>
                      <td>Large</td>
                    </tr>
                    <tr>
                      <td>Best For</td>
                      <td>Most apps</td>
                      <td>New Angular apps</td>
                      <td>Enterprise/complex</td>
                    </tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 4: HTTP PATTERNS
             ============================================================ -->
        <mat-tab label="HTTP Patterns">
          <div class="tab-content">
            <h2>HTTP Client Patterns & Best Practices</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Caching with shareReplay</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Cache API response - multiple subscribers share same result
private wellsCache$: Observable&lt;Well[]&gt; | null = null;

getWells(): Observable&lt;Well[]&gt; {{ '{' }}
  if (!this.wellsCache$) {{ '{' }}
    this.wellsCache$ = this.http.get&lt;Well[]&gt;('/api/wells').pipe(
      shareReplay(1)  // Cache latest value, share among subscribers
    );
  {{ '}' }}
  return this.wellsCache$;
{{ '}' }}

// Invalidate cache
refreshWells(): void {{ '{' }}
  this.wellsCache$ = null;
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Polling Pattern (Real-time fallback)</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Poll API every 5 seconds (when WebSocket not available)
startPolling(wellId: string): Observable&lt;SensorData&gt; {{ '{' }}
  return timer(0, 5000).pipe(  // Start immediately, then every 5s
    switchMap(() => this.http.get&lt;SensorData&gt;(
      '/api/wells/' + wellId + '/sensors'
    )),
    retry(3),          // Retry on error
    takeUntil(this.stopPolling$),
    distinctUntilChanged((prev, curr) =>
      JSON.stringify(prev) === JSON.stringify(curr)
    )
  );
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Parallel Requests (forkJoin vs combineLatest)</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// forkJoin: Wait for ALL to complete, then emit once
// Use when: All requests must succeed for result to be useful
loadDashboardData(): Observable&lt;DashboardData&gt; {{ '{' }}
  return forkJoin({{ '{' }}
    wells: this.http.get&lt;Well[]&gt;('/api/wells'),
    alerts: this.http.get&lt;Alert[]&gt;('/api/alerts'),
    stats: this.http.get&lt;Stats&gt;('/api/stats')
  {{ '}' }});
{{ '}' }}

// combineLatest: Emit whenever ANY source emits (after all have emitted once)
// Use when: You want latest combination of multiple streams
monitorMultipleWells(ids: string[]): Observable&lt;WellData[]&gt; {{ '{' }}
  const streams = ids.map(id =>
    this.getSensorStream(id)  // Continuous stream per well
  );
  return combineLatest(streams);
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Error Handling Patterns</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Pattern 1: Retry with exponential backoff
this.http.get('/api/data').pipe(
  retry({{ '{' }}
    count: 3,
    delay: (error, retryCount) => timer(1000 * Math.pow(2, retryCount))
  {{ '}' }})
);

// Pattern 2: Fallback value on error
this.http.get&lt;Well[]&gt;('/api/wells').pipe(
  catchError(error => {{ '{' }}
    console.error('Failed to load wells:', error);
    return of([]); // Return empty array as fallback
  {{ '}' }})
);

// Pattern 3: Transform error
this.http.get('/api/wells').pipe(
  catchError(error => {{ '{' }}
    const userMessage = this.getErrorMessage(error.status);
    return throwError(() => new Error(userMessage));
  {{ '}' }})
);

// Pattern 4: Loading indicator pattern
loadData(): void {{ '{' }}
  this.loading.set(true);
  this.error.set(null);

  this.http.get&lt;Data&gt;('/api/data').pipe(
    finalize(() => this.loading.set(false)) // Always runs (success or error)
  ).subscribe({{ '{' }}
    next: data => this.data.set(data),
    error: err => this.error.set(err.message)
  {{ '}' }});
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 5: USEFUL RxJS PATTERNS
             ============================================================ -->
        <mat-tab label="RxJS Recipes">
          <div class="tab-content">
            <h2>Common RxJS Recipes for Oil & Gas Apps</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Debounced Search</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Complete search pattern with loading & error handling
searchResults$ = this.searchInput.valueChanges.pipe(
  debounceTime(300),                    // Wait for user to stop typing
  distinctUntilChanged(),                // Only if value changed
  filter(term => term.length >= 2),      // Min 2 characters
  tap(() => this.loading.set(true)),     // Show loading
  switchMap(term =>                      // Cancel previous request
    this.api.search(term).pipe(
      catchError(() => of([]))           // Handle error gracefully
    )
  ),
  tap(() => this.loading.set(false))     // Hide loading
);
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Sensor Data Batching</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Buffer high-frequency sensor data untuk batch processing
this.sensorStream$.pipe(
  bufferTime(1000),                    // Collect all in 1 second window
  filter(batch => batch.length > 0),   // Skip empty buffers
  map(batch => ({{ '{' }}
    average: batch.reduce((sum, r) => sum + r.value, 0) / batch.length,
    max: Math.max(...batch.map(r => r.value)),
    min: Math.min(...batch.map(r => r.value)),
    count: batch.length
  {{ '}' }}))
).subscribe(stats => this.updateChart(stats));
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Unsubscribe Patterns</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Pattern 1: takeUntil + Subject (MOST COMMON)
private destroy$ = new Subject&lt;void&gt;();

ngOnInit() {{ '{' }}
  this.dataService.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => ...);
{{ '}' }}

ngOnDestroy() {{ '{' }}
  this.destroy$.next();
  this.destroy$.complete();
{{ '}' }}

// Pattern 2: DestroyRef (Angular 16+ - NEWEST)
private destroyRef = inject(DestroyRef);

ngOnInit() {{ '{' }}
  this.dataService.getData().pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(data => ...);
{{ '}' }}

// Pattern 3: async pipe in template (auto-unsubscribes!)
// &lt;div&gt;{{ '{{ data$ | async }}' }}&lt;/div&gt;

// Pattern 4: take(1) for one-shot operations
this.route.params.pipe(take(1)).subscribe(params => ...);
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Change Detection with scan()</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Track previous vs current value (like ngOnChanges for streams)
this.depthStream$.pipe(
  pairwise(),  // Emits [previous, current]
  map(([prev, curr]) => ({{ '{' }}
    current: curr,
    previous: prev,
    delta: curr - prev,
    isIncreasing: curr > prev
  {{ '}' }}))
).subscribe(change => this.updateTrend(change));

// Accumulate state over time (like Redux reducer)
this.events$.pipe(
  scan((state, event) => ({{ '{' }}
    ...state,
    count: state.count + 1,
    lastEvent: event,
    history: [...state.history, event].slice(-10)
  {{ '}' }}), {{ '{' }} count: 0, lastEvent: null, history: [] {{ '}' }})
).subscribe(state => this.state.set(state));
                </code></pre>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .intermediate-container { max-width: 1000px; margin: 0 auto; }
    h1 { margin-bottom: 4px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .intro { color: #555; margin-bottom: 16px; font-size: 14px; }
    .tab-content { padding: 24px 0; }

    .concept-card { margin-bottom: 16px; }

    .operator-info {
      margin-bottom: 12px;
      p { margin: 4px 0; font-size: 13px; }
      .warning { color: #d32f2f; font-weight: 500; }
    }

    .code-block {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.5;

      code { white-space: pre; font-family: 'Consolas', monospace; }
    }

    .reference-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;

      th, td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }

      th {
        background: #f5f5f5;
        font-weight: 600;
      }

      tr:hover td { background: #f8f9fa; }
    }

    .summary-card {
      border: 2px solid #1a237e;
    }

    .tip {
      background: #e8f5e9;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 13px;
      margin-top: 8px;
    }

    ul {
      padding-left: 20px;
      li { margin-bottom: 6px; font-size: 13px; }
    }
  `]
})
export class IntermediateOverviewComponent {
  // This component is primarily educational - displaying code examples and patterns
  // The actual patterns are demonstrated in the feature components (dashboard, streaming, etc.)
}
