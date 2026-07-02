/**
 * =============================================================================
 * NOTIFICATION.SERVICE.TS - Toast/Snackbar Notification Service
 * =============================================================================
 *
 * 📘 KONSEP: Service sebagai Pub/Sub pattern & UI feedback
 *
 * Pattern yang umum di Angular apps:
 * - Centralized notification service
 * - Components subscribe untuk menampilkan notifikasi
 * - Services/interceptors publish notifications
 *
 * 💡 TIP INTERVIEW:
 * "Bagaimana handle global notifications di Angular?"
 * - Dedicated service dengan Subject/Signal
 * - Angular Material Snackbar atau custom implementation
 * - Error interceptor yang auto-show error notifications
 * =============================================================================
 */

import { Injectable, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

// ===== INTERFACES =====

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;      // milliseconds, 0 = sticky
  timestamp: Date;
  action?: NotificationAction;
  dismissible?: boolean;
}

export interface NotificationAction {
  label: string;
  callback: () => void;
}

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

// ===== SERVICE =====

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private defaultDuration = 5000; // 5 seconds

  // 🟢 Signals approach - for current notification state
  private notificationsSignal = signal<Notification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();
  readonly notificationCount = computed(() => this.notificationsSignal().length);

  // 🔴 RxJS Subject - for event-driven notification stream
  // Useful when you need to pipe/transform notifications
  private notification$ = new Subject<Notification>();
  readonly notificationStream$ = this.notification$.asObservable();

  // ===== PUBLIC API =====

  success(title: string, message: string = '', duration?: number): void {
    this.show({
      type: NotificationType.Success,
      title,
      message,
      duration: duration ?? this.defaultDuration
    });
  }

  error(title: string, message: string = '', duration?: number): void {
    this.show({
      type: NotificationType.Error,
      title,
      message,
      duration: duration ?? 0, // Errors stay until dismissed
      dismissible: true
    });
  }

  warning(title: string, message: string = '', duration?: number): void {
    this.show({
      type: NotificationType.Warning,
      title,
      message,
      duration: duration ?? 8000
    });
  }

  info(title: string, message: string = '', duration?: number): void {
    this.show({
      type: NotificationType.Info,
      title,
      message,
      duration: duration ?? this.defaultDuration
    });
  }

  /**
   * Show notification with action button
   */
  showWithAction(
    title: string,
    message: string,
    action: NotificationAction,
    type: NotificationType = NotificationType.Info
  ): void {
    this.show({ type, title, message, action, duration: 0 });
  }

  /**
   * Dismiss specific notification
   */
  dismiss(id: string): void {
    this.notificationsSignal.update(
      notifications => notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSignal.set([]);
  }

  // ===== PRIVATE =====

  private show(config: Omit<Notification, 'id' | 'timestamp'>): void {
    const notification: Notification = {
      ...config,
      id: this.generateId(),
      timestamp: new Date(),
      dismissible: config.dismissible ?? true
    };

    // Add to signal state
    this.notificationsSignal.update(notifications => [...notifications, notification]);

    // Emit to stream (for subscribers)
    this.notification$.next(notification);

    // Auto-dismiss after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => this.dismiss(notification.id), notification.duration);
    }
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
