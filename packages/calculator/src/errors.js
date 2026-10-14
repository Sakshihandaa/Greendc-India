/**
 * Custom error class for GreenDC validation errors.
 */
export class ValidationError extends Error {
  /**
   * @param {string} message - Human-readable error description
   * @param {string} field - The name of the invalid or missing input field
   * @param {string} [code='VALIDATION_ERROR'] - Error code identifier
   */
  constructor(message, field, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}
