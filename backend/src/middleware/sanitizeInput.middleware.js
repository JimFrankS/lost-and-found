/**
 * Recursively trims whitespace from all string values inside an object or array.
 *
 * Traverses arrays and plain objects and returns a new structure with every string
 * value trimmed via String.prototype.trim(). Non-string primitives (number, boolean,
 * null, undefined), functions, and other non-plain-object values are returned unchanged.
 * The original input is not mutated for objects or arrays.
 *
 * @param {*} obj - Value to process (array, plain object, string, or any primitive).
 * @returns {*} A new array/object with trimmed strings, a trimmed string, or the original value.
 */
function deepTrim(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepTrim);
  } else if (obj && typeof obj === 'object' && obj !== null) {
    const cleaned = {};
    for (const key of Object.keys(obj)) {
      cleaned[key] = deepTrim(obj[key]);
    }
    return cleaned;
  } else if (typeof obj === 'string') {
    return obj.trim();
  }
  return obj;
}

/**
 * Express middleware that recursively trims all string values in req.body, req.query, and req.params.
 *
 * If req.body is a non-null object it is replaced with the result of deepTrim(req.body).
 * For req.query and req.params (when objects) each value is replaced with deepTrim(value).
 * Non-string values are preserved as-is by deepTrim. The middleware mutates the request object
 * (updates req.body, req.query, req.params) and then calls next().
 */
export function sanitizeInput(req, res, next) {
  // Uncomment for debugging:
  // console.debug('Sanitizing input:', { body: req.body, query: req.query, params: req.params });

  if (req.body && typeof req.body === 'object' && req.body !== null) {
    req.body = deepTrim(req.body);
  }
  if (req.query && typeof req.query === 'object' && req.query !== null) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = deepTrim(req.query[key]);
    });
  }
  if (req.params && typeof req.params === 'object' && req.params !== null) {
    Object.keys(req.params).forEach(key => {
      req.params[key] = deepTrim(req.params[key]);
    });
  }

  // Uncomment for debugging:
  // console.debug('Sanitized input:', { body: req.body, query: req.query, params: req.params });

  next();
}

// Export deepTrim for unit testing
export { deepTrim };

export default sanitizeInput;