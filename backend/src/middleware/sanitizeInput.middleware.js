/**
 * Recursively trims all string values in an object or array.
 * Leaves non-string values untouched.
 * @param {*} obj - The object, array, or primitive to recursively trim
 * @returns {*} - The trimmed object, array, or value
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
 * Express middleware to sanitize (trim) all input in req.body, req.query, and req.params.
 * Applies deepTrim to all relevant input sources.
 * Exports for easy use and unit testing.
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