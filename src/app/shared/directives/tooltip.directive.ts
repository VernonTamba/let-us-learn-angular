/**
 * =============================================================================
 * TOOLTIP.DIRECTIVE.TS - Custom Tooltip Directive
 * =============================================================================
 *
 * 📘 KONSEP: Advanced Custom Directive
 *
 * Mendemonstrasikan:
 * - Dynamic DOM manipulation
 * - Position calculation
 * - Cleanup pada destroy
 * - HostListener alternatives
 * =============================================================================
 */

import {
  Directive,
  input,
  inject,
  ElementRef,
  Renderer2,
  OnDestroy
} from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()'
  }
})
export class TooltipDirective implements OnDestroy {

  /**
   * 📘 KONSEP: Renderer2
   *
   * Renderer2 adalah abstraksi untuk DOM manipulation.
   * Kenapa tidak langsung pakai native DOM APIs?
   * - Server-side rendering (SSR) compatibility
   * - Security (sanitization)
   * - Platform independence (web workers, native mobile)
   *
   * 💡 TIP INTERVIEW:
   * "Kenapa gunakan Renderer2 daripada direct DOM access?"
   * - Platform agnostic (works with SSR)
   * - Security benefits
   * - Easier to test
   * - But for simple cases, ElementRef.nativeElement is fine
   */
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // Inputs
  appTooltip = input.required<string>();
  tooltipPosition = input<TooltipPosition>('top');
  tooltipDelay = input<number>(200);

  // Internal
  private tooltipElement: HTMLElement | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  show(): void {
    this.showTimeout = setTimeout(() => {
      this.createTooltip();
    }, this.tooltipDelay());
  }

  hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.removeTooltip();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private createTooltip(): void {
    if (this.tooltipElement) return;

    // Create tooltip element using Renderer2
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');
    this.renderer.addClass(this.tooltipElement, `tooltip-${this.tooltipPosition()}`);

    const text = this.renderer.createText(this.appTooltip());
    this.renderer.appendChild(this.tooltipElement, text);

    // Style the tooltip
    const styles: Record<string, string> = {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      zIndex: '10000',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.2s ease'
    };

    Object.entries(styles).forEach(([key, value]) => {
      this.renderer.setStyle(this.tooltipElement, key, value);
    });

    // Add to DOM
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Position the tooltip
    this.positionTooltip();

    // Fade in
    requestAnimationFrame(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      }
    });
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const gap = 8;

    let top: number;
    let left: number;

    switch (this.tooltipPosition()) {
      case 'top':
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
    }

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private removeTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
