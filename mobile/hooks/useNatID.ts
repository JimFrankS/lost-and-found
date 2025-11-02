import { useQueryClient, useMutation } from "@tanstack/react-query";
import { natIdApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showSuccessToast } from "@/utils/toasts"; 
import { NatId, NatIdFoundData, NatIdSearchParams } from "@/types";

export const useNatID = () => {
    const queryClient = useQueryClient();

    const [isNatIDModalVisible, setIsNatIDModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<NatIdFoundData>({
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter national ID details.

    const [searchFormData, setSearchFormData] = useState({
        identifier: "",
    }); // State for holding the search form data.

    const [searchFound, setSearchFound] = useState(false); // Whether or not search yielded results.

    const [foundNatId, setFoundNatId] = useState<NatId | NatId[] | null>(null); // found id details or list

    const [viewingNatIdId, setViewingNatIdId] = useState<string | null>(null); // currently viewing id ID.

    const [searchResults, setSearchResults] = useState<NatId[]>([]); // Store search results list

    const enterNatIDMutation = useMutation({
        mutationFn: (natIdData: NatIdFoundData) => natIdApi.foundId(natIdData), // Api Call to report found national ID

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["natId"] }); // Invalidate natId queries to refetch updated data.
            setIsNatIDModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "National ID reported successfully");
            showSuccessToast(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting found national ID.");
            if (__DEV__) console.error("Error Reporting National ID:", message);
            showError(message);
        },
    }); // end of the mutation for reporting found national ID.

    const searchNatIdMutation = useMutation({
        mutationFn: async (searchParams: NatIdSearchParams) => {
            try {
                return await natIdApi.searchNatId(searchParams);
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
            setFoundNatId(response.data);
            setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
            setSearchFound(true);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the national ID");
            if (__DEV__) console.error("NatID search error: ", message);
            showError(message);
        },
    });

    const viewNatIdMutation = useMutation({
        mutationFn: (id: string) => {
            setViewingNatIdId(id);
            return natIdApi.claimId(id);
        },

        onSuccess: (response: any) => {
            setViewingNatIdId(null);
            if (response.data) {
                setFoundNatId(response.data);
                setSearchFound(true);
            }
        },

        onError: (error: any) => {
            setViewingNatIdId(null);
            const message = extractErrorMessage(error, "An error occurred while viewing national ID");
            if (__DEV__) console.error("NatID view error:", message);
            showError(message);
        },
    });

    const openNatIDModal = () => {
        setFormData({
            lastName: "",
            firstName: "",
            idNumber: "",
            docLocation: "",
            finderContact: ""
        }); // reset form data when opening the modal

        setIsNatIDModalVisible(true); // after reset is complete, make the modal to be visible
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    const updateSearchFormData = (field: string, value: string) => {
        setSearchFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the search form data state
    };

    // Wrapper helpers so callers can wait if needed.

    const reportNatID = async () => enterNatIDMutation.mutateAsync(formData);
    const searchNatId = async (params: NatIdSearchParams) => searchNatIdMutation.mutateAsync(params);
    const viewNatId = async (id: string) => viewNatIdMutation.mutateAsync(id);

    const resetSearch = () => {
        setSearchFound(false);
        setFoundNatId(null);
        setSearchResults([]);
        setViewingNatIdId(null);
    };

    const goBackToResults = () => {
        if (searchResults.length > 0) {
            setFoundNatId(searchResults);
        }
    };

    return {
        isNatIDModalVisible,
        formData,
        searchFormData,
        openNatIDModal,
        closeNatIDModal: () => setIsNatIDModalVisible(false), // Function to close the national ID modal.
        reportNatID,
        searchNatId,
        viewNatId,
        updateFormData,
        updateSearchFormData,
        isReporting: enterNatIDMutation.isPending,
        isSearching: searchNatIdMutation.isPending,
        isViewing: viewNatIdMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["natId"] }), //function to refetch national ID data.
        searchFound,
        foundNatId,
        viewingNatIdId,
        searchResults,
        resetSearch,
        goBackToResults
    };

};
