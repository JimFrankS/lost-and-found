import React from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { searchResultStyles } from "@/styles/searchResultStyles";
import NothingFound from "../NothingFound";
import { Scertificate } from "@/types";
import { toTitleCase } from "@/utils/string.utility";
import { TAB_BAR_HEIGHT, EXTRA_SPACE } from "@/styles/tabStyles";

export interface FoundScertificateCardProps {
    searchFound: boolean;
    foundScertificate: Scertificate | Scertificate[] | null;
    resetSearch: () => void;
    goBackToResults?: () => void;
    viewScertificate?: (scertificateId: string) => void;
    isViewing?: boolean;
    viewingScertificateId?: string | null;
    searchResults?: Scertificate[];
}

const FoundScertificateCard = ({
    searchFound,
    foundScertificate,
    goBackToResults,
    resetSearch,
    viewScertificate,
    isViewing,
    viewingScertificateId,
    searchResults,
}: FoundScertificateCardProps) => {
    const insets = useSafeAreaInsets();

    if (!searchFound) return null;

    if (!foundScertificate) return null; // safety checks to prevent errors in the render method in case nothing is found

    //check if we have no results (empty array)
    const hasNoResults = Array.isArray(foundScertificate) && foundScertificate.length === 0;

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

    const isMultipleResults = Array.isArray(foundScertificate) && foundScertificate.length > 0;

    const isViewingSingleItem = !isMultipleResults && !!searchResults && searchResults.length > 0;

    const handleViewDetails = (id?: string) => {
        if (!id || !viewScertificate) return;
        viewScertificate(id);
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
                        {isMultipleResults ? "Found Certificate Results" : "Found Certificate Result"}
                    </Text>
                    <View style={searchResultStyles.headerSpacer} />
                </View>

                {isMultipleResults ? (
                    <ScrollView contentContainerStyle={[searchResultStyles.resultsContainer, { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + EXTRA_SPACE }]}>
                        {foundScertificate.map((scertificate: Scertificate, index: number) => {
                            if (!scertificate || typeof scertificate !== 'object' || !scertificate._id) return null;
                            return (
                                <View key={scertificate._id || index.toString()} style={searchResultStyles.card}>
                                    <Text style={searchResultStyles.cardTitle}>Certificate Type: {toTitleCase(String(scertificate.certificateType || 'NA'))} </Text>
                                    <Text style={searchResultStyles.cardText}>Surname: {toTitleCase(String(scertificate.lastName || 'NA'))} </Text>

                                    <TouchableOpacity
                                        onPress={() => handleViewDetails(scertificate._id)}
                                        disabled={isViewing && viewingScertificateId === scertificate._id}
                                        style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}>
                                        <Text style={searchResultStyles.actionText}> {isViewing && viewingScertificateId === scertificate._id ? "Loading..." : "View Details"} </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={[searchResultStyles.singleContainer, { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + EXTRA_SPACE }]}>
                        {foundScertificate && !Array.isArray(foundScertificate) && (
                            <View style={searchResultStyles.detailCard}>
                                <Text style={searchResultStyles.cardTitle}>Certificate Type: {toTitleCase(String(foundScertificate.certificateType || 'NA'))} </Text>
                                <Text style={searchResultStyles.cardTitle}>Surname: {toTitleCase(String(foundScertificate.lastName || 'NA'))} </Text>
                                <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(foundScertificate.firstName || 'NA'))} </Text>

                                <Text style={searchResultStyles.cardTitle}>Location: {toTitleCase(String(foundScertificate.docLocation || 'NA'))} </Text>
                                <Text style={searchResultStyles.cardTitle}>Finder Contact: {String(foundScertificate.finderContact || 'NA')} </Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default FoundScertificateCard;