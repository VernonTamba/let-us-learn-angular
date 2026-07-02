# 07 - WITSML Data Standard Concepts

## Overview

**WITSML** (Wellsite Information Transfer Standard Markup Language) adalah standard industri Oil & Gas untuk transfer data dari wellsite. Dikembangkan oleh **Energistics**, standard ini memungkinkan interoperability antar vendor dan sistem.

---

## Kenapa WITSML Penting?

Dalam operasi pengeboran Oil & Gas:
- Sensor di rig mengirim data 24/7
- Multiple vendor systems perlu berkomunikasi
- Data harus reliable untuk decision-making
- Safety critical - keputusan salah bisa fatal

WITSML menyediakan:
- Format data yang standar
- Protokol transfer yang defined
- Query mechanism yang consistent
- Real-time streaming capability

---

## WITSML Versions

| Version | Year | Protocol | Notes |
|---------|------|----------|-------|
| 1.3.1 | 2005 | SOAP/XML | Legacy, masih banyak dipakai |
| 1.4.1 | 2011 | SOAP/XML | Most widely adopted |
| 2.0 | 2016 | REST + ETP | Modern, WebSocket-based streaming |

### WITSML 2.0 & ETP
**ETP** (Energistics Transfer Protocol) adalah protokol real-time yang menggunakan WebSocket untuk streaming data. Ini relevan dengan project kita yang menggunakan WebSocket.

---

## Core Data Objects

### 1. Well
Informasi top-level tentang sumur.
```typescript
interface WitsmlWell {
  uid: string;
  name: string;
  field: string;
  operator: string;
  country: string;
  status: 'active' | 'drilling' | 'suspended' | 'abandoned';
  location: { latitude: number; longitude: number };
  spudDate: string;  // Tanggal mulai pengeboran
}
```

### 2. Wellbore
Sub-division dari well (satu well bisa punya multiple wellbores - sidetrack, re-entry).
```typescript
interface WitsmlWellbore {
  uid: string;
  uidWell: string;     // Parent well
  name: string;
  type: 'initial' | 'sidetrack' | 'reentry' | 'redrill';
  shape: 'vertical' | 'deviated' | 'horizontal' | 's-shape';
  md: { value: number; uom: string };  // Measured Depth
  tvd: { value: number; uom: string }; // True Vertical Depth
}
```

### 3. Log
Data logging - time-based atau depth-based.
```typescript
interface WitsmlLog {
  uid: string;
  name: string;
  indexType: 'measured depth' | 'date time';
  startIndex: number;
  endIndex: number;
  logCurveInfo: LogCurve[];  // Channels/curves
  logData: string[][];        // Actual data rows
}
```

### 4. Trajectory
Data arah pengeboran (directional drilling).
```typescript
interface WitsmlTrajectory {
  stations: {
    md: number;           // Measured Depth
    tvd: number;          // True Vertical Depth
    inclination: number;  // Angle from vertical (0-180)
    azimuth: number;      // Compass direction (0-360)
    dls: number;          // Dogleg Severity (rate of curvature)
  }[];
}
```

### 5. MudLog
Data dari lumpur pengeboran dan formasi batuan.
```typescript
interface WitsmlMudLog {
  depth: number;
  gasTotal: number;
  lithology: string;
  rateOfPenetration: number;
  description: string;
}
```

---

## Drilling Parameters (Real-time Data)

Data yang streaming real-time dari rig:

| Parameter | Abbreviation | Unit | Description |
|-----------|-------------|------|-------------|
| Bit Depth | BD | m/ft | Posisi current bit |
| Hole Depth | HD | m/ft | Total kedalaman lubang |
| Weight on Bit | WOB | klbs | Tekanan pada bit |
| Rotary RPM | RPM | rpm | Kecepatan putaran |
| Rate of Penetration | ROP | ft/hr | Kecepatan pengeboran |
| Torque | TQ | kft-lbs | Momen putar |
| Standpipe Pressure | SPP | psi | Tekanan pompa |
| Flow Rate | FR | gpm | Aliran lumpur |
| Mud Weight In | MWI | ppg | Berat lumpur masuk |
| Mud Weight Out | MWO | ppg | Berat lumpur keluar |
| Mud Temperature In | MTI | °F | Suhu lumpur masuk |
| Mud Temperature Out | MTO | °F | Suhu lumpur keluar |
| Total Gas | TG | units | Gas terdeteksi |
| H2S | H2S | ppm | Hidrogen Sulfida (BAHAYA!) |

---

## Data Flow Architecture

```
                    WELLSITE (Rig)
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
 Sensors            MWD/LWD             Gas Detector
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    WITS/WITSML
                    Data Acquisition
                         │
                    ┌────┴────┐
                    │  Server  │ (WITSML Store)
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         Real-time    Database    Reports
         Dashboard   (Historical)
         (Our App!)
```

---

## Relevansi dengan Angular App Kita

### Real-time Data → WebSocket Service
```typescript
// Sensor data streaming via WebSocket (ETP-like protocol)
this.wsService.connect(wellId);
this.wsService.getSensorDataStream().pipe(
  bufferTime(1000),  // Batch updates
  filter(batch => batch.length > 0)
).subscribe(data => this.updateDashboard(data));
```

### Historical Data → HTTP Service
```typescript
// Query historical logs via REST API
this.http.get<WitsmlLog>('/api/wells/${wellId}/logs', {
  params: { startDepth: '3000', endDepth: '3500', curves: 'ROP,WOB,RPM' }
});
```

### Data Models → TypeScript Interfaces
Lihat `src/app/core/models/witsml.model.ts` untuk implementasi lengkap.

---

## Istilah Penting Oil & Gas

| Term | Description |
|------|-------------|
| **Spud** | Mulai pengeboran sumur baru |
| **TD** | Total Depth - kedalaman akhir |
| **Kick** | Influx formasi ke wellbore (darurat!) |
| **BOP** | Blowout Preventer - safety equipment |
| **Casing** | Pipa pelindung dinding sumur |
| **Mud** | Fluida pengeboran (cooling, lifting cuttings) |
| **Trip** | Mengeluarkan/memasukkan drill string |
| **RIH** | Run In Hole |
| **POOH** | Pull Out Of Hole |
| **WOC** | Waiting On Cement |
| **NPT** | Non-Productive Time |
| **HSE** | Health, Safety & Environment |

---

## Pertanyaan Interview yang Mungkin Muncul

1. "Apa itu WITSML dan kenapa penting?"
   - Standard untuk transfer data wellsite, memungkinkan interoperability

2. "Bagaimana handle real-time data dari multiple wells?"
   - WebSocket per well, buffer/batch updates, OnPush + Signals for performance

3. "Apa bedanya Measured Depth dan True Vertical Depth?"
   - MD = panjang aktual lubang (mengikuti kurva), TVD = kedalaman vertikal sebenarnya

4. "Bagaimana handle data quality issues?"
   - Quality flags per reading, validation rules, fallback values

5. "Bagaimana scale untuk monitoring 100+ wells simultaneously?"
   - Lazy loading per well, virtual scrolling, WebSocket multiplexing, micro-frontend

---

*Previous: [06-OPTIMIZATION.md](06-OPTIMIZATION.md) | Next: [08-INTERVIEW-PREPARATION.md](08-INTERVIEW-PREPARATION.md)*
