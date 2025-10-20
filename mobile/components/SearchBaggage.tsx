import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackGroundCard from '@/components/BackGroundCard'
import { tabStyles } from '@/styles/tabStyles'
import SearchBaggageCard from '@/components/SearchBaggageCard'
import FoundBaggageCard from '@/components/FoundBaggageCard'
import { useBaggage } from '@/hooks/useBaggage'

const SearchBaggage = () => {
  const baggageHook = useBaggage();

  return (
    <View style={{ flex: 1, paddingBottom: 0 }}>
      <BackGroundCard />
      <View style={{ flex: 1, position: 'relative', zIndex: 1, paddingBottom: 0 }}>
        {!baggageHook.searchFound ? (
          <SafeAreaView style={[tabStyles.safeArea, { paddingBottom: 0 }]}>
            <View style={[tabStyles.container, { paddingBottom: 0 }]}>
              <View style={[tabStyles.content, { paddingBottom: 0 }]}>
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
              </View>
            </View>
          </SafeAreaView>
        ) : (
          <View style={{ flex: 1, paddingBottom: 0 }}>
            <FoundBaggageCard
              searchFound={baggageHook.searchFound}
              foundBaggage={baggageHook.foundBaggage}
              resetSearch={baggageHook.resetSearch}
              goBackToResults={baggageHook.goBackToResults}
              viewBaggage={baggageHook.viewBaggage}
              isViewing={baggageHook.isViewing}
              viewingBaggageId={baggageHook.viewingBaggageId}
              searchResults={baggageHook.searchResults}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default SearchBaggage