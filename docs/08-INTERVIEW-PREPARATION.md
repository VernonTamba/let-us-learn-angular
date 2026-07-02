# 08 - Angular Interview Preparation

## Panduan Interview Angular - Oil & Gas Company

Dokumen ini berisi pertanyaan-pertanyaan yang sering muncul di technical interview Angular, dikelompokkan berdasarkan level dan topik.

---

## Level 1: Basic Questions

### Q: Apa itu Angular dan bedanya dengan AngularJS?
**A:** Angular (2+) adalah complete rewrite dari AngularJS (1.x). Perbedaan utama:
- TypeScript-based (bukan plain JS)
- Component-based architecture (bukan controller/scope)
- Reactive (RxJS, Signals)
- Better performance (AOT compilation, tree-shaking)
- Mobile-friendly

### Q: Jelaskan Component Lifecycle Hooks
**A:** Urutan: constructor → ngOnChanges → ngOnInit → ngDoCheck → ngAfterContentInit → ngAfterContentChecked → ngAfterViewInit → ngAfterViewChecked → ngOnDestroy

Yang paling penting:
- `ngOnInit`: Initialization logic (fetch data, setup)
- `ngOnDestroy`: Cleanup (unsubscribe, clear timers)
- `ngOnChanges`: React to @Input changes

### Q: Apa bedanya ngOnInit dan constructor?
**A:**
- **Constructor:** Hanya untuk dependency injection. Angular belum setup inputs.
- **ngOnInit:** Component fully initialized, inputs sudah available, safe untuk fetch data.

### Q: Jelaskan 4 types of data binding
**A:**
1. **Interpolation** `{{ expr }}` - Component → View (text)
2. **Property binding** `[prop]="expr"` - Component → View (properties)
3. **Event binding** `(event)="handler()"` - View → Component
4. **Two-way** `[(ngModel)]="prop"` - Both directions

### Q: Apa itu Dependency Injection?
**A:** Design pattern dimana dependencies disediakan oleh framework (bukan dibuat sendiri). Angular punya hierarchical injector system. Benefits: testability, loose coupling, reusability.

```typescript
// Angular handles creating & providing the service instance
private http = inject(HttpClient);
```

### Q: Apa bedanya `*ngIf` dan `@if`?
**A:** `@if` adalah new control flow syntax (Angular 17+). Keuntungan:
- Built-in (no need import CommonModule)
- Better type narrowing
- Better performance
- Cleaner syntax with `@else`
- `@for` requires `track` (prevents bugs)

---

## Level 2: Intermediate Questions

### Q: Jelaskan perbedaan switchMap, mergeMap, concatMap, exhaustMap
**A:**
| Operator | Previous | New | Use Case |
|----------|----------|-----|----------|
| switchMap | Cancel | Subscribe | Search (only latest) |
| mergeMap | Continue | Subscribe parallel | Parallel uploads |
| concatMap | Queue | Wait turn | Sequential writes |
| exhaustMap | Continue | Ignore | Form submit (prevent double) |

### Q: Template-Driven vs Reactive Forms?
**A:**
- **Template-driven:** Logic di template (ngModel), simple forms, harder to test
- **Reactive:** Logic di TypeScript (FormBuilder), complex forms, easy to test, type-safe

Reactive forms recommended untuk production apps.

### Q: Bagaimana handle authentication di Angular?
**A:**
1. Login → Store JWT token
2. HTTP Interceptor → Attach token ke setiap request
3. Route Guards → Protect routes yang perlu auth
4. Token refresh → Auto-refresh saat expired (via interceptor)
5. Logout → Clear token, redirect ke login

### Q: Apa itu HTTP Interceptor dan use case-nya?
**A:** Middleware yang intercept setiap HTTP request/response. Use cases:
- Add auth headers
- Global error handling
- Loading indicators
- Request/response transformation
- Caching
- Logging

