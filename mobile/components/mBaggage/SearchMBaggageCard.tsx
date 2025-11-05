import React from 'react';
import { Text } from 'react-native';
import SearchMBaggageModal from './SearchMBaggageModal';
import CardWrapper from '@/styles/CardWrapper';
import { MBaggageSearchParams } from '@/types';

interface SearchBaggageCardProps {
  isBaggageModalVisible: boolean;
  formData: {
    baggageType: string;
    gatheringType: string;
    destinationProvince: string;
    destinationDistrict: string;
  };
  openBaggageModal: () => void;
  closeBaggageModal: () => void;
  searchBaggage: (params: MBaggageSearchParams) => Promise<boolean>;
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
        <Text className="text-gray-600 font-bold text-lg">Search Lost Items</Text>
      </CardWrapper>
      <SearchMBaggageModal
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
