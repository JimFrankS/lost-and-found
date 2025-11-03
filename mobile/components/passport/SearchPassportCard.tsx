 import React from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
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
                <Feather name="search" size={24} color="black" />
                <Text style={{ marginLeft: 8, color: '#4B5563', fontWeight: 'bold', fontSize: 18 }}>Search Lost Passport</Text>
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
