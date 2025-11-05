import { useQueryClient, useMutation } from "@tanstack/react-query";
import { passportApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts"; 
import { Passport, PassportFoundData, PassportSearchParams } from "@/types";

export const usePassport = () => {
    const queryClient = useQueryClient();

    const [isPassportModalVisible, setIsPassportModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<PassportFoundData>({
        passportNumber: "",
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter passport details.

    const [searchFormData, setSearchFormData] = useState({
        category: "",
        identifier: "",
    }); // State for holding the search form data.

    const [searchFound, setSearchFound] = useState(false); // Whether or not search yielded results.

    const [viewedPassport, setViewedPassport] = useState<Passport | null>(null); // viewed passport details

    const [viewingPassportId, setViewingPassportId] = useState<string | null>(null); // currently viewing passport ID.

    const [searchResults, setSearchResults] = useState<Passport[]>([]); // Store search results list

    const enterPassportMutation = useMutation({
        mutationFn: async (passportData: PassportFoundData) => {
            return await passportApi.lostPassport(passportData);
        }, // Api Call to report lost passport

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["passport"] }); // Invalidate passport queries to refetch updated data.
            setIsPassportModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "Passport reported successfully");
            showSuccessToast(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting lost passport.");
            if (__DEV__) console.error("Error Reporting Passport:", message);
            showError(message);
        },
    }); // end of the mutation for reporting lost passport.

    const searchPassportMutation = useMutation({
        mutationFn: async (searchParams: PassportSearchParams) => {
            try {
                return await passportApi.searchPassport(searchParams);
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

            setSearchFound(true);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the passport");
            if (__DEV__) console.error("Passport search error: ", message);
            setSearchResults([]);
            setSearchFound(false);
            showError(message);
        },
    });

    const viewPassportMutation = useMutation({
        mutationFn: async (passportId: string) => {
            const response = await passportApi.claimPassport(passportId);
            return response.data;
        }, // Api Call to claim passport

        onSuccess: (data: Passport) => {
            if (data) {
                setViewedPassport(data);
                setSearchFound(true);
            }
            // Do not show success toast for viewing, only for claiming
            // Optionally refetch or update state
            queryClient.invalidateQueries({ queryKey: ["passport"] });
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred while viewing passport");
            if (__DEV__) console.error("Passport view error:", message);
            showError(message);
        },

        onSettled: () => {
            setViewingPassportId(null);
        },
    });

    const openPassportModal = () => {
        setFormData({
            passportNumber: "",
            lastName: "",
            firstName: "",
            idNumber: "",
            docLocation: "",
            finderContact: ""
        }); // reset form data when opening the modal

        setIsPassportModalVisible(true); // after reset is complete, make the modal to be visible
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    const updateSearchFormData = (field: string, value: string) => {
        setSearchFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the search form data state
    };

    // Wrapper helpers so callers can wait if needed.

    const reportPassport = async () => {
        try {
            await enterPassportMutation.mutateAsync(formData);
            return true;
        } catch {
            return false;
        }
    };
    const searchPassport = async (params: PassportSearchParams) => {
        try {
            await searchPassportMutation.mutateAsync(params);
            return true;
        } catch {
            return false;
        }
    };
    const viewPassport = async (passportId: string) => {
        try {
            setViewingPassportId(passportId);
            await viewPassportMutation.mutateAsync(passportId);
            return true;
        } catch {
            return false;
        }
    };

    const resetSearch = () => {
        setSearchFound(false);
        setViewedPassport(null);
        setSearchResults([]);
        setViewingPassportId(null);
    };

    const goBackToResults = () => {
        setViewedPassport(null);
    };

    return {
        isPassportModalVisible,
        formData,
        searchFormData,
        openPassportModal,
        closePassportModal: () => setIsPassportModalVisible(false), // Function to close the passport modal.
        reportPassport,
        searchPassport,
        viewPassport,
        updateFormData,
        updateSearchFormData,
        isReporting: enterPassportMutation.isPending,
        isSearching: searchPassportMutation.isPending,
        isViewing: viewPassportMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["passport"] }), //function to refetch passport data.
        searchFound,
        viewedPassport,
        viewingPassportId,
        searchResults,
        resetSearch,
        goBackToResults
    };

};
