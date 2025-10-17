import { useQueryClient, useMutation } from "@tanstack/react-query";
import { bcertificateApi } from "@/utiils/api";
import { useState } from "react";
import { extractErrorMessage, extractSuccessMessage, showError, showSuccess } from "@/utiils/alerts";

export const useBCertificate = () => {
    const queryClient = useQueryClient();

    const [isBCertificateModalVisible, setIsBCertificateModalVisible] = useState(false); // state for holding modal visibility

    const [formData, setFormData] = useState({
        motherLastName: "",
        lastName: "",
        firstName: "",
        secondName: "",
        docLocation: "",
        finderContact: ""
    }); // State for holding the form data for enter birthcertiface details.

    const enterBCertificateMutation = useMutation({
        mutationFn: (bcertifacteData: any) => bcertificateApi.foundbCertificate(bcertifacteData), // Api Call to report lost baggage

        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["bcertificate"] }); // Invalidate bcertificate queries to refetch updated data.
            setIsBCertificateModalVisible(false); // Close the modal
            const message = extractSuccessMessage(response, "Birth Certificate reported succesfully");
            showSuccess(message);
        },

        onError: (error: any) => {
            console.error("Error Reporting Birth Certificate: ", error) // log full error for debugging.
            const message = extractErrorMessage(error, "An error occured whilst reporting lost birthcertificate.");
            showError(message)
        },
    }); // end of the mutation for reporting lost birthcertificate.

    const openBCertificateModal = () => {
        setFormData({
            motherLastName: "",
            lastName: "",
            firstName: "",
            secondName: "",
            docLocation: "",
            finderContact: ""
        }); // reset form data when opening the modal

        setIsBCertificateModalVisible(true); // after reset is complete, make the modal to be visible
    };

    const updateFormData =(field: string, value: string) => {
        setFormData((prevData) => ({...prevData, [field]: value})); // Function to update the form data state
    };

    return {
        isBCertificateModalVisible,
        formData,
        openBCertificateModal,
        closeBCertificateModal: () => setIsBCertificateModalVisible(false), // Function to close the birth certificate modal.
        reportBCertificate: () => enterBCertificateMutation.mutate(formData), // Function to submit the collected birth certificate information
        updateFormData,
        isReporting: enterBCertificateMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ["bcertificate"]}) //function to refetch birth certificate data.
    };

};