import React from 'react';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBCertificateModal from '@/components/birthcertificate/SearchBCertificateModal';
import CardWrapper from '@/styles/CardWrapper';
import { BirthCertificateSearchParams, Bcertificate } from '@/types';

interface SearchBCertificateCardProps {
    isSearchModalVisible: boolean;
    formData: {
        motherLastName: string;
        lastName: string;
        firstName: string;
    };
    openSearchModal: () => void;
    closeSearchModal: () => void;
    searchBCertificate: (params: BirthCertificateSearchParams) => Promise<Bcertificate[]>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}

const SearchBCertificateCard = ({
    isSearchModalVisible,
    formData,
    openSearchModal,
    closeSearchModal,
    searchBCertificate,
    updateFormData,
    isSearching,
    resetSearch,
}: SearchBCertificateCardProps) => (
    <>
        <CardWrapper onPress={openSearchModal} accessibilityLabel="Search Lost Birth Certificate">
            <Feather name="search" size={24} color="black" />
            <Text style={{ marginLeft: 8, color: '#4B5563', fontWeight: 'bold', fontSize: 18 }}>Search Lost Birth Certificate</Text>
        </CardWrapper>
        <SearchBCertificateModal isVisible={isSearchModalVisible} onClose={closeSearchModal} formData={formData} searchBCertificate={searchBCertificate} updateFormData={updateFormData} isSearching={isSearching} resetSearch={resetSearch} />
    </>
);

export default SearchBCertificateCard;