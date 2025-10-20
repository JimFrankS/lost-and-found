import axios, { AxiosInstance } from "axios"; // 
import { Platform } from "react-native"; 

const DEFAULT_BASE_URL = "https://lost-and-found-opal.vercel.app/";
let API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

// In web development, avoid calling the production backend from a localhost origin to prevent CORS issues.
// If no explicit API base URL is provided and the app runs on localhost in the browser, default to a local backend.
if (!process.env.EXPO_PUBLIC_API_URL && Platform.OS === 'web') {
    try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\\d+)?$/.test(origin)) {
            API_BASE_URL = 'http://localhost:5001';
        }
    } catch {
        // no-op: conservative fallback to DEFAULT_BASE_URL
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
    lostBaggage: (data: any) => apiClient.post("/api/baggage/found", data),
    searchBaggage: (params: any) => apiClient.get("/api/baggage/search", {params}),
    viewBaggage: (baggageId: string) => apiClient.get(`/api/baggage/view/${baggageId}`),
    claimBaggage: (baggageId: string) => apiClient.get(`/api/baggage/claim/${baggageId}`),
};

export const bcertificateApi = {
    foundbCertificate: (data: any) => apiClient.post("/api/bCertificate/found", data),
    claimbCertificate: (params: any) => apiClient.get("/api/bCertificate/claim", {params}),
};

export const dLicenceApi = {
    foundLicence: (data: any) => apiClient.post("/api/dLicence/found", data),
    claimLicence: (identifier: string) => apiClient.get(`/api/dLicence/claim/${identifier}`),
};

export const natIdApi = {
    foundId: (data: any) => apiClient.post("/api/natId/found", data),
    claimId: (identifier: string) => apiClient.get(`/api/natId/claim/${identifier}`),
};

export const passportApi = {
    lostPassport: (data: any) => apiClient.post("/api/passport/lost", data),
    claimPassport: (identifier: string) => apiClient.get(`/api/passport/claim/${identifier}`),
};

export const scertificateApi = {
    foundScertificate: (data: any) => apiClient.post("/api/sCertificate/found", data),
    claimScertificate: (params: any) => apiClient.get("/api/sCertificate/claim", {params}),
};
