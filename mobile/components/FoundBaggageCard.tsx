import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchResultStyles } from "@/styles/searchResultStyles";
import BackGroundCard from "@/components/BackGroundCard";
import NothingFound from "@/components/NothingFound";

interface FoundBaggageCardProps {
  searchFound: boolean;
  foundBaggage: any; // array or single object
  resetSearch: () => void;
  goBackToResults?: () => void;
  viewBaggage?: (baggageId: string) => void;
  isViewing?: boolean;
  viewingBaggageId?: string | null;
  searchResults?: any[];
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

      // No Results Found View

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

// Determine if foundBaggage is multiple results or a single item
  const isMultipleResults = Array.isArray(foundBaggage);
  const isViewingSingleItem = !isMultipleResults && searchResults && searchResults.length > 0; // viewing a single item from multiple results

  // when user taps "View Details" trigger the find baggage by id functionality
  const handleViewDetails = (id?: string) => {
    if (!id || !viewBaggage) return;
    viewBaggage(id);
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <BackGroundCard />  {/* To ensure the background remains consistent*/}
      {/* content layer above background */}
      <View
        style={[
          { flex: 1, zIndex: 1, paddingTop: insets.top, paddingBottom: 0 },
        ]} // style to ensure content is above background
      >
          <View style={searchResultStyles.header}>
            <TouchableOpacity
              onPress={isViewingSingleItem ? (goBackToResults || resetSearch) : resetSearch}
              style={searchResultStyles.backButton}
            > {/* Back button, that takes you back to all search results if you were viewing single item, or resets search field if one was viewing all the search results already*/}

              <Text style={searchResultStyles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={searchResultStyles.headerTitle}>
              {isMultipleResults ? "Found Baggage Results" : (foundBaggage.claimed ? "Baggage Claimed Successfully!" : "Baggage Details")}
            </Text>
            <View style={searchResultStyles.headerSpacer} />
          </View>

          {isMultipleResults ? (
            <ScrollView contentContainerStyle={searchResultStyles.resultsContainer}> {/* List of the available search results, in cards, when there is more than one result */}
              {foundBaggage.map((baggage: any, index: number) => (
                <View key={baggage._id ?? `${index}`} style={searchResultStyles.card}>
                  <Text style={searchResultStyles.cardTitle}>Baggage Type: {baggage.baggageType}</Text>
                  <Text style={searchResultStyles.cardText}>Transport Type: {baggage.transportType}</Text>
                  <Text style={searchResultStyles.cardText}>Route Type: {baggage.routeType}</Text>
                  <Text style={searchResultStyles.cardText}>Province: {baggage.destinationProvince}</Text>
                  <Text style={searchResultStyles.cardText}>District: {baggage.destinationDistrict}</Text>
                  <Text style={searchResultStyles.cardText}>Destination: {baggage.destination}</Text>

                  <TouchableOpacity
                    onPress={() => handleViewDetails(baggage._id)}
                    disabled={isViewing && viewingBaggageId === baggage._id}
                    style={[searchResultStyles.actionButton, searchResultStyles.viewButton]}
                  >
                    <Text style={searchResultStyles.actionText}>
                      {isViewing && viewingBaggageId === baggage._id ? "Loading..." : "View Details"}
                    </Text> {/* View Details button to see full details of selected baggage item */}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={searchResultStyles.singleContainer}> {/* Single baggage detail view, when only one result is found or when viewing a single item from multiple results */}
              <View style={searchResultStyles.detailCard}>
                <Text style={searchResultStyles.cardTitle}>Baggage Type: {foundBaggage.baggageType}</Text>
                <Text style={searchResultStyles.cardText}>Transport Type: {foundBaggage.transportType}</Text>
                <Text style={searchResultStyles.cardText}>Route Type: {foundBaggage.routeType}</Text>
                <Text style={searchResultStyles.cardText}>Province: {foundBaggage.destinationProvince}</Text>
                <Text style={searchResultStyles.cardText}>District: {foundBaggage.destinationDistrict}</Text>
                <Text style={searchResultStyles.cardText}>Destination: {foundBaggage.destination}</Text>

                {/* Full details */}
                <Text style={searchResultStyles.cardText}>Baggage Location: {foundBaggage.docLocation}</Text>
                <Text style={searchResultStyles.cardText}>Finder Contact: {foundBaggage.finderContact}</Text>

              </View>
            </ScrollView>
          )}
        </View>
    </View>
  );
};

export default FoundBaggageCard;
