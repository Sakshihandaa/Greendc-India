# GreenDC India

**GreenDC India** is an open-source, decision-support platform designed to explore the sustainability implications of AI data-centre infrastructure in India. It translates research on renewable energy, power demand, cooling water requirements, and regional environmental indicators into an explainable, transparent application.

> **Project Notice**: GreenDC India is an educational/research prototype. It provides transparent scenario estimations and multi-criteria screening aids, not certified engineering blueprints, financial guarantees, or official environmental clearance decisions.

---

## Architecture Overview

```
greendc-india/
├── apps/
│   ├── web/               # React + Vite + Tailwind CSS (UI & Visualisations - Milestone 3)
│   ├── api/               # Node.js + Express (REST API & Data Services - Milestone 2)
│   └── ai-service/        # Python + FastAPI (Curated RAG Assistant - Phase 3)
├── packages/
│   └── calculator/        # Deterministic calculation engine & validators (Milestone 1)
├── data/
│   ├── raw/               # Unmodified source files with provenance records
│   ├── processed/         # Cleaned, standardized datasets
│   └── schemas/           # Data & validation schemas
├── docs/
│   ├── GreenDC_India_PRD.docx
│   ├── GreenDC_India_Technical_Requirements.docx
│   └── methodology.md
├── .env.example
└── package.json
```

---

## Core Calculation Rules

All sustainability calculations are executed using deterministic mathematical functions:

1. **Facility Power**:
   $$\text{Facility Power (MW)} = \text{IT Load (MW)} \times \text{PUE}$$
2. **Annual IT Energy**:
   $$\text{Annual IT Energy (kWh/year)} = \text{IT Load (MW)} \times 1,000 \times 8,760 \times \text{Utilisation}$$
3. **Annual Facility Energy**:
   $$\text{Annual Facility Energy (kWh/year)} = \text{IT Load (MW)} \times 1,000 \times \text{PUE} \times 8,760 \times \text{Utilisation}$$
4. **Renewable-Equivalent Energy**:
   $$\text{Renewable-Equivalent Energy (kWh/year)} = \text{Annual Facility Energy} \times \text{Renewable Share}$$
   *(Note: This is an entered scenario assumption, not proof of physical grid delivery or hourly matching).*
5. **Estimated Annual Water Consumption**:
   $$\text{Estimated Water (Litres/year)} = \text{Annual IT Energy (kWh/year)} \times \text{WUE (L/kWh IT energy)}$$
   $$\text{Estimated Water (ML/year)} = \frac{\text{Estimated Water (Litres/year)}}{1,000,000}$$
   *(Note: Water consumption is only calculated when WUE is explicitly provided. When WUE is omitted, water consumption is reported as `null` / unavailable, never assumed as zero).*

---

## API Endpoints (`apps/api`)

### 1. Health Check
`GET /api/health`
Returns service availability, timestamp, and uptime.
```json
{
  "status": "healthy",
  "service": "greendc-india-api",
  "version": "1.0.0",
  "timestamp": "2026-10-14T21:58:00.000Z",
  "uptimeSeconds": 42
}
```

### 2. Simulation Calculator
`POST /api/simulations/calculate`

**Request Body:**
```json
{
  "itLoadMW": 10,
  "pue": 1.5,
  "utilisation": 0.8,
  "renewableShare": 0.4,
  "wue": 1.2
}
```

**Success Response (200 OK):**
```json
{
  "inputs": {
    "itLoadMW": 10,
    "pue": 1.5,
    "utilisation": 0.8,
    "renewableShare": 0.4,
    "wue": 1.2
  },
  "outputs": {
    "facilityPowerMW": 15,
    "annualITEnergyKWh": 70080000,
    "annualFacilityEnergyKWh": 105120000,
    "annualOverheadEnergyKWh": 35040000,
    "renewableEquivalentKWh": 42048000,
    "estimatedWaterLitres": 84096000,
    "estimatedWaterML": 84.096
  },
  "units": {
    "facilityPowerMW": "MW",
    "annualITEnergyKWh": "kWh/year",
    "annualFacilityEnergyKWh": "kWh/year",
    "annualOverheadEnergyKWh": "kWh/year",
    "renewableEquivalentKWh": "kWh/year",
    "estimatedWaterLitres": "Litres/year",
    "estimatedWaterML": "Megalitres/year"
  },
  "metadata": {
    "formulaVersion": "1.0",
    "waterBasis": "IT energy",
    "isEstimate": true,
    "hoursPerYear": 8760,
    "dataStatus": {
      "inputs": {
        "itLoadMW": "user_assumption",
        "pue": "user_assumption",
        "utilisation": "user_assumption",
        "renewableShare": "user_assumption",
        "wue": "user_assumption"
      },
      "outputs": {
        "facilityPowerMW": "calculated_estimate",
        "annualITEnergyKWh": "calculated_estimate",
        "annualFacilityEnergyKWh": "calculated_estimate",
        "annualOverheadEnergyKWh": "calculated_estimate",
        "renewableEquivalentKWh": "scenario_estimate",
        "estimatedWaterLitres": "calculated_estimate",
        "estimatedWaterML": "calculated_estimate"
      }
    },
    "disclaimers": { ... }
  }
}
```

**Error Response Format (400 Bad Request):**
```json
{
  "error": {
    "code": "OUT_OF_RANGE",
    "message": "PUE must be at least 1 and at most 5.",
    "field": "pue"
  }
}
```

---

## Current Status

- [x] **Milestone 1**: Project scaffolding, preserved DOCX documents, `@greendc/calculator` package with 22 unit tests.
- [x] **Milestone 2**: Express API under `apps/api` with health check, simulation calculation, structured validation error handling, and 10 integration tests.
- [x] **Milestone 3**: Premium Interactive Geospatial Platform (`apps/web`) with Leaflet India state boundary explorer, curated facility pins, energy/water simulator integration, and Recharts analytics.
- [ ] **Milestone 4**: Location intelligence ranking engine (MCDA multi-criteria screening).
- [ ] **Milestone 5**: Curated RAG AI Assistant with citations.

---

## Getting Started

### Prerequisites
- Node.js `v20+` (tested on `v24.20.0`)
- npm `10+` (run `npm.cmd` on Windows PowerShell if execution policies restrict `.ps1`)

### 1. Installation
Install and link all workspace packages:
```bash
npm install
```

### 2. Running Automated Tests
Run all 32 tests (calculator unit tests + Express API integration tests):
```bash
npm test
```

### 3. Running Backend & Frontend Together

**Terminal 1 — Start the Express API (Port 5000):**
```bash
npm run start:api
```

**Terminal 2 — Start the Vite React Frontend (Port 5173):**
```bash
npm run dev:web
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend automatically proxies API calls to `http://localhost:5000`.

### 4. Building for Production
```bash
npm run build:web
```
