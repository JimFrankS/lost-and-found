const allowedCodes = [
  "02","03","04","05","06","07","08","10","11","12","13","14","15","18","19","21","22","23","24","25","26","27","28","29",
  "32","34","35","37","38","39","41","42","43","44","45","46","47","48","49","50","53","54","56","58","59","61","63",
  "66","67","68","70","71","73","75","77","79","80","83","84","85","86"
];

// Modulus 23 check letter mapping
const modulus23Map = {
  0: 'Z',
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
  7: 'G',
  8: 'H',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'P',
  15: 'Q',
  16: 'R',
  17: 'S',
  18: 'T',
  19: 'V',
  20: 'W',
  21: 'X',
  22: 'Y'
};

// Build the regex pattern dynamically
const codeGroup = allowedCodes.join('|');
const idNumberRegex = new RegExp(`^(${codeGroup})-(\\d{6,7})([A-HJ-NP-TV-Z])(${codeGroup})$`);

/**
 * Validate a Zimbabwe national ID number using the modulus-23 check letter.
 *
 * The function expects an ID matching the module's regex: a valid two-digit district
 * code, a hyphen, a 6–7 digit serial, a check letter, and a trailing valid district code.
 * Non-string inputs or strings that don't match the expected pattern return false.
 *
 * @param {string} str - ID string to validate (e.g., "02-123456A02").
 * @returns {boolean} True if the ID's format is valid and the check letter matches the modulus-23 calculation; otherwise false.
 */
export function isValidZimbabweIdNumber(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const match = str.match(idNumberRegex);
  if (!match) {
    return false;
  }
  
  const [ , firstCode, digits, letter ] = match;
  
  // Perform modulus 23 calculation on the combined district code and serial number.
  const numericString = firstCode + digits;
  const numericPart = parseInt(numericString, 10);
  const remainder = numericPart % 23;
  const expectedLetter = modulus23Map[remainder];

  // Check if the actual letter matches the calculated letter
  return letter === expectedLetter;
}

export { isValidZimbabweIdNumber as default, idNumberRegex, allowedCodes, modulus23Map };
