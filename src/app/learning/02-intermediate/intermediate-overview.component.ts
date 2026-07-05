/**
 * =============================================================================
 * INTERMEDIATE OVERVIEW - RxJS Patterns, State Management, HTTP Patterns
 * =============================================================================
 *
 * 📘 KONSEP INTERMEDIATE YANG DICOVER:
 * 1. RxJS Operators (switchMap, mergeMap, concatMap, exhaustMap, forkJoin)
 * 2. State Management patterns (Service-based vs NgRx)
 * 3. HTTP Client patterns (caching, retry, polling)
 * 4. Error handling strategies
 * 5. Component Communication via Services
 *
 * 💡 TIP INTERVIEW:
 * RxJS adalah salah satu topik paling sering ditanya di Angular interview!
 * Pahami perbedaan higher-order mapping operators (switchMap vs mergeMap vs concatMap vs exhaustMap)
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  OnDestroy,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import {
  Subject, BehaviorSubject, ReplaySubject, AsyncSubject,
  Observable, of, interval, timer, forkJoin, combineLatest, merge,
  throwError, EMPTY, from
} from 'rxjs';
import {
  switchMap, mergeMap, concatMap, exhaustMap,
  map, filter, tap, catchError, retry, retryWhen,
  debounceTime, throttleTime, distinctUntilChanged,
  take, takeUntil, takeWhile, skip, skipUntil,
  delay, timeout, startWith, pairwise,
  scan, reduce, bufferTime, bufferCount,
  shareReplay, share, publishReplay,
  finalize, first, last, withLatestFrom,
  combineLatestWith, exhaustAll
} from 'rxjs/operators';

@Component({
  selector: 'app-intermediate-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './intermediate-overview.component.html',
  styleUrl: './intermediate-overview.component.scss'
})
export class IntermediateOverviewComponent {
  // This component is primarily educational - displaying code examples and patterns
  // The actual patterns are demonstrated in the feature components (dashboard, streaming, etc.)
}
