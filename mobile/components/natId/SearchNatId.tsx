import React from "react";
import { View, StyleSheet } from "react-native";
import SearchNatIdCard from "./SearchNatIdCard";
import FoundNatIDCard from "./FoundNatIDCard";

interface SearchNatIdProps {
    natIdHook: ReturnType<typeof import("@/hooks/useNatID").useNatID>;
    isSearchModalVisible?: boolean;
    openSearchModal?: () => void;
    closeSearchModal?: () => void;
}

const SearchNatId = ({ natIdHook, isSearchModalVisible, openSearchModal, closeSearchModal }: SearchNatIdProps) => {
    const showingResults = !!natIdHook.searchFound;

    return (
        <View style={styles.container}>
            {showingResults ? (
                <FoundNatIDCard
                    searchFound={natIdHook.searchFound}
                    foundNatId={natIdHook.viewedNatId || natIdHook.searchResults}
                    resetSearch={natIdHook.resetSearch}
                    goBackToResults={natIdHook.goBackToResults}
                    viewNatId={natIdHook.viewNatId}
                    isViewing={natIdHook.isViewing}
                    viewingNatIdId={natIdHook.viewingNatIdId}
                    searchResults={natIdHook.searchResults}
                />
            ) : (
                <SearchNatIdCard
                    isNatIDModalVisible={isSearchModalVisible || false}
                    formData={natIdHook.searchFormData}
                    openNatIDModal={openSearchModal || natIdHook.openSearchModal}
                    closeNatIDModal={closeSearchModal || (() => {})}
                    searchNatId={natIdHook.searchNatId}
                    updateFormData={natIdHook.updateSearchFormData}
                    isSearching={natIdHook.isSearching}
                    resetSearch={natIdHook.resetSearch}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
});

export default SearchNatId;