```typescript
// Modern way (Angular 15+): Functional interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

### Q: Jelaskan Lazy Loading dan keuntungannya
**A:** Lazy loading = load code hanya saat dibutuhkan.

Keuntungan:
- Smaller initial bundle (faster first load)
- Code loaded on demand (route navigation)
- Better caching (unchanged chunks stay cached)

```typescript
{ path: 'reports', loadComponent: () => import('./reports.component').then(c => c.ReportsComponent) }
```

### Q: Apa itu Route Guards dan jenisnya?
**A:**
- `canActivate`: Boleh akses route?
- `canActivateChild`: Boleh akses child routes?
- `canDeactivate`: Boleh tinggalkan route? (unsaved changes)
- `canMatch`: Route ini match? (conditional routing)
- `resolve`: Pre-fetch data sebelum render

### Q: Bagaimana prevent memory leaks di Angular?
**A:**
1. `takeUntilDestroyed()` (Angular 16+) - auto cleanup
2. `async` pipe in templates - auto unsubscribe
3. `takeUntil(destroy$)` pattern
4. Clear intervals/timeouts di ngOnDestroy
5. Remove event listeners

---

## Level 3: Advanced Questions

### Q: Jelaskan Change Detection dan OnPush strategy
**A:**
- **Default:** Check semua component setiap CD cycle (any async event)
- **OnPush:** Check hanya ketika:
  - Input reference berubah (immutable!)
  - Event handler di component fires
  - async pipe emits
  - Signal changes
  - Manual markForCheck()

OnPush significantly improves performance karena skip unchanged component trees.

### Q: Apa itu Angular Signals dan bedanya dengan RxJS?
**A:**
- **Signals:** Synchronous, always has value, for state. Simpler API (get/set).
- **RxJS:** Asynchronous, streams over time, for events/async operations.

Mereka complementary:
- Signals untuk UI state, form values, computed values
- RxJS untuk HTTP, WebSocket, timing operations, complex async coordination
- Bridge: `toSignal()` dan `toObservable()`

### Q: Bagaimana optimize performance Angular app?
**A:**
1. OnPush change detection everywhere
2. Lazy loading routes + @defer for components
3. `track` expression in @for loops
4. Signals/computed instead of methods in templates
5. Virtual scrolling for large lists
6. HTTP caching with shareReplay
7. Bundle analysis & budgets
8. Image lazy loading

### Q: Apa itu Content Projection dan kapan digunakan?
**A:** Mekanisme untuk pass template content dari parent ke child (like "slots").

```html
<!-- Multi-slot projection -->
<app-card>
  <h2 card-header>Title</h2>
  <p>Body content</p>
  <button card-footer>Action</button>
