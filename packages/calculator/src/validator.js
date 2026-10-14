import { ValidationError } from './errors.js';

/**
 * Validation constraints for simulation inputs.
 */
export const VALIDATION_LIMITS = {
  IT_LOAD_MW: { MIN: 0, MAX: 5000 },
  PUE: { MIN: 1.0, MAX: 5.0 },
  UTILISATION: { MIN: 0.0, MAX: 1.0 },
  RENEWABLE_SHARE: { MIN: 0.0, MAX: 1.0 },
  WUE: { MIN: 0.0, MAX: 5.0 }
};

/**
 * Validates simulation input parameters without throwing.
 *
 * @param {object} inputs
 * @returns {{ isValid: boolean, errors: Array<{ field: string, message: string, code: string }>, sanitized: object | null }}
 */
export function validateSimulationInputs(inputs) {
  const errors = [];

  if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) {
    return {
      isValid: false,
      errors: [{ field: 'inputs', message: 'Input parameters must be provided as an object.', code: 'INVALID_PAYLOAD' }],
      sanitized: null
    };
  }

  const { itLoadMW, pue, utilisation, renewableShare, wue } = inputs;

  // 1. IT Load (MW) - Required, finite, > 0, <= 5000
  if (itLoadMW === undefined || itLoadMW === null || itLoadMW === '') {
    errors.push({ field: 'itLoadMW', message: 'IT load (MW) is required.', code: 'MISSING_FIELD' });
  } else if (typeof itLoadMW !== 'number' || !Number.isFinite(itLoadMW)) {
    errors.push({ field: 'itLoadMW', message: 'IT load (MW) must be a finite number.', code: 'INVALID_TYPE' });
  } else if (itLoadMW <= VALIDATION_LIMITS.IT_LOAD_MW.MIN || itLoadMW > VALIDATION_LIMITS.IT_LOAD_MW.MAX) {
    errors.push({
      field: 'itLoadMW',
      message: `IT load must be greater than ${VALIDATION_LIMITS.IT_LOAD_MW.MIN} MW and at most ${VALIDATION_LIMITS.IT_LOAD_MW.MAX} MW.`,
      code: 'OUT_OF_RANGE'
    });
  }

  // 2. PUE - Required, finite, >= 1.0, <= 5.0
  if (pue === undefined || pue === null || pue === '') {
    errors.push({ field: 'pue', message: 'PUE is required.', code: 'MISSING_FIELD' });
  } else if (typeof pue !== 'number' || !Number.isFinite(pue)) {
    errors.push({ field: 'pue', message: 'PUE must be a finite number.', code: 'INVALID_TYPE' });
  } else if (pue < VALIDATION_LIMITS.PUE.MIN || pue > VALIDATION_LIMITS.PUE.MAX) {
    errors.push({
      field: 'pue',
      message: `PUE must be at least ${VALIDATION_LIMITS.PUE.MIN} and at most ${VALIDATION_LIMITS.PUE.MAX}.`,
      code: 'OUT_OF_RANGE'
    });
  }

  // 3. Utilisation - Required, finite, 0 <= utilisation <= 1.0
  if (utilisation === undefined || utilisation === null || utilisation === '') {
    errors.push({ field: 'utilisation', message: 'Utilisation factor is required.', code: 'MISSING_FIELD' });
  } else if (typeof utilisation !== 'number' || !Number.isFinite(utilisation)) {
    errors.push({ field: 'utilisation', message: 'Utilisation must be a finite number between 0 and 1.', code: 'INVALID_TYPE' });
  } else if (utilisation < VALIDATION_LIMITS.UTILISATION.MIN || utilisation > VALIDATION_LIMITS.UTILISATION.MAX) {
    errors.push({
      field: 'utilisation',
      message: `Utilisation factor must be between ${VALIDATION_LIMITS.UTILISATION.MIN} and ${VALIDATION_LIMITS.UTILISATION.MAX} (inclusive).`,
      code: 'OUT_OF_RANGE'
    });
  }

  // 4. Renewable Share - Required, finite, 0 <= renewableShare <= 1.0
  if (renewableShare === undefined || renewableShare === null || renewableShare === '') {
    errors.push({ field: 'renewableShare', message: 'Renewable share is required.', code: 'MISSING_FIELD' });
  } else if (typeof renewableShare !== 'number' || !Number.isFinite(renewableShare)) {
    errors.push({ field: 'renewableShare', message: 'Renewable share must be a finite number between 0 and 1.', code: 'INVALID_TYPE' });
  } else if (renewableShare < VALIDATION_LIMITS.RENEWABLE_SHARE.MIN || renewableShare > VALIDATION_LIMITS.RENEWABLE_SHARE.MAX) {
    errors.push({
      field: 'renewableShare',
      message: `Renewable share must be between ${VALIDATION_LIMITS.RENEWABLE_SHARE.MIN} and ${VALIDATION_LIMITS.RENEWABLE_SHARE.MAX} (inclusive).`,
      code: 'OUT_OF_RANGE'
    });
  }

  // 5. WUE (L/kWh IT energy) - Optional, but if provided must be finite and 0 <= wue <= 5.0
  let sanitizedWUE = null;
  if (wue !== undefined && wue !== null && wue !== '') {
    if (typeof wue !== 'number' || !Number.isFinite(wue)) {
      errors.push({ field: 'wue', message: 'WUE must be a finite number when provided.', code: 'INVALID_TYPE' });
    } else if (wue < VALIDATION_LIMITS.WUE.MIN || wue > VALIDATION_LIMITS.WUE.MAX) {
      errors.push({
        field: 'wue',
        message: `WUE must be between ${VALIDATION_LIMITS.WUE.MIN} and ${VALIDATION_LIMITS.WUE.MAX} L/kWh IT energy.`,
        code: 'OUT_OF_RANGE'
      });
    } else {
      sanitizedWUE = wue;
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      sanitized: null
    };
  }

  return {
    isValid: true,
    errors: [],
    sanitized: {
      itLoadMW,
      pue,
      utilisation,
      renewableShare,
      wue: sanitizedWUE
    }
  };
}

/**
 * Asserts that input parameters are valid, throwing ValidationError on the first failure.
 *
 * @param {object} inputs
 * @returns {object} sanitized inputs
 * @throws {ValidationError}
 */
export function assertValidInputs(inputs) {
  const result = validateSimulationInputs(inputs);
  if (!result.isValid) {
    const firstError = result.errors[0];
    throw new ValidationError(firstError.message, firstError.field, firstError.code);
  }
  return result.sanitized;
}
