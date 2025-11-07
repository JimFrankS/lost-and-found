import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTabStyles } from '@/styles/tabStyles'

import SearchScertificateCard from './SearchScertificateCard'
import FoundScertificateCard from './FoundScertificateCard'

interface SearchScertificateProps {
    scertificateHook: ReturnType<typeof import('@/hooks/useSCertificate').useSCertificate>
}

const SearchScertificate = ({ scertificateHook }: SearchScertificateProps) => {
    const showingResults = scertificateHook.searchPerformed;

    return (
        <View style={styles.container}>
            {showingResults ? (
                <FoundScertificateCard
                    searchFound={scertificateHook.searchFound}
                    foundScertificate={scertificateHook.viewedScertificate || scertificateHook.searchResults}
                    resetSearch={scertificateHook.resetSearch}
                    goBackToResults={scertificateHook.goBackToResults}
                    viewScertificate={scertificateHook.viewScertificate}
                    isViewing={scertificateHook.isViewing}
                    viewingScertificateId={scertificateHook.viewingScertificateId}
                    searchResults={scertificateHook.searchResults}
                />
            ) : (
                <SearchScertificateCard
                    isScertificateModalVisible={scertificateHook.isSCertificateModalVisible}
                    formData={scertificateHook.searchFormData}
                    openScertificateModal={scertificateHook.openSCertificateModal}
                    closeScertificateModal={scertificateHook.closeSCertificateModal}
                    searchScertificate={scertificateHook.searchScertificate}
                    updateFormData={scertificateHook.updateSearchFormData}
                    isSearching={scertificateHook.isSearching}
                    resetSearch={scertificateHook.resetSearch}
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

export default SearchScertificate;
