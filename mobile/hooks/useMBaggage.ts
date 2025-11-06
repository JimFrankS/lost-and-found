import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mBaggageApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage } from "@/utils/alerts";
import { showErrorToast, showSuccessToast } from "@/utils/toasts";
import { MBaggage, MBaggageFoundData, MBaggageSearchParams, MBaggageListItem, MBaggageViewResponse } from "@/types";

export const useMBaggage = () => {
    const queryClient = useQueryClient();

    const [isBaggageModalVisible, setIsBaggageModalVisible] = useState(false); 

    const [formData, setFormData] = useState<MBaggageFoundData>({
        baggageType: "clothing",
        gatheringType: "other",
        destinationProvince: "",
        destinationDistrict: "",
        gatheringLocation: "",
        docLocation: "",
        finderContact: ""
    });

    const [searchFound, setSearchFound] = useState(false); // whether search yielded results
    const [searchPerformed, setSearchPerformed] = useState(false); // whether a search has been performed
    const [viewedBaggage, setViewedBaggage] = useState<MBaggageViewResponse | null>(null); // viewed baggage details
    const [viewingBaggageId, setViewingBaggageId] = useState<string | null>(null); // currently viewing baggage ID
    const [searchResults, setSearchResults] = useState<MBaggageListItem[]>([]); // store search results list
    
    // helpers
    const openBaggageModal = () => setIsBaggageModalVisible(true);
    const closeBaggageModal = () => setIsBaggageModalVisible(false);


    const enterBaggageMutation = useMutation({
        mutationFn: async (baggageData: MBaggageFoundData) => {
            return await mBaggageApi.lostBaggage(baggageData);
        },
        onSuccess: (response) => {
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

    const searchBaggageMutation = useMutation<MBaggageListItem[], unknown, MBaggageSearchParams>({
        mutationFn: async (searchParams) => {
            try {
                const response = await mBaggageApi.searchBaggage(searchParams);
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

            setSearchFound(results.length > 0);
            setSearchPerformed(true);
            closeBaggageModal();
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while searching for baggage');
            if (__DEV__) console.error("Baggage search error:", message);
            showErrorToast(message);
            setSearchFound(false);
            setSearchPerformed(true);
            setSearchResults([]);
        },
    });

    const viewBaggageMutation = useMutation<MBaggageViewResponse, unknown, string>({
        onMutate: (baggageId: string) => {
            setViewingBaggageId(baggageId);
        },
        mutationFn: async (baggageId: string) => {
            const response = await mBaggageApi.viewBaggage(baggageId);
            return response.data;
        },
        onSuccess: (data: MBaggageViewResponse, baggageId: string) => {
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

    const claimBaggageMutation = useMutation<MBaggageViewResponse, unknown, string>({
        mutationFn: async (baggageId: string) => {
            const response = await mBaggageApi.claimBaggage(baggageId);
            return response.data;
        },
        onSuccess: (data: MBaggageViewResponse, baggageId: string) => {
            if (data) {
                setViewedBaggage(data);
                setSearchFound(true);
            }
            showSuccessToast('Baggage claimed successfully!');
        },
        onError: (error: any, baggageId: string) => {
            const message = extractErrorMessage(error, 'An error occurred while claiming baggage');
            if (__DEV__) console.error("Baggage claim error:", message);
            showErrorToast(message);
        },
    });

    const updateFormData = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    // wrapper helpers so callers can await if needed
    const reportBaggage = async (): Promise<boolean> => {
        try {
            await enterBaggageMutation.mutateAsync(formData);
            return true;
        } catch {
            return false;
        }
    };
    const searchBaggage = async (params: MBaggageSearchParams): Promise<MBaggageListItem[]> => {
        try {
            return await searchBaggageMutation.mutateAsync(params);
        } catch (error) {
            return [];
        }
    };
    const viewBaggage = async (baggageId: string): Promise<boolean> => {
        try {
            await viewBaggageMutation.mutateAsync(baggageId);
            return true;
        } catch {
            return false;
        }
    };
    const claimBaggage = async (baggageId: string): Promise<boolean> => {
        try {
            await claimBaggageMutation.mutateAsync(baggageId);
            return true;
        } catch {
            return false;
        }
    };

    const resetSearch = () => {
        setSearchFound(false);
        setSearchPerformed(false);
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
        searchFound,
        searchPerformed,
        viewedBaggage,
        viewingBaggageId,
        searchResults,
        resetSearch,
        goBackToResults
    };
};
