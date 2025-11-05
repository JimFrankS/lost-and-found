import { useQueryClient, useMutation } from "@tanstack/react-query";
import { natIdApi } from "@/utils/api";
import { useState, useCallback } from "react";
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
        category: "",
        identifier: "",
    }); // State for holding the search form data.

    const [searchFound, setSearchFound] = useState(false); // Whether or not search yielded results.

    const [viewedNatId, setViewedNatId] = useState<NatId | null>(null); // viewed id details

    const [viewingNatIdId, setViewingNatIdId] = useState<string | null>(null); // currently viewing id ID.

    const [searchResults, setSearchResults] = useState<NatId[]>([]); // Store search results list

    const enterNatIDMutation = useMutation({
        mutationFn: async (natIdData: NatIdFoundData) => {
            const response = await natIdApi.foundId(natIdData);
            return response.data;
        }, // Api Call to report found national ID

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["natId"] }); // Invalidate natId queries to refetch updated data.
            setIsNatIDModalVisible(false); // Close the modal
            const message = extractSuccessMessage({ data }, "National ID reported successfully");
            showSuccessToast(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting found national ID.");
            if (__DEV__) console.error("Error Reporting National ID:", message);
            showError(message);
        },
    }); // end of the mutation for reporting found national ID.

    const searchNatIdMutation = useMutation<NatId[], unknown, NatIdSearchParams>({
        mutationFn: async (searchParams: NatIdSearchParams) => {
            try {
                const response = await natIdApi.searchNatId(searchParams);
                return response.data;
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
        onSuccess: (data: NatId[]) => {
            const safeResults = data === null ? [] : Array.isArray(data) ? data : [data];
            setSearchResults(safeResults);

            setSearchFound(true);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst searching for the national ID");
            if (__DEV__) console.error("NatID search error: ", message);
            showError(message);
        },
    });

    const viewNatIdMutation = useMutation({
        onMutate: (id: string) => {
            setViewingNatIdId(id);
        },
        mutationFn: async (id: string) => {
            const response = await natIdApi.claimId(id);
            return response.data;
        },
        onSuccess: (data: NatId) => {
            setViewingNatIdId(null);
            if (data) {
                setViewedNatId(data);
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

    const openSearchModal = () => {
        setSearchFormData({
            category: "",
            identifier: "",
        }); // reset search form data when opening the modal
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    const updateSearchFormData = (field: string, value: string) => {
        setSearchFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the search form data state
    };

    // Wrapper helpers so callers can wait if needed.

    const reportNatID = useCallback(
        async () => enterNatIDMutation.mutateAsync(formData),
        [formData]
    );
    const searchNatId = useCallback(
        async (params: NatIdSearchParams) => searchNatIdMutation.mutateAsync(params),
        []
    );
    const viewNatId = useCallback(
        async (id: string) => viewNatIdMutation.mutateAsync(id),
        []
    );

    const resetSearch = useCallback(() => {
        setSearchFound(false);
        setViewedNatId(null);
        setSearchResults([]);
        setViewingNatIdId(null);
    }, []);

    const goBackToResults = useCallback(() => {
        setViewedNatId(null);
    }, []);

    return {
        isNatIDModalVisible,
        formData,
        searchFormData,
        openNatIDModal,
        closeNatIDModal: () => setIsNatIDModalVisible(false), // Function to close the national ID modal.
        openSearchModal,
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
        viewedNatId,
        viewingNatIdId,
        searchResults,
        resetSearch,
        goBackToResults
    };

};
