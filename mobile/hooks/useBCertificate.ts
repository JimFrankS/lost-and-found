import { useQueryClient, useMutation } from "@tanstack/react-query";
import { bcertificateApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts";
import { Bcertificate, BirthCertificateSearchParams } from "@/types";

export interface BirthCertificateFormData {
    motherLastName: string;
    lastName: string;
    firstName: string;
    secondName?: string;
    docLocation: string;
    finderContact: string;
}

export const useBCertificate = () => {
    const queryClient = useQueryClient();
    const [isBCertificateModalVisible, setIsBCertificateModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    const [formData, setFormData] = useState<BirthCertificateFormData>({
        motherLastName: "",
        lastName: "",
        firstName: "",
        secondName: "",
        docLocation: "",
        finderContact: ""
    });

    const [searchFormData, setSearchFormData] = useState({
        motherLastName: "",
        lastName: "",
        firstName: "",
    });
    const [searchFound, setSearchFound] = useState(false);
    const [foundBcertificate, setFoundBcertificate] = useState<Bcertificate | Bcertificate[] | null>(null);
    const [viewingBcertificateId, setViewingBcertificateId] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Bcertificate[]>([]);

    // helpers
    const openBCertificateModal = () => setIsBCertificateModalVisible(true);
    const closeBCertificateModal = () => setIsBCertificateModalVisible(false);
    const openSearchModal = () => setIsSearchModalVisible(true);
    const closeSearchModal = () => setIsSearchModalVisible(false);
    
    const enterBCertificateMutation = useMutation({
        mutationFn: (bcertificateData: any) => bcertificateApi.foundbCertificate(bcertificateData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["bcertificate"] });
            setIsBCertificateModalVisible(false);
            const message = extractSuccessMessage(response, "Birth Certificate reported successfully");
            showSuccessToast(message);
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting found birth certificate.");
            if (__DEV__) console.error("Error Reporting Birth Certificate:", message);
            showError(message);
        },
    });

    const searchBcertificateMutation = useMutation({
        mutationFn: async (searchParams: BirthCertificateSearchParams) => {
            try {
                return await bcertificateApi.searchbCertificate(searchParams);
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    return { data: [] };
                }
                throw error;
            }
        },
        onSuccess: (response: any) => {
            setSearchFound(false);
            setSearchResults([]);
            setFoundBcertificate(response.data);
            setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
            setSearchFound(true);
            closeSearchModal();
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the certificate");
            if (__DEV__) console.error("Birth Certificate search error: ", message);
            showError(message);
        },
    });

    const viewBcertificateMutation = useMutation({
        mutationFn: (bcertificateId: string) => {
            setViewingBcertificateId(bcertificateId);
            return bcertificateApi.viewBcertificate(bcertificateId);
        },
        onSuccess: (response: any) => {
            setViewingBcertificateId(null);
            if (response.data) {
                setFoundBcertificate(response.data);
                setSearchFound(true);
            }
        },
        onError: (error: any, bcertificateId: string) => {
            setViewingBcertificateId(null);
            const message = extractErrorMessage(error, "An error occurred while viewing certificate");
            if (__DEV__) console.error("Certificate view error:", message);
            showError(message);
        },
    });

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const updateSearchFormData = (field: string, value: string) => {
        setSearchFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const reportBCertificate = async () => enterBCertificateMutation.mutateAsync(formData);
    const searchBcertificate = async (params: BirthCertificateSearchParams) => searchBcertificateMutation.mutateAsync(params);
    const viewBcertificate = async (bcertificateId: string) => viewBcertificateMutation.mutateAsync(bcertificateId);

    const resetSearch = () => {
        setSearchFound(false);
        setFoundBcertificate(null);
        setSearchResults([]);
        setViewingBcertificateId(null);
    };

    const goBackToResults = () => {
        if (searchResults.length > 0) {
            setFoundBcertificate(searchResults);
        }
    };

    return {
        isBCertificateModalVisible,
        formData,
        searchFormData,
        openBCertificateModal,
        closeBCertificateModal,
        isSearchModalVisible,
        openSearchModal,
        closeSearchModal,
        reportBCertificate,
        searchBcertificate,
        viewBcertificate,
        updateFormData,
        updateSearchFormData,
        isReporting: enterBCertificateMutation.isPending,
        isSearching: searchBcertificateMutation.isPending,
        isViewing: viewBcertificateMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["bcertificate"] }),
        searchFound,
        foundBcertificate,
        viewingBcertificateId,
        searchResults,
        resetSearch,
        goBackToResults,
    };
};