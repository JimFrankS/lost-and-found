import React from "react";
import { View, StyleSheet } from "react-native";
import SearchNatIdCard from "./SearchNatIdCard";
import FoundNatIDCard from "./FoundNatIDCard";

interface SearchNatIdProps {
    natIdHook: ReturnType<typeof import("@/hooks/useNatID").useNatID>;
}

const SearchNatId = ({ natIdHook }: SearchNatIdProps) => {
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
                    isNatIDModalVisible={natIdHook.isNatIDModalVisible}
                    formData={natIdHook.searchFormData}
                    openNatIDModal={natIdHook.openNatIDModal}
                    closeNatIDModal={natIdHook.closeNatIDModal}
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
