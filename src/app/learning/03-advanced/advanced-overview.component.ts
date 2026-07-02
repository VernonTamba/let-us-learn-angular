/**
 * =============================================================================
 * ADVANCED OVERVIEW - Signals, Change Detection, @defer, Performance
 * =============================================================================
 *
 * 📘 KONSEP ADVANCED YANG DICOVER:
 * 1. Signals Deep Dive (signal, computed, effect, linkedSignal)
 * 2. Change Detection Strategies (Default vs OnPush)
 * 3. Deferrable Views (@defer)
 * 4. Content Projection (ng-content, ng-template)
 * 5. Dynamic Components
 * 6. Performance Optimization Techniques
 * 7. Zoneless Angular (future)
 *
 * 💡 TIP INTERVIEW:
 * Advanced topics menunjukkan bahwa kamu memahami Angular pada level yang dalam.
 * Interviewer suka bertanya tentang Change Detection, Signals, dan Performance.
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  untracked,
  inject,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  contentChild,
  contentChildren,
  viewChild,
  viewChildren,
  TemplateRef,
  ElementRef,
  afterNextRender,
  afterRender,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';

@Component({
  selector: 'app-advanced-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="advanced-container">
      <h1>03 - Advanced Angular</h1>
      <p class="subtitle">Signals, Change Detection, Performance, New APIs</p>

      <mat-tab-group>
        <!-- ============================================================
             TAB 1: SIGNALS DEEP DIVE
             ============================================================ -->
        <mat-tab label="Signals">
          <div class="tab-content">
            <h2>Angular Signals - New Reactivity System</h2>
            <p class="intro">
              Signals adalah primitive baru untuk reactive state management di Angular 16+.
              Mereka lebih sederhana dari RxJS untuk synchronous state dan
              memungkinkan fine-grained change detection.
            </p>

            <!-- signal() -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>signal() - Writable Signal</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
import {{ '{' }} signal {{ '}' }} from '&#64;angular/core';

// Create a signal with initial value
const count = signal(0);
const name = signal('Well-1');
const wells = signal&lt;Well[]&gt;([]);

// READ: Call the signal like a function
console.log(count());    // 0
console.log(name());     // 'Well-1'

// WRITE: Three methods
count.set(5);            // Replace value entirely
count.update(c => c + 1); // Update based on current value
wells.update(w => [...w, newWell]); // Immutable update for arrays/objects

// In template: {{ '{{ count() }}' }} - signals auto-track dependencies
                </code></pre>
                <div class="live-demo">
                  <h4>Live Demo:</h4>
                  <p>Counter: <strong>{{ counter() }}</strong></p>
                  <button mat-raised-button (click)="counter.set(counter() + 1)">
                    Increment
                  </button>
                  <button mat-raised-button (click)="counter.set(0)">
                    Reset
                  </button>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- computed() -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>computed() - Derived/Computed Signal</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
import {{ '{' }} signal, computed {{ '}' }} from '&#64;angular/core';

const price = signal(100);
const quantity = signal(5);
const taxRate = signal(0.1);

// Computed: automatically recalculated when dependencies change
const subtotal = computed(() => price() * quantity());
const tax = computed(() => subtotal() * taxRate());
const total = computed(() => subtotal() + tax());

// Properties:
// - Lazy: only computed when read
// - Cached: same value if dependencies haven't changed
// - Read-only: cannot be set manually
// - Tracks dependencies automatically (like Vue computed)
                </code></pre>
                <div class="live-demo">
                  <h4>Live Demo: Well Depth Calculator</h4>
                  <p>Depth (m): <strong>{{ depthMeters() }}</strong></p>
                  <p>Depth (ft): <strong>{{ depthFeet() | number:'1.1-1' }}</strong> (computed)</p>
                  <p>Is Deep Well: <strong>{{ isDeepWell() }}</strong> (computed)</p>
                  <button mat-raised-button (click)="depthMeters.set(depthMeters() + 100)">
                    Drill +100m
                  </button>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- effect() -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>effect() - Side Effects</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
import {{ '{' }} signal, effect, untracked {{ '}' }} from '&#64;angular/core';

const wellStatus = signal('drilling');
const depth = signal(3500);

// Effect: runs whenever tracked signals change
effect(() => {{ '{' }}
  // This re-runs whenever wellStatus() or depth() change
  console.log('Status:', wellStatus(), 'Depth:', depth());

  // Side effects: save to localStorage, analytics, logging
  localStorage.setItem('lastStatus', wellStatus());
{{ '}' }});

// untracked(): Read signal WITHOUT creating dependency
effect(() => {{ '{' }}
  console.log('Status changed:', wellStatus());
  // Read depth but DON'T re-run effect when depth changes
  const d = untracked(() => depth());
  console.log('Current depth (not tracked):', d);
{{ '}' }});

// Cleanup function (like useEffect return in React)
effect((onCleanup) => {{ '{' }}
  const timer = setInterval(() => pollData(), 5000);
  onCleanup(() => clearInterval(timer));
{{ '}' }});
                </code></pre>
                <div class="live-demo">
                  <h4>Live Demo: Effect logs to console</h4>
                  <p>Effect run count: <strong>{{ effectRunCount() }}</strong></p>
                  <p>Check browser console for effect output!</p>
                  <button mat-raised-button (click)="triggerEffect()">
                    Trigger Effect
                  </button>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Signal Inputs/Outputs -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Signal-based Component APIs</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// ======= INPUT SIGNALS =======
// 🔴 OLD: &#64;Input() name: string = '';
// 🟢 NEW:
name = input&lt;string&gt;('default');           // Optional with default
title = input.required&lt;string&gt;();           // Required (compile error if missing)
count = input(0, {{ '{' }}                        // With transform
  transform: (v: string | number) => Number(v)
{{ '}' }});

// ======= OUTPUT SIGNALS =======
// 🔴 OLD: &#64;Output() clicked = new EventEmitter&lt;string&gt;();
// 🟢 NEW:
clicked = output&lt;string&gt;();
// Emit: this.clicked.emit('hello');

// ======= MODEL SIGNALS (Two-way binding) =======
// 🟢 NEWEST: model() for two-way binding
value = model(0);  // Creates [(value)] binding
// Parent: &lt;child [(value)]="parentSignal" /&gt;
// Child can: this.value.set(newVal) → updates parent too!

// ======= VIEW QUERIES =======
// 🔴 OLD: &#64;ViewChild('myRef') myRef!: ElementRef;
// 🟢 NEW:
myRef = viewChild&lt;ElementRef&gt;('myRef');           // Optional
myReqRef = viewChild.required&lt;ElementRef&gt;('req'); // Required
items = viewChildren(ItemComponent);               // Multiple

// 🔴 OLD: &#64;ContentChild() / &#64;ContentChildren()
// 🟢 NEW:
header = contentChild&lt;TemplateRef&lt;unknown&gt;&gt;('header');
tabs = contentChildren(TabComponent);
                </code></pre>
              </mat-card-content>
            </mat-card>

            <!-- RxJS Interop -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Signal ↔ RxJS Interop</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
import {{ '{' }} toSignal, toObservable {{ '}' }} from '&#64;angular/core/rxjs-interop';

// Observable → Signal
const data$ = this.http.get&lt;Data&gt;('/api/data');
const dataSignal = toSignal(data$, {{ '{' }}
  initialValue: null,  // Required (signal needs initial value)
  // OR: requireSync: true (if observable emits synchronously)
{{ '}' }});

// Signal → Observable
const count = signal(0);
const count$ = toObservable(count);
count$.subscribe(value => console.log('Count changed:', value));

// takeUntilDestroyed (Angular 16+) - auto cleanup!
import {{ '{' }} takeUntilDestroyed {{ '}' }} from '&#64;angular/core/rxjs-interop';

// In constructor or field initializer (injection context):
this.http.get('/api').pipe(
  takeUntilDestroyed()  // Auto-unsubscribes on component destroy!
).subscribe();

// Outside injection context (e.g., ngOnInit):
private destroyRef = inject(DestroyRef);
ngOnInit() {{ '{' }}
  interval(1000).pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe();
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 2: CHANGE DETECTION
             ============================================================ -->
        <mat-tab label="Change Detection">
          <div class="tab-content">
            <h2>Change Detection Deep Dive</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>How Change Detection Works</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="cd-explanation">
                  <h4>What triggers Change Detection?</h4>
                  <ul>
                    <li>DOM events (click, input, submit, etc.)</li>
                    <li>HTTP responses</li>
                    <li>Timer/interval callbacks (setTimeout, setInterval)</li>
                    <li>Promise resolutions</li>
                    <li>Any async operation patched by Zone.js</li>
                  </ul>

                  <h4>What happens during CD?</h4>
                  <ol>
                    <li>Angular checks the component tree TOP-DOWN</li>
                    <li>For each component, compares current values with previous</li>
                    <li>If different → update the DOM</li>
                    <li>With Default strategy: checks ALL components</li>
                    <li>With OnPush: only checks if inputs change or events occur</li>
                  </ol>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Default vs OnPush Strategy</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparison">
                  <div class="old-way">
                    <h4>Default (ChangeDetectionStrategy.Default)</h4>
                    <pre><code>
// Checks component on EVERY CD cycle
// Even if nothing changed
&#64;Component({{ '{' }}
  changeDetection: ChangeDetectionStrategy.Default
{{ '}' }})

// When CD runs:
// - ALL bindings are evaluated
// - ALL child components are checked
// - More re-renders = slower

// Problems:
// - Unnecessary DOM updates
// - Performance issues with large trees
// - Expressions in template run every cycle
                    </code></pre>
                  </div>
                  <div class="new-way">
                    <h4>OnPush (ChangeDetectionStrategy.OnPush)</h4>
                    <pre><code>
// Only checks when:
// 1. &#64;Input() reference changes (immutable!)
// 2. Event handler in this component fires
// 3. Async pipe emits new value
// 4. Signal value changes (Angular 17+)
// 5. Manual: markForCheck()

&#64;Component({{ '{' }}
  changeDetection: ChangeDetectionStrategy.OnPush
{{ '}' }})

// Benefits:
// - Skip unnecessary checks
// - Much better performance
// - Forces immutable data patterns
// - Works perfectly with Signals

// ⚠️ GOTCHA: Object mutation won't trigger!
// this.data.name = 'new'; // ❌ Won't detect!
// this.data = {{ '{' }}...this.data, name: 'new'{{ '}' }}; // ✅ New reference
                    </code></pre>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>OnPush Best Practices</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// RULE 1: Always use immutable data patterns
// ❌ BAD (mutation - OnPush won't detect)
this.wells.push(newWell);
this.user.name = 'Updated';

// ✅ GOOD (new reference)
this.wells = [...this.wells, newWell];
this.user = {{ '{' }} ...this.user, name: 'Updated' {{ '}' }};

// RULE 2: Use async pipe OR signals in templates
// ✅ async pipe triggers markForCheck automatically
// {{ '{{ data$ | async }}' }}

// ✅ Signals trigger CD automatically in OnPush
// {{ '{{ dataSignal() }}' }}

// RULE 3: If you MUST trigger CD manually
import {{ '{' }} ChangeDetectorRef {{ '}' }} from '&#64;angular/core';
private cdr = inject(ChangeDetectorRef);
this.cdr.markForCheck();  // Mark for next CD cycle
this.cdr.detectChanges(); // Run CD immediately (use sparingly!)

// RULE 4: Use trackBy/track for lists
// Prevents re-creating DOM elements when array changes
&#64;for (item of items(); track item.id) {{ '{' }} ... {{ '}' }}

// RULE 5: Avoid function calls in templates (use computed/pipes instead)
// ❌ BAD: {{ '{{ calculateTotal(items) }}' }} - runs every CD cycle!
// ✅ GOOD: {{ '{{ total() }}' }} (computed signal) or {{ '{{ items | totalPipe }}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Future: Zoneless Angular</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Angular is moving towards removing Zone.js entirely!
// Signals enable this because they provide explicit change tracking.

// Experimental zoneless mode (Angular 18+):
// In app.config.ts:
export const appConfig: ApplicationConfig = {{ '{' }}
  providers: [
    provideExperimentalZonelessChangeDetection(), // No more Zone.js!
    // Instead of: provideZoneChangeDetection()
  ]
{{ '}' }};

// With zoneless:
// - Only Signals and async pipe trigger CD
// - setTimeout/setInterval DON'T trigger CD
// - Manual markForCheck() still works
// - Much smaller bundle (no zone.js ~15KB)
// - Better performance (no monkey-patching)

// This is WHY learning Signals is important for the future!
                </code></pre>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 3: DEFERRABLE VIEWS & PERFORMANCE
             ============================================================ -->
        <mat-tab label="@defer & Performance">
          <div class="tab-content">
            <h2>Deferrable Views & Performance Optimization</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>&#64;defer - Lazy Loading in Templates</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// &#64;defer lazily loads component code (JavaScript) on demand
// Perfect for heavy components that aren't immediately needed

// ===== TRIGGER: on viewport (when scrolled into view) =====
&#64;defer (on viewport) {{ '{' }}
  &lt;app-heavy-chart [data]="chartData()" /&gt;
{{ '}' }} &#64;placeholder {{ '{' }}
  &lt;div class="placeholder"&gt;Chart loads when visible&lt;/div&gt;
{{ '}' }} &#64;loading (after 100ms; minimum 500ms) {{ '{' }}
  &lt;app-spinner /&gt;
{{ '}' }} &#64;error {{ '{' }}
  &lt;p&gt;Failed to load chart component&lt;/p&gt;
{{ '}' }}

// ===== TRIGGER: on idle (when browser is idle) =====
&#64;defer (on idle) {{ '{' }}
  &lt;app-analytics-widget /&gt;
{{ '}' }}

// ===== TRIGGER: on interaction (click, focus, etc.) =====
&#64;defer (on interaction) {{ '{' }}
  &lt;app-advanced-editor /&gt;
{{ '}' }} &#64;placeholder {{ '{' }}
  &lt;button&gt;Click to load editor&lt;/button&gt;
{{ '}' }}

// ===== TRIGGER: on hover =====
&#64;defer (on hover) {{ '{' }}
  &lt;app-tooltip-content /&gt;
{{ '}' }}

// ===== TRIGGER: on timer =====
&#64;defer (on timer(3000)) {{ '{' }}
  &lt;app-ads-banner /&gt;  &lt;!-- Load after 3 seconds --&gt;
{{ '}' }}

// ===== TRIGGER: when (condition) =====
&#64;defer (when showAdvanced()) {{ '{' }}
  &lt;app-advanced-settings /&gt;
{{ '}' }}

// ===== PREFETCH: Load code early, render later =====
&#64;defer (on viewport; prefetch on idle) {{ '{' }}
  &lt;app-heavy-component /&gt;
  &lt;!-- Code loaded when idle, rendered when in viewport --&gt;
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Content Projection (ng-content)</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Content Projection = "Slots" (like Vue/Web Components slots)
// Parent passes content INTO child component

// ===== BASIC PROJECTION =====
// card.component.ts
&#64;Component({{ '{' }}
  selector: 'app-card',
  template: \`
    &lt;div class="card"&gt;
      &lt;ng-content&gt;&lt;/ng-content&gt;  &lt;!-- default slot --&gt;
    &lt;/div&gt;
  \`
{{ '}' }})

// Usage:
// &lt;app-card&gt;
//   &lt;p&gt;This content is projected!&lt;/p&gt;
// &lt;/app-card&gt;

// ===== MULTI-SLOT PROJECTION =====
&#64;Component({{ '{' }}
  selector: 'app-panel',
  template: \`
    &lt;div class="panel"&gt;
      &lt;header&gt;
        &lt;ng-content select="[panel-header]"&gt;&lt;/ng-content&gt;
      &lt;/header&gt;
      &lt;main&gt;
        &lt;ng-content&gt;&lt;/ng-content&gt;  &lt;!-- default --&gt;
      &lt;/main&gt;
      &lt;footer&gt;
        &lt;ng-content select="[panel-footer]"&gt;&lt;/ng-content&gt;
      &lt;/footer&gt;
    &lt;/div&gt;
  \`
{{ '}' }})

// Usage:
// &lt;app-panel&gt;
//   &lt;div panel-header&gt;My Title&lt;/div&gt;
//   &lt;p&gt;Body content (default slot)&lt;/p&gt;
//   &lt;div panel-footer&gt;Footer here&lt;/div&gt;
// &lt;/app-panel&gt;

// ===== CONDITIONAL PROJECTION (ng-template) =====
&#64;Component({{ '{' }}
  template: \`
    &#64;if (contentAvailable) {{ '{' }}
      &lt;ng-content&gt;&lt;/ng-content&gt;
    {{ '}' }} &#64;else {{ '{' }}
      &lt;p&gt;No content provided&lt;/p&gt;
    {{ '}' }}
  \`
{{ '}' }})
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Performance Optimization Checklist</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="checklist">
                  <h4>🏎️ Bundle Size</h4>
                  <ul>
                    <li>✅ Lazy load routes (loadComponent / loadChildren)</li>
                    <li>✅ Use &#64;defer for heavy below-fold components</li>
                    <li>✅ Tree-shake unused code (standalone components help)</li>
                    <li>✅ Analyze bundle: <code>ng build --stats-json</code></li>
                    <li>✅ Set budgets in angular.json</li>
                  </ul>

                  <h4>🎯 Runtime Performance</h4>
                  <ul>
                    <li>✅ Use OnPush change detection EVERYWHERE</li>
                    <li>✅ Use <code>track</code> in &#64;for loops</li>
                    <li>✅ Use Signals instead of getters/methods in templates</li>
                    <li>✅ Use pure pipes instead of methods in templates</li>
                    <li>✅ Virtual scrolling for large lists (CDK)</li>
                    <li>✅ Debounce rapid events (input, scroll, resize)</li>
                    <li>✅ Unsubscribe from observables (prevent memory leaks)</li>
                  </ul>

                  <h4>🖼️ Rendering</h4>
                  <ul>
                    <li>✅ Use CSS containment (<code>contain: content</code>)</li>
                    <li>✅ Minimize DOM depth</li>
                    <li>✅ Use <code>&#64;if</code> to remove hidden elements vs <code>[hidden]</code></li>
                    <li>✅ Image lazy loading: <code>&lt;img loading="lazy"&gt;</code></li>
                    <li>✅ Preconnect to API domains</li>
                  </ul>

                  <h4>📡 Network</h4>
                  <ul>
                    <li>✅ HTTP caching with shareReplay</li>
                    <li>✅ Pagination instead of loading all data</li>
                    <li>✅ WebSocket for real-time (avoid polling)</li>
                    <li>✅ Compress API responses (gzip/brotli)</li>
                    <li>✅ Service Worker for offline/caching</li>
                  </ul>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>ViewEncapsulation Modes</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
import {{ '{' }} ViewEncapsulation {{ '}' }} from '&#64;angular/core';

// Emulated (DEFAULT) - Styles scoped via attribute selectors
// Adds _ngcontent-xxx attributes to elements
&#64;Component({{ '{' }}
  encapsulation: ViewEncapsulation.Emulated // default
{{ '}' }})

// None - Styles are GLOBAL (no encapsulation)
// Useful for overriding 3rd party styles
&#64;Component({{ '{' }}
  encapsulation: ViewEncapsulation.None
{{ '}' }})

// ShadowDom - Uses native Shadow DOM
// True isolation, but limited browser support for older browsers
&#64;Component({{ '{' }}
  encapsulation: ViewEncapsulation.ShadowDom
{{ '}' }})

// 💡 Interview: "How does Angular scope component styles?"
// → Emulated mode adds unique attributes (_nghost, _ngcontent)
//   to both the component elements and the CSS selectors
//   e.g., .my-class[_ngcontent-abc123] {{ '{' }} color: red; {{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 4: NEW ANGULAR APIs
             ============================================================ -->
        <mat-tab label="New APIs">
          <div class="tab-content">
            <h2>New Angular APIs (v16-18)</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>afterRender / afterNextRender</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// Replaces many ngAfterViewInit use cases
// Runs after Angular has rendered the component to DOM

import {{ '{' }} afterNextRender, afterRender {{ '}' }} from '&#64;angular/core';

&#64;Component({{ '{' }}...{{ '}' }})
export class ChartComponent {{ '{' }}
  constructor() {{ '{' }}
    // Runs ONCE after first render (like ngAfterViewInit but SSR-safe)
    afterNextRender(() => {{ '{' }}
      // Safe to access DOM here
      this.initChart();
    {{ '}' }});

    // Runs after EVERY render (like ngAfterViewChecked but better)
    afterRender(() => {{ '{' }}
      this.updateChartSize();
    {{ '}' }});
  {{ '}' }}
{{ '}' }}

// Why better than lifecycle hooks?
// - SSR safe (doesn't run on server)
// - Runs in correct phase (read/write DOM)
// - Can specify phase: {{ '{' }} phase: AfterRenderPhase.Read {{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>DestroyRef & takeUntilDestroyed</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
import {{ '{' }} inject, DestroyRef {{ '}' }} from '&#64;angular/core';
import {{ '{' }} takeUntilDestroyed {{ '}' }} from '&#64;angular/core/rxjs-interop';

&#64;Component({{ '{' }}...{{ '}' }})
export class DataComponent {{ '{' }}
  private destroyRef = inject(DestroyRef);

  // In injection context (constructor/field initializer):
  data$ = this.http.get('/api').pipe(
    takeUntilDestroyed() // No need to pass destroyRef!
  );

  ngOnInit() {{ '{' }}
    // Outside injection context - pass destroyRef explicitly:
    interval(5000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refresh());

    // Register custom cleanup logic:
    this.destroyRef.onDestroy(() => {{ '{' }}
      console.log('Component destroyed!');
      this.cleanup();
    {{ '}' }});
  {{ '}' }}
{{ '}' }}

// 🔴 OLD WAY:
// private destroy$ = new Subject&lt;void&gt;();
// .pipe(takeUntil(this.destroy$))
// ngOnDestroy() {{ '{' }} this.destroy$.next(); this.destroy$.complete(); {{ '}' }}

// 🟢 NEW WAY: takeUntilDestroyed() - so much cleaner!
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Router Input Binding</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block"><code>
// app.config.ts: Enable with withComponentInputBinding()
provideRouter(routes, withComponentInputBinding())

// Route: {{ '{' }} path: 'wells/:id', component: WellDetailComponent {{ '}' }}
// URL: /wells/well-001?tab=logs

// 🔴 OLD WAY:
&#64;Component({{ '{' }}...{{ '}' }})
export class WellDetailComponent implements OnInit {{ '{' }}
  constructor(private route: ActivatedRoute) {{ '}' }}

  ngOnInit() {{ '{' }}
    // Route params
    this.route.params.subscribe(p => this.wellId = p['id']);
    // Query params
    this.route.queryParams.subscribe(q => this.tab = q['tab']);
    // Route data (from resolver)
    this.route.data.subscribe(d => this.well = d['well']);
  {{ '}' }}
{{ '}' }}

// 🟢 NEW WAY: Auto-bound to inputs!
&#64;Component({{ '{' }}...{{ '}' }})
export class WellDetailComponent {{ '{' }}
  id = input&lt;string&gt;();        // Auto-bound from :id param!
  tab = input&lt;string&gt;();       // Auto-bound from ?tab query param!
  well = input&lt;Well&gt;();        // Auto-bound from resolver data!

  // Use with effect to react to changes:
  constructor() {{ '{' }}
    effect(() => {{ '{' }}
      const wellId = this.id();
      if (wellId) this.loadWell(wellId);
    {{ '}' }});
  {{ '}' }}
{{ '}' }}
                </code></pre>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card summary-card">
              <mat-card-header>
                <mat-card-title>📋 Angular Evolution Summary</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table class="reference-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Introduced</th>
                      <th>Replaces</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Standalone Components</td><td>v14</td><td>NgModules</td></tr>
                    <tr><td>inject() function</td><td>v14</td><td>Constructor DI</td></tr>
                    <tr><td>Typed Forms</td><td>v14</td><td>Untyped FormGroup</td></tr>
                    <tr><td>Functional Guards</td><td>v15</td><td>Class-based Guards</td></tr>
                    <tr><td>Functional Interceptors</td><td>v15</td><td>Class-based Interceptors</td></tr>
                    <tr><td>Signals</td><td>v16</td><td>BehaviorSubject (for sync state)</td></tr>
                    <tr><td>takeUntilDestroyed</td><td>v16</td><td>takeUntil + Subject pattern</td></tr>
                    <tr><td>input() / output()</td><td>v17</td><td>&#64;Input() / &#64;Output()</td></tr>
                    <tr><td>&#64;if / &#64;for / &#64;switch</td><td>v17</td><td>*ngIf / *ngFor / ngSwitch</td></tr>
                    <tr><td>&#64;defer</td><td>v17</td><td>Manual lazy loading</td></tr>
                    <tr><td>viewChild() signal</td><td>v17</td><td>&#64;ViewChild decorator</td></tr>
                    <tr><td>model() two-way</td><td>v17</td><td>&#64;Input + &#64;Output combo</td></tr>
                    <tr><td>Zoneless (experimental)</td><td>v18</td><td>Zone.js</td></tr>
                  </tbody>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .advanced-container { max-width: 1000px; margin: 0 auto; }
    h1 { margin-bottom: 4px; }
    .subtitle { color: #666; margin-bottom: 24px; }
    .intro { color: #555; margin-bottom: 16px; font-size: 14px; }
    .tab-content { padding: 24px 0; }

    .concept-card { margin-bottom: 16px; }
    .summary-card { border: 2px solid #1a237e; }

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

    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 12px 0;
    }

    .old-way, .new-way {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      h4 { margin: 0 0 8px; font-size: 13px; }
      pre { margin: 0; font-size: 11px; overflow-x: auto;
        code { white-space: pre; }
      }
    }
    .old-way { border-left: 3px solid #f44336; }
    .new-way { border-left: 3px solid #4caf50; }

    .live-demo {
      background: #e8f5e9;
      border-radius: 8px;
      padding: 12px;
      margin-top: 12px;
      h4 { margin: 0 0 8px; color: #2e7d32; }
    }

    .cd-explanation {
      h4 { margin: 16px 0 8px; }
      ul, ol { padding-left: 20px; font-size: 13px;
        li { margin-bottom: 4px; }
      }
    }

    .checklist {
      h4 { margin: 16px 0 8px; }
      ul { padding-left: 20px;
        li { margin-bottom: 6px; font-size: 13px;
          code { background: #f5f5f5; padding: 1px 4px; border-radius: 3px; }
        }
      }
    }

    .reference-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #eee; }
      th { background: #f5f5f5; font-weight: 600; }
      tr:hover td { background: #f8f9fa; }
    }

    @media (max-width: 768px) {
      .comparison { grid-template-columns: 1fr; }
    }
  `]
})
export class AdvancedOverviewComponent {

  // ===== LIVE DEMO STATE =====

  counter = signal(0);
  depthMeters = signal(3500);
  depthFeet = computed(() => this.depthMeters() * 3.28084);
  isDeepWell = computed(() => this.depthMeters() > 4000);

  effectRunCount = signal(0);
  private effectTrigger = signal(0);

  constructor() {
    // Demo effect
    effect(() => {
      const trigger = this.effectTrigger();
      if (trigger > 0) {
        this.effectRunCount.update(c => c + 1);
        console.log(`[Effect Demo] Triggered! Count: ${this.effectRunCount()}`);
      }
    });
  }

  triggerEffect(): void {
    this.effectTrigger.update(v => v + 1);
  }
}
