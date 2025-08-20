/**
 * Validate a string against a set of allowed values and return the matching canonical value or an error.
 *
 * Trims and performs a case-insensitive comparison against allowedValues; if a match is found returns the
 * matched entry from allowedValues (preserving its original casing). If the input is missing/blank or not
 * one of the allowed values, returns a descriptive error message.
 *
 * @param {string} value - The input to validate.
 * @param {string[]} allowedValues - Array of allowed canonical values (original casing preserved).
 * @param {string} fieldName - Human-readable field name used in error messages.
 * @returns {{ canonical: string|null, error: string|null }} Object with `canonical` set to the matched allowed value (or null on error)
 * and `error` containing a message when validation fails (or null on success).
 */
export function getCanonical(value, allowedValues, fieldName) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return { canonical: null, error: `${fieldName} is required.` };
  }

  const lowercasedAllowed = allowedValues.map(v => v.toLowerCase());
  const index = lowercasedAllowed.indexOf(value.trim().toLowerCase());

  if (index === -1) {
    return { canonical: null, error: `${fieldName} must be one of: ${allowedValues.join(', ')}` };
  }

  return { canonical: allowedValues[index], error: null };
}

