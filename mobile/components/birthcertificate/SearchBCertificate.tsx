import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBCertificateCard from './SearchBCertificateCard';
import FoundBCertificateCard from './FoundBCertificateCard';

interface SearchBCertificateProps {
    bcertificateHook: ReturnType<typeof import('@/hooks/useBCertificate').useBCertificate>;
}

const SearchBCertificate = ({ bcertificateHook }: SearchBCertificateProps) => {
    const showingResults = !!bcertificateHook.searchFound;

    return (
        <View style={styles.container}>
            {showingResults ? (
                <FoundBCertificateCard
                    searchFound={bcertificateHook.searchFound}
                    foundBcertificate={bcertificateHook.viewedBcertificate || bcertificateHook.searchResults}
                    resetSearch={bcertificateHook.resetSearch}
                    goBackToResults={bcertificateHook.goBackToResults}
                    viewBcertificate={bcertificateHook.viewBcertificate}
                    isViewing={bcertificateHook.isViewing}
                    viewingBcertificateId={bcertificateHook.viewingBcertificateId}
                    searchResults={bcertificateHook.searchResults}
                />
            ) : (
                <SearchBCertificateCard
                    isSearchModalVisible={bcertificateHook.isSearchModalVisible}
                    formData={bcertificateHook.searchFormData}
                    openSearchModal={bcertificateHook.openSearchModal}
                    closeSearchModal={bcertificateHook.closeSearchModal}
                    searchBCertificate={bcertificateHook.searchBcertificate}
                    updateFormData={bcertificateHook.updateSearchFormData}
                    isSearching={bcertificateHook.isSearching}
                    resetSearch={bcertificateHook.resetSearch}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%' },
});

export default SearchBCertificate;