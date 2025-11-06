import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Bcertificate } from '@/types';
import NothingFound from '../NothingFound';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { searchResultStyles } from '@/styles/searchResultStyles';
import { toTitleCase } from '@/utils/string.utility';

interface FoundBCertificateCardProps {
    searchFound: boolean;
    searchPerformed: boolean;
    foundBcertificate: Bcertificate | Bcertificate[] | null;
    resetSearch: () => void;
    goBackToResults?: () => void;
    viewBcertificate?: (bcertificateId: string) => Promise<void>;
    isViewing?: boolean;
    viewingBcertificateId?: string | null;
    searchResults?: Bcertificate[];
}

const FoundBCertificateCard: React.FC<FoundBCertificateCardProps> = ({
    foundBcertificate,
    searchFound,
    searchPerformed,
    resetSearch,
    goBackToResults,
    viewBcertificate,
    isViewing,
    viewingBcertificateId,
    searchResults,
}) => {
    const insets = useSafeAreaInsets();

    if (!searchPerformed) return null;

    if (!foundBcertificate) return null; // safety checks to prevent errors in the render method in case nothing is found

    //check if we have no results (empty array)
    const hasNoResults = Array.isArray(foundBcertificate) && foundBcertificate.length === 0;

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

    const isMultipleResults = Array.isArray(foundBcertificate) && foundBcertificate.length > 0;

    const isViewingSingleItem = !isMultipleResults && !!searchResults && searchResults.length > 0;

    const handleViewDetails = async (id?: string) => {
        if (!id || !viewBcertificate) return;
        try {
            await viewBcertificate(id);
        } catch {
            // mutation handles alert
        }
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
                        {isMultipleResults ? "Found Certificate Results" : (foundBcertificate && !Array.isArray(foundBcertificate) ? "Found Certificate Result" : "NA")}
                    </Text>
                    <View style={searchResultStyles.headerSpacer} />
                </View>

                {isMultipleResults ? (
                    <ScrollView contentContainerStyle={searchResultStyles.resultsContainer}>
                        {foundBcertificate.map((bcertificate: any, index: number) => {
                            if (!bcertificate || typeof bcertificate !== 'object' || !bcertificate._id) return null;
                            return (
                                <View key={String(bcertificate._id || index)} style={searchResultStyles.card}>
                                    <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(bcertificate.firstName || 'NA'))}</Text>
                                    <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(bcertificate.lastName || 'NA'))}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleViewDetails(bcertificate._id)}
                                        disabled={isViewing && viewingBcertificateId === String(bcertificate._id || '')}
                                        style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}>
                                        <Text style={searchResultStyles.actionText}> {isViewing && viewingBcertificateId === String(bcertificate._id || '') ? "Loading..." : "View Details"} </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={searchResultStyles.singleContainer}>
                        {foundBcertificate && !Array.isArray(foundBcertificate) && (
                            <View style={searchResultStyles.detailCard}>
                                <Text style={searchResultStyles.cardTitle}>First Name: {toTitleCase(String(foundBcertificate.firstName || 'NA'))}</Text>
                                {foundBcertificate.secondName && foundBcertificate.secondName.trim() !== '' && (
                                    <Text style={searchResultStyles.cardTitle}>Second Name: {toTitleCase(String(foundBcertificate.secondName))}</Text>
                                )}
                                <Text style={searchResultStyles.cardTitle}>Last Name: {toTitleCase(String(foundBcertificate.lastName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Mother's Last Name: {toTitleCase(String(foundBcertificate.motherLastName || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Location: {toTitleCase(String(foundBcertificate.docLocation || 'NA'))}</Text>
                                <Text style={searchResultStyles.cardTitle}>Finder Contact: {String(foundBcertificate.finderContact || 'NA')}</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default FoundBCertificateCard;