# 02 - Angular Intermediate

## Table of Contents
1. [Reactive Forms](#reactive-forms)
2. [HTTP Client](#http-client)
3. [RxJS Operators Deep Dive](#rxjs-operators-deep-dive)
4. [Component Communication Patterns](#component-communication-patterns)
5. [Lazy Loading](#lazy-loading)
6. [Route Guards](#route-guards)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)

---

## Reactive Forms

### Setup
```typescript
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule]
})
```

### Form Creation
```typescript
private fb = inject(FormBuilder);

wellForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  field: ['', Validators.required],
  depth: [0, [Validators.required, Validators.min(0)]],
  type: ['oil'],
  // Nested FormGroup
  location: this.fb.group({
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]]
  }),
  // FormArray (dynamic fields)
  sensors: this.fb.array([])
});
```

### Custom Validators
```typescript
// Sync validator
function depthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value < 0 || value > 15000) {
    return { invalidDepth: { min: 0, max: 15000, actual: value } };
  }
  return null;
}

// Async validator (e.g., check uniqueness)
function uniqueNameValidator(wellService: WellDataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return wellService.checkNameExists(control.value).pipe(
      map(exists => exists ? { nameExists: true } : null),
      catchError(() => of(null))
    );
  };
}
```

---

## HTTP Client

### Basic CRUD
```typescript
private http = inject(HttpClient);
private apiUrl = '/api/wells';

getWells(): Observable<Well[]> {
  return this.http.get<Well[]>(this.apiUrl);
}

getWell(id: string): Observable<Well> {
  return this.http.get<Well>(`${this.apiUrl}/${id}`);
}

createWell(well: CreateWellDto): Observable<Well> {
  return this.http.post<Well>(this.apiUrl, well);
}

updateWell(id: string, updates: Partial<Well>): Observable<Well> {
  return this.http.patch<Well>(`${this.apiUrl}/${id}`, updates);
}

deleteWell(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
```

### HTTP Interceptors (Functional)
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};

// Register di app.config.ts:
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
```

---

## RxJS Operators Deep Dive

### Higher-Order Mapping (CRITICAL for Interview!)

| Operator | Previous Inner | Use Case |
|----------|---------------|----------|
| `switchMap` | ❌ Cancelled | Search, navigation (only latest matters) |
| `mergeMap` | ✅ Continues | Parallel uploads, independent calls |
| `concatMap` | ✅ Queued | Sequential writes, ordered operations |
| `exhaustMap` | ❌ Ignored new | Form submit, login (prevent duplicate) |

### Common Patterns
```typescript
// Debounced search
searchResults$ = this.searchInput.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  filter(term => term.length >= 2),
  switchMap(term => this.api.search(term))
);

// Polling fallback
pollData$ = timer(0, 5000).pipe(
  switchMap(() => this.http.get('/api/data')),
  retry(3),
  shareReplay(1)
);

// Parallel requests
dashboard$ = forkJoin({
  wells: this.getWells(),
  alerts: this.getAlerts(),
  stats: this.getStats()
});
```

### Subject Types

| Type | Initial Value | Replays | Use Case |
|------|--------------|---------|----------|
| `Subject` | No | Nothing | Event bus |
| `BehaviorSubject` | Yes (required) | Last value | Current state |
| `ReplaySubject(n)` | No | Last N values | Cache history |
| `AsyncSubject` | No | Last (on complete) | HTTP-like |

---

## Component Communication Patterns

### 1. Parent → Child (Input)
```typescript
// Parent: <app-child [data]="parentData" />
// Child: data = input.required<Data>();
```

### 2. Child → Parent (Output)
```typescript
// Child: saved = output<Data>(); this.saved.emit(data);
// Parent: <app-child (saved)="onSaved($event)" />
```

### 3. Via Service (Unrelated Components)
```typescript
@Injectable({ providedIn: 'root' })
export class SharedStateService {
  private selectedWell = signal<Well | null>(null);
  readonly selected = this.selectedWell.asReadonly();
  
  select(well: Well) { this.selectedWell.set(well); }
}
```

### 4. ViewChild (Parent accesses Child)
```typescript
child = viewChild(ChildComponent);
ngAfterViewInit() { this.child()?.refresh(); }
```

---

## Lazy Loading

### Route-level Lazy Loading
```typescript
// Standalone component
{ path: 'wells', loadComponent: () => import('./wells.component').then(c => c.WellsComponent) }

// Child routes
{ path: 'admin', loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES) }
```

### @defer (Template-level)
```html
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <p>Loading...</p>
}
```

---

## Route Guards

### Functional Guards (Modern)
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Usage: { path: 'admin', canActivate: [authGuard], ... }
```

### Types of Guards
- `canActivate` - Can user access this route?
- `canActivateChild` - Can user access child routes?
- `canDeactivate` - Can user leave? (unsaved changes warning)
- `canMatch` - Should this route be matched? (replaces canLoad)
- `resolve` - Pre-fetch data before navigation

---

## State Management

### Recommendation by App Size:
- **Small:** Service + Signals
- **Medium:** Service + Signals/BehaviorSubject
- **Large/Complex:** NgRx Store or NgRx Signal Store

### Signal Store (NgRx Signals - Newest Approach)
```typescript
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';

export const WellStore = signalStore(
  { providedIn: 'root' },
  withState({ wells: [] as Well[], loading: false }),
  withComputed(({ wells }) => ({
    activeWells: computed(() => wells().filter(w => w.status === 'drilling'))
  })),
  withMethods((store, wellService = inject(WellDataService)) => ({
    loadWells: () => {
      patchState(store, { loading: true });
      wellService.getWells().subscribe(wells => 
        patchState(store, { wells, loading: false })
      );
    }
  }))
);
```

---

## Error Handling

### Global Error Handler
```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('Unhandled error:', error);
    // Send to error tracking service (Sentry, etc.)
  }
}

// Register: { provide: ErrorHandler, useClass: GlobalErrorHandler }
```

### HTTP Error Pattern
```typescript
this.http.get('/api/data').pipe(
  retry({ count: 2, delay: 1000 }),
  catchError(error => {
    this.notification.error('Failed to load data');
    return of(fallbackData); // or throwError(() => error)
  }),
  finalize(() => this.loading.set(false))
);
```

---

*Previous: [01-BASICS.md](01-BASICS.md) | Next: [03-ADVANCED.md](03-ADVANCED.md)*
