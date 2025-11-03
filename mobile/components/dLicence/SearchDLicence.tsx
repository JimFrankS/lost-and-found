import React from "react";
import { View, StyleSheet } from "react-native";
import SearchDLicenceCard from "./SearchDLicenceCard";
import FoundDLicenceCard from "./FoundDLicenceCard";

interface SearchDLicenceProps {
    dlicenceHook: ReturnType<typeof import("@/hooks/useDLicense").useDLicense>;
}

const SearchDLicence = ({ dlicenceHook }: SearchDLicenceProps) => {
    const showingResults = !!dlicenceHook.searchFound;

    return (
        <View style={styles.container}>
            {showingResults ? (
                <FoundDLicenceCard
                    searchFound={dlicenceHook.searchFound}
                    foundDLicence={dlicenceHook.viewedDLicence || dlicenceHook.searchResults}
                    resetSearch={dlicenceHook.resetSearch}
                    goBackToResults={dlicenceHook.goBackToResults}
                    viewDLicence={dlicenceHook.viewDLicence}
                    isViewing={dlicenceHook.isViewing}
                    viewingDLicenceId={dlicenceHook.viewingDLicenceId}
                    searchResults={dlicenceHook.searchResults}
                />
            ) : (
                <SearchDLicenceCard
                    isDLicenceModalVisible={dlicenceHook.isDLicenseModalVisible}
                    formData={dlicenceHook.searchFormData}
                    openDLicenceModal={dlicenceHook.openDLicenseModal}
                    closeDLicenceModal={dlicenceHook.closeDLicenseModal}
                    searchDLicence={dlicenceHook.searchDLicence}
                    updateFormData={dlicenceHook.updateSearchFormData}
                    isSearching={dlicenceHook.isSearching}
                    resetSearch={dlicenceHook.resetSearch}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: "100%" },
});

export default SearchDLicence;
