import React from 'react';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBaggageModal from '@/components/baggage/SearchBaggageModal';
import CardWrapper from '@/styles/CardWrapper';

interface SearchBaggageCardProps {
  isBaggageModalVisible: boolean;
  formData: {
    baggageType: string;
    transportType: string;
    routeType: string;
    destinationProvince: string;
    destinationDistrict: string;
    docLocation: string;
    finderContact: string;
  };
  openBaggageModal: () => void;
  closeBaggageModal: () => void;
  searchBaggage: (params: any) => void;
  updateFormData: (field: string, value: string) => void;
  isSearching: boolean;
  resetSearch: () => void;
}

const SearchBaggageCard = ({
  isBaggageModalVisible,
  formData,
  openBaggageModal,
  closeBaggageModal,
  searchBaggage,
  updateFormData,
  isSearching,
  resetSearch,
}: SearchBaggageCardProps) => {

  return (
    <>
      <CardWrapper onPress={openBaggageModal} accessibilityLabel="Search lost baggage">
        <Feather name="search" size={24} color="black" />
        <Text style={{ marginLeft: 8, color: '#4B5563', fontWeight: 'bold', fontSize: 18 }}>Search Lost Baggage</Text>
      </CardWrapper>
      <SearchBaggageModal
        isVisible={isBaggageModalVisible}
        onClose={closeBaggageModal}
        formData={formData}
        searchBaggage={searchBaggage}
        updateFormData={updateFormData}
        isSearching={isSearching}
        resetSearch={resetSearch}
      />
    </>
  );
};

export default SearchBaggageCard;
