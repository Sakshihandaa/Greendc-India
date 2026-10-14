import { ValidationError } from '@greendc/calculator';

/**
 * 404 Not Found Middleware for unmatched routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
}

/**
 * Centralized Error Handling Middleware.
 * Handles validation errors, malformed JSON, and unexpected server errors without exposing stack traces.
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // 1. Handle JSON syntax errors from body-parser / express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: 'Malformed JSON payload in request body'
      }
    });
  }

  // 2. Handle GreenDC Validation Errors from calculator module
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: err.code || 'VALIDATION_ERROR',
        message: err.message,
        field: err.field
      }
    });
  }

  // 3. Handle unexpected errors without exposing stack traces
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected server error occurred'
    }
  });
}
