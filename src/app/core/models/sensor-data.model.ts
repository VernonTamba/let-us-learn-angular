/**
 * =============================================================================
 * SENSOR-DATA.MODEL.TS - Real-time Sensor Data Models
 * =============================================================================
 *
 * 📘 KONSEP: Real-time Data Streaming Models
 *
 * Dalam operasi Oil & Gas, sensor di wellsite mengirim data secara real-time:
 * - Drilling parameters (WOB, torque, RPM, ROP)
 * - Mud properties (weight, viscosity, temperature)
 * - Formation evaluation (gas, pressure, temperature)
 * - Directional survey (inclination, azimuth)
 * =============================================================================
 */

// ===== REAL-TIME DATA =====

/** Single sensor reading */
export interface SensorReading {
  sensorId: string;
  timestamp: Date;
  value: number;
  unit: string;
  quality: DataQualityFlag;
}

/** Batch of sensor readings (efficient for streaming) */
export interface SensorDataBatch {
  wellId: string;
  wellboreId: string;
  batchId: string;
  timestamp: Date;
  readings: SensorReading[];
}

/** Real-time drilling parameters */
export interface DrillingParameters {
  timestamp: Date;
  bitDepth: number;         // Current bit position
  holeDepth: number;        // Total hole depth
  blockPosition: number;    // Traveling block height
  weightOnBit: number;      // WOB in klbs
  hookLoad: number;         // Hook load in klbs
  torque: number;           // Rotary torque in kft-lbs
  rotaryRPM: number;        // Surface RPM
  rateOfPenetration: number; // ROP in ft/hr
  pumpPressure: number;     // Standpipe pressure in PSI
  pumpRate: number;         // Flow rate in GPM
  mudWeightIn: number;      // Mud weight going in (ppg)
  mudWeightOut: number;     // Mud weight coming out (ppg)
  mudTemperatureIn: number; // Mud temp in (°F)
  mudTemperatureOut: number; // Mud temp out (°F)
}

/** Gas detection readings */
export interface GasReadings {
  timestamp: Date;
  totalGas: number;     // Total gas (units)
  c1: number;           // Methane
  c2: number;           // Ethane
  c3: number;           // Propane
  ic4: number;          // Iso-Butane
  nc4: number;          // Normal-Butane
  ic5: number;          // Iso-Pentane
  nc5: number;          // Normal-Pentane
  h2s: number;          // Hydrogen Sulfide (safety critical!)
  co2: number;          // Carbon Dioxide
}

/** Alarm/Alert configuration */
export interface AlarmThreshold {
  sensorId: string;
  parameter: string;
  lowLow?: number;    // Critical low
  low?: number;       // Warning low
  high?: number;      // Warning high
  highHigh?: number;  // Critical high
  unit: string;
  enabled: boolean;
}

/** Active alarm */
export interface ActiveAlarm {
  id: string;
  wellId: string;
  sensorId: string;
  parameter: string;
  severity: AlarmSeverity;
  value: number;
  threshold: number;
  unit: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// ===== ENUMS =====

export enum DataQualityFlag {
  Good = 0,
  Uncertain = 1,
  Bad = 2,
  OutOfRange = 3,
  SensorFailure = 4,
  Simulated = 5
}

export enum AlarmSeverity {
  Info = 'info',
  Warning = 'warning',
  Critical = 'critical',
  Emergency = 'emergency'
}

export enum StreamingStatus {
  Connected = 'connected',
  Disconnected = 'disconnected',
  Reconnecting = 'reconnecting',
  Error = 'error',
  Paused = 'paused'
}

// ===== WEBSOCKET MESSAGE TYPES =====

export type WebSocketMessage =
  | { type: 'sensor_data'; payload: SensorDataBatch }
  | { type: 'alarm'; payload: ActiveAlarm }
  | { type: 'status_change'; payload: { wellId: string; status: string } }
  | { type: 'connection_status'; payload: { status: StreamingStatus } }
  | { type: 'heartbeat'; payload: { timestamp: number } };

// ===== CHART DATA MODELS =====

export interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
}

export interface ChartDataSet {
  label: string;
  data: TimeSeriesDataPoint[];
  color: string;
  unit: string;
  visible: boolean;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  position: { row: number; col: number; width: number; height: number };
  config: Record<string, unknown>;
  dataSource: string;
}

export enum WidgetType {
  LineChart = 'line_chart',
  Gauge = 'gauge',
  NumericDisplay = 'numeric_display',
  StatusIndicator = 'status_indicator',
  DataTable = 'data_table',
  TrajectoryPlot = 'trajectory_plot'
}
