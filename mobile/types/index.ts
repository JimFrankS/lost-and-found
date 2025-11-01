import { BAGGAGE_TYPES, ROUTE_TYPES, SCERTIFICATE_TYPES, TRANSPORT_TYPES } from "@/constants/allowedValues"

export interface Baggage {
    _id: string,
    baggageType: (typeof BAGGAGE_TYPES)[number], // Restrict to one of the predefined strings
    transportType: (typeof TRANSPORT_TYPES) [number], // Restrict to one of the predefined strings
    routeType: (typeof ROUTE_TYPES)[number], 
    destinationProvince: string,
    destinationDistrict: string,
    destination: string,
    docLocation: string,
    finderContact: string,
    claimed?: boolean
}


export interface Bcertificate {
    _id: string,
    motherLastName: string,
    lastName: string,
    firstName: string,
    secondName?: string,
    docLocation: string,
    finderContact: string,
    claimed?: boolean
}

export interface DLicence {
    _id: string,
    licenceNumber: string,
    lastName: string,
    firstName: string,
    idNumber: string,
    docLocation: string,
    finderContact: string,
    claimed?: boolean
}

export interface NatId {
    _id: string,
    lastName: string,
    firstName: string,
    idNumber: string,
    docLocation: string,
    finderContact: string,
    claimed?: boolean
}

export interface Passport {
    _id: string,
    passportNumber: string,
    lastName: string,
    firstName: string,
    idNumber: string,
    docLocation: string,
    finderContact: string,
    claimed?: boolean
}

export interface Scertificate {
    _id: string,
    certificateType: (typeof SCERTIFICATE_TYPES) [number],
    lastName: string,
    firstName: string,
    docLocation: string,
    finderContact: string,
    claimed?: boolean
}

export interface Stats {
    totalDocuments: number,
    claimedDocuments: number
}

// This file defines TypeScript interfaces for various document types used in the application. These interfaces ensure type safety and consistency when handling data related to lost and found documents. Each interface corresponds to a specific document type, outlining the expected properties and their types.