import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import SearchMBaggageCard from './SearchMBaggageCard'
import FoundMBaggageCard from './FoundMBaggageCard'

interface SearchMBaggageProps {
  baggageHook: ReturnType<typeof import('@/hooks/useMBaggage').useBaggage>
}

const SearchMBaggage = ({ baggageHook }: SearchMBaggageProps) => {
  const showingResults = !!baggageHook.searchFound;

  return (
    <View style={styles.container}>
      {showingResults ? (
        <FoundMBaggageCard
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
        <SearchMBaggageCard
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

export default SearchMBaggage
