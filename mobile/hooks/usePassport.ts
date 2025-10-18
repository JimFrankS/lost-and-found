import { useQueryClient, useMutation } from "@tanstack/react-query";
import { passportApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utils/alerts";

export interface PassportFormData {
    passportNumber: string;
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export const usePassport = () => {
    const queryClient = useQueryClient();

    const [isPassportModalVisible, setIsPassportModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<PassportFormData>({
        passportNumber: "",
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter passport details.

    const enterPassportMutation = useMutation({
        mutationFn: (passportData: any) => passportApi.lostPassport(passportData), // Api Call to report lost passport

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["passport"] }); // Invalidate passport queries to refetch updated data.
            setIsPassportModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "Passport reported successfully");
            showSuccess(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting lost passport.");
            if (__DEV__) console.error("Error Reporting Passport:", message);
            showError(message);
        },
    }); // end of the mutation for reporting lost passport.

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

    return {
        isPassportModalVisible,
        formData,
        openPassportModal,
        closePassportModal: () => setIsPassportModalVisible(false), // Function to close the passport modal.
        reportPassport: () => enterPassportMutation.mutate(formData), // Function to submit the collected passport information
        updateFormData,
        isReporting: enterPassportMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["passport"] }) //function to refetch passport data.
    };

};
