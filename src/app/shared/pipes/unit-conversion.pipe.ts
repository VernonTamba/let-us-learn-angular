/**
 * =============================================================================
 * UNIT-CONVERSION.PIPE.TS - Unit Conversion Pipe
 * =============================================================================
 *
 * 📘 KONSEP: Custom Pipes
 *
 * Pipes transform data di template tanpa mengubah source data.
 * Sangat berguna di Oil & Gas karena banyak unit conversion:
 * - Meters ↔ Feet
 * - Celsius ↔ Fahrenheit
 * - PSI ↔ Bar ↔ kPa
 * - Barrels ↔ Cubic Meters
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY:
 * ```typescript
 * @Pipe({ name: 'unitConvert' })
 * export class UnitConversionPipe implements PipeTransform {
 *   transform(value: number, from: string, to: string): number { ... }
 * }
 * // Declare in NgModule: declarations: [UnitConversionPipe]
 * ```
 *
 * 🟢 NEW WAY:
 * - standalone: true (import langsung di component)
 * - Pure pipe (default) vs Impure pipe
 *
 * 💡 TIP INTERVIEW:
 * "Apa bedanya Pure dan Impure pipe?"
 * - Pure (default): Hanya re-run ketika input reference berubah
 *   (primitive value change atau object reference change)
 * - Impure (pure: false): Re-run setiap change detection cycle
 *   (bisa impact performance jika tidak hati-hati)
 * =============================================================================
 */

import { Pipe, PipeTransform } from '@angular/core';

type LengthUnit = 'm' | 'ft' | 'km' | 'mi' | 'in' | 'cm';
type TemperatureUnit = 'C' | 'F' | 'K';
type PressureUnit = 'psi' | 'bar' | 'kpa' | 'atm' | 'mpa';
type VolumeUnit = 'bbl' | 'm3' | 'gal' | 'l';
type AllUnits = LengthUnit | TemperatureUnit | PressureUnit | VolumeUnit;

@Pipe({
  name: 'unitConvert',
  standalone: true,  // 🟢 NEW: Standalone pipe
  pure: true         // Default - hanya re-execute jika input berubah
})
export class UnitConversionPipe implements PipeTransform {

  /**
   * Transform value from one unit to another
   *
   * Usage di template:
   * {{ depth | unitConvert:'m':'ft' }}
   * {{ temperature | unitConvert:'C':'F' }}
   * {{ pressure | unitConvert:'psi':'bar' }}
   *
   * Dengan format option:
   * {{ depth | unitConvert:'m':'ft':'2' }}  → 2 decimal places
   */
  transform(
    value: number | null | undefined,
    from: AllUnits,
    to: AllUnits,
    decimals: string = '2'
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '--';
    }

    const decimalPlaces = parseInt(decimals, 10);
    let result: number;

    // Determine conversion category
    if (this.isLength(from) && this.isLength(to)) {
      result = this.convertLength(value, from as LengthUnit, to as LengthUnit);
    } else if (this.isTemperature(from) && this.isTemperature(to)) {
      result = this.convertTemperature(value, from as TemperatureUnit, to as TemperatureUnit);
    } else if (this.isPressure(from) && this.isPressure(to)) {
      result = this.convertPressure(value, from as PressureUnit, to as PressureUnit);
    } else if (this.isVolume(from) && this.isVolume(to)) {
      result = this.convertVolume(value, from as VolumeUnit, to as VolumeUnit);
    } else {
      console.warn(`[UnitConversion] Cannot convert from ${from} to ${to}`);
      return `${value}`;
    }

    return result.toFixed(decimalPlaces);
  }

  // ===== CONVERSION METHODS =====

  private convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
    // Convert to meters first, then to target
    const toMeters: Record<LengthUnit, number> = {
      'm': 1, 'ft': 0.3048, 'km': 1000, 'mi': 1609.344, 'in': 0.0254, 'cm': 0.01
    };
    const fromMeters: Record<LengthUnit, number> = {
      'm': 1, 'ft': 3.28084, 'km': 0.001, 'mi': 0.000621371, 'in': 39.3701, 'cm': 100
    };

    const meters = value * toMeters[from];
    return meters * fromMeters[to];
  }

  private convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case 'C': celsius = value; break;
      case 'F': celsius = (value - 32) * 5 / 9; break;
      case 'K': celsius = value - 273.15; break;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'C': return celsius;
      case 'F': return celsius * 9 / 5 + 32;
      case 'K': return celsius + 273.15;
    }
  }

  private convertPressure(value: number, from: PressureUnit, to: PressureUnit): number {
    const toPsi: Record<PressureUnit, number> = {
      'psi': 1, 'bar': 14.5038, 'kpa': 0.145038, 'atm': 14.696, 'mpa': 145.038
    };
    const fromPsi: Record<PressureUnit, number> = {
      'psi': 1, 'bar': 0.0689476, 'kpa': 6.89476, 'atm': 0.068046, 'mpa': 0.00689476
    };

    const psi = value * toPsi[from];
    return psi * fromPsi[to];
  }

  private convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
    const toBarrels: Record<VolumeUnit, number> = {
      'bbl': 1, 'm3': 6.28981, 'gal': 0.0238095, 'l': 0.00628981
    };
    const fromBarrels: Record<VolumeUnit, number> = {
      'bbl': 1, 'm3': 0.158987, 'gal': 42, 'l': 158.987
    };

    const barrels = value * toBarrels[from];
    return barrels * fromBarrels[to];
  }

  // ===== TYPE GUARDS =====

  private isLength(unit: string): boolean {
    return ['m', 'ft', 'km', 'mi', 'in', 'cm'].includes(unit);
  }

  private isTemperature(unit: string): boolean {
    return ['C', 'F', 'K'].includes(unit);
  }

  private isPressure(unit: string): boolean {
    return ['psi', 'bar', 'kpa', 'atm', 'mpa'].includes(unit);
  }

  private isVolume(unit: string): boolean {
    return ['bbl', 'm3', 'gal', 'l'].includes(unit);
  }
}
