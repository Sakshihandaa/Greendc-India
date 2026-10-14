# GreenDC India — Calculation Methodology & Data Rules

This document outlines the deterministic formulas, validation rules, missing-data policies, and assumptions used across the GreenDC India platform.

---

## 1. Constants & Conventions

- **Hours per year**: $8,760\text{ hours}$ ($365\text{ days} \times 24\text{ hours/day}$).
- **Energy conversion**: $1\text{ MW} = 1,000\text{ kW}$.
- **Water volume conversion**: $1\text{ Megalitre (ML)} = 1,000,000\text{ Litres (L)}$.

---

## 2. Input Parameters & Validation Rules

| Input Parameter | Key | Unit | Range / Constraints | Default / Missing Policy |
| :--- | :--- | :--- | :--- | :--- |
| **IT Load** | `itLoadMW` | MW | Finite number $> 0$, $\le 5,000$ | **Required**. No hidden defaults. |
| **Power Usage Effectiveness** | `pue` | dimensionless | Finite number $\ge 1.0$, $\le 5.0$ | **Required**. Lower bound strictly 1.0 (physical minimum). |
| **Utilisation Factor** | `utilisation` | fraction ($0–1$) | Finite number $\ge 0$ and $\le 1.0$ | **Required**. Represents average server capacity utilisation. |
| **Renewable Share** | `renewableShare` | fraction ($0–1$) | Finite number $\ge 0$ and $\le 1.0$ | **Required**. Scenario input for renewable-equivalent calculation. |
| **Water Usage Effectiveness** | `wue` | L/kWh IT energy | Finite number $\ge 0$ and $\le 5.0$ | **Optional**. When omitted or `null`, water consumption is strictly `null` (unavailable). |

---

## 3. Mathematical Formulas

### 3.1 Facility Power
$$\text{Facility Power (MW)} = \text{IT Load (MW)} \times \text{PUE}$$

### 3.2 Annual IT Energy
$$\text{Annual IT Energy (kWh/year)} = \text{IT Load (MW)} \times 1,000 \times 8,760 \times \text{Utilisation}$$

### 3.3 Annual Facility Energy
$$\text{Annual Facility Energy (kWh/year)} = \text{IT Load (MW)} \times 1,000 \times \text{PUE} \times 8,760 \times \text{Utilisation}$$
*(Equivalently: $\text{Annual IT Energy (kWh)} \times \text{PUE}$)*

### 3.4 Renewable-Equivalent Energy
$$\text{Renewable-Equivalent Energy (kWh/year)} = \text{Annual Facility Energy (kWh/year)} \times \text{Renewable Share}$$

> **Important Clarification**:
> This metric represents the arithmetic equivalent of facility energy corresponding to the user-entered renewable share assumption. It **must not** be described as physically verified or hourly matched renewable electricity supply.

### 3.5 Estimated Annual Water Consumption
$$\text{Estimated Water (Litres/year)} = \text{Annual IT Energy (kWh/year)} \times \text{WUE (L/kWh IT energy)}$$
$$\text{Estimated Water (ML/year)} = \frac{\text{Estimated Water (Litres/year)}}{1,000,000}$$

> **Water Metric Policy**:
> GreenDC India uses the **IT-energy basis** for WUE ($\text{L/kWh IT energy}$), in line with standard The Green Grid definitions. If WUE is not provided, water consumption is marked as `unavailable` (`null`). It is never silently assumed to be zero.

---

## 4. Edge Cases & Boundary Conditions

1. **Zero Utilisation ($\text{utilisation} = 0$)**:
   - Facility Power = $\text{IT Load} \times \text{PUE}$ (power capacity remains unchanged).
   - Annual IT Energy = $0\text{ kWh}$.
   - Annual Facility Energy = $0\text{ kWh}$.
   - Renewable-Equivalent Energy = $0\text{ kWh}$.
   - Estimated Water = $0\text{ L}$ (if WUE is provided) or `null` (if WUE is omitted).
2. **100% Utilisation ($\text{utilisation} = 1.0$)**:
   - Full capacity operation for all 8,760 hours in a year.
3. **Minimum PUE ($\text{pue} = 1.0$)**:
   - Ideal theoretical facility where all power delivered goes directly to IT equipment (Facility Power = IT Load; Facility Energy = IT Energy).
4. **Missing or Incomplete Data**:
   - Never convert missing inputs to zero or assume default values silently.
   - Return descriptive validation errors identifying the invalid/missing field.
