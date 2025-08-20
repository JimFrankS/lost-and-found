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

