 import React from "react";
import { Text } from "react-native";
import SearchPassportModal from "@/components/passport/SearchPassportModal";
import CardWrapper from "@/styles/CardWrapper";
import { PassportSearchParams, Passport } from "@/types";

interface SearchPassportCardProps {
    isPassportModalVisible: boolean;
    formData: {
        category: string;
        identifier: string;
    };
    openPassportModal: () => void;
    closePassportModal: () => void;
    searchPassport: (params: PassportSearchParams) => Promise<Passport[]>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}

const SearchPassportCard = ({
    isPassportModalVisible,
    formData,
    openPassportModal,
    closePassportModal,
    searchPassport,
    updateFormData,
    isSearching,
    resetSearch,
}: SearchPassportCardProps) => {

    return (
        <>
            <CardWrapper onPress={openPassportModal} accessibilityLabel="Search Lost Passport">
                <Text className="text-gray-600 font-bold text-lg">Search Lost Passport</Text>
            </CardWrapper>

            <SearchPassportModal
                isVisible={isPassportModalVisible}
                onClose={closePassportModal}
                formData={formData}
                searchPassport={searchPassport}
                updateFormData={updateFormData}
                isSearching={isSearching}
                resetSearch={resetSearch}
            />
        </>
    );
};

export default SearchPassportCard;
