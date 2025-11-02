import { useQueryClient, useMutation } from "@tanstack/react-query";
import { dLicenceApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts";
import { DLicence, DLicenceSearchParams } from "@/types";

export interface DrivingLicenseFormData {
    licenceNumber: string;
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export const useDLicense = () => {
    const queryClient = useQueryClient();

    const [isDLicenseModalVisible, setIsDLicenseModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<DrivingLicenseFormData>({
        licenceNumber: "",
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter driving license details.

    const [searchFormData, setSearchFormData] = useState({
        category: "", // No default category
        identifier: "",
    }); // State for holding the search form data.

    const [searchFound, setSearchFound] = useState(false); // Whether or not search yielded results.

    const [foundDLicence, setFoundDLicence] = useState<DLicence | DLicence[] | null>(null); // found licence details or list

    const [viewingDLicenceId, setViewingDLicenceId] = useState<string | null>(null); // currently viewing licence ID.

    const [searchResults, setSearchResults] = useState<DLicence[]>([]); // Store search results list

    const enterDLicenseMutation = useMutation({
        mutationFn: (dLicenceData: any) => dLicenceApi.foundLicence(dLicenceData), // Api Call to report found driving license

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
        mutationFn: async (searchParams: any) => {
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
            setSearchFound(false);
            setSearchResults([]);
            setFoundDLicence(response.data);
            setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
            setSearchFound(true);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the licence");
            if (__DEV__) console.error("Licence search error: ", message);
            showError(message);
        },
    });

    const viewDLicenceMutation = useMutation({
        mutationFn: (licenceId: string) => {
            setViewingDLicenceId(licenceId);
            return dLicenceApi.claimLicence(licenceId);
        },

        onSuccess: (response: any) => {
            setViewingDLicenceId(null);
            if (response.data) {
                setFoundDLicence(response.data);
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

    const reportDLicense = async () => enterDLicenseMutation.mutateAsync(formData);
    const searchDLicence = async (params: DLicenceSearchParams) => searchDLicenceMutation.mutateAsync(params);
    const viewDLicence = async (licenceId: string) => viewDLicenceMutation.mutateAsync(licenceId);

    const resetSearch = () => {
        setSearchFound(false);
        setFoundDLicence(null);
        setSearchResults([]);
        setViewingDLicenceId(null);
    };

    const goBackToResults = () => {
        if (searchResults.length > 0) {
            setFoundDLicence(searchResults);
        }
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
        foundDLicence,
        viewingDLicenceId,
        searchResults,
        resetSearch,
        goBackToResults
    };

};
