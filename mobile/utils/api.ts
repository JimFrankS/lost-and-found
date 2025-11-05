import axios, { AxiosInstance } from "axios"; //
import { Platform } from "react-native";
import {
    BaggageFoundData,
    BaggageSearchParams,
    BCertificateFoundData,
    BirthCertificateSearchParams,
    DLicenceFoundData,
    DLicenceSearchParams, NatIdFoundData, NatIdSearchParams, PassportFoundData, PassportSearchParams, SCertificateFoundData, SCertificateSearchParams,
    MBaggageFoundData,
    MBaggageSearchParams
} from "../types";

const DEFAULT_BASE_URL = "https://lost-and-found-opal.vercel.app/";
let API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

// In web development, when running on localhost and no explicit API URL is set,
// default to a local backend to avoid making production API calls and hitting CORS errors.
if (!process.env.EXPO_PUBLIC_API_URL && Platform.OS === 'web') {
    try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            API_BASE_URL = 'http://localhost:5001'; // Default local backend URL
        }
    } catch {
        // If window.location.origin is not available, fallback to the default.
        // This is a conservative no-op.
    }
}

export const TIMEOUT_ERROR_MESSAGE = "Request timed out. Please check your network connection and try again.";

// Plain axios instance without authentication
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            error.message = TIMEOUT_ERROR_MESSAGE;
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

// API calls (no authentication required)
export const baggageApi = {
    lostBaggage: (data: BaggageFoundData) => apiClient.post("/api/baggage/found", data),
    searchBaggage: (params: BaggageSearchParams) => apiClient.get("/api/baggage/search", {params}),
    viewBaggage: (baggageId: string) => apiClient.get(`/api/baggage/view/${baggageId}`),
    claimBaggage: (baggageId: string) => apiClient.get(`/api/baggage/claim/${baggageId}`),
};

export const bcertificateApi = {
    foundbCertificate: (data: BCertificateFoundData) => apiClient.post("/api/bCertificate/found", data),
    searchbCertificate: (params: BirthCertificateSearchParams) => apiClient.get("/api/bCertificate/search", {params}),
    claimbCertificate: (params: BirthCertificateSearchParams) => apiClient.get("/api/bCertificate/claim", {params}),
    viewBcertificate: (bcertificateId: string) => apiClient.get(`/api/bCertificate/view/${bcertificateId}`),
};

export const dLicenceApi = {
    foundLicence: (data: DLicenceFoundData) => apiClient.post("/api/dLicence/found", data),
    searchDLicence: (params: DLicenceSearchParams) => apiClient.get("/api/dLicence/search", {params}),
    claimLicence: (identifier: string) => apiClient.get(`/api/dLicence/claim/${identifier}`),
};

export const natIdApi = {
    foundId: (data: NatIdFoundData) => apiClient.post("/api/natId/found", data),
    searchNatId: (params: NatIdSearchParams) => apiClient.get("/api/natId/search", {params}),
    claimId: (identifier: string) => apiClient.get(`/api/natId/claim/${identifier}`),
};

export const passportApi = {
    lostPassport: (data: PassportFoundData) => apiClient.post("/api/passport/lost", data),
    searchPassport: (params: PassportSearchParams) => apiClient.get("/api/passport/search", {params}),
    claimPassport: (identifier: string) => apiClient.get(`/api/passport/claim/${identifier}`),
};

export const scertificateApi = {
    foundScertificate: (data: SCertificateFoundData) => apiClient.post("/api/sCertificate/found", data),
    searchScertificate: (params: SCertificateSearchParams) => apiClient.get("/api/sCertificate/search", {params}),
    viewScertificate: (scertificateId: string) => apiClient.get(`/api/sCertificate/view/${scertificateId}`)
};

export const mBaggageApi = {
    lostBaggage: (data: MBaggageFoundData) => apiClient.post("/api/mBaggage/found", data),
    searchBaggage: (params: MBaggageSearchParams) => apiClient.get("/api/mBaggage/search", {params}),
    viewBaggage: (baggageId: string) => apiClient.get(`/api/mBaggage/view/${baggageId}`),
    claimBaggage: (baggageId: string) => apiClient.get(`/api/mBaggage/claim/${baggageId}`),
};