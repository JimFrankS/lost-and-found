import { BAGGAGE_TYPES, MBAGGAGE_TYPES, ROUTE_TYPES, SCERTIFICATE_TYPES, TRANSPORT_TYPES, gatheringTypes } from "@/constants/allowedValues"

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

export interface MBaggage {
    _id: string,
    baggageType: (typeof MBAGGAGE_TYPES)[number], // Restrict to one of the predefined strings
    gatheringType: (typeof gatheringTypes)[number],
    destinationProvince: string,
    destinationDistrict: string,
    gatheringLocation: string,
    docLocation: string,
    finderContact: string,
    status: "lost" | "found",
    claimed?: boolean,
    claimedAt?: string | null
}

export type MBaggageListItem = Pick<
    MBaggage,
    "_id" | "baggageType" | "gatheringType" | "destinationProvince" | "destinationDistrict" | "gatheringLocation"
>;


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

export interface BaggageSearchParams {
    baggageType?: string;
    transportType?: string;
    routeType?: string;
    destinationProvince?: string;
    destinationDistrict?: string;
}

export interface BirthCertificateSearchParams {
    motherLastName: string;
    lastName: string;
    firstName: string;
}

export interface DLicenceSearchParams {
    category: string;
    identifier: string;
}

export interface NatIdSearchParams {
    category: string;
    identifier: string;
}

export interface PassportSearchParams {
    category: string;
    identifier: string;
}

export interface SCertificateSearchParams {
    certificateType: string;
    lastName: string;
}

export interface MBaggageSearchParams {
    baggageType?: string;
    gatheringType?: string;
    destinationProvince?: string;
    destinationDistrict?: string;
}

export interface Stats {
    totalDocuments: number,
    claimedDocuments: number
}

// --- API Data Transfer Objects (DTOs) ---

export interface BaggageFoundData {
    baggageType: string;
    transportType: string;
    routeType: string;
    destinationProvince: string;
    destinationDistrict: string;
    destination: string;
    docLocation: string;
    finderContact: string;
}

export interface BCertificateFoundData {
    motherLastName: string;
    lastName: string;
    firstName: string;
    secondName?: string;
    docLocation: string;
    finderContact: string;
}

export interface DLicenceFoundData {
    licenceNumber: string;
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export interface NatIdFoundData {
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export interface PassportFoundData {
    passportNumber: string;
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export interface SCertificateFoundData {
    certificateType: string;
    lastName: string;
    firstName: string;
    docLocation: string;
    finderContact: string;
}

export interface MBaggageFoundData {
    baggageType: (typeof MBAGGAGE_TYPES)[number];
    gatheringType: (typeof gatheringTypes)[number];
    destinationProvince: string;
    destinationDistrict: string;
    gatheringLocation: string;
    docLocation: string;
    finderContact: string;
}

export interface MBaggageViewResponse {
    baggageType: (typeof MBAGGAGE_TYPES)[number];
    gatheringType: (typeof gatheringTypes)[number];
    destinationProvince: string;
    destinationDistrict: string;
    gatheringLocation: string;
    docLocation: string;
    finderContact: string;
    claimed: boolean;
}

// This file defines TypeScript interfaces for various document types used in the application. These interfaces ensure type safety and consistency when handling data related to lost and found documents. Each interface corresponds to a specific document type, outlining the expected properties and their types.