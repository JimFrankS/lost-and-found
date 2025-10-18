import { useQueryClient, useMutation } from "@tanstack/react-query";
import { natIdApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utils/alerts";

export interface NationalIDFormData {
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export const useNatID = () => {
    const queryClient = useQueryClient();

    const [isNatIDModalVisible, setIsNatIDModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<NationalIDFormData>({
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter national ID details.

    const enterNatIDMutation = useMutation({
        mutationFn: (natIdData: any) => natIdApi.foundId(natIdData), // Api Call to report found national ID

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["natId"] }); // Invalidate natId queries to refetch updated data.
            setIsNatIDModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "National ID reported successfully");
            showSuccess(message);
        },

        onError: (error: any) => {
            console.error("Error Reporting National ID: ", error); // log full error for debugging.
            const message = extractErrorMessage(error, "An error occurred whilst reporting found national ID.");
            showError(message)
        },
    }); // end of the mutation for reporting found national ID.

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

    return {
        isNatIDModalVisible,
        formData,
        openNatIDModal,
        closeNatIDModal: () => setIsNatIDModalVisible(false), // Function to close the national ID modal.
        reportNatID: () => enterNatIDMutation.mutate(formData), // Function to submit the collected national ID information
        updateFormData,
        isReporting: enterNatIDMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["natId"] }) //function to refetch national ID data.
    };

};
