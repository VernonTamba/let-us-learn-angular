import{a as T,b as W,c as U}from"./chunk-AZI7E3VA.js";import{b as w}from"./chunk-IMRT547Z.js";import"./chunk-ZVVVXWQ5.js";import"./chunk-6PM257O5.js";import"./chunk-YQ7P3KZS.js";import{a as R,b as k,c as I,f as _,h as A}from"./chunk-ZI6LJQEP.js";import{ia as O,ja as M,na as P}from"./chunk-CQFEL3YN.js";import"./chunk-CARY4E7O.js";import{$c as b,Gb as t,Hb as n,Hc as h,Jc as D,Nb as c,Za as i,Zb as e,_b as l,ac as m,bc as x,cc as S,dd as y,gc as g,hc as r,ia as f,ib as d,mc as E,qc as C,sc as v}from"./chunk-SNN6NJCK.js";import"./chunk-4CLCTAJ7.js";var K=(()=>{class s{constructor(){this.counter=d(0),this.depthMeters=d(3500),this.depthFeet=h(()=>this.depthMeters()*3.28084),this.isDeepWell=h(()=>this.depthMeters()>4e3),this.effectRunCount=d(0),this.effectTrigger=d(0),D(()=>{this.effectTrigger()>0&&(this.effectRunCount.update(o=>o+1),console.log(`[Effect Demo] Triggered! Count: ${this.effectRunCount()}`))})}triggerEffect(){this.effectTrigger.update(p=>p+1)}static{this.\u0275fac=function(o){return new(o||s)}}static{this.\u0275cmp=f({type:s,selectors:[["app-advanced-overview"]],standalone:!0,features:[E],decls:403,vars:137,consts:[[1,"advanced-container"],[1,"subtitle"],["label","Signals"],[1,"tab-content"],[1,"intro"],[1,"concept-card"],[1,"code-block"],[1,"live-demo"],["mat-raised-button","",3,"click"],["label","Change Detection"],[1,"cd-explanation"],[1,"comparison"],[1,"old-way"],[1,"new-way"],["label","@defer & Performance"],[1,"checklist"],["label","New APIs"],[1,"concept-card","summary-card"],[1,"reference-table"]],template:function(o,a){o&1&&(t(0,"div",0)(1,"h1"),e(2,"03 - Advanced Angular"),n(),t(3,"p",1),e(4,"Signals, Change Detection, Performance, New APIs"),n(),t(5,"mat-tab-group")(6,"mat-tab",2)(7,"div",3)(8,"h2"),e(9,"Angular Signals - New Reactivity System"),n(),t(10,"p",4),e(11," Signals adalah primitive baru untuk reactive state management di Angular 16+. Mereka lebih sederhana dari RxJS untuk synchronous state dan memungkinkan fine-grained change detection. "),n(),t(12,"mat-card",5)(13,"mat-card-header")(14,"mat-card-title"),e(15,"signal() - Writable Signal"),n()(),t(16,"mat-card-content")(17,"pre",6)(18,"code"),e(19),n()(),t(20,"div",7)(21,"h4"),e(22,"Live Demo:"),n(),t(23,"p"),e(24,"Counter: "),t(25,"strong"),e(26),n()(),t(27,"button",8),c("click",function(){return a.counter.set(a.counter()+1)}),e(28," Increment "),n(),t(29,"button",8),c("click",function(){return a.counter.set(0)}),e(30," Reset "),n()()()(),t(31,"mat-card",5)(32,"mat-card-header")(33,"mat-card-title"),e(34,"computed() - Derived/Computed Signal"),n()(),t(35,"mat-card-content")(36,"pre",6)(37,"code"),e(38),n()(),t(39,"div",7)(40,"h4"),e(41,"Live Demo: Well Depth Calculator"),n(),t(42,"p"),e(43,"Depth (m): "),t(44,"strong"),e(45),n()(),t(46,"p"),e(47,"Depth (ft): "),t(48,"strong"),e(49),C(50,"number"),n(),e(51," (computed)"),n(),t(52,"p"),e(53,"Is Deep Well: "),t(54,"strong"),e(55),n(),e(56," (computed)"),n(),t(57,"button",8),c("click",function(){return a.depthMeters.set(a.depthMeters()+100)}),e(58," Drill +100m "),n()()()(),t(59,"mat-card",5)(60,"mat-card-header")(61,"mat-card-title"),e(62,"effect() - Side Effects"),n()(),t(63,"mat-card-content")(64,"pre",6)(65,"code"),e(66),n()(),t(67,"div",7)(68,"h4"),e(69,"Live Demo: Effect logs to console"),n(),t(70,"p"),e(71,"Effect run count: "),t(72,"strong"),e(73),n()(),t(74,"p"),e(75,"Check browser console for effect output!"),n(),t(76,"button",8),c("click",function(){return a.triggerEffect()}),e(77," Trigger Effect "),n()()()(),t(78,"mat-card",5)(79,"mat-card-header")(80,"mat-card-title"),e(81,"Signal-based Component APIs"),n()(),t(82,"mat-card-content")(83,"pre",6)(84,"code"),e(85),n()()()(),t(86,"mat-card",5)(87,"mat-card-header")(88,"mat-card-title"),e(89,"Signal \u2194 RxJS Interop"),n()(),t(90,"mat-card-content")(91,"pre",6)(92,"code"),e(93),n()()()()()(),t(94,"mat-tab",9)(95,"div",3)(96,"h2"),e(97,"Change Detection Deep Dive"),n(),t(98,"mat-card",5)(99,"mat-card-header")(100,"mat-card-title"),e(101,"How Change Detection Works"),n()(),t(102,"mat-card-content")(103,"div",10)(104,"h4"),e(105,"What triggers Change Detection?"),n(),t(106,"ul")(107,"li"),e(108,"DOM events (click, input, submit, etc.)"),n(),t(109,"li"),e(110,"HTTP responses"),n(),t(111,"li"),e(112,"Timer/interval callbacks (setTimeout, setInterval)"),n(),t(113,"li"),e(114,"Promise resolutions"),n(),t(115,"li"),e(116,"Any async operation patched by Zone.js"),n()(),t(117,"h4"),e(118,"What happens during CD?"),n(),t(119,"ol")(120,"li"),e(121,"Angular checks the component tree TOP-DOWN"),n(),t(122,"li"),e(123,"For each component, compares current values with previous"),n(),t(124,"li"),e(125,"If different \u2192 update the DOM"),n(),t(126,"li"),e(127,"With Default strategy: checks ALL components"),n(),t(128,"li"),e(129,"With OnPush: only checks if inputs change or events occur"),n()()()()(),t(130,"mat-card",5)(131,"mat-card-header")(132,"mat-card-title"),e(133,"Default vs OnPush Strategy"),n()(),t(134,"mat-card-content")(135,"div",11)(136,"div",12)(137,"h4"),e(138,"Default (ChangeDetectionStrategy.Default)"),n(),t(139,"pre")(140,"code"),e(141),n()()(),t(142,"div",13)(143,"h4"),e(144,"OnPush (ChangeDetectionStrategy.OnPush)"),n(),t(145,"pre")(146,"code"),e(147),n()()()()()(),t(148,"mat-card",5)(149,"mat-card-header")(150,"mat-card-title"),e(151,"OnPush Best Practices"),n()(),t(152,"mat-card-content")(153,"pre",6)(154,"code"),e(155),n()()()(),t(156,"mat-card",5)(157,"mat-card-header")(158,"mat-card-title"),e(159,"Future: Zoneless Angular"),n()(),t(160,"mat-card-content")(161,"pre",6)(162,"code"),e(163),n()()()()()(),t(164,"mat-tab",14)(165,"div",3)(166,"h2"),e(167,"Deferrable Views & Performance Optimization"),n(),t(168,"mat-card",5)(169,"mat-card-header")(170,"mat-card-title"),e(171,"@defer - Lazy Loading in Templates"),n()(),t(172,"mat-card-content")(173,"pre",6)(174,"code"),e(175),n()()()(),t(176,"mat-card",5)(177,"mat-card-header")(178,"mat-card-title"),e(179,"Content Projection (ng-content)"),n()(),t(180,"mat-card-content")(181,"pre",6)(182,"code"),e(183),n()()()(),t(184,"mat-card",5)(185,"mat-card-header")(186,"mat-card-title"),e(187,"Performance Optimization Checklist"),n()(),t(188,"mat-card-content")(189,"div",15)(190,"h4"),e(191,"\u{1F3CE}\uFE0F Bundle Size"),n(),t(192,"ul")(193,"li"),e(194,"\u2705 Lazy load routes (loadComponent / loadChildren)"),n(),t(195,"li"),e(196,"\u2705 Use @defer for heavy below-fold components"),n(),t(197,"li"),e(198,"\u2705 Tree-shake unused code (standalone components help)"),n(),t(199,"li"),e(200,"\u2705 Analyze bundle: "),t(201,"code"),e(202,"ng build --stats-json"),n()(),t(203,"li"),e(204,"\u2705 Set budgets in angular.json"),n()(),t(205,"h4"),e(206,"\u{1F3AF} Runtime Performance"),n(),t(207,"ul")(208,"li"),e(209,"\u2705 Use OnPush change detection EVERYWHERE"),n(),t(210,"li"),e(211,"\u2705 Use "),t(212,"code"),e(213,"track"),n(),e(214," in @for loops"),n(),t(215,"li"),e(216,"\u2705 Use Signals instead of getters/methods in templates"),n(),t(217,"li"),e(218,"\u2705 Use pure pipes instead of methods in templates"),n(),t(219,"li"),e(220,"\u2705 Virtual scrolling for large lists (CDK)"),n(),t(221,"li"),e(222,"\u2705 Debounce rapid events (input, scroll, resize)"),n(),t(223,"li"),e(224,"\u2705 Unsubscribe from observables (prevent memory leaks)"),n()(),t(225,"h4"),e(226,"\u{1F5BC}\uFE0F Rendering"),n(),t(227,"ul")(228,"li"),e(229,"\u2705 Use CSS containment ("),t(230,"code"),e(231,"contain: content"),n(),e(232,")"),n(),t(233,"li"),e(234,"\u2705 Minimize DOM depth"),n(),t(235,"li"),e(236,"\u2705 Use "),t(237,"code"),e(238,"@if"),n(),e(239," to remove hidden elements vs "),t(240,"code"),e(241,"[hidden]"),n()(),t(242,"li"),e(243,"\u2705 Image lazy loading: "),t(244,"code"),e(245,'<img loading="lazy">'),n()(),t(246,"li"),e(247,"\u2705 Preconnect to API domains"),n()(),t(248,"h4"),e(249,"\u{1F4E1} Network"),n(),t(250,"ul")(251,"li"),e(252,"\u2705 HTTP caching with shareReplay"),n(),t(253,"li"),e(254,"\u2705 Pagination instead of loading all data"),n(),t(255,"li"),e(256,"\u2705 WebSocket for real-time (avoid polling)"),n(),t(257,"li"),e(258,"\u2705 Compress API responses (gzip/brotli)"),n(),t(259,"li"),e(260,"\u2705 Service Worker for offline/caching"),n()()()()(),t(261,"mat-card",5)(262,"mat-card-header")(263,"mat-card-title"),e(264,"ViewEncapsulation Modes"),n()(),t(265,"mat-card-content")(266,"pre",6)(267,"code"),e(268),n()()()()()(),t(269,"mat-tab",16)(270,"div",3)(271,"h2"),e(272,"New Angular APIs (v16-18)"),n(),t(273,"mat-card",5)(274,"mat-card-header")(275,"mat-card-title"),e(276,"afterRender / afterNextRender"),n()(),t(277,"mat-card-content")(278,"pre",6)(279,"code"),e(280),n()()()(),t(281,"mat-card",5)(282,"mat-card-header")(283,"mat-card-title"),e(284,"DestroyRef & takeUntilDestroyed"),n()(),t(285,"mat-card-content")(286,"pre",6)(287,"code"),e(288),n()()()(),t(289,"mat-card",5)(290,"mat-card-header")(291,"mat-card-title"),e(292,"Router Input Binding"),n()(),t(293,"mat-card-content")(294,"pre",6)(295,"code"),e(296),n()()()(),t(297,"mat-card",17)(298,"mat-card-header")(299,"mat-card-title"),e(300,"\u{1F4CB} Angular Evolution Summary"),n()(),t(301,"mat-card-content")(302,"table",18)(303,"thead")(304,"tr")(305,"th"),e(306,"Feature"),n(),t(307,"th"),e(308,"Introduced"),n(),t(309,"th"),e(310,"Replaces"),n()()(),t(311,"tbody")(312,"tr")(313,"td"),e(314,"Standalone Components"),n(),t(315,"td"),e(316,"v14"),n(),t(317,"td"),e(318,"NgModules"),n()(),t(319,"tr")(320,"td"),e(321,"inject() function"),n(),t(322,"td"),e(323,"v14"),n(),t(324,"td"),e(325,"Constructor DI"),n()(),t(326,"tr")(327,"td"),e(328,"Typed Forms"),n(),t(329,"td"),e(330,"v14"),n(),t(331,"td"),e(332,"Untyped FormGroup"),n()(),t(333,"tr")(334,"td"),e(335,"Functional Guards"),n(),t(336,"td"),e(337,"v15"),n(),t(338,"td"),e(339,"Class-based Guards"),n()(),t(340,"tr")(341,"td"),e(342,"Functional Interceptors"),n(),t(343,"td"),e(344,"v15"),n(),t(345,"td"),e(346,"Class-based Interceptors"),n()(),t(347,"tr")(348,"td"),e(349,"Signals"),n(),t(350,"td"),e(351,"v16"),n(),t(352,"td"),e(353,"BehaviorSubject (for sync state)"),n()(),t(354,"tr")(355,"td"),e(356,"takeUntilDestroyed"),n(),t(357,"td"),e(358,"v16"),n(),t(359,"td"),e(360,"takeUntil + Subject pattern"),n()(),t(361,"tr")(362,"td"),e(363,"input() / output()"),n(),t(364,"td"),e(365,"v17"),n(),t(366,"td"),e(367,"@Input() / @Output()"),n()(),t(368,"tr")(369,"td"),e(370,"@if / @for / @switch"),n(),t(371,"td"),e(372,"v17"),n(),t(373,"td"),e(374,"*ngIf / *ngFor / ngSwitch"),n()(),t(375,"tr")(376,"td"),e(377,"@defer"),n(),t(378,"td"),e(379,"v17"),n(),t(380,"td"),e(381,"Manual lazy loading"),n()(),t(382,"tr")(383,"td"),e(384,"viewChild() signal"),n(),t(385,"td"),e(386,"v17"),n(),t(387,"td"),e(388,"@ViewChild decorator"),n()(),t(389,"tr")(390,"td"),e(391,"model() two-way"),n(),t(392,"td"),e(393,"v17"),n(),t(394,"td"),e(395,"@Input + @Output combo"),n()(),t(396,"tr")(397,"td"),e(398,"Zoneless (experimental)"),n(),t(399,"td"),e(400,"v18"),n(),t(401,"td"),e(402,"Zone.js"),n()()()()()()()()()()),o&2&&(i(19),x(`
import `,"{"," signal ","}",` from '@angular/core';

// Create a signal with initial value
const count = signal(0);
const name = signal('Well-1');
const wells = signal<Well[]>([]);

// READ: Call the signal like a function
console.log(count());    // 0
console.log(name());     // 'Well-1'

// WRITE: Three methods
count.set(5);            // Replace value entirely
count.update(c => c + 1); // Update based on current value
wells.update(w => [...w, newWell]); // Immutable update for arrays/objects

// In template: `,"{{ count() }}",` - signals auto-track dependencies
                `),i(7),l(a.counter()),i(12),m(`
import `,"{"," signal, computed ","}",` from '@angular/core';

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
                `),i(7),l(a.depthMeters()),i(4),l(v(50,134,a.depthFeet(),"1.1-1")),i(6),l(a.isDeepWell()),i(11),g(`
import `,"{"," signal, effect, untracked ","}",` from '@angular/core';

const wellStatus = signal('drilling');
const depth = signal(3500);

// Effect: runs whenever tracked signals change
effect(() => `,"{",`
  // This re-runs whenever wellStatus() or depth() change
  console.log('Status:', wellStatus(), 'Depth:', depth());

  // Side effects: save to localStorage, analytics, logging
  localStorage.setItem('lastStatus', wellStatus());
`,"}",`);

// untracked(): Read signal WITHOUT creating dependency
effect(() => `,"{",`
  console.log('Status changed:', wellStatus());
  // Read depth but DON'T re-run effect when depth changes
  const d = untracked(() => depth());
  console.log('Current depth (not tracked):', d);
`,"}",`);

// Cleanup function (like useEffect return in React)
effect((onCleanup) => `,"{",`
  const timer = setInterval(() => pollData(), 5000);
  onCleanup(() => clearInterval(timer));
`,"}",`);
                `),i(7),l(a.effectRunCount()),i(12),m(`
// ======= INPUT SIGNALS =======
// \u{1F534} OLD: @Input() name: string = '';
// \u{1F7E2} NEW:
name = input<string>('default');           // Optional with default
title = input.required<string>();           // Required (compile error if missing)
count = input(0, `,"{",`                        // With transform
  transform: (v: string | number) => Number(v)
`,"}",`);

// ======= OUTPUT SIGNALS =======
// \u{1F534} OLD: @Output() clicked = new EventEmitter<string>();
// \u{1F7E2} NEW:
clicked = output<string>();
// Emit: this.clicked.emit('hello');

// ======= MODEL SIGNALS (Two-way binding) =======
// \u{1F7E2} NEWEST: model() for two-way binding
value = model(0);  // Creates [(value)] binding
// Parent: <child [(value)]="parentSignal" />
// Child can: this.value.set(newVal) \u2192 updates parent too!

// ======= VIEW QUERIES =======
// \u{1F534} OLD: @ViewChild('myRef') myRef!: ElementRef;
// \u{1F7E2} NEW:
myRef = viewChild<ElementRef>('myRef');           // Optional
myReqRef = viewChild.required<ElementRef>('req'); // Required
items = viewChildren(ItemComponent);               // Multiple

// \u{1F534} OLD: @ContentChild() / @ContentChildren()
// \u{1F7E2} NEW:
header = contentChild<TemplateRef<unknown>>('header');
tabs = contentChildren(TabComponent);
                `),i(8),g(`
import `,"{"," toSignal, toObservable ","}",` from '@angular/core/rxjs-interop';

// Observable \u2192 Signal
const data$ = this.http.get<Data>('/api/data');
const dataSignal = toSignal(data$, `,"{",`
  initialValue: null,  // Required (signal needs initial value)
  // OR: requireSync: true (if observable emits synchronously)
`,"}",`);

// Signal \u2192 Observable
const count = signal(0);
const count$ = toObservable(count);
count$.subscribe(value => console.log('Count changed:', value));

// takeUntilDestroyed (Angular 16+) - auto cleanup!
import `,"{"," takeUntilDestroyed ","}",` from '@angular/core/rxjs-interop';

// In constructor or field initializer (injection context):
this.http.get('/api').pipe(
  takeUntilDestroyed()  // Auto-unsubscribes on component destroy!
).subscribe();

// Outside injection context (e.g., ngOnInit):
private destroyRef = inject(DestroyRef);
ngOnInit() `,"{",`
  interval(1000).pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe();
`,"}",`
                `),i(48),m(`
// Checks component on EVERY CD cycle
// Even if nothing changed
@Component(`,"{",`
  changeDetection: ChangeDetectionStrategy.Default
`,"}",`)

// When CD runs:
// - ALL bindings are evaluated
// - ALL child components are checked
// - More re-renders = slower

// Problems:
// - Unnecessary DOM updates
// - Performance issues with large trees
// - Expressions in template run every cycle
                    `),i(6),S(`
// Only checks when:
// 1. @Input() reference changes (immutable!)
// 2. Event handler in this component fires
// 3. Async pipe emits new value
// 4. Signal value changes (Angular 17+)
// 5. Manual: markForCheck()

@Component(`,"{",`
  changeDetection: ChangeDetectionStrategy.OnPush
`,"}",`)

// Benefits:
// - Skip unnecessary checks
// - Much better performance
// - Forces immutable data patterns
// - Works perfectly with Signals

// \u26A0\uFE0F GOTCHA: Object mutation won't trigger!
// this.data.name = 'new'; // \u274C Won't detect!
// this.data = `,"{","...this.data, name: 'new'","}",`; // \u2705 New reference
                    `),i(8),r([`
// RULE 1: Always use immutable data patterns
// \u274C BAD (mutation - OnPush won't detect)
this.wells.push(newWell);
this.user.name = 'Updated';

// \u2705 GOOD (new reference)
this.wells = [...this.wells, newWell];
this.user = `,"{"," ...this.user, name: 'Updated' ","}",`;

// RULE 2: Use async pipe OR signals in templates
// \u2705 async pipe triggers markForCheck automatically
// `,"{{ data$ | async }}",`

// \u2705 Signals trigger CD automatically in OnPush
// `,"{{ dataSignal() }}",`

// RULE 3: If you MUST trigger CD manually
import `,"{"," ChangeDetectorRef ","}",` from '@angular/core';
private cdr = inject(ChangeDetectorRef);
this.cdr.markForCheck();  // Mark for next CD cycle
this.cdr.detectChanges(); // Run CD immediately (use sparingly!)

// RULE 4: Use trackBy/track for lists
// Prevents re-creating DOM elements when array changes
@for (item of items(); track item.id) `,"{"," ... ","}",`

// RULE 5: Avoid function calls in templates (use computed/pipes instead)
// \u274C BAD: `,"{{ calculateTotal(items) }}",` - runs every CD cycle!
// \u2705 GOOD: `,"{{ total() }}"," (computed signal) or ","{{ items | totalPipe }}",`
                `]),i(8),m(`
// Angular is moving towards removing Zone.js entirely!
// Signals enable this because they provide explicit change tracking.

// Experimental zoneless mode (Angular 18+):
// In app.config.ts:
export const appConfig: ApplicationConfig = `,"{",`
  providers: [
    provideExperimentalZonelessChangeDetection(), // No more Zone.js!
    // Instead of: provideZoneChangeDetection()
  ]
`,"}",`;

// With zoneless:
// - Only Signals and async pipe trigger CD
// - setTimeout/setInterval DON'T trigger CD
// - Manual markForCheck() still works
// - Much smaller bundle (no zone.js ~15KB)
// - Better performance (no monkey-patching)

// This is WHY learning Signals is important for the future!
                `),i(12),r([`
// @defer lazily loads component code (JavaScript) on demand
// Perfect for heavy components that aren't immediately needed

// ===== TRIGGER: on viewport (when scrolled into view) =====
@defer (on viewport) `,"{",`
  <app-heavy-chart [data]="chartData()" />
`,"}"," @placeholder ","{",`
  <div class="placeholder">Chart loads when visible</div>
`,"}"," @loading (after 100ms; minimum 500ms) ","{",`
  <app-spinner />
`,"}"," @error ","{",`
  <p>Failed to load chart component</p>
`,"}",`

// ===== TRIGGER: on idle (when browser is idle) =====
@defer (on idle) `,"{",`
  <app-analytics-widget />
`,"}",`

// ===== TRIGGER: on interaction (click, focus, etc.) =====
@defer (on interaction) `,"{",`
  <app-advanced-editor />
`,"}"," @placeholder ","{",`
  <button>Click to load editor</button>
`,"}",`

// ===== TRIGGER: on hover =====
@defer (on hover) `,"{",`
  <app-tooltip-content />
`,"}",`

// ===== TRIGGER: on timer =====
@defer (on timer(3000)) `,"{",`
  <app-ads-banner />  <!-- Load after 3 seconds -->
`,"}",`

// ===== TRIGGER: when (condition) =====
@defer (when showAdvanced()) `,"{",`
  <app-advanced-settings />
`,"}",`

// ===== PREFETCH: Load code early, render later =====
@defer (on viewport; prefetch on idle) `,"{",`
  <app-heavy-component />
  <!-- Code loaded when idle, rendered when in viewport -->
`,"}",`
                `]),i(8),r([`
// Content Projection = "Slots" (like Vue/Web Components slots)
// Parent passes content INTO child component

// ===== BASIC PROJECTION =====
// card.component.ts
@Component(`,"{",`
  selector: 'app-card',
  template: \`
    <div class="card">
      <ng-content></ng-content>  <!-- default slot -->
    </div>
  \`
`,"}",`)

// Usage:
// <app-card>
//   <p>This content is projected!</p>
// </app-card>

// ===== MULTI-SLOT PROJECTION =====
@Component(`,"{",`
  selector: 'app-panel',
  template: \`
    <div class="panel">
      <header>
        <ng-content select="[panel-header]"></ng-content>
      </header>
      <main>
        <ng-content></ng-content>  <!-- default -->
      </main>
      <footer>
        <ng-content select="[panel-footer]"></ng-content>
      </footer>
    </div>
  \`
`,"}",`)

// Usage:
// <app-panel>
//   <div panel-header>My Title</div>
//   <p>Body content (default slot)</p>
//   <div panel-footer>Footer here</div>
// </app-panel>

// ===== CONDITIONAL PROJECTION (ng-template) =====
@Component(`,"{",`
  template: \`
    @if (contentAvailable) `,"{",`
      <ng-content></ng-content>
    `,"}"," @else ","{",`
      <p>No content provided</p>
    `,"}",`
  \`
`,"}",`)
                `]),i(85),r([`
import `,"{"," ViewEncapsulation ","}",` from '@angular/core';

// Emulated (DEFAULT) - Styles scoped via attribute selectors
// Adds _ngcontent-xxx attributes to elements
@Component(`,"{",`
  encapsulation: ViewEncapsulation.Emulated // default
`,"}",`)

// None - Styles are GLOBAL (no encapsulation)
// Useful for overriding 3rd party styles
@Component(`,"{",`
  encapsulation: ViewEncapsulation.None
`,"}",`)

// ShadowDom - Uses native Shadow DOM
// True isolation, but limited browser support for older browsers
@Component(`,"{",`
  encapsulation: ViewEncapsulation.ShadowDom
`,"}",`)

// \u{1F4A1} Interview: "How does Angular scope component styles?"
// \u2192 Emulated mode adds unique attributes (_nghost, _ngcontent)
//   to both the component elements and the CSS selectors
//   e.g., .my-class[_ngcontent-abc123] `,"{"," color: red; ","}",`
                `]),i(12),r([`
// Replaces many ngAfterViewInit use cases
// Runs after Angular has rendered the component to DOM

import `,"{"," afterNextRender, afterRender ","}",` from '@angular/core';

@Component(`,"{","...","}",`)
export class ChartComponent `,"{",`
  constructor() `,"{",`
    // Runs ONCE after first render (like ngAfterViewInit but SSR-safe)
    afterNextRender(() => `,"{",`
      // Safe to access DOM here
      this.initChart();
    `,"}",`);

    // Runs after EVERY render (like ngAfterViewChecked but better)
    afterRender(() => `,"{",`
      this.updateChartSize();
    `,"}",`);
  `,"}",`
`,"}",`

// Why better than lifecycle hooks?
// - SSR safe (doesn't run on server)
// - Runs in correct phase (read/write DOM)
// - Can specify phase: `,"{"," phase: AfterRenderPhase.Read ","}",`
                `]),i(8),r([`
import `,"{"," inject, DestroyRef ","}",` from '@angular/core';
import `,"{"," takeUntilDestroyed ","}",` from '@angular/core/rxjs-interop';

@Component(`,"{","...","}",`)
export class DataComponent `,"{",`
  private destroyRef = inject(DestroyRef);

  // In injection context (constructor/field initializer):
  data$ = this.http.get('/api').pipe(
    takeUntilDestroyed() // No need to pass destroyRef!
  );

  ngOnInit() `,"{",`
    // Outside injection context - pass destroyRef explicitly:
    interval(5000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.refresh());

    // Register custom cleanup logic:
    this.destroyRef.onDestroy(() => `,"{",`
      console.log('Component destroyed!');
      this.cleanup();
    `,"}",`);
  `,"}",`
`,"}",`

// \u{1F534} OLD WAY:
// private destroy$ = new Subject<void>();
// .pipe(takeUntil(this.destroy$))
// ngOnDestroy() `,"{"," this.destroy$.next(); this.destroy$.complete(); ","}",`

// \u{1F7E2} NEW WAY: takeUntilDestroyed() - so much cleaner!
                `]),i(8),r([`
// app.config.ts: Enable with withComponentInputBinding()
provideRouter(routes, withComponentInputBinding())

// Route: `,"{"," path: 'wells/:id', component: WellDetailComponent ","}",`
// URL: /wells/well-001?tab=logs

// \u{1F534} OLD WAY:
@Component(`,"{","...","}",`)
export class WellDetailComponent implements OnInit `,"{",`
  constructor(private route: ActivatedRoute) `,"}",`

  ngOnInit() `,"{",`
    // Route params
    this.route.params.subscribe(p => this.wellId = p['id']);
    // Query params
    this.route.queryParams.subscribe(q => this.tab = q['tab']);
    // Route data (from resolver)
    this.route.data.subscribe(d => this.well = d['well']);
  `,"}",`
`,"}",`

// \u{1F7E2} NEW WAY: Auto-bound to inputs!
@Component(`,"{","...","}",`)
export class WellDetailComponent `,"{",`
  id = input<string>();        // Auto-bound from :id param!
  tab = input<string>();       // Auto-bound from ?tab query param!
  well = input<Well>();        // Auto-bound from resolver data!

  // Use with effect to react to changes:
  constructor() `,"{",`
    effect(() => `,"{",`
      const wellId = this.id();
      if (wellId) this.loadWell(wellId);
    `,"}",`);
  `,"}",`
`,"}",`
                `]))},dependencies:[y,b,A,R,I,_,k,P,M,O,U,T,W,w],styles:[".advanced-container[_ngcontent-%COMP%]{max-width:1000px;margin:0 auto}h1[_ngcontent-%COMP%]{margin-bottom:4px}.subtitle[_ngcontent-%COMP%]{color:#666;margin-bottom:24px}.intro[_ngcontent-%COMP%]{color:#555;margin-bottom:16px;font-size:14px}.tab-content[_ngcontent-%COMP%]{padding:24px 0}.concept-card[_ngcontent-%COMP%]{margin-bottom:16px}.summary-card[_ngcontent-%COMP%]{border:2px solid #1a237e}.code-block[_ngcontent-%COMP%]{background:#1e1e1e;color:#d4d4d4;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;line-height:1.5}.code-block[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{white-space:pre;font-family:Consolas,monospace}.comparison[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0}.old-way[_ngcontent-%COMP%], .new-way[_ngcontent-%COMP%]{background:#f8f9fa;border-radius:8px;padding:12px}.old-way[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .new-way[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:0 0 8px;font-size:13px}.old-way[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%], .new-way[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]{margin:0;font-size:11px;overflow-x:auto}.old-way[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], .new-way[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{white-space:pre}.old-way[_ngcontent-%COMP%]{border-left:3px solid #f44336}.new-way[_ngcontent-%COMP%]{border-left:3px solid #4caf50}.live-demo[_ngcontent-%COMP%]{background:#e8f5e9;border-radius:8px;padding:12px;margin-top:12px}.live-demo[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:0 0 8px;color:#2e7d32}.cd-explanation[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:16px 0 8px}.cd-explanation[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], .cd-explanation[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]{padding-left:20px;font-size:13px}.cd-explanation[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], .cd-explanation[_ngcontent-%COMP%]   ol[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-bottom:4px}.checklist[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{margin:16px 0 8px}.checklist[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding-left:20px}.checklist[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-bottom:6px;font-size:13px}.checklist[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:#f5f5f5;padding:1px 4px;border-radius:3px}.reference-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:12px}.reference-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .reference-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:8px 12px;text-align:left;border-bottom:1px solid #eee}.reference-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background:#f5f5f5;font-weight:600}.reference-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%]{background:#f8f9fa}@media (max-width: 768px){.comparison[_ngcontent-%COMP%]{grid-template-columns:1fr}}"],changeDetection:0})}}return s})();export{K as AdvancedOverviewComponent};
