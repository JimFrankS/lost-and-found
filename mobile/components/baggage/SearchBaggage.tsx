import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabStyles } from '@/styles/tabStyles'
import SearchBaggageCard from '@/components/baggage/SearchBaggageCard'
import FoundBaggageCard from '@/components/baggage/FoundBaggageCard'

interface SearchBaggageProps {
  baggageHook: ReturnType<typeof import('@/hooks/useBaggage').useBaggage>
}

const SearchBaggage = ({ baggageHook }: SearchBaggageProps) => {
  const showingResults = baggageHook.searchPerformed;

  return (
    <View style={styles.container}>
      {showingResults ? (
        <FoundBaggageCard
          searchFound={baggageHook.searchFound}
          foundBaggage={baggageHook.viewedBaggage || baggageHook.searchResults}
          resetSearch={baggageHook.resetSearch}
          goBackToResults={baggageHook.goBackToResults}
          viewBaggage={baggageHook.viewBaggage}
          isViewing={baggageHook.isViewing}
          viewingBaggageId={baggageHook.viewingBaggageId}
          searchResults={baggageHook.searchResults}
        />
      ) : (
        <SearchBaggageCard
          isBaggageModalVisible={baggageHook.isBaggageModalVisible}
          formData={baggageHook.formData}
          openBaggageModal={baggageHook.openBaggageModal}
          closeBaggageModal={baggageHook.closeBaggageModal}
          searchBaggage={baggageHook.searchBaggage}
          updateFormData={baggageHook.updateFormData}
          isSearching={baggageHook.isSearching}
          resetSearch={baggageHook.resetSearch}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default SearchBaggage
