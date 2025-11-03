import React from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import SearchScertificateModal from "@/components/scertificate/SearchScertificateModal";
import CardWrapper from "@/styles/CardWrapper";
import { SCertificateSearchParams, Scertificate } from "@/types";

interface SearchScertificateCardProps {
    isScertificateModalVisible: boolean;
    formData: {
        certificateType: string;
        lastName: string;
    };
    openScertificateModal: () => void;
    closeScertificateModal: () => void;
    searchScertificate: (params: SCertificateSearchParams) => Promise<Scertificate[]>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}

const SearchScertificateCard = ({
    isScertificateModalVisible,
    formData,
    openScertificateModal,
    closeScertificateModal,
    searchScertificate,
    updateFormData,
    isSearching,
    resetSearch,
}: SearchScertificateCardProps) => {

    return (
        <>
            <CardWrapper onPress={openScertificateModal} accessibilityLabel="Search Lost Certificate">
                <Feather name="search" size={24} color="black" />
                <Text style={{ marginLeft: 8, color: '#4B5563', fontWeight: 'bold', fontSize: 18 }}>Search Lost Certificate</Text>
            </CardWrapper>

            <SearchScertificateModal
                isVisible={isScertificateModalVisible}
                onClose={closeScertificateModal}
                formData={formData}
                searchScertificate={searchScertificate}
                updateFormData={updateFormData}
                isSearching={isSearching}
                resetSearch={resetSearch}
            />
        </>
    );
};

export default SearchScertificateCard;