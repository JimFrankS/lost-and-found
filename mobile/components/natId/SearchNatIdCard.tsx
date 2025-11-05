import React from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import SearchNatIdModal from "@/components/natId/SearchNatIdModal";
import CardWrapper from "@/styles/CardWrapper";
import { NatIdSearchParams, NatId } from "@/types";

interface SearchNatIdCardProps {
    isNatIDModalVisible: boolean;
    formData: {
        category: string;
        identifier: string;
    };
    openNatIDModal: () => void;
    closeNatIDModal: () => void;
    searchNatId: (params: NatIdSearchParams) => Promise<boolean>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}

const SearchNatIdCard = ({
    isNatIDModalVisible,
    formData,
    openNatIDModal,
    closeNatIDModal,
    searchNatId,
    updateFormData,
    isSearching,
    resetSearch,
}: SearchNatIdCardProps) => {

    return (
        <>
            <CardWrapper onPress={openNatIDModal} accessibilityLabel="Search Lost National ID">
                <Feather name="search" size={24} color="black" />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Search Lost National ID</Text>
            </CardWrapper>

            <SearchNatIdModal
                isVisible={isNatIDModalVisible}
                onClose={closeNatIDModal}
                formData={formData}
                searchNatId={searchNatId}
                updateFormData={updateFormData}
                isSearching={isSearching}
                resetSearch={resetSearch}
            />
        </>
    );
};

export default SearchNatIdCard;
