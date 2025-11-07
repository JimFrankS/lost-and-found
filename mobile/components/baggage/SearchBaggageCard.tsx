import React from 'react';
import { Text } from 'react-native';
import SearchBaggageModal from '@/components/baggage/SearchBaggageModal';
import CardWrapper from '@/styles/CardWrapper';
import { BaggageSearchParams, Baggage } from '@/types';

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
  searchBaggage: (params: BaggageSearchParams) => Promise<Baggage[]>;
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
        <Text className="text-gray-600 font-bold text-lg">Search Lost Baggage</Text>
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
