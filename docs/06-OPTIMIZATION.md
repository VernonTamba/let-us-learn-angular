# 06 - Performance Optimization

## Table of Contents
1. [Bundle Size Optimization](#bundle-size-optimization)
2. [Runtime Performance](#runtime-performance)
3. [Change Detection Optimization](#change-detection-optimization)
4. [Rendering Optimization](#rendering-optimization)
5. [Network Optimization](#network-optimization)
6. [Memory Management](#memory-management)
7. [Profiling & Measurement](#profiling--measurement)

---

## Bundle Size Optimization

### 1. Lazy Loading
```typescript
// Route-level: Load only when user navigates
{ path: 'reports', loadComponent: () => import('./reports.component').then(c => c.ReportsComponent) }

// Template-level: Load when condition met
@defer (on viewport) { <app-chart /> }

// Impact: Initial bundle bisa turun 40-60%
```

### 2. Standalone Components (Tree-shaking)
```typescript
// NgModules import EVERYTHING in the module
// Standalone components import ONLY what they need
@Component({
  standalone: true,
  imports: [MatButtonModule] // Only button, not entire Material
})
```

### 3. Bundle Analysis
```bash
# Generate stats
ng build --stats-json

# Analyze
npx webpack-bundle-analyzer dist/stats.json

# Set budgets (angular.json)
"budgets": [
  { "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" }
]
```

### 4. Import Optimization
```typescript
// ❌ BAD: Import entire library
import * as _ from 'lodash';
import { MatModule } from '@angular/material';

// ✅ GOOD: Import specific functions/modules
import { debounce } from 'lodash-es/debounce';
import { MatButtonModule } from '@angular/material/button';
```

### 5. Production Build Optimizations
```bash
ng build --configuration production
# Enables: AOT, tree-shaking, minification, dead code elimination
```

---

## Runtime Performance

### 1. OnPush Change Detection (Everywhere!)
```typescript
// ✅ Set in angular.json as default for new components:
"schematics": {
  "@schematics/angular:component": {
    "changeDetection": "OnPush"
  }
}

// Impact: Reduces CD checks by 50-90% in complex UIs
```

### 2. track in @for (Required in Angular 17+)
```html
<!-- ✅ Angular reuses DOM elements when items move/change -->
@for (well of wells(); track well.uid) {
  <app-well-card [well]="well" />
}

<!-- Without track: Angular destroys/recreates all DOM on ANY change -->
```

### 3. Signals over Methods in Templates
```typescript
// ❌ BAD: Function called every CD cycle
get total(): number { return this.items.reduce(...); }
// Template: {{ total }} → computed on EVERY check!

// ✅ GOOD: Computed signal (memoized)
total = computed(() => this.items().reduce(...));
// Template: {{ total() }} → only recomputed when items change
```

### 4. Pure Pipes over Methods
```typescript
// ❌ BAD: Method in template
{{ formatDate(well.lastUpdated) }}  // Called every CD cycle!

// ✅ GOOD: Pure pipe (only re-runs on input change)
{{ well.lastUpdated | date:'short' }}
{{ depth | unitConvert:'m':'ft' }}
```

### 5. Virtual Scrolling (Large Lists)
```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="48" class="list">
      <div *cdkVirtualFor="let well of wells">
        {{ well.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
// Only renders visible items (e.g., 20 of 10,000)
```

---

## Change Detection Optimization

### Strategy Overview
```
                    ┌─── Default ─── Checks EVERYTHING every cycle
                    │
Change Detection ───┤
                    │
                    └─── OnPush ──── Only checks when:
                                     • Input reference changes
                                     • Event in component
                                     • async pipe emits
                                     • Signal changes
                                     • markForCheck()
```

### Detaching Components from CD
```typescript
// For components that rarely change (static headers, footers)
private cdr = inject(ChangeDetectorRef);

ngOnInit() {
  this.cdr.detach(); // Remove from CD tree
  
  // Manually check only when needed
  this.dataService.criticalUpdate$.subscribe(() => {
    this.cdr.detectChanges();
  });
}
```

### Reducing Unnecessary Re-renders
```typescript
// 1. Use distinctUntilChanged for observables
this.data$.pipe(
  distinctUntilChanged((prev, curr) => prev.id === curr.id)
)

// 2. Use memoization for expensive computations
import { memoize } from 'lodash-es';
calculateRoute = memoize((start, end) => complexCalculation(start, end));

// 3. Separate frequently-changing from stable content
// Put rapidly-updating data in its own component with OnPush
```

---

## Rendering Optimization

### 1. @if vs [hidden]
```html
<!-- @if: Removes from DOM entirely (saves memory for complex trees) -->
@if (showChart()) { <app-complex-chart /> }

<!-- [hidden]: Keeps in DOM, just CSS hidden (faster toggle) -->
<app-complex-chart [hidden]="!showChart()" />

<!-- Rule: Use @if for heavy components, [hidden] for frequent toggling -->
```

### 2. @defer for Below-fold Content
```html
<!-- Don't load what user can't see yet -->
@defer (on viewport; prefetch on idle) {
  <app-analytics-dashboard />
} @placeholder {
  <div style="height: 400px"></div> <!-- Reserve space -->
}
```

### 3. Image Optimization
```html
<!-- Lazy load images -->
<img [src]="url" loading="lazy" decoding="async" />

<!-- NgOptimizedImage (Angular 15+) -->
<img ngSrc="well-photo.jpg" width="800" height="600" priority />
```

### 4. CSS Containment
```css
/* Tell browser this subtree is independent */
.widget-container {
  contain: content; /* layout + style + paint */
}

/* For items in a list */
.list-item {
  contain: layout style;
  content-visibility: auto; /* Skip rendering of off-screen items */
}
```

---

## Network Optimization

### 1. HTTP Caching
```typescript
// In-memory cache with shareReplay
private cache$: Observable<Well[]> | null = null;

getWells(): Observable<Well[]> {
  if (!this.cache$) {
    this.cache$ = this.http.get<Well[]>('/api/wells').pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
  return this.cache$;
}

// Invalidate
refresh() { this.cache$ = null; }
```

### 2. Request Deduplication
```typescript
// Prevent duplicate concurrent requests
private pendingRequests = new Map<string, Observable<unknown>>();

get<T>(url: string): Observable<T> {
  if (!this.pendingRequests.has(url)) {
    const req$ = this.http.get<T>(url).pipe(
      finalize(() => this.pendingRequests.delete(url)),
      shareReplay(1)
    );
    this.pendingRequests.set(url, req$);
  }
  return this.pendingRequests.get(url) as Observable<T>;
}
```

### 3. Pagination
```typescript
// Don't load 10,000 wells at once!
getWells(page: number, size: number): Observable<PaginatedResponse<Well>> {
  return this.http.get<PaginatedResponse<Well>>('/api/wells', {
    params: { page: page.toString(), size: size.toString() }
  });
}
```

### 4. WebSocket vs Polling
```typescript
// ✅ WebSocket: Efficient for real-time (Oil & Gas sensor data)
// - Server pushes only when data changes
// - Single persistent connection
// - Bi-directional

// ⚠️ Polling: Fallback when WebSocket unavailable
// - Wasteful (requests even when no new data)
// - Use long-polling as compromise
// - Set appropriate intervals (5-30s depending on data freshness needs)
```

---

## Memory Management

### 1. Unsubscribe from Observables
```typescript
// Memory leak sources:
// - Active subscriptions to infinite observables
// - Event listeners not removed
// - Timers not cleared
// - Large data retained in closures

// Best pattern (Angular 16+):
private destroyRef = inject(DestroyRef);

ngOnInit() {
  interval(5000).pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe();
}
```

### 2. WeakRef for Caching
```typescript
// For large objects that can be garbage collected
private cache = new Map<string, WeakRef<WellData>>();

get(id: string): WellData | undefined {
  return this.cache.get(id)?.deref();
}
```

### 3. Limit Signal History
```typescript
// Don't keep growing arrays indefinitely
dataHistory.update(history => {
  const updated = [...history, newPoint];
  return updated.slice(-1000); // Keep last 1000 only
});
```

---

## Profiling & Measurement

### Browser DevTools
1. **Performance tab** - Record and analyze frames
2. **Memory tab** - Heap snapshots, detect leaks
3. **Network tab** - Request waterfall, size

### Angular DevTools (Chrome Extension)
- Component tree inspection
- Change detection profiling
- Dependency injection visualization

### Key Metrics
| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Bundle size (initial) | < 500KB | `ng build` budgets |
| CD cycles per interaction | Minimal | Angular DevTools |
| Memory leaks | 0 | Chrome Memory tab |

### Performance Audit Checklist
```
□ All routes lazy loaded?
□ All components OnPush?
□ No function calls in templates?
□ track used in all @for loops?
□ Heavy components deferred?
□ All subscriptions cleaned up?
□ HTTP responses cached where appropriate?
□ Bundle size within budget?
□ Images optimized and lazy loaded?
□ Virtual scrolling for long lists?
```

---

*Previous: [05-BEST-PRACTICES.md](05-BEST-PRACTICES.md) | Next: [07-WITSML-CONCEPTS.md](07-WITSML-CONCEPTS.md)*
