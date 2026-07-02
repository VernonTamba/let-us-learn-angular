# 01 - Angular Basics

## Table of Contents
1. [Components](#components)
2. [Templates & Data Binding](#templates--data-binding)
3. [Directives](#directives)
4. [Pipes](#pipes)
5. [Services & Dependency Injection](#services--dependency-injection)
6. [Lifecycle Hooks](#lifecycle-hooks)
7. [Basic Routing](#basic-routing)
8. [Forms (Template-Driven)](#forms-template-driven)

---

## Components

### Apa itu Component?
Component adalah building block utama Angular. Setiap component terdiri dari:
- **Class** (TypeScript) - Logic & data
- **Template** (HTML) - UI/View
- **Styles** (CSS/SCSS) - Styling
- **Metadata** (Decorator) - Configuration

### Anatomy of a Component

```typescript
// OLD WAY (NgModule-based)
@Component({
  selector: 'app-well-card',
  templateUrl: './well-card.component.html',
  styleUrls: ['./well-card.component.scss']
})
export class WellCardComponent {
  @Input() well!: Well;
  @Output() selected = new EventEmitter<string>();
}
// Harus declare di NgModule: declarations: [WellCardComponent]

// NEW WAY (Standalone - Angular 14+)
@Component({
  selector: 'app-well-card',
  standalone: true,                        // Independent!
  imports: [CommonModule, MatCardModule],   // Import sendiri
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,                         // Inline or templateUrl
  styles: [`...`]                          // Inline or styleUrls
})
export class WellCardComponent {
  well = input.required<Well>();           // Signal input
  selected = output<string>();             // Signal output
}
```

### Component Selector Rules
- Harus ada prefix (e.g., `app-`, `witsml-`)
- Kebab-case: `app-well-detail`
- Bisa juga attribute selector: `[appHighlight]`

---

## Templates & Data Binding

### 4 Types of Data Binding

| Type | Syntax | Direction | Use Case |
|------|--------|-----------|----------|
| Interpolation | `{{ expression }}` | Component → View | Display text |
| Property Binding | `[property]="expr"` | Component → View | Set DOM property |
| Event Binding | `(event)="handler()"` | View → Component | Handle events |
| Two-way Binding | `[(ngModel)]="prop"` | Both | Form inputs |

### Template Expressions
```html
<!-- Interpolation -->
<h1>{{ well.name }}</h1>
<p>Depth: {{ well.depth * 3.28084 | number:'1.2-2' }} ft</p>

<!-- Property Binding -->
<button [disabled]="isLoading">Submit</button>
<img [src]="well.imageUrl" [alt]="well.name">
<div [class.active]="isActive" [style.color]="statusColor">

<!-- Event Binding -->
<button (click)="onSubmit()">Save</button>
<input (input)="onSearch($event)" (keyup.enter)="search()">

<!-- Two-way Binding -->
<input [(ngModel)]="searchTerm">
<!-- Equivalent to: [ngModel]="searchTerm" (ngModelChange)="searchTerm = $event" -->
```

### Template Reference Variables
```html
<!-- #ref creates a reference to the DOM element -->
<input #searchInput type="text">
<button (click)="search(searchInput.value)">Search</button>

<!-- Reference to component instance -->
<app-child #childComp></app-child>
<button (click)="childComp.refresh()">Refresh Child</button>
```

---

## Directives

### Structural Directives (Control Flow)

**OLD WAY:**
```html
*ngIf, *ngFor, [ngSwitch]
```

**NEW WAY (Angular 17+):**
```html
@if, @for, @switch
```

Lihat perbandingan detail di file:
`src/app/learning/01-basics/basics-overview.component.ts`

### Attribute Directives
```typescript
// Built-in:
[ngClass]="{'active': isActive, 'disabled': !isEnabled}"
[ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}"

// Custom directive:
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  appHighlight = input<string>('yellow');
  // ... host listeners for mouseenter/mouseleave
}
```

---

## Pipes

### Built-in Pipes
| Pipe | Example | Output |
|------|---------|--------|
| `date` | `{{ today \| date:'short' }}` | 7/2/26, 10:30 AM |
| `number` | `{{ 3500.5 \| number:'1.0-2' }}` | 3,500.50 |
| `currency` | `{{ 1500 \| currency:'USD' }}` | $1,500.00 |
| `uppercase` | `{{ 'hello' \| uppercase }}` | HELLO |
| `titlecase` | `{{ 'well name' \| titlecase }}` | Well Name |
| `percent` | `{{ 0.85 \| percent }}` | 85% |
| `json` | `{{ obj \| json }}` | JSON string |
| `async` | `{{ data$ \| async }}` | Unwraps Observable |
| `slice` | `{{ arr \| slice:0:5 }}` | First 5 items |

### Custom Pipe
```typescript
@Pipe({ name: 'unitConvert', standalone: true, pure: true })
export class UnitConversionPipe implements PipeTransform {
  transform(value: number, from: string, to: string): string {
    // conversion logic
  }
}
// Usage: {{ depth | unitConvert:'m':'ft' }}
```

### Pure vs Impure Pipes
- **Pure (default):** Re-evaluate hanya saat input reference berubah
- **Impure (`pure: false`):** Re-evaluate setiap change detection cycle

---

## Services & Dependency Injection

### Creating a Service
```typescript
@Injectable({
  providedIn: 'root'  // Singleton, tree-shakeable
})
export class WellDataService {
  private http = inject(HttpClient); // NEW WAY

  // OLD WAY: constructor(private http: HttpClient) {}
}
```

### DI Hierarchy
```
Root Injector (providedIn: 'root')
  └── Module Injector (providers in NgModule)
       └── Component Injector (providers in @Component)
            └── Directive Injector
```

### Injection Tokens
```typescript
// Custom token for configuration
export const API_URL = new InjectionToken<string>('API_URL');

// Provide:
providers: [{ provide: API_URL, useValue: 'http://api.example.com' }]

// Inject:
private apiUrl = inject(API_URL);
```

---

## Lifecycle Hooks

### Order of Execution
1. `constructor()` - DI only
2. `ngOnChanges()` - Input changes (before ngOnInit and on every change)
3. `ngOnInit()` - ⭐ Initialization logic
4. `ngDoCheck()` - Custom change detection
5. `ngAfterContentInit()` - After ng-content projected
6. `ngAfterContentChecked()` - After content checked
7. `ngAfterViewInit()` - After view rendered
8. `ngAfterViewChecked()` - After view checked
9. `ngOnDestroy()` - ⭐ Cleanup

### Key Points untuk Interview
- **ngOnInit vs constructor:** Constructor hanya untuk DI. ngOnInit saat component sudah fully initialized dan inputs sudah available.
- **ngOnDestroy:** WAJIB unsubscribe observables, clear timers, detach event listeners.
- **ngOnChanges:** Hanya triggered untuk @Input() properties, BUKAN signal inputs.

---

## Basic Routing

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'wells', loadComponent: () => import('./wells.component').then(c => c.WellsComponent) },
  { path: 'wells/:id', component: WellDetailComponent },
  { path: '**', component: NotFoundComponent }
];
```

### Router Directives
```html
<a routerLink="/wells" routerLinkActive="active">Wells</a>
<a [routerLink]="['/wells', well.id]">{{ well.name }}</a>
<router-outlet></router-outlet>
```

---

## Forms (Template-Driven)

```html
<form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
  <input name="wellName" [(ngModel)]="well.name" required minlength="3" #name="ngModel">
  
  @if (name.invalid && name.touched) {
    <span class="error">Name is required (min 3 chars)</span>
  }
  
  <button [disabled]="myForm.invalid">Submit</button>
</form>
```

Template-driven forms cocok untuk form sederhana. Untuk form kompleks, gunakan Reactive Forms (lihat 02-INTERMEDIATE.md).

---

*Next: [02-INTERMEDIATE.md](02-INTERMEDIATE.md)*
