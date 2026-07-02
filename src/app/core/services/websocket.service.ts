/**
 * =============================================================================
 * WEBSOCKET.SERVICE.TS - Real-time WebSocket Service
 * =============================================================================
 *
 * 📘 KONSEP: WebSocket & Real-time Data Streaming
 *
 * Dalam Oil & Gas, real-time data dari sensor harus di-stream secara continuous.
 * WebSocket menyediakan full-duplex communication channel.
 *
 * ============ PERBANDINGAN APPROACHES ============
 *
 * 🔴 APPROACH 1: Raw WebSocket + manual RxJS wrapping
 * 🟢 APPROACH 2: RxJS WebSocketSubject (recommended)
 *
 * 💡 TIP INTERVIEW:
 * "Bagaimana handle real-time data di Angular?"
 * - WebSocket untuk bi-directional real-time
 * - Server-Sent Events (SSE) untuk server-to-client streaming
 * - Polling (HTTP) sebagai fallback
 * - RxJS operators untuk throttle, buffer, dan process data
 * =============================================================================
 */

import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  Observable,
  Subject,
  BehaviorSubject,
  timer,
  EMPTY,
  of
} from 'rxjs';
import {
  switchMap,
  retryWhen,
  delay,
  tap,
  takeUntil,
  catchError,
  filter,
  map,
  bufferTime,
  share,
  retry,
  distinctUntilChanged
} from 'rxjs/operators';

