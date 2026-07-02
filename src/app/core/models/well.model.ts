/**
 * =============================================================================
 * WELL.MODEL.TS - Well Data Interfaces & Types
 * =============================================================================
 *
 * 📘 KONSEP: TypeScript Interfaces & Types
 *
 * Best Practice di Angular:
 * - Gunakan Interface untuk mendefinisikan shape of data
 * - Gunakan Type untuk unions, intersections, utility types
 * - Gunakan Enum untuk fixed set of values (atau string literal union)
 * - Pisahkan models dari business logic
 *
 * 💡 TIP INTERVIEW:
 * "Interface vs Type di TypeScript?"
 * - Interface: extendable, declaration merging, lebih semantic untuk objects
 * - Type: lebih powerful (unions, intersections, mapped types)
 * - Untuk Angular models, Interface lebih umum digunakan
 * =============================================================================
 */

// ===== ENUMS & CONSTANTS =====

/**
 * Status sumur minyak
 * 💡 Bisa juga pakai string literal union:
 * type WellStatus = 'drilling' | 'producing' | 'suspended' | 'abandoned';
 */
export enum WellStatus {
  Drilling = 'drilling',
  Producing = 'producing',
  Suspended = 'suspended',
  Abandoned = 'abandoned',
  Completed = 'completed',
  Planning = 'planning'
}

export enum WellType {
  Oil = 'oil',
  Gas = 'gas',
  Water = 'water',
  Injection = 'injection',
  Observation = 'observation'
}

export enum MeasurementUnit {
  Meters = 'm',
  Feet = 'ft',
  Celsius = '°C',
  Fahrenheit = '°F',
  PSI = 'psi',
  Bar = 'bar',
  MetersPerSecond = 'm/s',
  BarrelsPerDay = 'bbl/d'
}

// ===== INTERFACES =====

/** Geographic location */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  elevation?: number;
  elevationUnit?: MeasurementUnit;
}

/** Depth information */
export interface DepthInfo {
  current: number;
  planned: number;
  unit: MeasurementUnit;
  bitDepth?: number;
  holeDepth?: number;
}

/** Well metadata */
export interface Well {
  uid: string;
  name: string;
  field: string;
  operator: string;
  country: string;
  region: string;
  status: WellStatus;
  type: WellType;
  location: GeoLocation;
  depth: DepthInfo;
  spudDate: Date;
  lastUpdated: Date;
  rigName?: string;
  licensee?: string;
}

/** Well summary for list views */
export interface WellSummary {
  uid: string;
  name: string;
  field: string;
  status: WellStatus;
  type: WellType;
  currentDepth: number;
  depthUnit: MeasurementUnit;
  lastUpdated: Date;
}

/** Well detail with full data */
export interface WellDetail extends Well {
  logs: LogCurve[];
  trajectories: TrajectoryPoint[];
  mudLogs: MudLogEntry[];
  sensors: SensorInfo[];
}

// ===== LOG DATA =====

export interface LogCurve {
  uid: string;
  name: string;
  mnemonic: string;
  unit: string;
  description: string;
  data: LogDataPoint[];
}

export interface LogDataPoint {
  index: number; // depth or time index
  value: number;
  timestamp: Date;
  quality?: DataQuality;
}

export enum DataQuality {
  Good = 'good',
  Suspect = 'suspect',
  Bad = 'bad',
  Missing = 'missing'
}

// ===== TRAJECTORY =====

export interface TrajectoryPoint {
  measuredDepth: number;
  inclination: number;
  azimuth: number;
  tvd: number; // True Vertical Depth
  northing: number;
  easting: number;
  doglegSeverity?: number;
}

// ===== MUD LOG =====

export interface MudLogEntry {
  depth: number;
  gasTotal: number;
  gasC1: number; // Methane
  gasC2: number; // Ethane
  rateOfPenetration: number;
  lithology: string;
  description: string;
  timestamp: Date;
}

// ===== SENSOR =====

export interface SensorInfo {
  uid: string;
  name: string;
  type: SensorType;
  unit: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
  status: 'active' | 'inactive' | 'error';
  lastReading: Date;
}

export enum SensorType {
  Temperature = 'temperature',
  Pressure = 'pressure',
  FlowRate = 'flow_rate',
  Torque = 'torque',
  RPM = 'rpm',
  WeightOnBit = 'wob',
  MudWeight = 'mud_weight',
  GasDetector = 'gas_detector'
}

// ===== API RESPONSE TYPES =====

/** Generic paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** API error response */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: Date;
}

/** Filter/query params for wells */
export interface WellQueryParams {
  search?: string;
  status?: WellStatus[];
  type?: WellType[];
  field?: string;
  operator?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Well;
  sortOrder?: 'asc' | 'desc';
}
