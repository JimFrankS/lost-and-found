import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baggageApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utils/alerts";

export const useBaggage = () => {
    const queryClient = useQueryClient();

    const [isBaggageModalVisible, setIsBaggageModalVisible] = useState(false); // State to control modal visibility for baggage form

    const [formData, setFormData] = useState({
        baggageType: "",
        transportType: "",
        routeType: "",
        destinationProvince: "",
        destinationDistrict: "",
        destination: "",
        docLocation: "",
        finderContact: ""
    }); // State to hold form data for entering baggage details

    const enterBaggageMutation = useMutation({
        mutationFn: (baggageData: any) => baggageApi.lostBaggage(baggageData), // API call to report lost baggage
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['baggage'] }); // Invalidate baggage queries to refetch updated data
            setIsBaggageModalVisible(false); // Close the modal on success
            const message = extractSuccessMessage(response, 'Baggage reported successfully');
            showSuccess(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, 'An error occurred while reporting baggage');
            if (__DEV__) console.error("Baggage reporting error:", message);
            showError(message);
        },
    }); // Mutation hook for reporting lost baggage

    const openBaggageModal = () => {
        setFormData({
            baggageType: "",
            transportType: "",
            routeType: "",
            destinationProvince: "",
            destinationDistrict: "",
            destination: "",
            docLocation: "",
            finderContact: ""
        }); // Reset form data when opening the modal
        setIsBaggageModalVisible(true); // Function to open the baggage form modal
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update form data state
    }; // Function to update form data state

    return {
        isBaggageModalVisible,
        formData,
        openBaggageModal,
        closeBaggageModal: () => setIsBaggageModalVisible(false), // Function to close the baggage form modal   
        reportBaggage: () => enterBaggageMutation.mutate(formData), // Function to submit baggage report
        updateFormData,
        isReporting: enterBaggageMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['baggage'] }) // Function to refetch baggage data
    };
};
