import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Passport } from "@/types";
import NothingFound from "../NothingFound";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchResultStyles } from "@/styles/searchResultStyles";
import { toTitleCase } from "@/utils/string.utility";
import { TAB_BAR_HEIGHT, EXTRA_SPACE } from "@/styles/tabStyles";

interface FoundPassportCardProps {
    searchFound: boolean;
    foundPassport: Passport | Passport[] | null;
    resetSearch: () => void;
    goBackToResults?: () => void;
    viewPassport?: (passportId: string) => void;
    isViewing?: boolean;
    viewingPassportId?: string | null;
    searchResults?: Passport[];
}

const FoundPassportCard: React.FC<FoundPassportCardProps> = ({
    foundPassport,
    searchFound,
    resetSearch,
    goBackToResults,
    viewPassport,
    isViewing,
    viewingPassportId,
    searchResults,
}) => {
    const insets = useSafeAreaInsets();

    if (!searchFound) return null;

    if (!foundPassport) return null; // safety checks to prevent errors in the render method in case nothing is found

    //check if we have no results (empty array)
    const hasNoResults = Array.isArray(foundPassport) && foundPassport.length === 0;

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

    const isMultipleResults = Array.isArray(foundPassport) && foundPassport.length > 0;

    const isViewingSingleItem = !isMultipleResults && !!searchResults && searchResults.length > 0;

    const handleViewDetails = (id?: string) => {
        if (!id || !viewPassport) return;
        viewPassport(id);
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
                        {isMultipleResults ? "Found Passport Results" : (foundPassport && !Array.isArray(foundPassport) ? "Found Passport Result" : "NA")}
                    </Text>
                    <View style={searchResultStyles.headerSpacer} />
                </View>

                {isMultipleResults ? (
                    <ScrollView contentContainerStyle={[searchResultStyles.resultsContainer, { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + EXTRA_SPACE }]}>
                        {foundPassport.map((passport: any, index: number) => {
                            if (!passport || typeof passport !== 'object' || !passport._id) return null;
                            return (
                                <View key={String(passport._id || index)} style={searchResultStyles.card}>
                                    <Text style={searchResultStyles.cardTitle}>Passport Number: {String(passport.passportNumber || 'NA')}</Text>
                                    <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(passport.firstName || 'NA'))}</Text>
                                    <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(passport.lastName || 'NA'))}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleViewDetails(passport._id)}
                                        disabled={isViewing && viewingPassportId === String(passport._id || '')}
                                        style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}>
                                        <Text style={searchResultStyles.actionText}> {isViewing && viewingPassportId === String(passport._id || '') ? "Loading..." : "View Details"} </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={[searchResultStyles.singleContainer, { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + EXTRA_SPACE }]}>
                        {foundPassport && !Array.isArray(foundPassport) && (
                            <View style={searchResultStyles.detailCard}>
                                <Text style={searchResultStyles.cardTitle}>Passport Number: {String(foundPassport.passportNumber || 'NA')}</Text>
                                <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(foundPassport.firstName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(foundPassport.lastName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>ID Number: {String(foundPassport.idNumber || 'NA')}</Text>
                                <Text style={searchResultStyles.cardTitle}>Location: {toTitleCase(String(foundPassport.docLocation || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Finder Contact: {String(foundPassport.finderContact || 'NA')}</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default FoundPassportCard;
