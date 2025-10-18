import { useQueryClient, useMutation } from "@tanstack/react-query";
import { scertificateApi } from "@/utils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utils/alerts";

export interface SCertificateFormData {
    certificateType: string;
    lastName: string;
    firstName: string;
    docLocation: string;
    finderContact: string;
}

export const useSCertificate = () => {
    const queryClient = useQueryClient();

    const [isSCertificateModalVisible, setIsSCertificateModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState<SCertificateFormData>({
        certificateType: "",
        lastName: "",
        firstName: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter school certificate details.

    const enterSCertificateMutation = useMutation({
        mutationFn: (scertificateData: any) => scertificateApi.foundScertificate(scertificateData), // Api Call to report found school certificate

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["scertificate"] }); // Invalidate scertificate queries to refetch updated data.
            setIsSCertificateModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "School Certificate reported successfully");
            showSuccess(message);
        },

        onError: (error: any) => {
            console.error("Error Reporting School Certificate: ", error); // log full error for debugging.
            const message = extractErrorMessage(error, "An error occurred whilst reporting found school certificate.");
            showError(message)
        },
    }); // end of the mutation for reporting found school certificate.

    const openSCertificateModal = () => {
        setFormData({
            certificateType: "",
            lastName: "",
            firstName: "",
            docLocation: "",
            finderContact: ""
        }); // reset form data when opening the modal

        setIsSCertificateModalVisible(true); // after reset is complete, make the modal to be visible
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [field]: value })); // Function to update the form data state
    };

    return {
        isSCertificateModalVisible,
        formData,
        openSCertificateModal,
        closeSCertificateModal: () => setIsSCertificateModalVisible(false), // Function to close the school certificate modal.
        reportSCertificate: () => enterSCertificateMutation.mutate(formData), // Function to submit the collected school certificate information
        updateFormData,
        isReporting: enterSCertificateMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["scertificate"] }) //function to refetch school certificate data.
    };

};
