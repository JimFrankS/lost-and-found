import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchResultStyles } from "@/styles/searchResultStyles";
import BackGroundCard from "@/components/BackGroundCard";
import NothingFound from "@/components/NothingFound";
import { Baggage } from "@/types";

interface FoundBaggageCardProps {
  searchFound: boolean;
  foundBaggage: Baggage | Baggage[] | null;
  resetSearch: () => void;
  goBackToResults?: () => void;
  viewBaggage?: (baggageId: string) => void;
  isViewing?: boolean;
  viewingBaggageId?: string | null;
  searchResults?: Baggage[];
}

const FoundBaggageCard = ({
  searchFound,
  foundBaggage,
  resetSearch,
  goBackToResults,
  viewBaggage,
  isViewing,
  viewingBaggageId,
  searchResults,
}: FoundBaggageCardProps) => {
  const insets = useSafeAreaInsets();

  if (!searchFound) return null;

  if (!foundBaggage) return null; // Safety check if foundBaggage is undefined or null to prevent errors in the render method

  // Check if we have no results (empty array)
  const hasNoResults = Array.isArray(foundBaggage) && foundBaggage.length === 0;

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

  const isMultipleResults = Array.isArray(foundBaggage) && foundBaggage.length > 0;
  const isViewingSingleItem = !isMultipleResults && !!searchResults && searchResults.length > 0;

  const handleViewDetails = (id?: string) => {
    if (!id || !viewBaggage) return;
    viewBaggage(id);
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <BackGroundCard />
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
              {isMultipleResults ? "Found Baggage Results" : (foundBaggage && !Array.isArray(foundBaggage) && foundBaggage.claimed ? "Baggage Claimed Successfully!" : "Baggage Details")}
            </Text>
            <View style={searchResultStyles.headerSpacer} />
          </View>

          {isMultipleResults ? (
            <ScrollView contentContainerStyle={searchResultStyles.resultsContainer}>
              {foundBaggage.map((baggage: any, index: number) => {
                if (!baggage || typeof baggage !== 'object' || !baggage._id) return null;
                return (
                  <View key={String(baggage._id || index)} style={searchResultStyles.card}>
                    <Text style={searchResultStyles.cardTitle}>Baggage Type: {String(baggage.baggageType || 'N/A')}</Text>
                    <Text style={searchResultStyles.cardText}>Transport Type: {String(baggage.transportType || 'N/A')}</Text>
                    <Text style={searchResultStyles.cardText}>Route Type: {String(baggage.routeType || 'N/A')}</Text>
                    <Text style={searchResultStyles.cardText}>Province: {String(baggage.destinationProvince || 'N/A')}</Text>
                    <Text style={searchResultStyles.cardText}>District: {String(baggage.destinationDistrict || 'N/A')}</Text>
                    <Text style={searchResultStyles.cardText}>Destination: {String(baggage.destination || 'N/A')}</Text>

                    <TouchableOpacity
                      onPress={() => handleViewDetails(String(baggage._id || ''))}
                      disabled={isViewing && viewingBaggageId === String(baggage._id || '')}
                      style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}
                    >
                      <Text style={searchResultStyles.actionText}>
                        {isViewing && viewingBaggageId === String(baggage._id || '') ? "Loading..." : "View Details"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={searchResultStyles.singleContainer}>
              {foundBaggage && !Array.isArray(foundBaggage) && (
                <View style={searchResultStyles.detailCard}>
                  <Text style={searchResultStyles.cardTitle}>Baggage Type: {String(foundBaggage.baggageType || 'N/A')}</Text>
                  <Text style={searchResultStyles.cardText}>Transport Type: {String(foundBaggage.transportType || 'N/A')}</Text>
                  <Text style={searchResultStyles.cardText}>Route Type: {String(foundBaggage.routeType || 'N/A')}</Text>
                  <Text style={searchResultStyles.cardText}>Province: {String(foundBaggage.destinationProvince || 'N/A')}</Text>
                  <Text style={searchResultStyles.cardText}>District: {String(foundBaggage.destinationDistrict || 'N/A')}</Text>
                  <Text style={searchResultStyles.cardText}>Destination: {String(foundBaggage.destination || 'N/A')}</Text>
  
                  <Text style={searchResultStyles.cardText}>Baggage Location: {String(foundBaggage.docLocation || 'N/A')}</Text>
                  <Text style={searchResultStyles.cardText}>Finder Contact: {String(foundBaggage.finderContact || 'N/A')}</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
    </View>
  );
};

export default FoundBaggageCard;
