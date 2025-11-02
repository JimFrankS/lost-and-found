import React from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import SearchNatIdModal from "@/components/natId/SearchNatIdModal";
import CardWrapper from "@/styles/CardWrapper";

interface SearchNatIdCardProps {
    isNatIDModalVisible: boolean;
    formData: {
        category: string;
        identifier: string;
    };
    openNatIDModal: () => void;
    closeNatIDModal: () => void;
    searchNatId: (params: any) => Promise<any>;
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
                <Text style={{ marginLeft: 8, color: '#4B5563', fontWeight: 'bold', fontSize: 18 }}>Search Lost National ID</Text>
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
