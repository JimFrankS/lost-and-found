import { useQueryClient, useMutation } from "@tanstack/react-query";
import { dLicenceApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts"; 
import { DLicence, DLicenceFoundData, DLicenceSearchParams } from "@/types";

export const useDLicense = () => {
    const queryClient = useQueryClient();

    const [isDLicenseModalVisible, setIsDLicenseModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<DLicenceFoundData>({
        licenceNumber: "",
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter driving license details.

    const [searchFormData, setSearchFormData] = useState({
        category: "",
        identifier: "",
    }); // State for holding the search form data.

    const [searchFound, setSearchFound] = useState(false); // Whether or not search yielded results.

    const [searchPerformed, setSearchPerformed] = useState(false); // Whether a search has been performed

    const [viewedDLicence, setViewedDLicence] = useState<DLicence | null>(null); // viewed licence details

    const [viewingDLicenceId, setViewingDLicenceId] = useState<string | null>(null); // currently viewing licence ID.

    const [searchResults, setSearchResults] = useState<DLicence[]>([]); // Store search results list

    const enterDLicenseMutation = useMutation({
        mutationFn: async (dLicenceData: DLicenceFoundData) => {
            return await dLicenceApi.foundLicence(dLicenceData);
        }, // Api Call to report found driving license

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["dLicence"] }); // Invalidate dLicence queries to refetch updated data.
            setIsDLicenseModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "Driving License reported successfully");
            showSuccessToast(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting found driving license.");
            if (__DEV__) console.error("Error Reporting Driving License:", message);
            showError(message);
        },
    }); // end of the mutation for reporting found driving license.

    const searchDLicenceMutation = useMutation({
        mutationFn: async (searchParams: DLicenceSearchParams) => {
            try {
                return await dLicenceApi.searchDLicence(searchParams);
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    return { data: [] };
                }
                throw error;
            }
        },
        onSuccess: (response: any) => {
            const data = response.data;

            const results = data == null ? [] : Array.isArray(data) ? data : [data];
            setSearchResults(results);

            setSearchFound(results.length > 0);
            setSearchPerformed(true);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the licence");
            if (__DEV__) console.error("Licence search error: ", message);
            showError(message);
        },
    });

    const viewDLicenceMutation = useMutation({
        onMutate: (licenceId: string) => {
            setViewingDLicenceId(licenceId);
        },
        mutationFn: async (licenceId: string) => {
            const response = await dLicenceApi.claimLicence(licenceId);
            return response.data;
        },
        onSuccess: (data: DLicence) => {
            setViewingDLicenceId(null);
            if (data) {
                setViewedDLicence(data);
                setSearchFound(true);
            }
        },

        onError: (error: any) => {
            setViewingDLicenceId(null);
            const message = extractErrorMessage(error, "An error occurred while viewing licence");
            if (__DEV__) console.error("Licence view error:", message);
            showError(message);
        },
    });

    const openDLicenseModal = () => {
        setFormData({
            licenceNumber: "",
            lastName: "",
            firstName: "",
            idNumber: "",
            docLocation: "",
            finderContact: ""
        }); // reset form data when opening the modal

        setIsDLicenseModalVisible(true); // after reset is complete, make the modal to be visible
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    const updateSearchFormData = (field: string, value: string) => {
        setSearchFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the search form data state
    };

    // Wrapper helpers so callers can wait if needed.

    const reportDLicense = async () => {
        try {
            await enterDLicenseMutation.mutateAsync(formData);
            return true;
        } catch {
            return false;
        }
    };
    const searchDLicence = async (params: DLicenceSearchParams) => {
        try {
            await searchDLicenceMutation.mutateAsync(params);
            return true;
        } catch {
            return false;
        }
    };
    const viewDLicence = async (licenceId: string) => {
        try {
            await viewDLicenceMutation.mutateAsync(licenceId);
            return true;
        } catch {
            return false;
        }
    };

    const resetSearch = () => {
        setSearchFound(false);
        setSearchPerformed(false);
        setViewedDLicence(null);
        setSearchResults([]);
        setViewingDLicenceId(null);
    };

    const goBackToResults = () => {
        setViewedDLicence(null);
    };

    return {
        isDLicenseModalVisible,
        formData,
        searchFormData,
        openDLicenseModal,
        closeDLicenseModal: () => setIsDLicenseModalVisible(false), // Function to close the driving license modal.
        reportDLicense,
        searchDLicence,
        viewDLicence,
        updateFormData,
        updateSearchFormData,
        isReporting: enterDLicenseMutation.isPending,
        isSearching: searchDLicenceMutation.isPending,
        isViewing: viewDLicenceMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["dLicence"] }), //function to refetch driving license data.
        searchFound,
        searchPerformed,
        viewedDLicence,
        viewingDLicenceId,
        searchResults,
        resetSearch,
        goBackToResults
    };

};
