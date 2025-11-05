import React from "react";
import { Text } from "react-native";
import SearchDLicenceModal from "@/components/dLicence/SearchDLicenceModal";
import CardWrapper from "@/styles/CardWrapper";
import { DLicenceSearchParams, DLicence } from "@/types";

interface SearchDLicenceCardProps {
    isDLicenceModalVisible: boolean;
    formData: {
        category: string;
        identifier: string;
    };
    openDLicenceModal: () => void;
    closeDLicenceModal: () => void;
    searchDLicence: (params: DLicenceSearchParams) => Promise<DLicence[]>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}

const SearchDLicenceCard = ({
    isDLicenceModalVisible,
    formData,
    openDLicenceModal,
    closeDLicenceModal,
    searchDLicence,
    updateFormData,
    isSearching,
    resetSearch,
}: SearchDLicenceCardProps) => {

    return (
        <>
            <CardWrapper onPress={openDLicenceModal} accessibilityLabel="Search Lost Driving Licence">
                <Text className="text-gray-600 font-bold text-lg">Search Lost Driving Licence</Text>
            </CardWrapper>

            <SearchDLicenceModal
                isVisible={isDLicenceModalVisible}
                onClose={closeDLicenceModal}
                formData={formData}
                searchDLicence={searchDLicence}
                updateFormData={updateFormData}
                isSearching={isSearching}
                resetSearch={resetSearch}
            />
        </>
    );
};

export default SearchDLicenceCard;
