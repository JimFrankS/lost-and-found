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
    const [foundBaggage, setFoundBaggage] = useState<Baggage | Baggage[] | null>(null); // found baggage details or list
    const [viewingBaggageId, setViewingBaggageId] = useState<string | null>(null); // currently viewing baggage ID
    const [searchResults, setSearchResults] = useState<Baggage[]>([]); // store search results list
    
    // helpers
    const openBaggageModal = () => setIsBaggageModalVisible(true);
    const closeBaggageModal = () => setIsBaggageModalVisible(false);


    const enterBaggageMutation = useMutation({
        mutationFn: (baggageData: BaggageFoundData) => baggageApi.lostBaggage(baggageData),
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
            const response = await baggageApi.searchBaggage(searchParams);
            return response.data;
        },
        onSuccess: (data) => {
            setSearchFound(false);
            setSearchResults([]);
            setFoundBaggage(data);
            setSearchResults(data);
            setSearchFound(true);
            closeBaggageModal();
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while searching for baggage');
            if (__DEV__) console.error("Baggage search error:", message);
            showErrorToast(message);
            setSearchFound(false);
            setFoundBaggage(null);
            setSearchResults([]);
        },
    });

    const viewBaggageMutation = useMutation({
        mutationFn: (baggageId: string) => {
            setViewingBaggageId(baggageId);
            return baggageApi.viewBaggage(baggageId);
        },
        onSuccess: (response: any, baggageId: string) => {
            setViewingBaggageId(null);
            if (response.data) {
                setFoundBaggage(response.data);
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
        mutationFn: (baggageId: string) => baggageApi.claimBaggage(baggageId),
        onSuccess: (response: any) => {
            if (response.data) {
                setFoundBaggage(response.data);
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
    const reportBaggage = async () => enterBaggageMutation.mutateAsync(formData);
    const searchBaggage = async (params: BaggageSearchParams) => searchBaggageMutation.mutateAsync(params);
    const viewBaggage = async (baggageId: string) => viewBaggageMutation.mutateAsync(baggageId);
    const claimBaggage = async (baggageId: string) => claimBaggageMutation.mutateAsync(baggageId);

    const resetSearch = () => {
        setSearchFound(false);
        setFoundBaggage(null);
        setSearchResults([]);
        setViewingBaggageId(null);
    };

    const goBackToResults = () => {
        if (searchResults.length > 0) {
            setFoundBaggage(searchResults);
        }
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
        foundBaggage,
        viewingBaggageId,
        searchResults,
        resetSearch,
        goBackToResults
    };
};
