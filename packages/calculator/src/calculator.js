import { assertValidInputs } from './validator.js';

export const HOURS_PER_YEAR = 8760;
export const KW_PER_MW = 1000;
export const LITRES_PER_MEGALITRE = 1000000;
export const FORMULA_VERSION = '1.0';

/**
 * Rounds a number to a specified number of decimal places to prevent IEEE 754 float artifacts.
 *
 * @param {number|null} value
 * @param {number} [decimals=6]
 * @returns {number|null}
 */
export function roundToPrecision(value, decimals = 6) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return value;
  }
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates deterministic sustainability metrics for a data centre facility scenario.
 *
 * @param {object} rawInputs
 * @param {number} rawInputs.itLoadMW - IT load in megawatts (> 0)
 * @param {number} rawInputs.pue - Power Usage Effectiveness (>= 1.0)
 * @param {number} rawInputs.utilisation - Server utilisation factor (0.0 to 1.0)
 * @param {number} rawInputs.renewableShare - Scenario renewable energy share (0.0 to 1.0)
 * @param {number|null} [rawInputs.wue] - Water Usage Effectiveness in L/kWh IT energy (0.0 to 5.0)
 * @returns {object} Calculated metrics, breakdown, metadata, and transparent disclaimers
 */
export function calculateFacilityMetrics(rawInputs) {
  // Validate and sanitize inputs strictly
  const inputs = assertValidInputs(rawInputs);

  const { itLoadMW, pue, utilisation, renewableShare, wue } = inputs;

  // 1. Facility Power (MW) = IT Load × PUE
  const facilityPowerMW = roundToPrecision(itLoadMW * pue, 6);

  // 2. Annual IT Energy (kWh/year) = IT Load (MW) × 1,000 × 8,760 × utilisation
  const annualITEnergyKWh = roundToPrecision(
    itLoadMW * KW_PER_MW * HOURS_PER_YEAR * utilisation,
    4
  );

  // 3. Annual Facility Energy (kWh/year) = IT Load (MW) × 1,000 × PUE × 8,760 × utilisation
  const annualFacilityEnergyKWh = roundToPrecision(
    itLoadMW * KW_PER_MW * pue * HOURS_PER_YEAR * utilisation,
    4
  );

  // Facility overhead energy (Cooling, lighting, power distribution losses)
  const annualOverheadEnergyKWh = roundToPrecision(
    annualFacilityEnergyKWh - annualITEnergyKWh,
    4
  );

  // 4. Renewable-Equivalent Energy (kWh/year) = Annual Facility Energy × Renewable Share
  // Notice: This is a scenario assumption estimate, not physically verified consumption.
  const renewableEquivalentKWh = roundToPrecision(
    annualFacilityEnergyKWh * renewableShare,
    4
  );

  // 5. Estimated Annual Water Consumption
  // Missing WUE is treated strictly as null (unavailable), never assumed as zero.
  let estimatedWaterLitres = null;
  let estimatedWaterML = null;
  let waterStatus = 'unavailable';

  if (wue !== null) {
    estimatedWaterLitres = roundToPrecision(annualITEnergyKWh * wue, 4);
    estimatedWaterML = roundToPrecision(estimatedWaterLitres / LITRES_PER_MEGALITRE, 6);
    waterStatus = 'calculated_estimate';
  }

  return {
    inputs: {
      itLoadMW,
      pue,
      utilisation,
      renewableShare,
      wue
    },
    outputs: {
      facilityPowerMW,
      annualITEnergyKWh,
      annualFacilityEnergyKWh,
      annualOverheadEnergyKWh,
      renewableEquivalentKWh,
      estimatedWaterLitres,
      estimatedWaterML
    },
    metadata: {
      formulaVersion: FORMULA_VERSION,
      waterBasis: 'IT energy',
      isEstimate: true,
      hoursPerYear: HOURS_PER_YEAR,
      dataStatus: {
        inputs: {
          itLoadMW: 'user_assumption',
          pue: 'user_assumption',
          utilisation: 'user_assumption',
          renewableShare: 'user_assumption',
          wue: wue !== null ? 'user_assumption' : 'missing'
        },
        outputs: {
          facilityPowerMW: 'calculated_estimate',
          annualITEnergyKWh: 'calculated_estimate',
          annualFacilityEnergyKWh: 'calculated_estimate',
          annualOverheadEnergyKWh: 'calculated_estimate',
          renewableEquivalentKWh: 'scenario_estimate',
          estimatedWaterLitres: waterStatus,
          estimatedWaterML: waterStatus
        }
      },
      disclaimers: {
        renewableEquivalent:
          'Renewable-equivalent energy is a scenario calculation based on user-entered renewable share assumption. It does not represent physically verified renewable electricity supply or hourly grid matching.',
        waterConsumption:
          wue !== null
            ? 'Estimated water consumption is calculated on an IT-energy basis (L/kWh IT). Actual water use varies based on cooling technology, local wet-bulb temperature, and load profile.'
            : 'Water consumption is unavailable because WUE was not provided. GreenDC India does not assume a default WUE to avoid misleading estimates.',
        operationalEnergy:
          'Annual energy calculations assume continuous operation at the specified average IT load and utilisation over 8,760 hours per year.'
      }
    }
  };
}
