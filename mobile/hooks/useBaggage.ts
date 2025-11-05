import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baggageApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError } from "@/utils/alerts";
import { showErrorToast, showSuccessToast } from "@/utils/toasts";
import { Baggage, BaggageFoundData, BaggageSearchParams } from "@/types";

export const useBaggage = () => {
    const queryClient = useQueryClient();

    const [isBaggageModalVisible, setIsBaggageModalVisible] = useState(false); 

    const [formData, setFormData] = useState<BaggageFoundData>({
        baggageType: "",
        transportType: "",
        routeType: "",
        destination: "",
        destinationProvince: "",
        destinationDistrict: "",
        docLocation: "",
        finderContact: ""
    });

    const [searchFound, setSearchFound] = useState(false); // whether search yielded results
    const [viewedBaggage, setViewedBaggage] = useState<Baggage | null>(null); // viewed baggage details
    const [viewingBaggageId, setViewingBaggageId] = useState<string | null>(null); // currently viewing baggage ID
    const [searchResults, setSearchResults] = useState<Baggage[]>([]); // store search results list
    
    // helpers
    const openBaggageModal = () => setIsBaggageModalVisible(true);
    const closeBaggageModal = () => setIsBaggageModalVisible(false);


    const enterBaggageMutation = useMutation({
        mutationFn: async (baggageData: BaggageFoundData) => {
            return await baggageApi.lostBaggage(baggageData);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['baggage'] });
            setIsBaggageModalVisible(false);
            const message = extractSuccessMessage(response, 'Baggage reported successfully');
            showSuccessToast(message);
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while reporting baggage');
            if (__DEV__) console.error("Baggage reporting error:", message);
            showErrorToast(message);
        },
    });

    const searchBaggageMutation = useMutation<Baggage[], unknown, BaggageSearchParams>({
        mutationFn: async (searchParams) => {
            try {
                const response = await baggageApi.searchBaggage(searchParams);
                return response.data;
            } catch (error: any) {
                if (error?.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            const results = data ?? [];
            setSearchResults(results);

            setSearchFound(true);
            closeBaggageModal();
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while searching for baggage');
            if (__DEV__) console.error("Baggage search error:", message);
            showErrorToast(message);
            setSearchFound(false);
            setSearchResults([]);
        },
    });

    const viewBaggageMutation = useMutation({
        onMutate: (baggageId: string) => {
            setViewingBaggageId(baggageId);
        },
        mutationFn: async (baggageId: string) => {
            const response = await baggageApi.viewBaggage(baggageId);
            return response.data;
        },
        onSuccess: (data: Baggage, baggageId: string) => {
            setViewingBaggageId(null);
            if (data) {
                setViewedBaggage(data);
                setSearchFound(true);
            }
        },
        onError: (error: any, baggageId: string) => {
            setViewingBaggageId(null);
            const message = extractErrorMessage(error, 'An error occurred while viewing baggage');
            if (__DEV__) console.error("Baggage view error:", message);
            showErrorToast(message);
        },
    });

    const claimBaggageMutation = useMutation({
        mutationFn: async (baggageId: string) => {
            const response = await baggageApi.claimBaggage(baggageId);
            return response.data;
        },
        onSuccess: (data: Baggage) => {
            if (data) {
                setViewedBaggage(data);
                setSearchFound(true);
            }
            showSuccessToast('Baggage claimed successfully!');
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while claiming baggage');
            if (__DEV__) console.error("Baggage claim error:", message);
            showErrorToast(message);
        },
    });

    const updateFormData = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    // wrapper helpers so callers can await if needed
    const reportBaggage = async () => {
        try {
            await enterBaggageMutation.mutateAsync(formData);
            return true;
        } catch {
            return false;
        }
    };
    const searchBaggage = async (params: BaggageSearchParams) => {
        try {
            await searchBaggageMutation.mutateAsync(params);
            return true;
        } catch {
            return false;
        }
    };
    const viewBaggage = async (baggageId: string) => {
        try {
            await viewBaggageMutation.mutateAsync(baggageId);
            return true;
        } catch {
            return false;
        }
    };
    const claimBaggage = async (baggageId: string) => {
        try {
            await claimBaggageMutation.mutateAsync(baggageId);
            return true;
        } catch {
            return false;
        }
    };

    const resetSearch = () => {
        setSearchFound(false);
        setViewedBaggage(null);
        setSearchResults([]);
        setViewingBaggageId(null);
    };

    const goBackToResults = () => {
        // Clear the single-item view to show the search results list again
        setViewedBaggage(null);
    };

    return {
        isBaggageModalVisible,
        formData,
        openBaggageModal,
        closeBaggageModal,
        reportBaggage,
        searchBaggage,
        viewBaggage,
        claimBaggage,
        updateFormData,
        isReporting: enterBaggageMutation.isPending,
        isSearching: searchBaggageMutation.isPending,
        isViewing: viewBaggageMutation.isPending,
        isClaiming: claimBaggageMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['baggage'] }),
        searchFound,
        viewedBaggage,
        viewingBaggageId,
        searchResults,
        resetSearch,
        goBackToResults
    };
};
