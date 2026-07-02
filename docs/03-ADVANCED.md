# 03 - Angular Advanced

## Table of Contents
1. [Signals System](#signals-system)
2. [Change Detection](#change-detection)
3. [Deferrable Views](#deferrable-views)
4. [Content Projection](#content-projection)
5. [Dynamic Components](#dynamic-components)
6. [ViewEncapsulation](#viewencapsulation)
7. [NgRx Signal Store](#ngrx-signal-store)
8. [Zoneless Angular](#zoneless-angular)
9. [Angular Evolution Timeline](#angular-evolution-timeline)

---

## Signals System

### Core Primitives

| API | Purpose | Writable? |
|-----|---------|-----------|
| `signal(value)` | Create reactive state | Yes (set, update) |
| `computed(() => ...)` | Derived state | No (read-only) |
| `effect(() => ...)` | Side effects on change | N/A |
| `untracked(() => ...)` | Read without tracking | N/A |

### signal() - Writable Signal
```typescript
// Create
const count = signal(0);
const wells = signal<Well[]>([]);

// Read (call as function)
console.log(count());   // 0

// Write
count.set(5);                          // Replace
count.update(c => c + 1);             // Derive from current
wells.update(w => [...w, newWell]);   // Immutable update

// Readonly version (expose to consumers)
readonly publicCount = this.count.asReadonly();
```

### computed() - Derived Signal
```typescript
const price = signal(100);
const quantity = signal(3);

// Auto-recalculates when price or quantity changes
const total = computed(() => price() * quantity());

// Key properties:
// - Lazy evaluation (computed only when read)
// - Memoized (cached until dependencies change)
// - Read-only (cannot be set)
// - Glitch-free (consistent state always)
```

### effect() - Side Effects
```typescript
// Runs whenever tracked signals inside change
effect(() => {
  console.log('Depth changed to:', depth());
  localStorage.setItem('depth', depth().toString());
});

// With cleanup (like React useEffect return)
effect((onCleanup) => {
  const interval = setInterval(() => poll(), 5000);
  onCleanup(() => clearInterval(interval));
});

// Avoid tracking specific signals
effect(() => {
  const status = wellStatus(); // tracked
  const d = untracked(() => depth()); // NOT tracked
});
```

### Signal-based Component APIs
```typescript
// Inputs
name = input<string>('');              // Optional
title = input.required<string>();       // Required (compile error if missing)
value = input(0, { transform: numberAttribute }); // With transform

// Outputs
clicked = output<string>();             // Replaces EventEmitter
closed = output<void>();

// Model (two-way binding)
checked = model(false);                 // Parent: [(checked)]="val"

// View Queries
chart = viewChild<ElementRef>('chart');           // Optional
container = viewChild.required<ElementRef>('container'); // Required
items = viewChildren(ItemComponent);

// Content Queries
header = contentChild<TemplateRef<unknown>>('header');
panels = contentChildren(PanelComponent);
```

---

## Change Detection

### Bagaimana Change Detection Bekerja?

```
Zone.js patches async APIs (setTimeout, Promise, DOM events, XHR)
         ↓
Async event terjadi (click, HTTP response, timer)
         ↓
Zone.js notifies Angular
         ↓
Angular runs Change Detection dari root ke bawah
         ↓
Setiap component: compare old bindings vs new values
         ↓
Jika berbeda → update DOM
```

### Default vs OnPush

| Aspect | Default | OnPush |
|--------|---------|--------|
| Checks when? | Every CD cycle | Only when triggered |
| Triggers | Any async event anywhere | Input ref change, events in component, async pipe, signals, markForCheck() |
| Performance | Slower (checks everything) | Faster (skips unchanged branches) |
| Data pattern | Any | Immutable preferred |
| Best for | Prototyping | Production apps |

### OnPush Gotchas
```typescript
// ❌ WRONG: Object mutation - OnPush won't detect
this.well.name = 'New Name';
this.wells.push(newWell);

// ✅ CORRECT: New reference
this.well = { ...this.well, name: 'New Name' };
this.wells = [...this.wells, newWell];

// ✅ Signals automatically trigger OnPush
this.wellName.set('New Name');  // Works!

// ✅ async pipe triggers markForCheck
{{ data$ | async }}  // Works!
```

### Manual CD Control
```typescript
private cdr = inject(ChangeDetectorRef);

// Mark for check (next CD cycle)
this.cdr.markForCheck();

// Immediate detection (use sparingly!)
this.cdr.detectChanges();

// Detach from CD tree (for manual control)
this.cdr.detach();
this.cdr.reattach();
```

---

## Deferrable Views

### All Trigger Types
```html
<!-- Viewport (most common) -->
@defer (on viewport) { <app-chart /> }

<!-- Idle (browser idle) -->
@defer (on idle) { <app-widget /> }

<!-- Timer -->
@defer (on timer(3s)) { <app-ad /> }

<!-- Interaction (click, focus, input) -->
@defer (on interaction) { <app-editor /> }

<!-- Hover -->
@defer (on hover) { <app-preview /> }

<!-- Condition -->
@defer (when showAdvanced()) { <app-settings /> }

<!-- Combined: prefetch early, show later -->
@defer (on viewport; prefetch on idle) { <app-heavy /> }
```

### Block Types
```html
@defer (on viewport) {
  <!-- Main content (lazy loaded) -->
  <app-chart />
} @placeholder (minimum 200ms) {
  <!-- Before trigger fires -->
  <div>Scroll to load chart</div>
} @loading (after 150ms; minimum 500ms) {
  <!-- While loading JS bundle -->
  <app-spinner />
} @error {
  <!-- If loading fails -->
  <p>Failed to load</p>
}
```

---

## Content Projection

### Single Slot
```typescript
// card.component.ts
@Component({
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>`
})

// Usage: <app-card><p>Hello</p></app-card>
```

### Multi-slot Projection
```typescript
@Component({
  template: `
    <header><ng-content select="[card-header]"></ng-content></header>
    <main><ng-content></ng-content></main>
    <footer><ng-content select="[card-footer]"></ng-content></footer>`
})

// Usage:
// <app-card>
//   <h2 card-header>Title</h2>
//   <p>Body content</p>
//   <button card-footer>Action</button>
// </app-card>
```

### Conditional Projection with ng-template
```typescript
@Component({
  template: `
    @if (items.length > 0) {
      <ng-content></ng-content>
    } @else {
      <ng-container *ngTemplateOutlet="emptyTemplate || defaultEmpty">
      </ng-container>
    }
    <ng-template #defaultEmpty>No items</ng-template>`
})
export class ListComponent {
  emptyTemplate = contentChild<TemplateRef<unknown>>('empty');
}
```

---

## Dynamic Components

```typescript
// Angular 13+: No need for ComponentFactoryResolver!
import { ViewContainerRef, Type } from '@angular/core';

@Component({ template: `<ng-container #container></ng-container>` })
export class DashboardComponent {
  container = viewChild('container', { read: ViewContainerRef });
  
  loadWidget(component: Type<unknown>, data: unknown) {
    const vcr = this.container()!;
    vcr.clear();
    const ref = vcr.createComponent(component);
    ref.setInput('data', data);
  }
}
```

---

## ViewEncapsulation

| Mode | Behavior | Use Case |
|------|----------|----------|
| `Emulated` (default) | Scoped via `_ngcontent-xxx` attributes | Most components |
| `None` | Global styles | Override 3rd-party, global themes |
| `ShadowDom` | Native Shadow DOM | True isolation |

---

## NgRx Signal Store

```typescript
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';

export const WellStore = signalStore(
  { providedIn: 'root' },
  withState({
    wells: [] as Well[],
    loading: false,
    error: null as string | null
  }),
  withComputed(({ wells }) => ({
    activeWells: computed(() => wells().filter(w => w.status === 'drilling')),
    totalCount: computed(() => wells().length)
  })),
  withMethods((store, wellService = inject(WellDataService)) => ({
    load: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true })),
      switchMap(() => wellService.getWells()),
      tap(wells => patchState(store, { wells, loading: false, error: null }))
    ))
  }))
);

// Usage in component:
store = inject(WellStore);
wells = this.store.activeWells;  // Signal!
```

---

## Zoneless Angular

```typescript
// Experimental in Angular 18+
export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
};

// Requirements for zoneless:
// - Use Signals for all state
// - Use async pipe for observables in templates
// - No relying on Zone.js auto-detection
// - markForCheck() still works as escape hatch
```

---

## Angular Evolution Timeline

| Version | Key Features |
|---------|-------------|
| v14 (2022) | Standalone components, inject(), typed forms |
| v15 (2022) | Functional guards/interceptors, directive composition |
| v16 (2023) | Signals, DestroyRef, takeUntilDestroyed, required inputs |
| v17 (2023) | @if/@for/@switch, @defer, input()/output()/viewChild() signals |
| v18 (2024) | Zoneless (experimental), improved SSR, material 3 |

---

*Previous: [02-INTERMEDIATE.md](02-INTERMEDIATE.md) | Next: [04-SIGNALS-VS-RXJS.md](04-SIGNALS-VS-RXJS.md)*
