import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFacilityMetrics,
  validateSimulationInputs,
  ValidationError,
  HOURS_PER_YEAR,
  VALIDATION_LIMITS
} from '../src/index.js';

describe('GreenDC Sustainability Calculator Module', () => {
  describe('1. Normal Calculation (Reference Example from PRD & Technical Specs)', () => {
    it('should calculate exact metrics matching reference scenario (10 MW, 1.5 PUE, 80% util, 40% RE, 1.2 WUE)', () => {
      const inputs = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.4,
        wue: 1.2
      };

      const result = calculateFacilityMetrics(inputs);

      // Facility Power (MW) = 10 * 1.5 = 15 MW
      assert.equal(result.outputs.facilityPowerMW, 15);

      // Annual IT Energy (kWh) = 10 * 1,000 * 8,760 * 0.8 = 70,080,000 kWh
      assert.equal(result.outputs.annualITEnergyKWh, 70080000);

      // Annual Facility Energy (kWh) = 10 * 1,000 * 1.5 * 8,760 * 0.8 = 105,120,000 kWh
      assert.equal(result.outputs.annualFacilityEnergyKWh, 105120000);

      // Overhead energy = 105,120,000 - 70,080,000 = 35,040,000 kWh
      assert.equal(result.outputs.annualOverheadEnergyKWh, 35040000);

      // Renewable-Equivalent (kWh) = 105,120,000 * 0.4 = 42,048,000 kWh
      assert.equal(result.outputs.renewableEquivalentKWh, 42048000);

      // Estimated Water (Litres) = 70,080,000 * 1.2 = 84,096,000 Litres
      assert.equal(result.outputs.estimatedWaterLitres, 84096000);

      // Estimated Water (ML) = 84,096,000 / 1,000,000 = 84.096 ML
      assert.equal(result.outputs.estimatedWaterML, 84.096);

      // Verify metadata & provenance annotations
      assert.equal(result.metadata.formulaVersion, '1.0');
      assert.equal(result.metadata.waterBasis, 'IT energy');
      assert.equal(result.metadata.isEstimate, true);
      assert.equal(result.metadata.hoursPerYear, 8760);
      assert.equal(result.metadata.dataStatus.outputs.estimatedWaterLitres, 'calculated_estimate');
      assert.equal(result.metadata.dataStatus.outputs.renewableEquivalentKWh, 'scenario_estimate');
      assert.ok(result.metadata.disclaimers.renewableEquivalent.includes('scenario calculation'));
    });
  });

  describe('2. Minimum PUE (pue = 1.0)', () => {
    it('should calculate facility power equal to IT load and 0 overhead energy when PUE is 1.0', () => {
      const inputs = {
        itLoadMW: 25,
        pue: 1.0,
        utilisation: 0.6,
        renewableShare: 0.5,
        wue: 1.0
      };

      const result = calculateFacilityMetrics(inputs);

      assert.equal(result.outputs.facilityPowerMW, 25);
      assert.equal(result.outputs.annualITEnergyKWh, 25 * 1000 * 8760 * 0.6);
      assert.equal(result.outputs.annualFacilityEnergyKWh, result.outputs.annualITEnergyKWh);
      assert.equal(result.outputs.annualOverheadEnergyKWh, 0);
    });
  });

  describe('3. Utilisation Boundary Cases (0% and 100%)', () => {
    it('should return 0 energy and 0 water but preserve connected facility power capacity when utilisation is 0', () => {
      const inputs = {
        itLoadMW: 15,
        pue: 1.4,
        utilisation: 0,
        renewableShare: 0.5,
        wue: 1.5
      };

      const result = calculateFacilityMetrics(inputs);

      assert.equal(result.outputs.facilityPowerMW, 15 * 1.4);
      assert.equal(result.outputs.annualITEnergyKWh, 0);
      assert.equal(result.outputs.annualFacilityEnergyKWh, 0);
      assert.equal(result.outputs.annualOverheadEnergyKWh, 0);
      assert.equal(result.outputs.renewableEquivalentKWh, 0);
      assert.equal(result.outputs.estimatedWaterLitres, 0);
      assert.equal(result.outputs.estimatedWaterML, 0);
    });

    it('should calculate full 8,760 hours of operation when utilisation is 1.0 (100%)', () => {
      const inputs = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 1.0,
        renewableShare: 0.2,
        wue: 1.0
      };

      const result = calculateFacilityMetrics(inputs);

      const expectedITEnergy = 10 * 1000 * 8760 * 1.0;
      assert.equal(result.outputs.annualITEnergyKWh, expectedITEnergy);
      assert.equal(result.outputs.annualFacilityEnergyKWh, expectedITEnergy * 1.5);
    });
  });

  describe('4. Missing WUE & Unavailable Data Policy', () => {
    it('should treat missing WUE (null) as unavailable, returning null for water metrics rather than zero', () => {
      const inputs = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.4,
        wue: null
      };

      const result = calculateFacilityMetrics(inputs);

      assert.equal(result.outputs.estimatedWaterLitres, null);
      assert.equal(result.outputs.estimatedWaterML, null);
      assert.equal(result.metadata.dataStatus.outputs.estimatedWaterLitres, 'unavailable');
      assert.equal(result.metadata.dataStatus.outputs.estimatedWaterML, 'unavailable');
      assert.ok(result.metadata.disclaimers.waterConsumption.includes('unavailable because WUE was not provided'));
    });

    it('should treat omitted WUE (undefined) as unavailable, returning null for water metrics', () => {
      const inputs = {
        itLoadMW: 10,
        pue: 1.5,
        utilisation: 0.8,
        renewableShare: 0.4
      };

      const result = calculateFacilityMetrics(inputs);

      assert.equal(result.outputs.estimatedWaterLitres, null);
      assert.equal(result.outputs.estimatedWaterML, null);
      assert.equal(result.metadata.dataStatus.outputs.estimatedWaterLitres, 'unavailable');
    });
  });

  describe('5. Renewable Share Boundary Cases (0% and 100%)', () => {
    it('should return 0 renewable equivalent energy when renewableShare is 0', () => {
      const inputs = {
        itLoadMW: 5,
        pue: 1.3,
        utilisation: 0.75,
        renewableShare: 0,
        wue: null
      };

      const result = calculateFacilityMetrics(inputs);
      assert.equal(result.outputs.renewableEquivalentKWh, 0);
    });

    it('should return 100% of facility energy as renewable equivalent when renewableShare is 1.0', () => {
      const inputs = {
        itLoadMW: 5,
        pue: 1.3,
        utilisation: 0.75,
        renewableShare: 1.0,
        wue: null
      };

      const result = calculateFacilityMetrics(inputs);
      assert.equal(result.outputs.renewableEquivalentKWh, result.outputs.annualFacilityEnergyKWh);
    });
  });

  describe('6. Missing Required Inputs', () => {
    const validBase = {
      itLoadMW: 10,
      pue: 1.5,
      utilisation: 0.8,
      renewableShare: 0.5
    };

    it('should throw ValidationError when itLoadMW is missing', () => {
      const { itLoadMW, ...missingItLoad } = validBase;
      assert.throws(
        () => calculateFacilityMetrics(missingItLoad),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW' && err.code === 'MISSING_FIELD'
      );
    });

    it('should throw ValidationError when pue is missing', () => {
      const { pue, ...missingPue } = validBase;
      assert.throws(
        () => calculateFacilityMetrics(missingPue),
        (err) => err instanceof ValidationError && err.field === 'pue' && err.code === 'MISSING_FIELD'
      );
    });

    it('should throw ValidationError when utilisation is missing', () => {
      const { utilisation, ...missingUtilisation } = validBase;
      assert.throws(
        () => calculateFacilityMetrics(missingUtilisation),
        (err) => err instanceof ValidationError && err.field === 'utilisation' && err.code === 'MISSING_FIELD'
      );
    });

    it('should throw ValidationError when renewableShare is missing', () => {
      const { renewableShare, ...missingRenewableShare } = validBase;
      assert.throws(
        () => calculateFacilityMetrics(missingRenewableShare),
        (err) => err instanceof ValidationError && err.field === 'renewableShare' && err.code === 'MISSING_FIELD'
      );
    });

    it('should throw ValidationError when inputs object is null or undefined', () => {
      assert.throws(
        () => calculateFacilityMetrics(null),
        (err) => err instanceof ValidationError && err.field === 'inputs'
      );
      assert.throws(
        () => calculateFacilityMetrics(undefined),
        (err) => err instanceof ValidationError && err.field === 'inputs'
      );
    });
  });

  describe('7. Invalid Inputs & Out-of-Range Boundary Checks', () => {
    const validBase = {
      itLoadMW: 10,
      pue: 1.5,
      utilisation: 0.8,
      renewableShare: 0.5,
      wue: 1.2
    };

    it('should reject IT load <= 0', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, itLoadMW: 0 }),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, itLoadMW: -10 }),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW'
      );
    });

    it('should reject IT load exceeding maximum limit (5000 MW)', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, itLoadMW: 5001 }),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW' && err.code === 'OUT_OF_RANGE'
      );
    });

    it('should reject non-finite IT load (string, NaN, Infinity)', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, itLoadMW: '10' }),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW' && err.code === 'INVALID_TYPE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, itLoadMW: NaN }),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW' && err.code === 'INVALID_TYPE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, itLoadMW: Infinity }),
        (err) => err instanceof ValidationError && err.field === 'itLoadMW' && err.code === 'INVALID_TYPE'
      );
    });

    it('should reject PUE < 1.0 (physical minimum)', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, pue: 0.99 }),
        (err) => err instanceof ValidationError && err.field === 'pue' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, pue: -1 }),
        (err) => err instanceof ValidationError && err.field === 'pue'
      );
    });

    it('should reject PUE > 5.0', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, pue: 5.1 }),
        (err) => err instanceof ValidationError && err.field === 'pue' && err.code === 'OUT_OF_RANGE'
      );
    });

    it('should reject utilisation < 0 or > 1.0', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, utilisation: -0.1 }),
        (err) => err instanceof ValidationError && err.field === 'utilisation' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, utilisation: 1.05 }),
        (err) => err instanceof ValidationError && err.field === 'utilisation' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, utilisation: 80 }), // 80 instead of 0.8
        (err) => err instanceof ValidationError && err.field === 'utilisation' && err.code === 'OUT_OF_RANGE'
      );
    });

    it('should reject renewableShare < 0 or > 1.0', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, renewableShare: -0.05 }),
        (err) => err instanceof ValidationError && err.field === 'renewableShare' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, renewableShare: 1.1 }),
        (err) => err instanceof ValidationError && err.field === 'renewableShare' && err.code === 'OUT_OF_RANGE'
      );
    });

    it('should reject WUE < 0 or > 5.0 when provided', () => {
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, wue: -0.1 }),
        (err) => err instanceof ValidationError && err.field === 'wue' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, wue: 5.5 }),
        (err) => err instanceof ValidationError && err.field === 'wue' && err.code === 'OUT_OF_RANGE'
      );
      assert.throws(
        () => calculateFacilityMetrics({ ...validBase, wue: 'medium' }),
        (err) => err instanceof ValidationError && err.field === 'wue' && err.code === 'INVALID_TYPE'
      );
    });
  });

  describe('8. Non-throwing Validator Helper (validateSimulationInputs)', () => {
    it('should collect multiple validation errors in batch mode', () => {
      const invalidInputs = {
        itLoadMW: -5,
        pue: 0.8,
        utilisation: 1.5,
        renewableShare: -0.2,
        wue: 10
      };

      const result = validateSimulationInputs(invalidInputs);
      assert.equal(result.isValid, false);
      assert.equal(result.sanitized, null);
      assert.equal(result.errors.length, 5);

      const fieldNames = result.errors.map((e) => e.field);
      assert.ok(fieldNames.includes('itLoadMW'));
      assert.ok(fieldNames.includes('pue'));
      assert.ok(fieldNames.includes('utilisation'));
      assert.ok(fieldNames.includes('renewableShare'));
      assert.ok(fieldNames.includes('wue'));
    });
  });
});
