/**
 * =============================================================================
 * BASICS OVERVIEW - Comprehensive Angular Basics Learning Module
 * =============================================================================
 *
 * 📘 File ini mencover SEMUA konsep dasar Angular dalam satu component,
 * lengkap dengan perbandingan OLD vs NEW syntax.
 *
 * TOPICS COVERED:
 * 1. Component Basics & Decorators
 * 2. Data Binding (4 types)
 * 3. Structural Directives (*ngIf, *ngFor → @if, @for)
 * 4. Pipes (built-in)
 * 5. Lifecycle Hooks
 * 6. Template Reference Variables
 * 7. Component Communication (Input/Output)
 * 8. Services & Dependency Injection basics
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
  inject,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

// ===========================================================================
// CHILD COMPONENT DEMO (Dumb/Presentational Component)
// ===========================================================================

/**
 * 📘 KONSEP: Dumb/Presentational Component
 *
 * Component yang HANYA menerima data via input dan emit events via output.
 * Tidak tahu tentang services atau state management.
 */
@Component({
  selector: 'app-well-status-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      📘 KONSEP: Data Binding di Template

      1. INTERPOLATION: {{ expression }}
         - One-way: Component → Template
         - Untuk display text values

      2. PROPERTY BINDING: [property]="expression"
         - One-way: Component → Template
         - Untuk set DOM properties / directive inputs

      3. EVENT BINDING: (event)="handler($event)"
         - One-way: Template → Component
         - Untuk handle user events

      4. TWO-WAY BINDING: [(ngModel)]="property"
         - Two-way: Component ↔ Template
         - Shorthand for [ngModel]="property" (ngModelChange)="property = $event"
    -->
    <mat-card class="well-status-card" [class.active]="isActive()">
      <!-- 1. INTERPOLATION: {{ }} -->
      <mat-card-header>
        <mat-card-title>{{ wellName() }}</mat-card-title>
        <mat-card-subtitle>Status: {{ status() }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <!-- 2. PROPERTY BINDING: [] -->
        <p [style.color]="statusColor()">
          Depth: {{ depth() }}m
        </p>
      </mat-card-content>

      <mat-card-actions>
        <!-- 3. EVENT BINDING: () -->
        <button mat-button (click)="onViewDetails()">
          View Details
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .well-status-card {
      transition: border 0.3s;
      &.active { border-left: 4px solid #4caf50; }
    }
  `]
})
export class WellStatusCardComponent {
  /**
   * ============ PERBANDINGAN: @Input/@Output vs input()/output() ============
   *
   * 🔴 OLD WAY:
   * @Input() wellName: string = '';
   * @Input() status: string = '';
   * @Input() depth: number = 0;
   * @Output() viewDetails = new EventEmitter<string>();
   *
   * 🟢 NEW WAY (Angular 17+):
   */
  wellName = input<string>('Unknown');
  status = input<string>('unknown');
  depth = input<number>(0);
  viewDetails = output<string>();

  // Computed: Derive status color from status input
  statusColor = computed(() => {
    switch (this.status()) {
      case 'drilling': return '#4caf50';
      case 'producing': return '#2196f3';
      case 'suspended': return '#ff9800';
      default: return '#666';
    }
  });

  isActive = computed(() =>
    this.status() === 'drilling' || this.status() === 'producing'
  );

  onViewDetails(): void {
    this.viewDetails.emit(this.wellName());
  }
}

// ===========================================================================
// MAIN BASICS COMPONENT
// ===========================================================================

@Component({
  selector: 'app-basics-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    WellStatusCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="basics-container">
      <h1>01 - Angular Basics</h1>
      <p class="subtitle">Fundamental concepts dengan perbandingan Old vs New syntax</p>

      <mat-tab-group>
        <!-- ============================================================
             TAB 1: DATA BINDING
             ============================================================ -->
        <mat-tab label="Data Binding">
          <div class="tab-content">
            <h2>4 Types of Data Binding</h2>

            <!-- 1. INTERPOLATION -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>1. Interpolation {{ '{' }}{{ '{' }} {{ '}' }}{{ '}' }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Direction:</strong> Component → Template (one-way)</p>
                <p><strong>Use:</strong> Display values in text content</p>
                <div class="example">
                  <p>Well Name: <strong>{{ wellName() }}</strong></p>
                  <p>Current Depth: <strong>{{ currentDepth() }}m</strong></p>
                  <p>Expression: <strong>{{ currentDepth() * 3.28084 | number:'1.2-2' }} ft</strong></p>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- 2. PROPERTY BINDING -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>2. Property Binding [property]</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Direction:</strong> Component → Template (one-way)</p>
                <p><strong>Use:</strong> Set element/component properties dynamically</p>
                <div class="example">
                  <button mat-raised-button [disabled]="isLoading()" [color]="buttonColor()">
                    {{ isLoading() ? 'Loading...' : 'Click Me' }}
                  </button>
                  <img [src]="'https://via.placeholder.com/50'" [alt]="wellName()" style="margin-left:8px">
                </div>
              </mat-card-content>
            </mat-card>

            <!-- 3. EVENT BINDING -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>3. Event Binding (event)</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Direction:</strong> Template → Component (one-way)</p>
                <p><strong>Use:</strong> React to user events</p>
                <div class="example">
                  <button mat-raised-button (click)="incrementDepth()">
                    Increase Depth (+10m)
                  </button>
                  <button mat-raised-button (click)="decrementDepth()">
                    Decrease Depth (-10m)
                  </button>
                  <p>Current: {{ currentDepth() }}m</p>
                  <p class="hint">Click count: {{ clickCount() }}</p>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- 4. TWO-WAY BINDING -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>4. Two-way Binding [(ngModel)]</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p><strong>Direction:</strong> Component ↔ Template (two-way)</p>
                <p><strong>Use:</strong> Form inputs that need to sync with component state</p>
                <div class="example">
                  <!--
                    📘 Two-way binding = Property binding + Event binding combined
                    [(ngModel)]="x" === [ngModel]="x" (ngModelChange)="x = $event"
                  -->
                  <input [(ngModel)]="twoWayValue"
                    placeholder="Type here..."
                    style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                  <p>Live value: <strong>{{ twoWayValue }}</strong></p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 2: CONTROL FLOW (OLD vs NEW)
             ============================================================ -->
        <mat-tab label="Control Flow">
          <div class="tab-content">
            <h2>Control Flow: Old vs New Syntax</h2>

            <!-- @if vs *ngIf -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Conditional Rendering</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparison">
                  <div class="old-way">
                    <h4>🔴 OLD: *ngIf / *ngIf...else</h4>
                    <pre><code>
&lt;div *ngIf="isConnected; else offlineTemplate"&gt;
  Connected!
&lt;/div&gt;
&lt;ng-template #offlineTemplate&gt;
  Offline
&lt;/ng-template&gt;
                    </code></pre>
                  </div>
                  <div class="new-way">
                    <h4>🟢 NEW: &#64;if / &#64;else</h4>
                    <pre><code>
&#64;if (isConnected()) {{ '{' }}
  &lt;div&gt;Connected!&lt;/div&gt;
{{ '}' }} &#64;else {{ '{' }}
  &lt;div&gt;Offline&lt;/div&gt;
{{ '}' }}
                    </code></pre>
                  </div>
                </div>
                <div class="live-demo">
                  <h4>Live Demo:</h4>
                  <button mat-button (click)="toggleConnection()">
                    Toggle Connection
                  </button>
                  @if (isConnected()) {
                    <span class="status-connected">🟢 Connected</span>
                  } @else {
                    <span class="status-offline">🔴 Offline</span>
                  }
                </div>
              </mat-card-content>
            </mat-card>

            <!-- @for vs *ngFor -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>List Rendering</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparison">
                  <div class="old-way">
                    <h4>🔴 OLD: *ngFor with trackBy</h4>
                    <pre><code>
&lt;div *ngFor="let well of wells;
              trackBy: trackByUid;
              let i = index;
              let first = first;
              let last = last"&gt;
  #{{ '{' }}{{ '{' }}i{{ '}' }}{{ '}' }}: {{ '{' }}{{ '{' }}well.name{{ '}' }}{{ '}' }}
&lt;/div&gt;

// Di component:
trackByUid(index: number, well: any) {{ '{' }}
  return well.uid;
{{ '}' }}
                    </code></pre>
                  </div>
                  <div class="new-way">
                    <h4>🟢 NEW: &#64;for with track (REQUIRED)</h4>
                    <pre><code>
&#64;for (well of wells(); track well.uid;
      let i = $index, first = $first,
      last = $last, count = $count) {{ '{' }}
  &lt;div&gt;#{{ '{' }}{{ '{' }}i{{ '}' }}{{ '}' }}: {{ '{' }}{{ '{' }}well.name{{ '}' }}{{ '}' }}&lt;/div&gt;
{{ '}' }} &#64;empty {{ '{' }}
  &lt;div&gt;No wells found&lt;/div&gt;
{{ '}' }}
                    </code></pre>
                  </div>
                </div>
                <div class="live-demo">
                  <h4>Live Demo:</h4>
                  @for (well of demoWells(); track well.uid; let i = $index) {
                    <div class="list-item">
                      <span>#{{ i + 1 }}</span>
                      <strong>{{ well.name }}</strong>
                      <span class="badge">{{ well.status }}</span>
                    </div>
                  } @empty {
                    <p>No wells to display</p>
                  }
                  <button mat-button (click)="addDemoWell()">+ Add Well</button>
                  <button mat-button (click)="clearDemoWells()">Clear All</button>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- @switch vs [ngSwitch] -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Switch/Case</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparison">
                  <div class="old-way">
                    <h4>🔴 OLD: [ngSwitch]</h4>
                    <pre><code>
&lt;div [ngSwitch]="status"&gt;
  &lt;p *ngSwitchCase="'drilling'"&gt;Drilling...&lt;/p&gt;
  &lt;p *ngSwitchCase="'producing'"&gt;Producing&lt;/p&gt;
  &lt;p *ngSwitchDefault&gt;Unknown&lt;/p&gt;
&lt;/div&gt;
                    </code></pre>
                  </div>
                  <div class="new-way">
                    <h4>🟢 NEW: &#64;switch</h4>
                    <pre><code>
&#64;switch (status()) {{ '{' }}
  &#64;case ('drilling') {{ '{' }}
    &lt;p&gt;Drilling...&lt;/p&gt;
  {{ '}' }}
  &#64;case ('producing') {{ '{' }}
    &lt;p&gt;Producing&lt;/p&gt;
  {{ '}' }}
  &#64;default {{ '{' }}
    &lt;p&gt;Unknown&lt;/p&gt;
  {{ '}' }}
{{ '}' }}
                    </code></pre>
                  </div>
                </div>
                <div class="live-demo">
                  <h4>Live Demo:</h4>
                  <select [(ngModel)]="currentStatus" style="padding:4px">
                    <option value="drilling">Drilling</option>
                    <option value="producing">Producing</option>
                    <option value="suspended">Suspended</option>
                    <option value="abandoned">Abandoned</option>
                  </select>
                  @switch (currentStatus) {
                    @case ('drilling') { <span class="status-badge drilling">⛏️ Actively Drilling</span> }
                    @case ('producing') { <span class="status-badge producing">💧 Producing Oil/Gas</span> }
                    @case ('suspended') { <span class="status-badge suspended">⏸️ Temporarily Suspended</span> }
                    @case ('abandoned') { <span class="status-badge abandoned">❌ Abandoned</span> }
                    @default { <span>Unknown Status</span> }
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 3: LIFECYCLE HOOKS
             ============================================================ -->
        <mat-tab label="Lifecycle Hooks">
          <div class="tab-content">
            <h2>Component Lifecycle Hooks</h2>
            <mat-card class="concept-card">
              <mat-card-content>
                <div class="lifecycle-diagram">
                  <div class="hook-item">
                    <strong>constructor()</strong>
                    <span>DI only. Don't put logic here.</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item">
                    <strong>ngOnChanges(changes)</strong>
                    <span>Called when &#64;Input() values change. Receives SimpleChanges object.</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item highlight">
                    <strong>ngOnInit()</strong>
                    <span>⭐ Most used! Component initialized. Inputs available. Fetch data here.</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item">
                    <strong>ngDoCheck()</strong>
                    <span>Custom change detection. Called every CD cycle. Use carefully!</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item">
                    <strong>ngAfterContentInit()</strong>
                    <span>After ng-content projected. Once only.</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item">
                    <strong>ngAfterContentChecked()</strong>
                    <span>After projected content checked.</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item">
                    <strong>ngAfterViewInit()</strong>
                    <span>After component's view & children initialized. Access ViewChild here.</span>
                  </div>
                  <div class="hook-arrow">↓</div>
                  <div class="hook-item">
                    <strong>ngAfterViewChecked()</strong>
                    <span>After view & children checked.</span>
                  </div>
                  <div class="hook-arrow">↓ (on destroy)</div>
                  <div class="hook-item highlight-red">
                    <strong>ngOnDestroy()</strong>
                    <span>⭐ Cleanup! Unsubscribe observables, detach listeners, clear timers.</span>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <h3 style="margin-top:16px">💡 Interview Tips:</h3>
                <ul class="tips-list">
                  <li><strong>ngOnInit vs constructor:</strong> Constructor = DI setup. ngOnInit = initialization logic (inputs ready, services available)</li>
                  <li><strong>ngOnDestroy:</strong> ALWAYS unsubscribe from observables to prevent memory leaks</li>
                  <li><strong>ngOnChanges:</strong> Only called for &#64;Input() decorated properties, not for signal inputs</li>
                  <li><strong>Signal equivalent:</strong> effect() replaces many lifecycle hook use cases</li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 4: COMPONENT COMMUNICATION
             ============================================================ -->
        <mat-tab label="Component Comm">
          <div class="tab-content">
            <h2>Component Communication Patterns</h2>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Parent → Child (Input)</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparison">
                  <div class="old-way">
                    <h4>🔴 OLD: &#64;Input() decorator</h4>
                    <pre><code>
// Child:
&#64;Input() wellName: string = '';
&#64;Input() depth!: number; // required (no default)

// Parent template:
&lt;app-child [wellName]="name" [depth]="3500"&gt;
                    </code></pre>
                  </div>
                  <div class="new-way">
                    <h4>🟢 NEW: input() signal function</h4>
                    <pre><code>
// Child:
wellName = input&lt;string&gt;('');        // optional
depth = input.required&lt;number&gt;();    // required!

// Access in code: this.wellName()
// Computed: status = computed(() =>
//   this.depth() > 4000 ? 'deep' : 'shallow');

// Parent template (same):
&lt;app-child [wellName]="name" [depth]="3500"&gt;
                    </code></pre>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Child → Parent (Output)</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="comparison">
                  <div class="old-way">
                    <h4>🔴 OLD: &#64;Output() + EventEmitter</h4>
                    <pre><code>
// Child:
&#64;Output() wellSelected = new EventEmitter&lt;string&gt;();

onClick() {{ '{' }}
  this.wellSelected.emit(this.wellName);
{{ '}' }}

// Parent:
&lt;app-child (wellSelected)="onSelect($event)"&gt;
                    </code></pre>
                  </div>
                  <div class="new-way">
                    <h4>🟢 NEW: output() function</h4>
                    <pre><code>
// Child:
wellSelected = output&lt;string&gt;();

onClick() {{ '{' }}
  this.wellSelected.emit(this.wellName());
{{ '}' }}

// Parent (same):
&lt;app-child (wellSelected)="onSelect($event)"&gt;
                    </code></pre>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Live Demo -->
            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Live Demo: Parent-Child Communication</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="hint">Parent sends data down, child emits events up:</p>
                <div class="demo-grid">
                  @for (well of demoWells(); track well.uid) {
                    <app-well-status-card
                      [wellName]="well.name"
                      [status]="well.status"
                      [depth]="well.depth"
                      (viewDetails)="onWellSelected($event)" />
                  }
                </div>
                @if (selectedWellName()) {
                  <p class="selected-info">
                    📍 Selected: <strong>{{ selectedWellName() }}</strong>
                  </p>
                }
              </mat-card-content>
            </mat-card>

            <mat-card class="concept-card">
              <mat-card-header>
                <mat-card-title>Other Communication Patterns</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <ul class="patterns-list">
                  <li>
                    <strong>ViewChild/viewChild():</strong>
                    Parent accesses child component instance directly
                  </li>
                  <li>
                    <strong>Service (Shared State):</strong>
                    Unrelated components communicate via shared service (BehaviorSubject/Signal)
                  </li>
                  <li>
                    <strong>Content Projection (ng-content):</strong>
                    Parent passes template content to child
                  </li>
                  <li>
                    <strong>NgRx Store:</strong>
                    Global state management for complex apps
                  </li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- ============================================================
             TAB 5: PIPES
             ============================================================ -->
        <mat-tab label="Pipes">
          <div class="tab-content">
            <h2>Built-in & Custom Pipes</h2>
            <mat-card class="concept-card">
              <mat-card-content>
                <h3>Common Built-in Pipes:</h3>
                <div class="pipes-demo">
                  <div class="pipe-item">
                    <code>| date</code>
                    <span>{{ today | date:'medium' }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| number</code>
                    <span>{{ 3500.567 | number:'1.0-2' }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| currency</code>
                    <span>{{ 1500000 | currency:'USD':'symbol':'1.0-0' }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| uppercase</code>
                    <span>{{ 'drilling' | uppercase }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| lowercase</code>
                    <span>{{ 'PRODUCING' | lowercase }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| titlecase</code>
                    <span>{{ 'well monitoring system' | titlecase }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| percent</code>
                    <span>{{ 0.85 | percent:'1.0-1' }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| json</code>
                    <span>{{ { name: 'Well-1', depth: 3500 } | json }}</span>
                  </div>
                  <div class="pipe-item">
                    <code>| slice</code>
                    <span>{{ 'Kalimantan Deep-1' | slice:0:10 }}...</span>
                  </div>
                  <div class="pipe-item">
                    <code>| async</code>
                    <span>Unwraps Observable/Promise in template (auto-unsubscribes!)</span>
                  </div>
                </div>

                <h3 style="margin-top:16px">💡 Pipe Tips:</h3>
                <ul class="tips-list">
                  <li>Pipes are <strong>pure by default</strong> - only re-evaluate when input reference changes</li>
                  <li><strong>async pipe</strong> is the most important - handles subscription & unsubscription</li>
                  <li>Chain pipes: <code>{{ '{{ value | pipe1 | pipe2 }}' }}</code></li>
                  <li>Custom pipes: implement PipeTransform interface</li>
                </ul>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .basics-container { max-width: 1000px; margin: 0 auto; }
    h1 { margin-bottom: 4px; }
    .subtitle { color: #666; margin-bottom: 24px; }

    .tab-content { padding: 24px 0; }

    .concept-card {
      margin-bottom: 16px;
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
      pre {
        margin: 0;
        font-size: 11px;
        overflow-x: auto;
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

    .example {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      margin-top: 8px;
    }

    .hint { font-size: 12px; color: #999; margin-top: 4px; }

    .list-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid #eee;
    }

    .badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      background: #e3f2fd;
      color: #1565c0;
    }

    .lifecycle-diagram {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .hook-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 6px;

      strong { min-width: 200px; font-family: monospace; font-size: 13px; }
      span { font-size: 12px; color: #555; }

      &.highlight { background: #e8f5e9; border-left: 3px solid #4caf50; }
      &.highlight-red { background: #fbe9e7; border-left: 3px solid #f44336; }
    }

    .hook-arrow { text-align: center; color: #999; font-size: 12px; }

    .tips-list {
      padding-left: 20px;
      li { margin-bottom: 8px; font-size: 13px; }
    }

    .patterns-list {
      padding-left: 20px;
      li { margin-bottom: 12px; font-size: 13px; }
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin: 12px 0;
    }

    .selected-info {
      background: #e3f2fd;
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 8px;
    }

    .pipes-demo {
      display: grid;
      gap: 8px;
    }

    .pipe-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 13px;

      code {
        font-weight: 600;
        min-width: 120px;
        color: #1565c0;
      }
    }

    .status-connected { color: #2e7d32; font-weight: 500; }
    .status-offline { color: #d32f2f; font-weight: 500; }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-left: 8px;

      &.drilling { background: #e8f5e9; color: #2e7d32; }
      &.producing { background: #e3f2fd; color: #1565c0; }
      &.suspended { background: #fff3e0; color: #e65100; }
      &.abandoned { background: #fbe9e7; color: #d32f2f; }
    }

    @media (max-width: 768px) {
      .comparison { grid-template-columns: 1fr; }
    }
  `]
})
export class BasicsOverviewComponent implements OnInit, OnDestroy {

  // ===== STATE (Signals - NEW WAY) =====
  wellName = signal('Kalimantan Deep-1');
  currentDepth = signal(3500);
  isLoading = signal(false);
  isConnected = signal(true);
  clickCount = signal(0);
  selectedWellName = signal('');
  buttonColor = signal<'primary' | 'accent' | 'warn'>('primary');

  // Two-way binding value (still uses plain property for ngModel)
  twoWayValue = '';
  currentStatus = 'drilling';
  today = new Date();

  // Demo wells
  demoWells = signal([
    { uid: '1', name: 'Kalimantan Deep-1', status: 'drilling', depth: 3500 },
    { uid: '2', name: 'Java Sea Explorer-3', status: 'producing', depth: 4200 },
    { uid: '3', name: 'Sumatra Light-7', status: 'suspended', depth: 2800 }
  ]);

  // Computed example
  depthInFeet = computed(() => this.currentDepth() * 3.28084);

  // ===== LIFECYCLE =====

  ngOnInit(): void {
    console.log('[BasicsOverview] ngOnInit - Component initialized');
  }

  ngOnDestroy(): void {
    console.log('[BasicsOverview] ngOnDestroy - Cleanup');
  }

  // ===== METHODS =====

  incrementDepth(): void {
    this.currentDepth.update(d => d + 10);
    this.clickCount.update(c => c + 1);
  }

  decrementDepth(): void {
    this.currentDepth.update(d => Math.max(0, d - 10));
    this.clickCount.update(c => c + 1);
  }

  toggleConnection(): void {
    this.isConnected.update(v => !v);
  }

  addDemoWell(): void {
    const id = Date.now().toString();
    this.demoWells.update(wells => [
      ...wells,
      { uid: id, name: `New Well-${wells.length + 1}`, status: 'drilling', depth: Math.round(Math.random() * 5000) }
    ]);
  }

  clearDemoWells(): void {
    this.demoWells.set([]);
  }

  onWellSelected(name: string): void {
    this.selectedWellName.set(name);
  }
}
