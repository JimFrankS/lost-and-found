export const BAGGAGE_TYPES = [
  "purse", "wallet", "handbag", "hustlebag", "laptopbag", "briefcase", "satchel",
  "travelingbag", "changanibag", "monarch", "plasticbag", "tsaga", "box", "other"
] as const; // Make this a readonly tuple

export interface Baggage {
    _id: string,
    baggageType: (typeof BAGGAGE_TYPES)[number], // Restrict to one of the predefined strings
    transportType: "bus" | "kombi" | "mushikashika" | "private",
    routeType: "local" | "intercity",
    destinationProvince: string,
    destinationDistrict: string,
    destination: string,
    docLocation: string,
    finderContact: string
}


export interface Bcertificate {
    _id: string,
    mothersLastName: string,
    lastName: string,
    firstName: string,
    secondName?: string,
    docLocation: string,
    finderContact: string
}

export interface DLicence {
    _id: string,
    licenceNumber: string,
    lastName: string,
    idNumber: string,
    docLocation: string,
    finderContact: string
}

export interface NatId {
    _id: string,
    lastName: string,
    firstName: string,
    idNumber: string,
    docLocation: string,
    finderContact: string
}

export interface Passport {
    _id: string,
    passportNumber: string,
    lastName: string,
    firstName: string,
    idNumber: string,
    docLocation: string,
    finderContact: string
}

export interface Scertificate {
    _id: string,
    certificateType: "Olevel" | "Alevel" | "Poly" | "University" | "Other",
    lastName: string,
    firstName: string,
    docLocation: string,
    finderContact: string
}

export interface Stats {
    totalDocuments: number,
    claimedDocuments: number
}

// This file defines TypeScript interfaces for various document types used in the application. These interfaces ensure type safety and consistency when handling data related to lost and found documents. Each interface corresponds to a specific document type, outlining the expected properties and their types.