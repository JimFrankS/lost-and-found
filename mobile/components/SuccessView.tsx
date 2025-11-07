import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { searchResultStyles } from "@/styles/searchResultStyles";
import ReportedSuccessfullyCard from "./ReportedSuccessfullyCard";

interface SuccessViewProps {
  onClose: () => void;
  documentType: string;
  insets: EdgeInsets;
}

const SuccessView = ({ onClose, documentType, insets }: SuccessViewProps) => (
  <View style={{ flex: 1, position: "relative" }}>
    <View style={[{ flex: 1, zIndex: 1, paddingTop: insets.top, paddingBottom: 0 }]}>
      <View style={searchResultStyles.header}>
        <TouchableOpacity onPress={onClose} style={searchResultStyles.backButton}>
          <Text style={searchResultStyles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={searchResultStyles.headerTitle}>Success</Text>
        <View style={searchResultStyles.headerSpacer} />
      </View>
      <ReportedSuccessfullyCard hookname={documentType} />
    </View>
  </View>
);

export default SuccessView;
