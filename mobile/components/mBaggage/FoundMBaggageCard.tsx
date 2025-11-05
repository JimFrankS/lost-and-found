import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { searchResultStyles } from "@/styles/searchResultStyles";
import NothingFound from "../NothingFound";
import { MBaggage, MBaggageListItem } from "@/types";
import { toTitleCase } from "@/utils/string.utility";

interface FoundBaggageCardProps {
    searchFound: boolean;
    foundBaggage: MBaggage | MBaggageListItem[] | null;
    resetSearch: () => void;
    goBackToResults?: () => void;
    viewBaggage?: (baggageId: string) => void;
    isViewing?: boolean;
    viewingBaggageId?: string | null;
    searchResults?: MBaggageListItem[];
}

const FoundBaggageCard = ({
    searchFound,
    foundBaggage,
    goBackToResults,
    resetSearch,
    viewBaggage,
    isViewing,
    viewingBaggageId,
    searchResults,
}: FoundBaggageCardProps) => {
    const insets = useSafeAreaInsets();

    if (!searchFound || !foundBaggage) return null;

    const hasNoResults = Array.isArray(foundBaggage) && foundBaggage.length === 0;

    if (hasNoResults) {
        return (
            <View style={searchResultStyles.container}>
                <View
                    style={[
                        searchResultStyles.contentWrapper,
                        { paddingTop: insets.top },
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

    const isMultipleResults = Array.isArray(foundBaggage) && foundBaggage.length > 0;
    // User is viewing detail page for a single item selected from search results
    const hasSearchResults = !!searchResults && searchResults.length > 0;
    const isViewingSingleItem = !isMultipleResults && hasSearchResults;

    const handleViewDetails = (id?: string) => {
        if (!id || !viewBaggage) return;
        viewBaggage(id);
    };

    const handleBackPress = () => {
        if (isViewingSingleItem && goBackToResults) {
            goBackToResults();
        } else {
            resetSearch();
        }
    };

    const getHeaderTitle = () => {
        if (isMultipleResults) return "Found Baggage Results";
        if (foundBaggage && !Array.isArray(foundBaggage)) return "Found Baggage Result";
        return "Baggage Details"; // more user-friendly than "NA"
    };

    return (
        <View style={searchResultStyles.container}>
            <View
                style={[
                    searchResultStyles.contentWrapper,
                    { paddingTop: insets.top },
                ]}
            >
                <View style={searchResultStyles.header}>
                    <TouchableOpacity
                        onPress={handleBackPress}
                        style={searchResultStyles.backButton}
                    >
                        <Text style={searchResultStyles.backText}>Back</Text>
                    </TouchableOpacity>

                    <Text style={searchResultStyles.headerTitle}>{getHeaderTitle()}</Text>
                    <View style={searchResultStyles.headerSpacer} />
                </View>

                {isMultipleResults ? (
                    <ScrollView contentContainerStyle={searchResultStyles.resultsContainer}>
                        {foundBaggage.map((baggage: MBaggageListItem, index: number) => {
                            if (!baggage?._id) return null;
                            return (
                                <View key={baggage._id} style={searchResultStyles.card}>
                                    <Text style={searchResultStyles.cardTitle}>Missing Item Type: {toTitleCase(baggage.baggageType)}</Text>
                                    <Text style={searchResultStyles.cardText}>Gathering Location: {toTitleCase(baggage.gatheringLocation)}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleViewDetails(baggage._id)}
                                        disabled={isViewing && viewingBaggageId === baggage._id}
                                        style={[
                                            searchResultStyles.actionButton,
                                            searchResultStyles.viewButton,
                                            (isViewing && viewingBaggageId === baggage._id) && { opacity: 0.5 }
                                        ]}>
                                        <Text style={searchResultStyles.actionText}>{isViewing && viewingBaggageId === baggage._id ? "Loading..." : "View Details"}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={searchResultStyles.singleContainer}>
                        {foundBaggage && !Array.isArray(foundBaggage) && (
                            <View style={searchResultStyles.detailCard}>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>Missing Item Type: </Text>
                                    {toTitleCase(foundBaggage.baggageType)}
                                </Text>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>Gathering Type: </Text>
                                    {toTitleCase(foundBaggage.gatheringType)}
                                </Text>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>Province: </Text>
                                    {toTitleCase(foundBaggage.destinationProvince)}
                                </Text>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>District: </Text>
                                    {toTitleCase(foundBaggage.destinationDistrict)}
                                </Text>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>Gathering Location: </Text>
                                    {toTitleCase(foundBaggage.gatheringLocation)}
                                </Text>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>Location: </Text>
                                    {toTitleCase(foundBaggage.docLocation)}
                                </Text>
                                <Text style={searchResultStyles.cardText}>
                                    <Text style={searchResultStyles.cardTitle}>Finder Contact: </Text>
                                    {foundBaggage.finderContact}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default FoundBaggageCard;