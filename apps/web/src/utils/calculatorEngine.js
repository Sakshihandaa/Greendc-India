import { calculateFacilityMetrics, validateSimulationInputs } from '@greendc/calculator';

// CEA Grid Emission Factors (kg CO2e per kWh) - Central Electricity Authority Baseline
export const GRID_EMISSION_FACTORS = {
  national: { name: 'National Grid Average (CEA)', factor: 0.716 },
  maharashtra: { name: 'Maharashtra (WR)', factor: 0.785 },
  tamilnadu: { name: 'Tamil Nadu (SR)', factor: 0.640 },
  karnataka: { name: 'Karnataka (SR)', factor: 0.580 },
  uttarpradesh: { name: 'Uttar Pradesh (NR)', factor: 0.810 },
  gujarat: { name: 'Gujarat (WR)', factor: 0.730 },
  telangana: { name: 'Telangana (SR)', factor: 0.690 },
};

// Typical Industrial HT Power Tariff in India (₹ INR per kWh)
export const INDUSTRIAL_POWER_TARIFF_INR = 7.65;

/**
 * Calculates complete sustainability, carbon, and financial metrics.
 * Runs instantly in the client and queries Express API if available.
 */
export async function runSimulationWithFallback(inputs) {
  // Try Express API first with a short timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);

    const res = await fetch('/api/simulations/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return enrichResults(data, inputs, 'api');
    }
  } catch (err) {
    // API is offline or slow, proceed to local deterministic engine
  }

  // Local deterministic calculation via @greendc/calculator
  try {
    const localResult = calculateFacilityMetrics({
      itLoadMW: Number(inputs.itLoadMW),
      pue: Number(inputs.pue),
      utilisation: Number(inputs.utilisation),
      renewableShare: Number(inputs.renewableShare),
      wue: inputs.wue !== null && inputs.wue !== undefined && inputs.wue !== '' ? Number(inputs.wue) : null
    });

    return enrichResults(localResult, inputs, 'local');
  } catch (err) {
    return {
      error: err.message,
      engine: 'error'
    };
  }
}

/**
 * Enriches base calculator metrics with Indian Scope-2 Carbon Footprint & Financials.
 */
function enrichResults(baseResult, inputs, engineType) {
  const outputs = baseResult.outputs;
  const gridKey = inputs.gridRegion || 'national';
  const gridFactor = GRID_EMISSION_FACTORS[gridKey]?.factor || 0.716;

  // Annual Facility Energy in MWh and GWh
  const annualFacilityEnergyMWh = outputs.annualFacilityEnergyKWh / 1000;
  const annualFacilityEnergyGWh = outputs.annualFacilityEnergyKWh / 1000000;
  const annualITEnergyGWh = outputs.annualITEnergyKWh / 1000000;
  const annualOverheadGWh = outputs.annualOverheadEnergyKWh / 1000000;

  // Scope 2 Carbon Emissions
  // Gross emissions without renewable offset (Metric Tonnes CO2e)
  const grossEmissionsTonnes = (outputs.annualFacilityEnergyKWh * gridFactor) / 1000;
  // Emissions avoided via renewable energy
  const avoidedEmissionsTonnes = (outputs.renewableEquivalentKWh * gridFactor) / 1000;
  // Net Scope 2 emissions
  const netEmissionsTonnes = Math.max(0, grossEmissionsTonnes - avoidedEmissionsTonnes);

  // Tree offset equivalent (~21.7 kg CO2 absorbed per mature tree per year)
  const treesOffsetEquivalent = Math.round(avoidedEmissionsTonnes * 1000 / 21.77);
  // Passenger cars off the road equivalent (~4.6 tonnes CO2 per passenger car per year)
  const carsOffTheRoadEquivalent = Math.round(avoidedEmissionsTonnes / 4.6);

  // Water Metrics
  const annualWaterML = outputs.estimatedWaterML;
  const dailyWaterKL = annualWaterML !== null ? (annualWaterML * 1000) / 365 : null;
  // 1 Olympic swimming pool = ~2.5 Megalitres (ML)
  const olympicPoolsEquivalent = annualWaterML !== null ? Math.round((annualWaterML / 2.5) * 10) / 10 : null;

  // Financial Energy Cost (₹ Crores per year)
  // 1 Crore = 10,000,000 INR
  const annualElectricityBillINR = outputs.annualFacilityEnergyKWh * INDUSTRIAL_POWER_TARIFF_INR;
  const annualElectricityBillCrores = Math.round((annualElectricityBillINR / 10000000) * 100) / 100;

  // Efficiency Grade
  let efficiencyGrade = 'A+';
  let efficiencyText = 'Ultra-Efficient (Next-Gen Liquid Cooling)';
  if (inputs.pue > 1.6) {
    efficiencyGrade = 'D';
    efficiencyText = 'High Overhead (Legacy Air-Cooled)';
  } else if (inputs.pue > 1.45) {
    efficiencyGrade = 'C';
    efficiencyText = 'Standard Commercial Tier-3';
  } else if (inputs.pue > 1.30) {
    efficiencyGrade = 'B';
    efficiencyText = 'Good Modern Efficiency';
  } else if (inputs.pue > 1.18) {
    efficiencyGrade = 'A';
    efficiencyText = 'Hyperscale Direct-to-Chip Benchmark';
  }

  return {
    ...baseResult,
    engine: engineType,
    gridFactorUsed: gridFactor,
    gridRegionName: GRID_EMISSION_FACTORS[gridKey]?.name || 'National Grid Average',
    derived: {
      annualFacilityEnergyGWh: Math.round(annualFacilityEnergyGWh * 100) / 100,
      annualITEnergyGWh: Math.round(annualITEnergyGWh * 100) / 100,
      annualOverheadGWh: Math.round(annualOverheadGWh * 100) / 100,
      grossEmissionsTonnes: Math.round(grossEmissionsTonnes),
      avoidedEmissionsTonnes: Math.round(avoidedEmissionsTonnes),
      netEmissionsTonnes: Math.round(netEmissionsTonnes),
      treesOffsetEquivalent,
      carsOffTheRoadEquivalent,
      dailyWaterKL: dailyWaterKL !== null ? Math.round(dailyWaterKL * 10) / 10 : null,
      olympicPoolsEquivalent,
      annualElectricityBillCrores,
      efficiencyGrade,
      efficiencyText
    }
  };
}
