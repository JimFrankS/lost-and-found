import axios, { AxiosInstance } from "axios"; // 

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://lost-and-found-opal.vercel.app/";

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
    claimBaggage: (params: any) => apiClient.get("/api/baggage/claim", {params}),
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
