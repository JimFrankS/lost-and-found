import { Text, View, ScrollView, Modal, TouchableOpacity, ActivityIndicator, Dimensions, Platform, TextInput } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showAlerts } from "@/utils/alerts";
import { DLicenceSearchParams } from "@/types";

interface SearchDLicenceModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        identifier: string;
    };
    searchDLicence: (params: DLicenceSearchParams) => Promise<any>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
};

const SearchDLicenceModal = ({ isVisible, onClose, formData, searchDLicence, updateFormData, isSearching, resetSearch }: SearchDLicenceModalProps) => {
    const insets = useSafeAreaInsets();

    const isFormComplete = Boolean(formData.identifier.trim());

    const handleSearch = async () => {
        if (!formData.identifier.trim()) {
            showAlerts("Error", "Please fill in the identifier field");
            return;
        }
        //Reset Previous results before searching
        resetSearch();
        try {
            await searchDLicence({ identifier: formData.identifier });
        } catch (error) {
            showAlerts("Error", "Failed to search driving licence. Please try again.");
            console.error("Search error:", error);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View
                className="flex-1 bg-white"
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                }}>
                {/* Modal Header */}
                <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
                    <TouchableOpacity onPress={() => {
                        showAlerts("Cancel", "Are you sure you want to cancel?", [
                            { text: "No", style: "cancel" },
                            { text: "Yes", style: "destructive", onPress: onClose },
                        ]);
                    }}>
                        <Text className="text-red-500 font-semibold">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSearch} disabled={isSearching || !isFormComplete}>
                        {(!isFormComplete) ? (
                            <Text className="text-gray-500 font-semi-bold">Search</Text>
                        ) :
                            isSearching ? (
                                <ActivityIndicator size="small" color="blue" />
                            ) : (
                                <Text className="text-blue-500 font-bold">Search</Text>
                            )}
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView className="flex-1 p-4"
                    style={
                        Platform.OS === 'web'
                            ? {
                                maxHeight: Dimensions.get('window').height - insets.top - insets.bottom,
                                overflow: 'scroll'
                            }
                            : undefined
                    }>

                    <TextInput
                        className="border border-gray-300 rounded p-3"
                        placeholder="Enter licence number, ID number, or surname"
                        value={formData.identifier}
                        onChangeText={(value) => updateFormData('identifier', value.trim())}
                        autoCapitalize="words"
                        maxLength={100}
                    />
                    {formData.identifier.length === 0 && (
                        <View className="mt-7" />
                    )}

                </ScrollView>
            </View>
        </Modal>
    );
};

export default SearchDLicenceModal;
