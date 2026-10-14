import { Router } from 'express';
import { calculateFacilityMetrics } from '@greendc/calculator';

const router = Router();

/**
 * Standard unit definitions for simulator outputs.
 */
export const METRIC_UNITS = {
  facilityPowerMW: 'MW',
  annualITEnergyKWh: 'kWh/year',
  annualFacilityEnergyKWh: 'kWh/year',
  annualOverheadEnergyKWh: 'kWh/year',
  renewableEquivalentKWh: 'kWh/year',
  estimatedWaterLitres: 'Litres/year',
  estimatedWaterML: 'Megalitres/year'
};

/**
 * POST /api/simulations/calculate
 * Calculate deterministic energy, power, and water requirements for a data centre facility.
 */
router.post('/calculate', (req, res, next) => {
  try {
    const rawInputs = req.body;
    const metrics = calculateFacilityMetrics(rawInputs);

    return res.status(200).json({
      inputs: metrics.inputs,
      outputs: metrics.outputs,
      units: METRIC_UNITS,
      metadata: metrics.metadata
    });
  } catch (error) {
    next(error);
  }
});

export default router;
