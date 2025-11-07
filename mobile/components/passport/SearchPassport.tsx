import React from "react";
import { View, StyleSheet } from "react-native";
import SearchPassportCard from "./SearchPassportCard";
import FoundPassportCard from "./FoundPassportCard";

interface SearchPassportProps {
    passportHook: ReturnType<typeof import("@/hooks/usePassport").usePassport>;
}

const SearchPassport = ({ passportHook }: SearchPassportProps) => {
    const showingResults = passportHook.searchPerformed;

    return (
        <View style={styles.container}>
            {showingResults ? (
                <FoundPassportCard
                    searchFound={passportHook.searchFound}
                    foundPassport={passportHook.viewedPassport || passportHook.searchResults}
                    resetSearch={passportHook.resetSearch}
                    goBackToResults={passportHook.goBackToResults}
                    viewPassport={passportHook.viewPassport}
                    isViewing={passportHook.isViewing}
                    viewingPassportId={passportHook.viewingPassportId}
                    searchResults={passportHook.searchResults}
                />
            ) : (
                <SearchPassportCard
                    isPassportModalVisible={passportHook.isPassportModalVisible}
                    formData={passportHook.searchFormData}
                    openPassportModal={passportHook.openPassportModal}
                    closePassportModal={passportHook.closePassportModal}
                    searchPassport={passportHook.searchPassport}
                    updateFormData={passportHook.updateSearchFormData}
                    isSearching={passportHook.isSearching}
                    resetSearch={passportHook.resetSearch}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
});

export default SearchPassport;
