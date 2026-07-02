/**
 * =============================================================================
 * HIGHLIGHT.DIRECTIVE.TS - Custom Attribute Directive
 * =============================================================================
 *
 * 📘 KONSEP: Custom Directives
 *
 * Directive adalah class yang memodifikasi behavior atau appearance dari
 * DOM element. Ada 3 jenis:
 * 1. Component Directive (has template)
 * 2. Structural Directive (*ngIf, *ngFor, @if, @for)
 * 3. Attribute Directive (modifies appearance/behavior)
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY (NgModule-based directive):
 * ```typescript
 * @Directive({ selector: '[appHighlight]' })
 * export class HighlightDirective {
 *   @Input() appHighlight: string = '';
 *   @Input() highlightColor: string = 'yellow';
 *   @HostBinding('style.backgroundColor') bgColor: string = '';
 *   @HostListener('mouseenter') onMouseEnter() { ... }
 *   @HostListener('mouseleave') onMouseLeave() { ... }
 * }
 * // Harus di-declare di NgModule declarations: [HighlightDirective]
 * ```
 *
 * 🟢 NEW WAY (Standalone Directive + host binding in decorator):
 * - standalone: true
 * - host property di decorator (menggantikan @HostListener/@HostBinding)
 * - input() signal-based
 *
 * 💡 TIP INTERVIEW:
 * "Apa bedanya Component, Directive, dan Pipe?"
 * - Component: Directive dengan template
 * - Directive: Memodifikasi behavior/appearance element yang sudah ada
 * - Pipe: Transform data di template
 * =============================================================================
 */

import {
  Directive,
  input,
  signal,
  effect,
  ElementRef,
  inject,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
  /**
   * 🟢 NEW WAY: host property di decorator
   * Menggantikan @HostListener dan @HostBinding
   *
   * 🔴 OLD: @HostListener('mouseenter') onMouseEnter() { ... }
   * 🟢 NEW: host: { '(mouseenter)': 'onMouseEnter()', ... }
   */
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[style.transition]': '"background-color 0.3s ease"',
    '[style.cursor]': '"pointer"',
    '[style.borderRadius]': '"4px"',
    '[style.padding]': '"2px 4px"'
  }
})
export class HighlightDirective implements OnInit {

  // 🟢 NEW: inject() function
  private el = inject(ElementRef);

  // ===== INPUTS =====

  /**
   * Highlight color - bisa digunakan sebagai:
   * <p appHighlight="yellow">Text</p>
   * ATAU
   * <p [appHighlight]="colorVariable">Text</p>
   */
  appHighlight = input<string>('yellow');

  /** Color saat hover */
  highlightHover = input<string>('');

  /** Default background (ketika tidak hover) */
  defaultColor = input<string>('transparent');

  // ===== INTERNAL STATE =====
  private isHovered = signal(false);

  constructor() {
    // Effect untuk react ke input changes
    effect(() => {
      if (!this.isHovered()) {
        this.el.nativeElement.style.backgroundColor = this.defaultColor();
      }
    });
  }

  ngOnInit(): void {
    this.el.nativeElement.style.backgroundColor = this.defaultColor();
  }

  // ===== EVENT HANDLERS =====

  onMouseEnter(): void {
    this.isHovered.set(true);
    const color = this.highlightHover() || this.appHighlight();
    this.el.nativeElement.style.backgroundColor = color;
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    this.el.nativeElement.style.backgroundColor = this.defaultColor();
  }
}
