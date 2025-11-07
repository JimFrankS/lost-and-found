import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NatId } from "@/types";
import NothingFound from "../NothingFound";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchResultStyles } from "@/styles/searchResultStyles";
import { toTitleCase } from "@/utils/string.utility";
import { TAB_BAR_HEIGHT, EXTRA_SPACE } from "@/styles/tabStyles";

interface FoundNatIDCardProps {
    searchFound: boolean;
    foundNatId: NatId | NatId[] | null;
    resetSearch: () => void;
    goBackToResults?: () => void;
    viewNatId?: (natIdId: string) => void;
    isViewing?: boolean;
    viewingNatIdId?: string | null;
    searchResults?: NatId[];
}

const FoundNatIDCard: React.FC<FoundNatIDCardProps> = ({
    foundNatId,
    searchFound,
    resetSearch,
    goBackToResults,
    viewNatId,
    isViewing,
    viewingNatIdId,
    searchResults,
}) => {
    const insets = useSafeAreaInsets();

    if (!searchFound) return null;

    if (!foundNatId) return null; // safety checks to prevent errors in the render method in case nothing is found

    //check if we have no results (empty array)
    const hasNoResults = Array.isArray(foundNatId) && foundNatId.length === 0;

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

    const isMultipleResults = Array.isArray(foundNatId) && foundNatId.length > 0;

    const isViewingSingleItem = !isMultipleResults && !!searchResults && searchResults.length > 0;

    const handleViewDetails = (id?: string) => {
        if (!id || !viewNatId) return;
        viewNatId(id);
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
                        {isMultipleResults ? "Found National ID Results" : (foundNatId && !Array.isArray(foundNatId) ? "Found National ID Result" : "NA")}
                    </Text>
                    <View style={searchResultStyles.headerSpacer} />
                </View>

                {isMultipleResults ? (
                    <ScrollView contentContainerStyle={[searchResultStyles.resultsContainer, { paddingBottom: Math.max(insets.bottom, TAB_BAR_HEIGHT + EXTRA_SPACE) }]}>
                        {foundNatId.map((natId: any, index: number) => {
                            if (!natId || typeof natId !== 'object' || !natId._id) return null;
                            return (
                                <View key={String(natId._id || index)} style={searchResultStyles.card}>
                                    <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(natId.firstName || 'NA'))}</Text>
                                    <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(natId.lastName || 'NA'))}</Text>
                                    <Text style={searchResultStyles.cardTitle}>ID Number: {String(natId.idNumber || 'NA')}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleViewDetails(String(natId._id || ''))}
                                        disabled={isViewing && viewingNatIdId === String(natId._id || '')}
                                        style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}>
                                        <Text style={searchResultStyles.actionText}> {isViewing && viewingNatIdId === String(natId._id || '') ? "Loading..." : "View Details"} </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={[searchResultStyles.singleContainer, { paddingBottom: Math.max(insets.bottom, TAB_BAR_HEIGHT + EXTRA_SPACE) }]}>
                        {foundNatId && !Array.isArray(foundNatId) && (
                            <View style={searchResultStyles.detailCard}>
                                <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(foundNatId.firstName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(foundNatId.lastName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>ID Number: {String(foundNatId.idNumber || 'NA')}</Text>
                                <Text style={searchResultStyles.cardTitle}>Location: {toTitleCase(String(foundNatId.docLocation || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Finder Contact: {String(foundNatId.finderContact || 'NA')}</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default FoundNatIDCard;
