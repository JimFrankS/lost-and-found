import { useQueryClient, useMutation } from "@tanstack/react-query";
import { bcertificateApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts"; 
import { Bcertificate, BCertificateFoundData, BirthCertificateSearchParams } from "@/types";

export const useBCertificate = () => {
    const queryClient = useQueryClient();
    const [isBCertificateModalVisible, setIsBCertificateModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    const [formData, setFormData] = useState<BCertificateFoundData>({
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
    const [viewedBcertificate, setViewedBcertificate] = useState<Bcertificate | null>(null);
    const [viewingBcertificateId, setViewingBcertificateId] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Bcertificate[]>([]);

    // helpers
    const openBCertificateModal = () => setIsBCertificateModalVisible(true);
    const closeBCertificateModal = () => setIsBCertificateModalVisible(false);
    const openSearchModal = () => setIsSearchModalVisible(true);
    const closeSearchModal = () => setIsSearchModalVisible(false);
    
    const enterBCertificateMutation = useMutation({
        mutationFn: (bcertificateData: BCertificateFoundData) => bcertificateApi.foundbCertificate(bcertificateData),
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
            const data = response.data;
            const results = data === null ? [] : Array.isArray(data) ? data : [data];
            setSearchResults(results);
            setSearchFound(results.length > 0);
            closeSearchModal();
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the certificate");
            if (__DEV__) console.error("Birth Certificate search error: ", message);
            showError(message);
        },
    });

    const viewBcertificateMutation = useMutation({
        onMutate: (bcertificateId: string) => {
            setViewingBcertificateId(bcertificateId);
        },
        mutationFn: (bcertificateId: string) =>
            bcertificateApi.viewBcertificate(bcertificateId),
        onSuccess: (response: any) => {
            setViewingBcertificateId(null);
            if (response.data) {
                setViewedBcertificate(response.data);
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
        setViewedBcertificate(null);
        setSearchResults([]);
        setViewingBcertificateId(null);
    };

    const goBackToResults = () => {
        setViewedBcertificate(null);
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
        viewedBcertificate,
        viewingBcertificateId,
        searchResults,
        resetSearch,
        goBackToResults,
    };
};