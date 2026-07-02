# 04 - Signals vs RxJS: When to Use Which?

## Overview

Signals dan RxJS bukan pengganti satu sama lain - mereka **complementary**. Masing-masing punya strength di area berbeda.

---

## Quick Decision Guide

| Scenario | Use Signals | Use RxJS |
|----------|:-----------:|:--------:|
| UI state (loading, error, selected item) | ✅ | |
| Form values | ✅ | |
| Component local state | ✅ | |
| Derived/computed values | ✅ | |
| HTTP responses (one-shot) | ✅ (via toSignal) | ✅ |
| Real-time streams (WebSocket) | | ✅ |
| Event handling with timing (debounce) | | ✅ |
| Complex async coordination | | ✅ |
| Race conditions handling | | ✅ |
| Retry/polling logic | | ✅ |
| Multiple subscribers with transformation | | ✅ |

---

## Detailed Comparison

### Synchronous State → Signals

```typescript
// ✅ SIGNALS: Simple, synchronous, reactive state

// State
const count = signal(0);
const name = signal('Well-1');
const wells = signal<Well[]>([]);

// Derived
const total = computed(() => wells().length);
const activeWells = computed(() => wells().filter(w => w.status === 'drilling'));

// Update
count.set(5);
count.update(c => c + 1);

// Read (synchronous - always has a value)
console.log(count()); // 5

// In template (auto-tracked, fine-grained updates)
// {{ count() }}
// {{ activeWells().length }}
```

### Asynchronous Streams → RxJS

```typescript
// ✅ RXJS: Asynchronous, time-based, complex streams

// WebSocket real-time data
const sensorData$ = this.webSocket.pipe(
  filter(msg => msg.type === 'sensor'),
  map(msg => msg.payload),
  bufferTime(1000),
  filter(batch => batch.length > 0)
);

// Search with debounce
const results$ = this.searchInput.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term))
);

// Retry logic
const data$ = this.http.get('/api').pipe(
  retry({ count: 3, delay: (err, count) => timer(1000 * count) }),
  catchError(err => of(fallback))
);
```

---

## Common Patterns: Signals + RxJS Together

### Pattern 1: HTTP → Signal (toSignal)
```typescript
// Convert one-shot HTTP observable to signal
private http = inject(HttpClient);

// RxJS handles the async fetch, Signal holds the result
wells = toSignal(
  this.http.get<Well[]>('/api/wells'),
  { initialValue: [] }
);

// Now use in template: {{ wells().length }}
// Or in computed: activeCount = computed(() => wells().filter(...).length)
```

### Pattern 2: Signal → RxJS (toObservable)
```typescript
// When you need RxJS operators on signal changes
const searchTerm = signal('');
const debouncedSearch$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term))
);

// Convert result back to signal for template
const results = toSignal(debouncedSearch$, { initialValue: [] });
```

### Pattern 3: Service State (Signals) + Async Operations (RxJS)
```typescript
@Injectable({ providedIn: 'root' })
export class WellService {
  // STATE: Signals (synchronous, always has value)
  private _wells = signal<Well[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // PUBLIC: Readonly signals for consumers
  readonly wells = this._wells.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly activeCount = computed(() => 
    this._wells().filter(w => w.status === 'active').length
  );
  
  // OPERATIONS: RxJS for async (HTTP, retry, error handling)
  loadWells(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.http.get<Well[]>('/api/wells').pipe(
      retry(2),
      catchError(err => {
        this._error.set(err.message);
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe(wells => this._wells.set(wells));
  }
}
```

### Pattern 4: Real-time Stream → Signal
```typescript
// WebSocket stream (RxJS) → latest value as Signal
private sensorData$ = this.ws.getSensorStream('well-001');

// Option 1: toSignal (auto-manages subscription)
latestReading = toSignal(this.sensorData$, { initialValue: null });

// Option 2: Manual subscription with effect (more control)
latestReading = signal<SensorData | null>(null);
constructor() {
  this.sensorData$.pipe(
    takeUntilDestroyed()
  ).subscribe(data => this.latestReading.set(data));
}
```

---

## When NOT to Replace RxJS with Signals

### Keep RxJS for:
1. **Debounce/Throttle** - No signal equivalent
2. **switchMap/mergeMap/concatMap** - Complex async coordination
3. **retry/retryWhen** - Error recovery with timing
4. **WebSocket management** - Connection lifecycle
5. **combineLatest/forkJoin** - Multiple async sources
6. **bufferTime/bufferCount** - Batching

### Replace with Signals:
1. **BehaviorSubject for UI state** → `signal()`
2. **Derived state via `pipe(map(...))` on BehaviorSubject** → `computed()`
3. **Simple boolean flags** (loading, error, visible) → `signal()`
4. **Component local state** → `signal()`

---

## Migration Strategy

```
Step 1: New code uses Signals for state, RxJS for async
Step 2: Convert BehaviorSubject UI state → signal()
Step 3: Convert derived observables → computed()
Step 4: Use toSignal() for read-only observable consumption
Step 5: Keep complex RxJS streams as-is (don't force convert)
```

### Anti-Patterns to Avoid

```typescript
// ❌ DON'T: Convert everything to signals forcefully
// This is an anti-pattern:
const data = toSignal(
  interval(1000).pipe(
    switchMap(() => this.http.get('/api')),
    retry(3),
    catchError(err => of(null))
  )
);
// Better: Keep this as observable, only toSignal the final result

// ❌ DON'T: Use effect() as a replacement for RxJS operators
effect(() => {
  const term = this.search();
  // Can't debounce inside effect!
  // Can't cancel previous request!
  this.http.get(`/api?q=${term}`).subscribe(...); // BAD!
});

// ✅ DO: Use the right tool for the job
const results = toSignal(
  toObservable(this.search).pipe(
    debounceTime(300),
    switchMap(term => this.http.get(`/api?q=${term}`))
  ),
  { initialValue: [] }
);
```

---

## Summary

```
┌─────────────────────────────────────────────────────┐
│                  Angular App                         │
├─────────────────────┬───────────────────────────────┤
│     SIGNALS         │         RxJS                  │
│                     │                               │
│  • UI State         │  • HTTP requests              │
│  • Component state  │  • WebSocket streams          │
│  • Derived values   │  • Event coordination         │
│  • Template binding │  • Timing (debounce/throttle) │
│  • Simple toggles   │  • Retry/error recovery       │
│                     │  • Complex async flows        │
├─────────────────────┴───────────────────────────────┤
│           BRIDGE: toSignal() / toObservable()       │
└─────────────────────────────────────────────────────┘
```

---

*Previous: [03-ADVANCED.md](03-ADVANCED.md) | Next: [05-BEST-PRACTICES.md](05-BEST-PRACTICES.md)*
