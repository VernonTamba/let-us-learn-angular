/**
 * =============================================================================
 * TIME-AGO.PIPE.TS - Relative Time Pipe
 * =============================================================================
 *
 * 📘 KONSEP: Impure Pipe
 *
 * Pipe ini menampilkan waktu relatif: "5 minutes ago", "2 hours ago", dll.
 * Karena waktu terus berubah, ini PERLU jadi impure pipe agar update otomatis.
 *
 * ⚠️ PERHATIAN: Impure pipes berjalan setiap change detection cycle!
 * Gunakan dengan bijak. Alternatif: Signal + interval timer
 *
 * 💡 TIP INTERVIEW:
 * "Kapan gunakan Impure Pipe?"
 * - Ketika output bisa berubah tanpa input berubah (time-based)
 * - Ketika pipe bergantung pada external state
 * - Tapi hati-hati performance! Setiap CD cycle = pipe re-evaluate
 * - Alternative: Gunakan async pipe dengan interval observable
 * =============================================================================
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false // ⚠️ IMPURE - re-runs every change detection cycle
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '--';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '--';

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Future date
    if (seconds < 0) {
      return this.formatFuture(Math.abs(seconds));
    }

    // Past date
    return this.formatPast(seconds);
  }

  private formatPast(seconds: number): string {
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
  }

  private formatFuture(seconds: number): string {
    if (seconds < 60) return `in ${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `in ${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `in ${hours}h`;

    const days = Math.floor(hours / 24);
    return `in ${days}d`;
  }
}

/**
 * 📘 BONUS: Pure alternative menggunakan async pipe + interval
 *
 * Ini adalah pattern yang lebih performant untuk time-ago:
 *
 * ```typescript
 * // Di component:
 * timeAgo$ = interval(60000).pipe(  // Update every minute
 *   startWith(0),
 *   map(() => this.getTimeAgo(this.date))
 * );
 *
 * // Di template:
 * {{ timeAgo$ | async }}
 * ```
 *
 * Ini lebih efficient karena hanya update setiap menit,
 * bukan setiap change detection cycle.
 */
