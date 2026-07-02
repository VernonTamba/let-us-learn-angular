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
  template: `
    <div class="reports-container">
      <header class="page-header">
        <h1>
          <mat-icon>assessment</mat-icon>
          Reports & Analytics
        </h1>
        <p class="subtitle">Generate well performance and operational reports</p>
      </header>

      <!-- Report Generator Form (Reactive Forms Demo) -->
      <mat-card class="report-form-card">
        <mat-card-header>
          <mat-card-title>Generate Report</mat-card-title>
          <mat-card-subtitle>Configure report parameters</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="reportForm" (ngSubmit)="onSubmit()">

            <!-- Step 1: Basic Info -->
            <section class="form-section">
              <h3>Report Configuration</h3>

              <div class="form-row">
                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Report Title</mat-label>
                  <input matInput formControlName="title" placeholder="e.g., Daily Drilling Report">
                  <!--
                    📘 KONSEP: Validation Error Messages
                    Reactive Forms memberikan akses ke validation state
                  -->
                  @if (reportForm.get('title')?.hasError('required') &&
                       reportForm.get('title')?.touched) {
                    <mat-error>Title is required</mat-error>
                  }
                  @if (reportForm.get('title')?.hasError('minlength')) {
                    <mat-error>Minimum 3 characters</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Report Type</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="daily_drilling">Daily Drilling Report</mat-option>
                    <mat-option value="well_summary">Well Summary</mat-option>
                    <mat-option value="production">Production Report</mat-option>
                    <mat-option value="safety">Safety & HSE Report</mat-option>
                    <mat-option value="mud_log">Mud Log Report</mat-option>
                  </mat-select>
                  @if (reportForm.get('type')?.hasError('required') &&
                       reportForm.get('type')?.touched) {
                    <mat-error>Please select a report type</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Start Date</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>End Date</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                </mat-form-field>
              </div>

              <!--
                📘 KONSEP: Cross-field validation
                Custom validator yang check relationship antar fields
              -->
              @if (reportForm.hasError('dateRange')) {
                <mat-error class="form-error">
                  End date must be after start date
                </mat-error>
              }
            </section>

            <mat-divider></mat-divider>

            <!-- Step 2: Well Selection -->
            <section class="form-section">
              <h3>Well Selection</h3>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Wells</mat-label>
                <mat-select formControlName="wells" multiple>
                  <mat-option value="well-001">Kalimantan Deep-1</mat-option>
                  <mat-option value="well-002">Java Sea Explorer-3</mat-option>
                  <mat-option value="well-003">Sumatra Light-7</mat-option>
                  <mat-option value="well-004">Papua Deep Gas-2</mat-option>
                  <mat-option value="well-005">Natuna Injection-1</mat-option>
                </mat-select>
              </mat-form-field>
            </section>

            <mat-divider></mat-divider>

            <!--
              📘 KONSEP: FormArray - Dynamic form fields
              Memungkinkan user menambah/hapus fields secara dinamis
            -->
            <section class="form-section">
              <div class="section-header">
                <h3>Parameters to Include</h3>
                <button mat-mini-fab color="primary" type="button"
                  (click)="addParameter()"
                  [attr.aria-label]="'Add parameter'">
                  <mat-icon>add</mat-icon>
                </button>
              </div>

              <!-- Dynamic FormArray -->
              <div formArrayName="parameters">
                @for (param of parametersArray.controls; track $index; let i = $index) {
                  <div class="parameter-row" [formGroupName]="i">
                    <mat-form-field appearance="outline" class="flex-1">
                      <mat-label>Parameter Name</mat-label>
                      <mat-select formControlName="name">
                        <mat-option value="bit_depth">Bit Depth</mat-option>
                        <mat-option value="rop">Rate of Penetration</mat-option>
                        <mat-option value="wob">Weight on Bit</mat-option>
                        <mat-option value="rpm">Rotary RPM</mat-option>
                        <mat-option value="torque">Torque</mat-option>
                        <mat-option value="pump_pressure">Pump Pressure</mat-option>
                        <mat-option value="mud_weight">Mud Weight</mat-option>
                        <mat-option value="temperature">Temperature</mat-option>
                        <mat-option value="gas_total">Total Gas</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Unit</mat-label>
                      <mat-select formControlName="unit">
                        <mat-option value="m">Meters</mat-option>
                        <mat-option value="ft">Feet</mat-option>
                        <mat-option value="psi">PSI</mat-option>
                        <mat-option value="bar">Bar</mat-option>
                        <mat-option value="rpm">RPM</mat-option>
                        <mat-option value="ppg">PPG</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-checkbox formControlName="includeChart">Chart</mat-checkbox>

                    <button mat-icon-button color="warn" type="button"
                      (click)="removeParameter(i)"
                      [attr.aria-label]="'Remove parameter'">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                }
              </div>

              @if (parametersArray.length === 0) {
                <p class="hint-text">Click + to add parameters to the report</p>
              }
            </section>

            <mat-divider></mat-divider>

            <!-- Options -->
            <section class="form-section">
              <h3>Options</h3>
              <div formGroupName="options" class="options-row">
                <mat-checkbox formControlName="includeCharts">Include Charts</mat-checkbox>
                <mat-checkbox formControlName="includeSummary">Include Summary</mat-checkbox>
                <mat-checkbox formControlName="includeRawData">Include Raw Data</mat-checkbox>
                <mat-checkbox formControlName="exportPdf">Export as PDF</mat-checkbox>
              </div>
            </section>

            <!-- Form Actions -->
            <div class="form-actions">
              <button mat-button type="button" (click)="resetForm()">Reset</button>
              <button mat-raised-button color="primary" type="submit"
                [disabled]="reportForm.invalid || isGenerating()">
                @if (isGenerating()) {
                  <mat-icon class="spin">sync</mat-icon>
                  Generating...
                } @else {
                  <mat-icon>description</mat-icon>
                  Generate Report
                }
              </button>
            </div>

            <!-- Form State Debug (for learning) -->
            <details class="debug-section">
              <summary>📘 Form Debug Info (for learning)</summary>
              <pre class="form-debug">
Form Valid: {{ reportForm.valid }}
Form Dirty: {{ reportForm.dirty }}
Form Touched: {{ reportForm.touched }}
Form Value: {{ reportForm.value | json }}
Form Errors: {{ reportForm.errors | json }}
              </pre>
            </details>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
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