import { environment } from '@environments/environment';
import {
  WebSocketMessage,
  SensorDataBatch,
  SensorReading,
  ActiveAlarm,
  StreamingStatus,
  DrillingParameters
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {

  private wsUrl = environment.wsUrl;
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private destroy$ = new Subject<void>();

  // ===== STATE DENGAN SIGNALS =====

  /** Connection status menggunakan Signal */
  private connectionStatusSignal = signal<StreamingStatus>(StreamingStatus.Disconnected);
  readonly connectionStatus = this.connectionStatusSignal.asReadonly();

  /** Is connected computed signal */
  readonly isConnected = computed(() =>
    this.connectionStatusSignal() === StreamingStatus.Connected
  );

  /** Latest sensor data */
  private latestDataSignal = signal<SensorDataBatch | null>(null);
  readonly latestData = this.latestDataSignal.asReadonly();

  /** Active alarms count */
  private alarmsSignal = signal<ActiveAlarm[]>([]);
  readonly alarms = this.alarmsSignal.asReadonly();
  readonly alarmCount = computed(() => this.alarmsSignal().length);
  readonly criticalAlarms = computed(() =>
    this.alarmsSignal().filter(a => a.severity === 'critical' || a.severity === 'emergency')
  );

  // ===== RXJS STREAMS (for complex async operations) =====

  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds

  // ===== CONNECTION MANAGEMENT =====

  /**
   * Connect to WebSocket server
   *
   * 📘 KONSEP: WebSocketSubject dari rxjs/webSocket
   * - Handles connection lifecycle
   * - Auto-serialization/deserialization
   * - Multiplexing support
   */
  connect(wellId?: string): void {
    if (this.socket$) {
      this.disconnect();
    }

    const url = wellId ? `${this.wsUrl}?wellId=${wellId}` : this.wsUrl;

    this.connectionStatusSignal.set(StreamingStatus.Reconnecting);

    // 🟢 RxJS WebSocketSubject - recommended approach
    this.socket$ = webSocket<WebSocketMessage>({
      url,
      openObserver: {
        next: () => {
          console.log('[WebSocket] Connected');
          this.connectionStatusSignal.set(StreamingStatus.Connected);
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: (event) => {
          console.log('[WebSocket] Disconnected', event);
          this.connectionStatusSignal.set(StreamingStatus.Disconnected);
          this.attemptReconnect(wellId);
        }
      }
    });

    // Subscribe and route messages
    this.socket$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => this.handleMessage(message),
        error: (error) => {
          console.error('[WebSocket] Error:', error);
          this.connectionStatusSignal.set(StreamingStatus.Error);
          this.attemptReconnect(wellId);
        }
      });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    this.connectionStatusSignal.set(StreamingStatus.Disconnected);
  }

  /**
   * Send message to server
   */
  send(message: WebSocketMessage): void {
    if (this.socket$ && this.isConnected()) {
      this.socket$.next(message);
    } else {
      console.warn('[WebSocket] Cannot send - not connected');
    }
  }

  // ===== TYPED STREAMS =====
  // Filtered observables untuk specific message types

  /**
   * Stream sensor data only
   *
   * 📘 KONSEP: RxJS filter & map operators
   * Memfilter stream untuk mendapatkan hanya tipe data tertentu
   */
  getSensorDataStream(): Observable<SensorDataBatch> {
    if (!this.socket$) return EMPTY;

    return this.socket$.pipe(
      filter((msg): msg is { type: 'sensor_data'; payload: SensorDataBatch } =>
        msg.type === 'sensor_data'
      ),
      map(msg => msg.payload),

      // 📘 KONSEP: bufferTime - batch data untuk mengurangi re-renders
      // Uncomment jika data terlalu frequent:
      // bufferTime(1000),
      // filter(batch => batch.length > 0),
      // map(batches => batches[batches.length - 1]), // Take latest

      share(), // Share subscription antar multiple subscribers
      takeUntil(this.destroy$)
    );
  }

  /**
   * Stream alarms only
   */
  getAlarmStream(): Observable<ActiveAlarm> {
    if (!this.socket$) return EMPTY;

    return this.socket$.pipe(
      filter((msg): msg is { type: 'alarm'; payload: ActiveAlarm } =>
        msg.type === 'alarm'
      ),
      map(msg => msg.payload),
      tap(alarm => {
        // Update alarms signal
        this.alarmsSignal.update(alarms => [...alarms, alarm]);
      }),
      takeUntil(this.destroy$)
    );
  }

  /**
   * Get specific sensor readings stream
   */
  getSensorStream(sensorId: string): Observable<SensorReading> {
    return this.getSensorDataStream().pipe(
      map(batch => batch.readings.find(r => r.sensorId === sensorId)),
      filter((reading): reading is SensorReading => reading !== undefined),
      distinctUntilChanged((prev, curr) => prev.value === curr.value)
    );
  }

  // ===== PRIVATE METHODS =====

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'sensor_data':
        this.latestDataSignal.set(message.payload);
        break;
      case 'alarm':
        this.alarmsSignal.update(alarms => [...alarms, message.payload]);
        break;
      case 'heartbeat':
        // Keep-alive, no action needed
        break;
      case 'connection_status':
        this.connectionStatusSignal.set(message.payload.status);
        break;
    }
  }

  private attemptReconnect(wellId?: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      this.connectionStatusSignal.set(StreamingStatus.Error);
      return;
    }

    this.reconnectAttempts++;
    this.connectionStatusSignal.set(StreamingStatus.Reconnecting);

    console.log(`[WebSocket] Reconnecting... attempt ${this.reconnectAttempts}`);

    setTimeout(() => {
      this.connect(wellId);
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  // ===== MOCK DATA GENERATOR (for development) =====

  /**
   * Generate mock real-time data stream
   * Simulates sensor data coming from a well
   */
  getMockSensorStream(wellId: string): Observable<DrillingParameters> {
    return timer(0, 2000).pipe( // Emit every 2 seconds
      map(() => this.generateMockDrillingParams()),
      takeUntil(this.destroy$)
    );
  }

  private generateMockDrillingParams(): DrillingParameters {
    return {
      timestamp: new Date(),
      bitDepth: 3500 + Math.random() * 5,
      holeDepth: 3505 + Math.random() * 2,
      blockPosition: 15 + Math.random() * 3,
      weightOnBit: 20 + Math.random() * 10,
      hookLoad: 150 + Math.random() * 20,
      torque: 8 + Math.random() * 4,
      rotaryRPM: 120 + Math.random() * 30,
      rateOfPenetration: 25 + Math.random() * 15,
      pumpPressure: 3000 + Math.random() * 500,
      pumpRate: 600 + Math.random() * 100,
      mudWeightIn: 10.5 + Math.random() * 0.5,
      mudWeightOut: 10.4 + Math.random() * 0.6,
      mudTemperatureIn: 85 + Math.random() * 10,
      mudTemperatureOut: 95 + Math.random() * 15
    };
  }

  // ===== LIFECYCLE =====

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
