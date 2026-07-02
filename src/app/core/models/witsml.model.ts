/**
 * =============================================================================
 * WITSML.MODEL.TS - WITSML Data Standard Models
 * =============================================================================
 *
 * 📘 KONSEP: WITSML (Wellsite Information Transfer Standard Markup Language)
 *
 * WITSML adalah standard industri Oil & Gas untuk transfer data dari wellsite.
 * Standard ini mendefinisikan:
 * - Data objects (Well, Wellbore, Log, Trajectory, etc.)
 * - Query mechanisms
 * - Real-time data transfer protocols
 *
 * Version yang umum digunakan:
 * - WITSML 1.3.1 (legacy, masih banyak dipakai)
 * - WITSML 1.4.1 (widely adopted)
 * - WITSML 2.0 (latest, REST-based via ETP - Energistics Transfer Protocol)
 * =============================================================================
 */

// ===== WITSML CORE OBJECTS =====

/** WITSML Well Object */
export interface WitsmlWell {
  uid: string;
  name: string;
  nameLegal?: string;
  numLicense?: string;
  numGovt?: string;
  field?: string;
  country?: string;
  state?: string;
  county?: string;
  region?: string;
  operator?: string;
  operatorDiv?: string;
  timeZone?: string;
  statusWell?: WitsmlWellStatus;
  purposeWell?: string;
  dTimSpud?: string;  // ISO 8601 format
  dTimPa?: string;    // Plug & Abandon date
  wellLocation?: WitsmlLocation[];
}

/** WITSML Wellbore Object */
export interface WitsmlWellbore {
  uid: string;
  uidWell: string;
  name: string;
  nameWell: string;
  number?: string;
  suffixAPI?: string;
  statusWellbore?: WitsmlWellboreStatus;
  purposeWellbore?: string;
  typeWellbore?: WitsmlWellboreType;
  shape?: WitsmlWellboreShape;
  md?: WitsmlMeasuredDepthCoord;
  tvd?: WitsmlMeasuredDepthCoord;
  mdKickoff?: WitsmlMeasuredDepthCoord;
  dTimKickoff?: string;
}

/** WITSML Log Object */
export interface WitsmlLog {
  uid: string;
  uidWell: string;
  uidWellbore: string;
  name: string;
  nameWell: string;
  nameWellbore: string;
  indexType: WitsmlLogIndexType;
  startIndex?: string;
  endIndex?: string;
  startDateTimeIndex?: string;
  endDateTimeIndex?: string;
  direction?: 'increasing' | 'decreasing';
  indexCurve: string;
  logCurveInfo: WitsmlLogCurveInfo[];
  logData?: WitsmlLogData;
}

/** WITSML Trajectory Object */
export interface WitsmlTrajectory {
  uid: string;
  uidWell: string;
  uidWellbore: string;
  name: string;
  dTimTrajStart?: string;
  dTimTrajEnd?: string;
  mdMn?: WitsmlMeasuredDepthCoord;
  mdMx?: WitsmlMeasuredDepthCoord;
  trajectoryStation: WitsmlTrajectoryStation[];
}

// ===== SUPPORTING TYPES =====

export interface WitsmlLocation {
  uid?: string;
  latitude?: number;
  longitude?: number;
  easting?: number;
  northing?: number;
  crs?: string;
  description?: string;
}

export interface WitsmlMeasuredDepthCoord {
  value: number;
  uom: string; // Unit of measure (m, ft, etc.)
  datum?: string;
}

export interface WitsmlLogCurveInfo {
  uid: string;
  mnemonic: string;
  classWitsml?: string;
  unit?: string;
  curveDescription?: string;
  typeLogData?: 'double' | 'int' | 'string' | 'date time';
  sensorOffset?: WitsmlMeasuredDepthCoord;
}

export interface WitsmlLogData {
  mnemonicList: string;
  unitList: string;
  data: string[]; // CSV-like format per row
}

export interface WitsmlTrajectoryStation {
  uid: string;
  typeTrajStation: string;
  md: WitsmlMeasuredDepthCoord;
  tvd?: WitsmlMeasuredDepthCoord;
  incl?: number;
  azi?: number;
  dls?: number; // Dogleg severity
  dispNs?: number;
  dispEw?: number;
  dTimStn?: string;
}

// ===== ENUMS =====

export enum WitsmlWellStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  PA = 'permanently abandoned',
  TA = 'temporarily abandoned',
  Drilling = 'drilling',
  Producing = 'producing',
  Testing = 'testing'
}

export enum WitsmlWellboreStatus {
  Active = 'active',
  Inactive = 'inactive',
  Drilling = 'drilling',
  Completed = 'completed'
}

export enum WitsmlWellboreType {
  Initial = 'initial',
  Redrill = 'redrill',
  Reentry = 'reentry',
  Respud = 'respud',
  Sidetrack = 'sidetrack'
}

export enum WitsmlWellboreShape {
  Vertical = 'vertical',
  Deviated = 'deviated',
  Horizontal = 'horizontal',
  SShape = 's-shape',
  BuildAndHold = 'build and hold'
}

export enum WitsmlLogIndexType {
  MeasuredDepth = 'measured depth',
  DateTime = 'date time',
  ElapsedTime = 'elapsed time',
  VerticalDepth = 'vertical depth'
}

// ===== ETP (Energistics Transfer Protocol) =====
// Used in WITSML 2.0 for real-time streaming

export interface EtpMessage {
  protocol: number;
  messageType: number;
  correlationId: number;
  messageFlags: number;
  body: unknown;
}

export interface EtpStreamingData {
  channelId: number;
  indexes: EtpIndex[];
  value: EtpDataValue;
}

export interface EtpIndex {
  item: number | string;
}

export interface EtpDataValue {
  item: number | string | boolean;
}

export interface EtpChannel {
  channelId: number;
  channelUri: string;
  channelName: string;
  dataType: string;
  uom: string;
  startIndex?: number;
  endIndex?: number;
  description?: string;
  status: 'active' | 'inactive' | 'closed';
}