</app-card>
```

Use case: Reusable layout components (cards, modals, panels).

### Q: Jelaskan Standalone Components
**A:** Components yang independent dari NgModules. Benefits:
- Simpler architecture (no module boilerplate)
- Better tree-shaking (only import what's used)
- Easier to understand (dependencies explicit in component)
- Required for modern Angular (v17+ default)

### Q: Apa itu Zone.js dan Zoneless Angular?
**A:**
- **Zone.js:** Library yang patches semua async APIs (setTimeout, Promise, etc.) untuk trigger change detection. Adds ~13KB to bundle.
- **Zoneless (Angular 18+):** Experimental mode tanpa Zone.js. Change detection hanya triggered oleh Signals dan async pipe. Smaller bundle, better performance.

### Q: Jelaskan @defer dan trigger types-nya
**A:** @defer lazily loads component code (JavaScript bundle) berdasarkan trigger:
- `on viewport` - saat element visible di screen
- `on idle` - saat browser idle
- `on timer(Xms)` - setelah X milliseconds
- `on interaction` - saat user interact (click/focus)
- `on hover` - saat mouse hover
- `when condition` - saat expression true

Plus `prefetch` untuk load code early, render later.

---

## Behavioral / System Design Questions

### Q: Bagaimana design real-time monitoring dashboard?
**A:** (Relevant untuk Oil & Gas!)
1. **WebSocket** untuk bi-directional real-time data
2. **Buffer/batch** updates (jangan render setiap reading)
3. **OnPush + Signals** untuk minimize DOM updates
4. **Virtual scrolling** untuk list of wells
5. **@defer** untuk charts below fold
6. **Service Worker** untuk offline support
7. **Alarm system** dengan prioritas (critical vs warning)
8. **Data compression** untuk reduce bandwidth

### Q: Bagaimana handle 100+ wells monitoring simultaneously?
**A:**
1. **Pagination/virtualization** - don't render all
2. **WebSocket multiplexing** - single connection, multiple channels
3. **Server-side aggregation** - send summarized data
4. **Progressive loading** - load visible first, rest on scroll
5. **Micro-frontend** - split by feature area
6. **Worker threads** - heavy computation off main thread

### Q: Bagaimana structure Angular app untuk enterprise?
**A:**
```
Core → Shared → Features (lazy loaded)
```
- Mono-repo with Nx (multiple apps sharing libraries)
- Feature-based folder structure
- Shared libraries for common components
- State management (NgRx for complex state)
- CI/CD with automated testing
- Design system / component library

---

## Quick-fire Questions (Jawab Singkat)

| Question | Answer |
|----------|--------|
| Pure vs Impure pipe? | Pure: only re-runs on input change. Impure: every CD cycle. |
| ViewEncapsulation modes? | Emulated (default), None (global), ShadowDom (native) |
| providedIn: 'root' vs component? | root = singleton. component = new instance per component. |
| Observable vs Promise? | Observable: multiple values, lazy, cancellable. Promise: single, eager. |
| AOT vs JIT compilation? | AOT: compile at build (production). JIT: compile at runtime (dev). |
| ng-content vs ng-template? | ng-content: project parent content. ng-template: reusable template block. |
| Renderer2 vs direct DOM? | Renderer2: platform-agnostic (SSR safe). Direct DOM: not SSR safe. |
| trackBy/@for track? | Helps Angular identify items for efficient DOM reuse in lists. |
| Signals vs BehaviorSubject? | Signals: sync, simpler. BS: async, more operators, legacy support. |
| input() vs @Input()? | input(): signal-based, reactive, better type safety. @Input(): legacy. |

---

## Tips Menghadapi Interview

### Sebelum Interview:
1. Review project ini - pahami setiap file
2. Bisa jelaskan code yang kamu tulis
3. Pahami trade-offs (kenapa pilih X over Y)
4. Siapkan contoh real-world problems yang pernah kamu solve

### Selama Interview:
1. **Think out loud** - jelaskan reasoning-mu
2. **Ask clarifying questions** - jangan asumsi
3. **Start simple, then optimize** - jangan langsung complex
4. **Acknowledge trade-offs** - "ini trade-off antara X dan Y"
5. **Jika tidak tahu** - bilang jujur, lalu explain approach untuk learn

### Topik yang Sering Muncul di Oil & Gas Tech Interview:
1. Real-time data handling (WebSocket, RxJS)
2. Performance di high-frequency updates
3. Data visualization (charts, dashboards)
4. Error handling & reliability
5. Offline support / poor connectivity
6. Security (role-based access, sensitive data)
7. Scalability (multiple wells, multiple users)

---

## Practice Exercise Ideas

1. **Build a sensor gauge component** yang update real-time via WebSocket
2. **Implement search** dengan debounce, loading state, dan error handling
3. **Create a data table** dengan sorting, filtering, pagination
4. **Build an alarm system** dengan different severity levels dan acknowledge
5. **Implement authentication flow** complete dengan guards dan interceptors
6. **Create a chart** yang update real-time tanpa performance issues

Semua ini sudah didemonstrasikan dalam project ini! Review dan practice modifikasi.

---

## Useful Resources

- [Angular Official Docs](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Blog](https://blog.angular.dev)
- [NgRx Documentation](https://ngrx.io)
- [WITSML Standards (Energistics)](https://www.energistics.org)

---

*Good luck with your interview! You've got this! 🚀*

*Previous: [07-WITSML-CONCEPTS.md](07-WITSML-CONCEPTS.md)*
