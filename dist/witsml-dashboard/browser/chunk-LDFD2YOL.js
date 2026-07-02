import{a as C,b as M,c as P}from"./chunk-AZI7E3VA.js";import{c as y}from"./chunk-DBUVICIC.js";import{b as h}from"./chunk-IMRT547Z.js";import"./chunk-YLISNWIS.js";import"./chunk-ZVVVXWQ5.js";import"./chunk-6PM257O5.js";import"./chunk-YQ7P3KZS.js";import{a as b,b as x,c as v,d as E,f as w,h as f}from"./chunk-ZI6LJQEP.js";import"./chunk-FMONLWTG.js";import{ia as g,na as S}from"./chunk-CQFEL3YN.js";import"./chunk-CARY4E7O.js";import{Gb as n,Hb as e,Za as a,Zb as t,ac as i,dd as p,ec as s,fc as m,gc as c,hc as o,ia as d,mc as u}from"./chunk-SNN6NJCK.js";import"./chunk-4CLCTAJ7.js";var U=(()=>{class r{static{this.\u0275fac=function(l){return new(l||r)}}static{this.\u0275cmp=d({type:r,selectors:[["app-intermediate-overview"]],standalone:!0,features:[u],decls:432,vars:77,consts:[[1,"intermediate-container"],[1,"subtitle"],["label","RxJS Operators"],[1,"tab-content"],[1,"intro"],[1,"concept-card"],[1,"operator-info"],[1,"code-block"],[1,"warning"],[1,"concept-card","summary-card"],[1,"reference-table"],["label","Subjects"],[1,"tip"],["label","State Management"],["label","HTTP Patterns"],["label","RxJS Recipes"]],template:function(l,W){l&1&&(n(0,"div",0)(1,"h1"),t(2,"02 - Intermediate Angular"),e(),n(3,"p",1),t(4,"RxJS Mastery, State Management, HTTP Patterns"),e(),n(5,"mat-tab-group")(6,"mat-tab",2)(7,"div",3)(8,"h2"),t(9,"Higher-Order Mapping Operators"),e(),n(10,"p",4),t(11,' Ini adalah operator yang paling penting dan paling sering ditanya di interview. Mereka meng-handle "Observable of Observables" (inner subscriptions). '),e(),n(12,"mat-card",5)(13,"mat-card-header")(14,"mat-card-title"),t(15,"switchMap"),e(),n(16,"mat-card-subtitle"),t(17,"Cancel previous, take latest only"),e()(),n(18,"mat-card-content")(19,"div",6)(20,"p")(21,"strong"),t(22,"Behavior:"),e(),t(23," Ketika source emit, cancel inner observable sebelumnya dan subscribe ke yang baru."),e(),n(24,"p")(25,"strong"),t(26,"Use Case:"),e(),t(27," Search autocomplete, route parameter changes, dropdown selection"),e(),n(28,"p")(29,"strong"),t(30,"Analogy:"),e(),t(31," Seperti remote TV - saat ganti channel, channel lama langsung berhenti."),e()(),n(32,"pre",7)(33,"code"),t(34,`
// Search autocomplete - cancel pending request saat user ketik lagi
this.searchControl.valueChanges.pipe(
  debounceTime(300),           // Wait 300ms after last keystroke
  distinctUntilChanged(),       // Only if value actually changed
  switchMap(term =>             // Cancel previous API call!
    this.wellService.search(term)
  )
).subscribe(results => this.results = results);

// Route params - well detail page
this.route.params.pipe(
  switchMap(params =>           // Cancel if user navigates to different well
    this.wellService.getWellById(params['id'])
  )
).subscribe(well => this.well = well);
                `),e()()()(),n(35,"mat-card",5)(36,"mat-card-header")(37,"mat-card-title"),t(38,"mergeMap (flatMap)"),e(),n(39,"mat-card-subtitle"),t(40,"Run all in parallel, don't cancel"),e()(),n(41,"mat-card-content")(42,"div",6)(43,"p")(44,"strong"),t(45,"Behavior:"),e(),t(46," Subscribe ke semua inner observables secara parallel. Tidak ada yang di-cancel."),e(),n(47,"p")(48,"strong"),t(49,"Use Case:"),e(),t(50," Parallel API calls, file uploads, actions yang independent"),e(),n(51,"p")(52,"strong"),t(53,"Analogy:"),e(),t(54," Seperti multithread - semua berjalan bersamaan."),e(),n(55,"p",8),t(56,"\u26A0\uFE0F Hati-hati memory leak! Bisa subscribe tanpa batas."),e()(),n(57,"pre",7)(58,"code"),t(59,`
// Upload multiple files in parallel
this.filesToUpload$.pipe(
  mergeMap(file =>
    this.uploadService.upload(file),
    3  // concurrency limit = max 3 simultaneous uploads
  )
).subscribe(result => console.log('Uploaded:', result));

// Fetch data for multiple wells simultaneously
of('well-001', 'well-002', 'well-003').pipe(
  mergeMap(wellId => this.wellService.getWellById(wellId))
).subscribe(well => this.wells.push(well));
                `),e()()()(),n(60,"mat-card",5)(61,"mat-card-header")(62,"mat-card-title"),t(63,"concatMap"),e(),n(64,"mat-card-subtitle"),t(65,"Queue & execute one by one (sequential)"),e()(),n(66,"mat-card-content")(67,"div",6)(68,"p")(69,"strong"),t(70,"Behavior:"),e(),t(71," Queue inner observables. Tunggu yang sebelumnya selesai baru mulai yang berikutnya."),e(),n(72,"p")(73,"strong"),t(74,"Use Case:"),e(),t(75," Sequential API calls, ordered operations, dependent requests"),e(),n(76,"p")(77,"strong"),t(78,"Analogy:"),e(),t(79," Seperti antrian - satu per satu sesuai urutan."),e()(),n(80,"pre",7)(81,"code"),t(82),e()()()(),n(83,"mat-card",5)(84,"mat-card-header")(85,"mat-card-title"),t(86,"exhaustMap"),e(),n(87,"mat-card-subtitle"),t(88,"Ignore new while current is running"),e()(),n(89,"mat-card-content")(90,"div",6)(91,"p")(92,"strong"),t(93,"Behavior:"),e(),t(94," Ignore source emissions selama inner observable masih active."),e(),n(95,"p")(96,"strong"),t(97,"Use Case:"),e(),t(98," Login button, form submit, prevent double-click"),e(),n(99,"p")(100,"strong"),t(101,"Analogy:"),e(),t(102," Seperti elevator - ignore button press saat elevator masih bergerak."),e()(),n(103,"pre",7)(104,"code"),t(105,`
// Prevent double-submit
this.submitButton$.pipe(
  exhaustMap(() =>
    this.reportService.generateReport(this.formData)
    // Clicks during generation are IGNORED
  )
).subscribe(report => this.showReport(report));

// Login - ignore repeated clicks
this.loginClicks$.pipe(
  exhaustMap(() =>
    this.authService.login(this.credentials)
  )
).subscribe();
                `),e()()()(),n(106,"mat-card",9)(107,"mat-card-header")(108,"mat-card-title"),t(109,"\u{1F4CB} Quick Reference: When to Use Which?"),e()(),n(110,"mat-card-content")(111,"table",10)(112,"thead")(113,"tr")(114,"th"),t(115,"Operator"),e(),n(116,"th"),t(117,"Previous Inner"),e(),n(118,"th"),t(119,"New Emissions"),e(),n(120,"th"),t(121,"Use When"),e()()(),n(122,"tbody")(123,"tr")(124,"td")(125,"strong"),t(126,"switchMap"),e()(),n(127,"td"),t(128,"\u274C Cancelled"),e(),n(129,"td"),t(130,"\u2705 Subscribed"),e(),n(131,"td"),t(132,"Only latest matters (search, navigation)"),e()(),n(133,"tr")(134,"td")(135,"strong"),t(136,"mergeMap"),e()(),n(137,"td"),t(138,"\u2705 Continues"),e(),n(139,"td"),t(140,"\u2705 Subscribed"),e(),n(141,"td"),t(142,"All matter, order doesn't (parallel uploads)"),e()(),n(143,"tr")(144,"td")(145,"strong"),t(146,"concatMap"),e()(),n(147,"td"),t(148,"\u2705 Continues"),e(),n(149,"td"),t(150,"\u23F3 Queued"),e(),n(151,"td"),t(152,"All matter, order matters (sequential writes)"),e()(),n(153,"tr")(154,"td")(155,"strong"),t(156,"exhaustMap"),e()(),n(157,"td"),t(158,"\u2705 Continues"),e(),n(159,"td"),t(160,"\u274C Ignored"),e(),n(161,"td"),t(162,"Ignore while busy (form submit, login)"),e()()()()()()()(),n(163,"mat-tab",11)(164,"div",3)(165,"h2"),t(166,"RxJS Subject Types"),e(),n(167,"mat-card",5)(168,"mat-card-header")(169,"mat-card-title"),t(170,"Subject"),e()(),n(171,"mat-card-content")(172,"p")(173,"strong"),t(174,"Behavior:"),e(),t(175," Multicast observable. New subscribers only get future values."),e(),n(176,"p")(177,"strong"),t(178,"Use Case:"),e(),t(179," Event bus, custom events"),e(),n(180,"pre",7)(181,"code"),t(182,`
const subject = new Subject<string>();

subject.subscribe(v => console.log('A:', v));  // Gets: 'hello', 'world'
subject.next('hello');
subject.subscribe(v => console.log('B:', v));  // Gets: 'world' only
subject.next('world');
                `),e()()()(),n(183,"mat-card",5)(184,"mat-card-header")(185,"mat-card-title"),t(186,"BehaviorSubject"),e()(),n(187,"mat-card-content")(188,"p")(189,"strong"),t(190,"Behavior:"),e(),t(191," Has initial value. New subscribers immediately get current value."),e(),n(192,"p")(193,"strong"),t(194,"Use Case:"),e(),t(195," State management, current user, connection status"),e(),n(196,"pre",7)(197,"code"),t(198),e()(),n(199,"p",12),t(200,"\u{1F4A1} Most common Subject type for Angular services (state management)"),e()()(),n(201,"mat-card",5)(202,"mat-card-header")(203,"mat-card-title"),t(204,"ReplaySubject"),e()(),n(205,"mat-card-content")(206,"p")(207,"strong"),t(208,"Behavior:"),e(),t(209," Replays N last values to new subscribers."),e(),n(210,"p")(211,"strong"),t(212,"Use Case:"),e(),t(213," Cache recent events, chat history"),e(),n(214,"pre",7)(215,"code"),t(216,`
const history$ = new ReplaySubject<string>(3); // Buffer last 3

history$.next('msg1');
history$.next('msg2');
history$.next('msg3');
history$.next('msg4');

history$.subscribe(v => console.log(v));
// Gets: 'msg2', 'msg3', 'msg4' (last 3)
                `),e()()()(),n(217,"mat-card",5)(218,"mat-card-header")(219,"mat-card-title"),t(220,"AsyncSubject"),e()(),n(221,"mat-card-content")(222,"p")(223,"strong"),t(224,"Behavior:"),e(),t(225," Only emits the LAST value, and only when completed."),e(),n(226,"p")(227,"strong"),t(228,"Use Case:"),e(),t(229," HTTP request result (like Promise), computation result"),e(),n(230,"pre",7)(231,"code"),t(232,`
const result$ = new AsyncSubject<number>();

result$.subscribe(v => console.log(v)); // Nothing yet...
result$.next(1);  // Nothing emitted
result$.next(2);  // Nothing emitted
result$.next(3);  // Nothing emitted
result$.complete(); // NOW emits: 3 (last value only)
                `),e()()()()()(),n(233,"mat-tab",13)(234,"div",3)(235,"h2"),t(236,"State Management Patterns"),e(),n(237,"mat-card",5)(238,"mat-card-header")(239,"mat-card-title"),t(240,"Pattern 1: Service with BehaviorSubject"),e(),n(241,"mat-card-subtitle"),t(242,"Simple, works for most apps"),e()(),n(243,"mat-card-content")(244,"pre",7)(245,"code"),t(246),e()()()(),n(247,"mat-card",5)(248,"mat-card-header")(249,"mat-card-title"),t(250,"Pattern 2: Service with Signals"),e(),n(251,"mat-card-subtitle"),t(252,"\u{1F7E2} NEW - Angular 16+ approach"),e()(),n(253,"mat-card-content")(254,"pre",7)(255,"code"),t(256),e()()()(),n(257,"mat-card",5)(258,"mat-card-header")(259,"mat-card-title"),t(260,"Pattern 3: NgRx Store"),e(),n(261,"mat-card-subtitle"),t(262,"Enterprise-scale state (Redux pattern)"),e()(),n(263,"mat-card-content")(264,"p")(265,"strong"),t(266,"When to use NgRx:"),e()(),n(267,"ul")(268,"li"),t(269,"Large team, complex state interactions"),e(),n(270,"li"),t(271,"Need time-travel debugging"),e(),n(272,"li"),t(273,"Strict unidirectional data flow requirement"),e(),n(274,"li"),t(275,"Complex side effects"),e()(),n(276,"p")(277,"strong"),t(278,"When NOT to use:"),e()(),n(279,"ul")(280,"li"),t(281,"Small/medium apps (over-engineering)"),e(),n(282,"li"),t(283,"Simple CRUD operations"),e(),n(284,"li"),t(285,"When service-based state is sufficient"),e()(),n(286,"pre",7)(287,"code"),t(288),e()()()(),n(289,"mat-card",9)(290,"mat-card-header")(291,"mat-card-title"),t(292,"\u{1F4CB} Decision Guide: Which Pattern?"),e()(),n(293,"mat-card-content")(294,"table",10)(295,"thead")(296,"tr")(297,"th"),t(298,"Criteria"),e(),n(299,"th"),t(300,"Service + BehaviorSubject"),e(),n(301,"th"),t(302,"Service + Signals"),e(),n(303,"th"),t(304,"NgRx"),e()()(),n(305,"tbody")(306,"tr")(307,"td"),t(308,"Complexity"),e(),n(309,"td"),t(310,"Low"),e(),n(311,"td"),t(312,"Low"),e(),n(313,"td"),t(314,"High"),e()(),n(315,"tr")(316,"td"),t(317,"Boilerplate"),e(),n(318,"td"),t(319,"Minimal"),e(),n(320,"td"),t(321,"Minimal"),e(),n(322,"td"),t(323,"Significant"),e()(),n(324,"tr")(325,"td"),t(326,"Scalability"),e(),n(327,"td"),t(328,"Medium"),e(),n(329,"td"),t(330,"Medium-High"),e(),n(331,"td"),t(332,"High"),e()(),n(333,"tr")(334,"td"),t(335,"DevTools"),e(),n(336,"td"),t(337,"\u274C"),e(),n(338,"td"),t(339,"\u{1F504} Coming"),e(),n(340,"td"),t(341,"\u2705 Excellent"),e()(),n(342,"tr")(343,"td"),t(344,"Team Size"),e(),n(345,"td"),t(346,"Small"),e(),n(347,"td"),t(348,"Small-Medium"),e(),n(349,"td"),t(350,"Large"),e()(),n(351,"tr")(352,"td"),t(353,"Best For"),e(),n(354,"td"),t(355,"Most apps"),e(),n(356,"td"),t(357,"New Angular apps"),e(),n(358,"td"),t(359,"Enterprise/complex"),e()()()()()()()(),n(360,"mat-tab",14)(361,"div",3)(362,"h2"),t(363,"HTTP Client Patterns & Best Practices"),e(),n(364,"mat-card",5)(365,"mat-card-header")(366,"mat-card-title"),t(367,"Caching with shareReplay"),e()(),n(368,"mat-card-content")(369,"pre",7)(370,"code"),t(371),e()()()(),n(372,"mat-card",5)(373,"mat-card-header")(374,"mat-card-title"),t(375,"Polling Pattern (Real-time fallback)"),e()(),n(376,"mat-card-content")(377,"pre",7)(378,"code"),t(379),e()()()(),n(380,"mat-card",5)(381,"mat-card-header")(382,"mat-card-title"),t(383,"Parallel Requests (forkJoin vs combineLatest)"),e()(),n(384,"mat-card-content")(385,"pre",7)(386,"code"),t(387),e()()()(),n(388,"mat-card",5)(389,"mat-card-header")(390,"mat-card-title"),t(391,"Error Handling Patterns"),e()(),n(392,"mat-card-content")(393,"pre",7)(394,"code"),t(395),e()()()()()(),n(396,"mat-tab",15)(397,"div",3)(398,"h2"),t(399,"Common RxJS Recipes for Oil & Gas Apps"),e(),n(400,"mat-card",5)(401,"mat-card-header")(402,"mat-card-title"),t(403,"Debounced Search"),e()(),n(404,"mat-card-content")(405,"pre",7)(406,"code"),t(407,`
// Complete search pattern with loading & error handling
searchResults$ = this.searchInput.valueChanges.pipe(
  debounceTime(300),                    // Wait for user to stop typing
  distinctUntilChanged(),                // Only if value changed
  filter(term => term.length >= 2),      // Min 2 characters
  tap(() => this.loading.set(true)),     // Show loading
  switchMap(term =>                      // Cancel previous request
    this.api.search(term).pipe(
      catchError(() => of([]))           // Handle error gracefully
    )
  ),
  tap(() => this.loading.set(false))     // Hide loading
);
                `),e()()()(),n(408,"mat-card",5)(409,"mat-card-header")(410,"mat-card-title"),t(411,"Sensor Data Batching"),e()(),n(412,"mat-card-content")(413,"pre",7)(414,"code"),t(415),e()()()(),n(416,"mat-card",5)(417,"mat-card-header")(418,"mat-card-title"),t(419,"Unsubscribe Patterns"),e()(),n(420,"mat-card-content")(421,"pre",7)(422,"code"),t(423),e()()()(),n(424,"mat-card",5)(425,"mat-card-header")(426,"mat-card-title"),t(427,"Change Detection with scan()"),e()(),n(428,"mat-card-content")(429,"pre",7)(430,"code"),t(431),e()()()()()()()()),l&2&&(a(82),i(`
// Sequential operations - order matters!
this.actions$.pipe(
  concatMap(action => `,"{",`
    // Each action waits for previous to complete
    return this.api.executeAction(action);
  `,"}",`)
).subscribe();

// Write sensor data in order (must maintain sequence)
this.sensorReadings$.pipe(
  concatMap(reading =>
    this.dataService.saveReading(reading) // Wait before saving next
  )
).subscribe();
                `),a(116),i(`
const user$ = new BehaviorSubject<User | null>(null);

user$.subscribe(u => console.log('A:', u));  // Gets: null immediately, then 'John'
user$.next(`,"{"," name: 'John' ","}",`);
user$.subscribe(u => console.log('B:', u));  // Gets: 'John' immediately
user$.getValue(); // Synchronous access to current value
                `),a(48),c(`
// \u{1F534} OLD WAY (still valid & widely used)
@Injectable(`,"{"," providedIn: 'root' ","}",`)
export class WellStateService `,"{",`
  // Private mutable state
  private wellsSubject = new BehaviorSubject<Well[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Public read-only observables
  readonly wells$ = this.wellsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  // Derived state
  readonly activeWells$ = this.wells$.pipe(
    map(wells => wells.filter(w => w.status === 'drilling'))
  );

  // Actions
  loadWells(): void `,"{",`
    this.loadingSubject.next(true);
    this.http.get<Well[]>('/api/wells').pipe(
      tap(wells => this.wellsSubject.next(wells)),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  `,"}",`

  addWell(well: Well): void `,"{",`
    const current = this.wellsSubject.getValue();
    this.wellsSubject.next([...current, well]);
  `,"}",`
`,"}",`
                `),a(10),o([`
// \u{1F7E2} NEW WAY - Signals-based state management
@Injectable(`,"{"," providedIn: 'root' ","}",`)
export class WellStateService `,"{",`
  // Private writable signals
  private wellsState = signal<Well[]>([]);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);

  // Public readonly signals
  readonly wells = this.wellsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Derived state (automatically recalculated)
  readonly activeWells = computed(() =>
    this.wellsState().filter(w => w.status === 'drilling')
  );
  readonly wellCount = computed(() => this.wellsState().length);

  // Actions
  loadWells(): void `,"{",`
    this.loadingState.set(true);
    this.http.get<Well[]>('/api/wells').subscribe(`,"{",`
      next: wells => `,"{",`
        this.wellsState.set(wells);
        this.loadingState.set(false);
      `,"}",`,
      error: err => `,"{",`
        this.errorState.set(err.message);
        this.loadingState.set(false);
      `,"}",`
    `,"}",`);
  `,"}",`

  addWell(well: Well): void `,"{",`
    this.wellsState.update(wells => [...wells, well]);
  `,"}",`

  removeWell(id: string): void `,"{",`
    this.wellsState.update(wells => wells.filter(w => w.uid !== id));
  `,"}",`
`,"}",`
                `]),a(32),o([`
// NgRx follows: Action \u2192 Reducer \u2192 State \u2192 Selector \u2192 Component

// Actions
export const loadWells = createAction('[Wells] Load');
export const loadWellsSuccess = createAction(
  '[Wells] Load Success',
  props<`,"{"," wells: Well[] ","}",`>()
);

// Reducer
export const wellsReducer = createReducer(
  initialState,
  on(loadWells, state => (`,"{"," ...state, loading: true ","}",`)),
  on(loadWellsSuccess, (state, `,"{"," wells ","}",`) =>
    (`,"{"," ...state, wells, loading: false ","}",`))
);

// Selector
export const selectActiveWells = createSelector(
  selectWellsState,
  state => state.wells.filter(w => w.status === 'drilling')
);

// Component usage
wells$ = this.store.select(selectActiveWells);
loadWells() `,"{"," this.store.dispatch(loadWells()); ","}",`
                `]),a(83),s(`
// Cache API response - multiple subscribers share same result
private wellsCache$: Observable<Well[]> | null = null;

getWells(): Observable<Well[]> `,"{",`
  if (!this.wellsCache$) `,"{",`
    this.wellsCache$ = this.http.get<Well[]>('/api/wells').pipe(
      shareReplay(1)  // Cache latest value, share among subscribers
    );
  `,"}",`
  return this.wellsCache$;
`,"}",`

// Invalidate cache
refreshWells(): void `,"{",`
  this.wellsCache$ = null;
`,"}",`
                `),a(8),i(`
// Poll API every 5 seconds (when WebSocket not available)
startPolling(wellId: string): Observable<SensorData> `,"{",`
  return timer(0, 5000).pipe(  // Start immediately, then every 5s
    switchMap(() => this.http.get<SensorData>(
      '/api/wells/' + wellId + '/sensors'
    )),
    retry(3),          // Retry on error
    takeUntil(this.stopPolling$),
    distinctUntilChanged((prev, curr) =>
      JSON.stringify(prev) === JSON.stringify(curr)
    )
  );
`,"}",`
                `),a(8),s(`
// forkJoin: Wait for ALL to complete, then emit once
// Use when: All requests must succeed for result to be useful
loadDashboardData(): Observable<DashboardData> `,"{",`
  return forkJoin(`,"{",`
    wells: this.http.get<Well[]>('/api/wells'),
    alerts: this.http.get<Alert[]>('/api/alerts'),
    stats: this.http.get<Stats>('/api/stats')
  `,"}",`);
`,"}",`

// combineLatest: Emit whenever ANY source emits (after all have emitted once)
// Use when: You want latest combination of multiple streams
monitorMultipleWells(ids: string[]): Observable<WellData[]> `,"{",`
  const streams = ids.map(id =>
    this.getSensorStream(id)  // Continuous stream per well
  );
  return combineLatest(streams);
`,"}",`
                `),a(8),o([`
// Pattern 1: Retry with exponential backoff
this.http.get('/api/data').pipe(
  retry(`,"{",`
    count: 3,
    delay: (error, retryCount) => timer(1000 * Math.pow(2, retryCount))
  `,"}",`)
);

// Pattern 2: Fallback value on error
this.http.get<Well[]>('/api/wells').pipe(
  catchError(error => `,"{",`
    console.error('Failed to load wells:', error);
    return of([]); // Return empty array as fallback
  `,"}",`)
);

// Pattern 3: Transform error
this.http.get('/api/wells').pipe(
  catchError(error => `,"{",`
    const userMessage = this.getErrorMessage(error.status);
    return throwError(() => new Error(userMessage));
  `,"}",`)
);

// Pattern 4: Loading indicator pattern
loadData(): void `,"{",`
  this.loading.set(true);
  this.error.set(null);

  this.http.get<Data>('/api/data').pipe(
    finalize(() => this.loading.set(false)) // Always runs (success or error)
  ).subscribe(`,"{",`
    next: data => this.data.set(data),
    error: err => this.error.set(err.message)
  `,"}",`);
`,"}",`
                `]),a(20),i(`
// Buffer high-frequency sensor data untuk batch processing
this.sensorStream$.pipe(
  bufferTime(1000),                    // Collect all in 1 second window
  filter(batch => batch.length > 0),   // Skip empty buffers
  map(batch => (`,"{",`
    average: batch.reduce((sum, r) => sum + r.value, 0) / batch.length,
    max: Math.max(...batch.map(r => r.value)),
    min: Math.min(...batch.map(r => r.value)),
    count: batch.length
  `,"}",`))
).subscribe(stats => this.updateChart(stats));
                `),a(8),m(`
// Pattern 1: takeUntil + Subject (MOST COMMON)
private destroy$ = new Subject<void>();

ngOnInit() `,"{",`
  this.dataService.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => ...);
`,"}",`

ngOnDestroy() `,"{",`
  this.destroy$.next();
  this.destroy$.complete();
`,"}",`

// Pattern 2: DestroyRef (Angular 16+ - NEWEST)
private destroyRef = inject(DestroyRef);

ngOnInit() `,"{",`
  this.dataService.getData().pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(data => ...);
`,"}",`

// Pattern 3: async pipe in template (auto-unsubscribes!)
// <div>`,"{{ data$ | async }}",`</div>

// Pattern 4: take(1) for one-shot operations
this.route.params.pipe(take(1)).subscribe(params => ...);
                `),a(8),s(`
// Track previous vs current value (like ngOnChanges for streams)
this.depthStream$.pipe(
  pairwise(),  // Emits [previous, current]
  map(([prev, curr]) => (`,"{",`
    current: curr,
    previous: prev,
    delta: curr - prev,
    isIncreasing: curr > prev
  `,"}",`))
).subscribe(change => this.updateTrend(change));

// Accumulate state over time (like Redux reducer)
this.events$.pipe(
  scan((state, event) => (`,"{",`
    ...state,
    count: state.count + 1,
    lastEvent: event,
    history: [...state.history, event].slice(-10)
  `,"}","), ","{"," count: 0, lastEvent: null, history: [] ","}",`)
).subscribe(state => this.state.set(state));
                `))},dependencies:[p,f,b,v,w,E,x,S,g,P,C,M,h,y],styles:[".intermediate-container[_ngcontent-%COMP%]{max-width:1000px;margin:0 auto}h1[_ngcontent-%COMP%]{margin-bottom:4px}.subtitle[_ngcontent-%COMP%]{color:#666;margin-bottom:24px}.intro[_ngcontent-%COMP%]{color:#555;margin-bottom:16px;font-size:14px}.tab-content[_ngcontent-%COMP%]{padding:24px 0}.concept-card[_ngcontent-%COMP%]{margin-bottom:16px}.operator-info[_ngcontent-%COMP%]{margin-bottom:12px}.operator-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:4px 0;font-size:13px}.operator-info[_ngcontent-%COMP%]   .warning[_ngcontent-%COMP%]{color:#d32f2f;font-weight:500}.code-block[_ngcontent-%COMP%]{background:#1e1e1e;color:#d4d4d4;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;line-height:1.5}.code-block[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{white-space:pre;font-family:Consolas,monospace}.reference-table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:13px}.reference-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .reference-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:8px 12px;text-align:left;border-bottom:1px solid #eee}.reference-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background:#f5f5f5;font-weight:600}.reference-table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover   td[_ngcontent-%COMP%]{background:#f8f9fa}.summary-card[_ngcontent-%COMP%]{border:2px solid #1a237e}.tip[_ngcontent-%COMP%]{background:#e8f5e9;padding:8px 12px;border-radius:4px;font-size:13px;margin-top:8px}ul[_ngcontent-%COMP%]{padding-left:20px}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-bottom:6px;font-size:13px}"],changeDetection:0})}}return r})();export{U as IntermediateOverviewComponent};
