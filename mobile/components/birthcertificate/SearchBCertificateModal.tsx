import { Text, View, ScrollView, Modal, TouchableOpacity, ActivityIndicator, Dimensions, Platform, TextInput } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showAlerts } from "@/utils/alerts";
import { BirthCertificateSearchParams, Bcertificate } from "@/types";

interface SearchBCertificateModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        motherLastName: string;
        lastName: string;
        firstName: string;
    };
    searchBCertificate: (params: BirthCertificateSearchParams) => Promise<Bcertificate[]>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
};

const SearchBCertificateModal = ({ isVisible, onClose, formData, searchBCertificate, updateFormData, isSearching, resetSearch }: SearchBCertificateModalProps) => {
    const insets = useSafeAreaInsets();

    const isFormComplete = Boolean(
        formData.motherLastName && formData.lastName && formData.firstName
    );

    const handleSearch = async () => {
        if (!isFormComplete) {
            showAlerts("Error", "Please fill in all the required fields");
            return;
        }
        //Reset Previous results before searching
        resetSearch();
        try {
            await searchBCertificate(formData);
        } catch (error) {
            showAlerts("Error", "Failed to search birth certificate. Please try again.");
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

                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-600 mb-2">Mother's Last Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded p-3"
                            placeholder="Enter the mother's last name"
                            value={formData.motherLastName}
                            onChangeText={(text) => updateFormData('motherLastName', text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-600 mb-2">Owner's Last Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded p-3"
                            placeholder="Enter the owner's last name"
                            value={formData.lastName}
                            onChangeText={(text) => updateFormData('lastName', text)}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-600 mb-2">Owner's First Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded p-3"
                            placeholder="Enter the owner's first name"
                            value={formData.firstName}
                            onChangeText={(text) => updateFormData('firstName', text)}
                        />
                    </View>

                </ScrollView>
            </View>
        </Modal>
    );
};

export default SearchBCertificateModal;