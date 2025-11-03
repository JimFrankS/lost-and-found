import { useQueryClient, useMutation } from "@tanstack/react-query";
import { scertificateApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts"; 
import { Scertificate, SCertificateFoundData, SCertificateSearchParams } from "@/types";

export const useSCertificate = () => {
    const queryClient = useQueryClient();

    const [isSCertificateModalVisible, setIsSCertificateModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<SCertificateFoundData>({
        certificateType: "",
        lastName: "",
        firstName: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter school certificate details.

    const [searchFormData, setSearchFormData] = useState({
        certificateType: "",
        lastName: "",
    }); // State for holding the search form data.

    const [searchFound, setSearchFound] = useState(false); // Whether or not search yeilded results.

    const [viewedScertificate, setViewedScertificate] = useState<Scertificate | null>(null); // viewed certificate details

    const [viewingScertificateId, setViewingScertificateId] = useState<string | null>(null); // currently viewing certificate ID.

    const [searchResults, setSearchResults] = useState<Scertificate[]>([]); //  Store search results list

    // helpers

    const openSCertificateModal = () => setIsSCertificateModalVisible(true);
    const closeSCertificateModal = () => setIsSCertificateModalVisible(false);

    const enterSCertificateMutation = useMutation({
        mutationFn: async (scertificateData: SCertificateFoundData) => {
            return await scertificateApi.foundScertificate(scertificateData);
        }, // Api Call to report found school certificate

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["scertificate"] }); // Invalidate scertificate queries to refetch updated data.
            setIsSCertificateModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "School Certificate reported successfully");
            showSuccessToast(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting found school certificate.");
            if (__DEV__) console.error("Error Reporting School Certificate:", message);
            showError(message);
        },
    }); // end of the mutation for reporting found school certificate.

    const searchScertificateMutation = useMutation({
        mutationFn: (searchParams: SCertificateSearchParams) => scertificateApi.searchScertificate(searchParams),
    onSuccess: (response: any) => {
            const data = response.data;

            const results = data === null ? [] : Array.isArray(data) ? data : [data];
            setSearchResults(results);

            setSearchFound(true);
            closeSCertificateModal();
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the certificate");
            if (__DEV__) console.error("Baggage search error: ", message);
            showError(message);
            setSearchFound(false);
            setSearchResults([]);
        },
    });

    const viewScertificateMutation = useMutation({
        onMutate: (scertificateId: string) => {
            setViewingScertificateId(scertificateId);
        },
        mutationFn: async (scertificateId: string) => {
            const response = await scertificateApi.viewScertificate(scertificateId);
            return response.data;
        },
        onSuccess: (data: Scertificate) => {
            setViewingScertificateId(null);
            if (data) {
                setViewedScertificate(data);
                setSearchFound(true)
            }
        },

        onError: (error: any) => {
            setViewingScertificateId(null);
            const message = extractErrorMessage(error, "An error occured while viewing Certificate");
            if (__DEV__) console.error("Certificate view error:", message);
            showError(message);
        },
    });

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    const updateSearchFormData = (field: string, value: string) => {
        setSearchFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the search form data state
    };

    // Wrapper helpers so callers can wait if needed.

    const reportSCertificate = async () => enterSCertificateMutation.mutateAsync(formData);
    const searchScertificate = async (params: SCertificateSearchParams) => {
        const response = await searchScertificateMutation.mutateAsync(params);
        return response.data;
    };
    const viewScertificate = async (scertificateId: string) => viewScertificateMutation.mutateAsync(scertificateId);

    const resetSearch = () => {
        setSearchFound(false);
        setViewedScertificate(null);
        setSearchResults([]);
        setViewingScertificateId(null);
    };

    const goBackToResults = () => {
        setViewedScertificate(null);
    };

    return {
        isSCertificateModalVisible,
        formData,
        searchFormData,
        openSCertificateModal,
        closeSCertificateModal,
        reportSCertificate,
        searchScertificate,
        viewScertificate,
        updateFormData,
        updateSearchFormData,
        isReporting: enterSCertificateMutation.isPending,
        isSearching: searchScertificateMutation.isPending,
        isViewing: viewScertificateMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["scertificate"] }), //function to refetch school certificate data.
        searchFound,
        viewedScertificate,
        viewingScertificateId,
        searchResults,
        resetSearch,
        goBackToResults
    };
};
