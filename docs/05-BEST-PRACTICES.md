# 05 - Angular Best Practices

## Table of Contents
1. [Project Structure](#project-structure)
2. [Component Design](#component-design)
3. [State Management](#state-management)
4. [RxJS Best Practices](#rxjs-best-practices)
5. [Forms Best Practices](#forms-best-practices)
6. [Routing Best Practices](#routing-best-practices)
7. [TypeScript Best Practices](#typescript-best-practices)
8. [Security](#security)
9. [Testing Strategy](#testing-strategy)
10. [Code Style & Conventions](#code-style--conventions)

---

## Project Structure

### Recommended Folder Structure
```
src/app/
├── core/                    # Singleton services, one-time setup
│   ├── guards/
│   ├── interceptors/
│   ├── models/              # Interfaces, types, enums
│   └── services/            # Global services (auth, notification)
├── shared/                  # Reusable across features
│   ├── components/          # Dumb/presentational components
│   ├── directives/
│   ├── pipes/
│   └── utils/
├── features/                # Feature-based folders
│   ├── dashboard/
│   ├── well-monitoring/
│   │   ├── well-list/
│   │   ├── well-detail/
│   │   └── well-monitoring.routes.ts
│   └── data-streaming/
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

### Rules:
- **core/**: Services yang hanya perlu 1 instance (auth, http interceptors)
- **shared/**: Components/pipes/directives yang digunakan di 2+ features
- **features/**: Setiap feature punya folder sendiri dengan sub-components
- **Barrel files (index.ts)**: Untuk clean imports
- **Path aliases**: `@core/`, `@shared/`, `@features/` di tsconfig

---

## Component Design

### Smart vs Dumb Components

| Aspect | Smart (Container) | Dumb (Presentational) |
|--------|-------------------|----------------------|
| Knows about services | Yes | No |
| Manages state | Yes | No |
| Has business logic | Yes | No |
| Receives data via | Service injection | @Input / input() |
| Sends data via | Service calls | @Output / output() |
| Testability | Need mocks | Easy (just inputs) |
| Reusability | Low | High |

### Component Checklist
```typescript
@Component({
  standalone: true,                          // ✅ Always standalone
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Always OnPush
  imports: [/* only what's needed */],       // ✅ Minimal imports
  // ...
})
export class MyComponent {
  // ✅ Use inject() over constructor injection
  private service = inject(MyService);
  
  // ✅ Use signal inputs
  data = input.required<Data>();
  
  // ✅ Use signal outputs
  saved = output<Data>();
  
  // ✅ Computed for derived state
  total = computed(() => this.data().items.length);
  
  // ✅ Keep methods small and focused
}
```

### Rules:
1. **One component = one responsibility**
2. **Max 400 lines per file** (refactor jika lebih)
3. **Keep templates clean** - complex logic ke computed/pipe
4. **No function calls in templates** - gunakan computed signal atau pure pipe
5. **Always use OnPush** change detection
6. **Always use standalone: true**

---

## State Management

### Where to Put State?

| State Type | Where | Example |
|-----------|-------|---------|
| UI state (local) | Component signal | `isOpen = signal(false)` |
| Shared state | Service signal | `wells = signal<Well[]>([])` |
| Form state | FormGroup | Reactive forms |
| URL state | Router | Query params, route params |
| Server cache | Service + RxJS | HTTP cache with shareReplay |
| Complex global | NgRx/Signal Store | Large enterprise apps |

### Signal-based Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class WellStore {
  // Private writable
  private _wells = signal<Well[]>([]);
  private _loading = signal(false);
  
  // Public readonly
  readonly wells = this._wells.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly activeWells = computed(() => 
    this._wells().filter(w => w.status === 'active')
  );
  
  // Actions (explicit state changes)
  load() { /* ... */ }
  add(well: Well) { this._wells.update(w => [...w, well]); }
  remove(id: string) { this._wells.update(w => w.filter(x => x.uid !== id)); }
}
```

---

## RxJS Best Practices

### 1. Always Unsubscribe
```typescript
// ✅ Best: takeUntilDestroyed (Angular 16+)
data$.pipe(takeUntilDestroyed()).subscribe();

// ✅ Good: async pipe in template (auto-unsubscribes)
{{ data$ | async }}

// ✅ OK: takeUntil + Subject pattern
private destroy$ = new Subject<void>();
data$.pipe(takeUntil(this.destroy$)).subscribe();
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

// ❌ Bad: No cleanup
data$.subscribe(); // Memory leak!
```

### 2. Avoid Nested Subscriptions
```typescript
// ❌ BAD: Nested subscribe
this.route.params.subscribe(params => {
  this.http.get(`/api/${params.id}`).subscribe(data => {
    this.data = data;
  });
});

// ✅ GOOD: Use higher-order operators
this.route.params.pipe(
  switchMap(params => this.http.get(`/api/${params.id}`))
).subscribe(data => this.data = data);
```

### 3. Share Subscriptions
```typescript
// ❌ BAD: Multiple HTTP calls for same data
const data$ = this.http.get('/api/wells');
// Each subscribe = new HTTP request!

// ✅ GOOD: Share result
const data$ = this.http.get('/api/wells').pipe(shareReplay(1));
```

### 4. Handle Errors
```typescript
// ❌ BAD: No error handling (breaks the stream)
data$.subscribe(data => ...);

// ✅ GOOD: catchError inside pipe
data$.pipe(
  catchError(err => {
    this.error.set(err.message);
    return of(fallbackValue); // or EMPTY to complete
  })
).subscribe(data => ...);
```

---

## Forms Best Practices

1. **Simple forms** → Template-driven (ngModel)
2. **Complex forms** → Reactive (FormBuilder)
3. **Always validate** on both client AND server
4. **Custom validators** for business rules
5. **Disable submit** when form invalid
6. **Show errors** only after field touched
7. **Use typed forms** (Angular 14+)

---

## Routing Best Practices

1. **Lazy load** all feature routes
2. **Use guards** for authentication/authorization
3. **Title strategy** for page titles
4. **withComponentInputBinding()** for auto-binding route params
5. **Wildcard route** (`**`) for 404
6. **Preloading strategy** for better UX

```typescript
provideRouter(
  routes,
  withComponentInputBinding(),       // Auto-bind route params to inputs
  withViewTransitions(),             // Page transition animations
  withPreloading(PreloadAllModules)  // Preload lazy routes
)
```

---

## TypeScript Best Practices

```typescript
// ✅ Use interfaces for data shapes
interface Well { uid: string; name: string; }

// ✅ Use strict mode (tsconfig)
"strict": true

// ✅ Use readonly for immutable data
readonly wells: Well[] = [];

// ✅ Use enums or string literal unions
type WellStatus = 'drilling' | 'producing' | 'suspended';

// ✅ Use generics for reusable types
interface PaginatedResponse<T> { data: T[]; total: number; }

// ✅ Use utility types
type WellUpdate = Partial<Well>;
type WellCreate = Omit<Well, 'uid' | 'createdAt'>;

// ✅ Avoid 'any' - use 'unknown' if type is truly unknown
function handle(data: unknown): void { /* type guard before use */ }
```

---

## Security

### XSS Prevention
- Angular sanitizes values in templates by default
- Never use `bypassSecurityTrust*()` without careful review
- Use `[innerHtml]` instead of innerHTML (Angular sanitizes it)

### Authentication
- Store tokens securely (HttpOnly cookies > localStorage)
- Use HTTP interceptors for token attachment
- Implement token refresh mechanism
- Clear tokens on logout

### Authorization
- Route guards for page-level access
- Service-level checks for API calls
- Hide UI elements based on role (but always verify server-side)

### CSRF
- Angular's HttpClient automatically handles XSRF tokens
- Configure cookie/header names if non-default

---

## Testing Strategy

### Testing Pyramid
```
        /  E2E  \        ← Few (critical paths)
       /Integration\     ← Moderate
      /  Unit Tests  \   ← Many (fast, focused)
```

### What to Test:
- **Unit:** Services, pipes, utility functions, component logic
- **Integration:** Component + template + child components
- **E2E:** Critical user flows (login, main features)

### Quick test pattern:
```typescript
describe('WellDataService', () => {
  let service: WellDataService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WellDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch wells', () => {
    service.getWells().subscribe(wells => expect(wells.length).toBe(2));
    const req = httpMock.expectOne('/api/wells');
    req.flush([{ uid: '1' }, { uid: '2' }]);
  });
});
```

---

## Code Style & Conventions

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase + suffix | `WellListComponent` |
| Service | PascalCase + suffix | `WellDataService` |
| Directive | camelCase | `appHighlight` |
| Pipe | camelCase | `unitConvert` |
| Interface | PascalCase | `WellData` (no I prefix) |
| Enum | PascalCase | `WellStatus.Drilling` |
| File | kebab-case | `well-list.component.ts` |
| Signal | camelCase | `isLoading`, `wells` |
| Observable | camelCase + $ | `wells$`, `loading$` |

### File Organization in Component
```typescript
@Component({ /* metadata */ })
export class MyComponent implements OnInit, OnDestroy {
  // 1. DI (inject)
  private service = inject(MyService);
  
  // 2. Inputs
  data = input.required<Data>();
  
  // 3. Outputs
  saved = output<void>();
  
  // 4. State (signals)
  loading = signal(false);
  
  // 5. Computed
  total = computed(() => ...);
  
  // 6. ViewChild / ContentChild
  chart = viewChild<ElementRef>('chart');
  
  // 7. Lifecycle hooks
  ngOnInit() { }
  ngOnDestroy() { }
  
  // 8. Public methods (template handlers)
  onSubmit() { }
  
  // 9. Private methods
  private loadData() { }
}
```

---

*Previous: [04-SIGNALS-VS-RXJS.md](04-SIGNALS-VS-RXJS.md) | Next: [06-OPTIMIZATION.md](06-OPTIMIZATION.md)*
