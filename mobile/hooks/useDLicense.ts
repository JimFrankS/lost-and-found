import { useQueryClient, useMutation } from "@tanstack/react-query";
import { dLicenceApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utils/alerts";

export interface DrivingLicenseFormData {
    licenceNumber: string;
    lastName: string;
    firstName: string;
    idNumber: string;
    docLocation: string;
    finderContact: string;
}

export const useDLicense = () => {
    const queryClient = useQueryClient();

    const [isDLicenseModalVisible, setIsDLicenseModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<DrivingLicenseFormData>({
        licenceNumber: "",
        lastName: "",
        firstName: "",
        idNumber: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter driving license details.

    const enterDLicenseMutation = useMutation({
        mutationFn: (dLicenceData: any) => dLicenceApi.foundLicence(dLicenceData), // Api Call to report found driving license

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["dLicence"] }); // Invalidate dLicence queries to refetch updated data.
            setIsDLicenseModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "Driving License reported successfully");
            showSuccess(message);
        },

        onError: (error: any) => {
            const message = extractErrorMessage(error, "An error occurred whilst reporting found driving license.");
            if (__DEV__) console.error("Error Reporting Driving License:", message);
            showError(message);
        },
    }); // end of the mutation for reporting found driving license.

    const openDLicenseModal = () => {
        setFormData({
            licenceNumber: "",
            lastName: "",
            firstName: "",
            idNumber: "",
            docLocation: "",
            finderContact: ""
        }); // reset form data when opening the modal

        setIsDLicenseModalVisible(true); // after reset is complete, make the modal to be visible
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    return {
        isDLicenseModalVisible,
        formData,
        openDLicenseModal,
        closeDLicenseModal: () => setIsDLicenseModalVisible(false), // Function to close the driving license modal.
        reportDLicense: () => enterDLicenseMutation.mutate(formData), // Function to submit the collected driving license information
        updateFormData,
        isReporting: enterDLicenseMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["dLicence"] }) //function to refetch driving license data.
    };

};
