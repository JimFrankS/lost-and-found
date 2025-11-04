// Predefined values mirrored from the backend for form dropdowns

export const escapeRegex = (str: string): string => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Regex definitions
export const PHONE_NUMBER_REGEX = /^07(?:8[0-9]{7}|[137][1-9][0-9]{6})$/;
export const PHONE_EXAMPLE = "0719729537";

export const licenceNumberRegex = /^\d{6}[A-Z]{2}$/;

export const passportNumberRegex = /^[A-Z]{2}\d{6}$/;

// Baggaage Definations

export const BAGGAGE_TYPES = [
  "purse", "wallet", "handbag", "hustlebag", "laptopbag", "briefcase", "satchel",
  "travelingbag", "changanibag", "monarch", "plasticbag", "tsaga", "box", "other"
] as const;

export const MBAGGAGE_TYPES = [
  "clothing", "wallet", "handbag", "documents", "jewelry", "keys", "phone", "tablet", "laptop", "headphones", "charger", "earpods", "earphones", "money", "hustlebag", "monarch", "satchel", "laptopBag", "briefcase", "travelingbag", "changanibag", "box", "other"
] as const;

export const gatheringTypes = [
  "entertainment", "church", "school", "other"
] as const;

export const TRANSPORT_TYPES = [
  "bus",
  "kombi",
  "mushikashika",
  "private",
] as const;

export const ROUTE_TYPES = [
  "local",
  "intercity",
] as const;

export const SCERTIFICATE_TYPES = [
  "Olevel",
  "Alevel",
  "Poly",
  "University",
  "Other"
] as const;

export const PROVINCE_DISTRICT_MAP = {
  harare: ["harare", "chitungwiza", "epworth"],
  bulawayo: ["bulawayo"],
  manicaland: [
    "buhera",
    "chimanimani",
    "chipinge",
    "makoni",
    "mutare",
    "nyanga",
    "mutasa",
  ],
  "mashonaland east": [
    "chikomba",
    "goromonzi",
    "marondera",
    "mudzi",
    "murehwa",
    "mutoko",
    "seke",
    "uzumba maramba pfungwe",
    "wedza",
  ],
  "mashonaland west": [
    "chegutu",
    "hurungwe",
    "kariba",
    "makonde",
    "mhondoro ngezi",
    "sanyati",
    "zvimba",
  ],
  masvingo: [
    "bikita",
    "chiredzi",
    "chivi",
    "gutu",
    "masvingo",
    "mwenezi",
    "zaka",
  ],
  "matabeleland north": [
    "binga",
    "bubi",
    "hwange",
    "lupane",
    "nkayi",
    "tsholotsho",
    "umguza",
  ],
  "matabeleland south": [
    "beitbridge",
    "bulilima",
    "gwanda",
    "insiza",
    "mangwe",
    "matobo",
    "umzingwane",
  ],
  midlands: [
    "chirumhanzu",
    "gokwe north",
    "gokwe south",
    "gweru",
    "kwekwe",
    "mberengwa",
    "shurugwi",
    "zvishavane",
  ],
  "mashonaland central": [
    "bindura",
    "guruve",
    "mazowe",
    "mbire",
    "mount darwin",
    "muzarabani",
    "rushinga",
    "shamva",
  ],
} as const;

export const PROVINCES = Object.keys(PROVINCE_DISTRICT_MAP) as (keyof typeof PROVINCE_DISTRICT_MAP)[]; // This wil be the allowed provinces and districts. Districts depend on province.
