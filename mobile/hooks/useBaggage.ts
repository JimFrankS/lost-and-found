import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baggageApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utils/alerts";

export const useBaggage = () => {
    const queryClient = useQueryClient();

    const [isBaggageModalVisible, setIsBaggageModalVisible] = useState(false); 

    const [formData, setFormData] = useState({
        baggageType: "",
        transportType: "",
        routeType: "",
        destinationProvince: "",
        destinationDistrict: "",
        docLocation: "",
        finderContact: ""
    });

    const [searchFound, setSearchFound] = useState(false); // whether search yielded results
    const [foundBaggage, setFoundBaggage] = useState<any>(null); // found baggage details or list
    const [viewingBaggageId, setViewingBaggageId] = useState<string | null>(null); // currently viewing baggage ID
    const [searchResults, setSearchResults] = useState<any[]>([]); // store search results list
    
    // helpers
    const openBaggageModal = () => setIsBaggageModalVisible(true);
    const closeBaggageModal = () => setIsBaggageModalVisible(false);


    const enterBaggageMutation = useMutation({
        mutationFn: (baggageData: any) => baggageApi.lostBaggage(baggageData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['baggage'] });
            setIsBaggageModalVisible(false);
            const message = extractSuccessMessage(response, 'Baggage reported successfully');
            showSuccess(message);
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while reporting baggage');
            if (__DEV__) console.error("Baggage reporting error:", message);
            showError(message);
        },
    });

    const searchBaggageMutation = useMutation({
        mutationFn: (searchParams: any) => baggageApi.searchBaggage(searchParams),
        onSuccess: (response: any) => {
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setSearchResults(response.data);
                setFoundBaggage(response.data);
                setSearchFound(true);
            } else {
                setSearchResults([]);
                setFoundBaggage([]);
                setSearchFound(true);
            }
            closeBaggageModal();
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while searching for baggage');
            if (__DEV__) console.error("Baggage search error:", message);
            showError(message);
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
            showError(message);
        },
    });

    const claimBaggageMutation = useMutation({
        mutationFn: (baggageId: string) => baggageApi.claimBaggage(baggageId),
        onSuccess: (response: any) => {
            if (response.data) {
                setFoundBaggage(response.data);
                setSearchFound(true);
            }
            showSuccess('Baggage claimed successfully!');
        },
        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while claiming baggage');
            if (__DEV__) console.error("Baggage claim error:", message);
            showError(message);
        },
    });

    const updateFormData = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    // wrapper helpers so callers can await if needed
    const reportBaggage = async () => enterBaggageMutation.mutateAsync(formData);
    const searchBaggage = async (params: any) => searchBaggageMutation.mutateAsync(params);
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
