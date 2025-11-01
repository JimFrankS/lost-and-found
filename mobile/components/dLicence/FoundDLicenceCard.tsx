import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { DLicence } from "@/types";
import NothingFound from "../NothingFound";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchResultStyles } from "@/styles/searchResultStyles";
import { toTitleCase } from "@/utils/string.utility";

interface FoundDLicenceCardProps {
    searchFound: boolean;
    foundDLicence: DLicence | DLicence[] | null;
    resetSearch: () => void;
    goBackToResults?: () => void;
    viewDLicence?: (dlicenceId: string) => void;
    isViewing?: boolean;
    viewingDLicenceId?: string | null;
    searchResults?: DLicence[];
}

const FoundDLicenceCard: React.FC<FoundDLicenceCardProps> = ({
    foundDLicence,
    searchFound,
    resetSearch,
    goBackToResults,
    viewDLicence,
    isViewing,
    viewingDLicenceId,
    searchResults,
}) => {
    const insets = useSafeAreaInsets();

    if (!searchFound) return null;

    if (!foundDLicence) return null; // safety checks to prevent errors in the render method in case nothing is found

    //check if we have no results (empty array)
    const hasNoResults = Array.isArray(foundDLicence) && foundDLicence.length === 0;

    if (hasNoResults) {
        return (
            <View style={{ flex: 1, position: "relative" }}>
                <View
                    style={[
                        { flex: 1, zIndex: 1, paddingTop: insets.top, paddingBottom: 0 },
                    ]}
                >
                    <View style={searchResultStyles.header}>
                        <TouchableOpacity
                            onPress={resetSearch}
                            style={searchResultStyles.backButton}
                        >
                            <Text style={searchResultStyles.backText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={searchResultStyles.headerTitle}>No Results Found</Text>
                        <View style={searchResultStyles.headerSpacer} />
                    </View>
                    <NothingFound />
                </View>
            </View>
        );
    }

    const isMultipleResults = Array.isArray(foundDLicence) && foundDLicence.length > 0;

    const isViewingSingleItem = !isMultipleResults && !!searchResults && searchResults.length > 0;

    const handleViewDetails = (id?: string) => {
        if (!id || !viewDLicence) return;
        viewDLicence(id);
    };

    return (
        <View style={{ flex: 1, position: "relative" }}>
            <View
                style={[
                    { flex: 1, zIndex: 1, paddingTop: insets.top, paddingBottom: 0 },
                ]}
            >
                <View style={searchResultStyles.header}>
                    <TouchableOpacity
                        onPress={isViewingSingleItem ? (goBackToResults || resetSearch) : resetSearch}
                        style={searchResultStyles.backButton}
                    >
                        <Text style={searchResultStyles.backText}>Back</Text>
                    </TouchableOpacity>

                    <Text style={searchResultStyles.headerTitle}>
                        {isMultipleResults ? "Found Licence Results" : (foundDLicence && !Array.isArray(foundDLicence) ? "Found Licence Result" : "NA")}
                    </Text>
                    <View style={searchResultStyles.headerSpacer} />
                </View>

                {isMultipleResults ? (
                    <ScrollView contentContainerStyle={searchResultStyles.resultsContainer}>
                        {foundDLicence.map((dlicence: any, index: number) => {
                            if (!dlicence || typeof dlicence !== 'object' || !dlicence._id) return null;
                            return (
                                <View key={String(dlicence._id || index)} style={searchResultStyles.card}>
                                    <Text style={searchResultStyles.cardTitle}>Licence Number: {String(dlicence.licenceNumber || 'NA')}</Text>
                                    <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(dlicence.firstName || 'NA'))}</Text>
                                    <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(dlicence.lastName || 'NA'))}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleViewDetails(String(dlicence._id || ''))}
                                        disabled={isViewing && viewingDLicenceId === String(dlicence._id || '')}
                                        style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}>
                                        <Text style={searchResultStyles.actionText}> {isViewing && viewingDLicenceId === String(dlicence._id || '') ? "Loading..." : "View Details"} </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={searchResultStyles.singleContainer}>
                        {foundDLicence && !Array.isArray(foundDLicence) && (
                            <View style={searchResultStyles.detailCard}>
                                <Text style={searchResultStyles.cardTitle}>Licence Number: {String(foundDLicence.licenceNumber || 'NA')}</Text>
                                <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(foundDLicence.firstName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(foundDLicence.lastName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>ID Number: {String(foundDLicence.idNumber || 'NA')}</Text>
                                <Text style={searchResultStyles.cardTitle}>Location: {toTitleCase(String(foundDLicence.docLocation || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Finder Contact: {String(foundDLicence.finderContact || 'NA')}</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default FoundDLicenceCard;
