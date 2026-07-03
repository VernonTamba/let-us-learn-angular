/**
 * =============================================================================
 * REPORTS.COMPONENT.TS - Reports & Analytics Feature
 * =============================================================================
 *
 * 📘 KONSEP: Reactive Forms (Advanced), Template-driven vs Reactive comparison
 *
 * Concepts demonstrated:
 * - Complex Reactive Forms with FormGroups, FormArrays
 * - Form validation (built-in & custom validators)
 * - Dynamic form fields
 * - Form submission handling
 * - Two-way binding comparison (ngModel vs formControl)
 *
 * ============ PERBANDINGAN: Template-Driven vs Reactive Forms ============
 *
 * 🔴 TEMPLATE-DRIVEN FORMS:
 * - Directives: ngModel, ngForm
 * - Logic di template
 * - Implicit FormControl creation
 * - Simpler for simple forms
 * - Harder to test
 *
 * 🟢 REACTIVE FORMS:
 * - Logic di TypeScript class
 * - Explicit FormControl, FormGroup, FormArray
 * - Better for complex forms
 * - Easier to test
 * - Immutable data model
 * - Better type safety (typed forms di Angular 14+)
 *
 * 💡 TIP INTERVIEW:
 * "Kapan pilih Template-Driven vs Reactive Forms?"
 * - Template-driven: Simple forms, quick prototyping
 * - Reactive: Complex validation, dynamic fields, unit testing
 * =============================================================================
 */

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatStepperModule,
    MatChipsModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reports.component.html',
  styles: [`
    .reports-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
      h1 { display: flex; align-items: center; gap: 8px; margin: 0; }
      .subtitle { color: #666; margin: 4px 0 0; }
    }

    .form-section {
      padding: 16px 0;
      h3 { margin-bottom: 12px; color: #333; }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .flex-1 { flex: 1; }
    .full-width { width: 100%; }

    .parameter-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .options-row {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
    }

    .form-error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: -8px;
      margin-bottom: 8px;
    }

    .hint-text {
      color: #999;
      font-size: 13px;
      font-style: italic;
    }

    .debug-section {
      margin-top: 24px;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 12px;

      summary {
        cursor: pointer;
        font-weight: 500;
        color: #666;
      }
    }

    .form-debug {
      font-size: 11px;
      white-space: pre-wrap;
      color: #333;
      margin: 8px 0 0;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `]
})
export class ReportsComponent {

  private fb = inject(FormBuilder);

  // State
  isGenerating = signal(false);

  /**
   * 📘 KONSEP: Typed Reactive Forms (Angular 14+)
   *
   * FormBuilder.group() sekarang type-safe!
   * Setiap control punya type yang jelas.
   */
  reportForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    type: ['', Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    wells: [[] as string[], Validators.required],
    parameters: this.fb.array([]),  // Dynamic FormArray
    options: this.fb.group({
      includeCharts: [true],
      includeSummary: [true],
      includeRawData: [false],
      exportPdf: [false]
    })
  }, {
    // Cross-field validator
    validators: [this.dateRangeValidator]
  });

  // Getter for FormArray
  get parametersArray(): FormArray {
    return this.reportForm.get('parameters') as FormArray;
  }

  // ===== METHODS =====

  addParameter(): void {
    const paramGroup = this.fb.group({
      name: ['', Validators.required],
      unit: ['m'],
      includeChart: [true]
    });
    this.parametersArray.push(paramGroup);
  }

  removeParameter(index: number): void {
    this.parametersArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.isGenerating.set(true);
      console.log('Report Config:', this.reportForm.value);

      // Simulate report generation
      setTimeout(() => {
        this.isGenerating.set(false);
        alert('Report generated successfully! (Mock)');
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.reportForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.reportForm.reset();
    this.parametersArray.clear();
  }

  /**
   * 📘 KONSEP: Custom Cross-field Validator
   *
   * Validator yang memeriksa relationship antar fields.
   * Di sini: endDate harus setelah startDate.
   */
  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { dateRange: true };
    }
    return null;
  }
}
