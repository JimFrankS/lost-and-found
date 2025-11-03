import { Text, View, ScrollView, Modal, TouchableOpacity, ActivityIndicator, Dimensions, Platform, TextInput } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SCERTIFICATE_TYPES } from "@/constants/allowedValues";
import { OptionPicker, SelectField, toTitleCase } from "../FormsHelper";
import { showAlerts } from "@/utils/alerts";

interface SearchScertificateModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        certificateType: string;
        lastName: string;
    };
    searchScertificate: (params: any) => Promise<any>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
};

const SearchScertificateModal = ({ isVisible, onClose, formData, searchScertificate, updateFormData, isSearching, resetSearch }: SearchScertificateModalProps) => {
    const [openPicker, setOpenPicker] = useState<null | 'certificateType'>(null);
    const insets = useSafeAreaInsets();

    const isFormComplete = Boolean(
        formData.certificateType && formData.lastName
    );

    const handleSearch = async () => {
        if (!isFormComplete) {
            showAlerts("Error", "Please fill in all the required fields");
            return;
        }
        //Reset Previous results before searching
        resetSearch();
        try {
            await searchScertificate(formData);
        } catch (error) {
            showAlerts("Error", "Failed to search school certificate. Please try again.");
        }
    };

    const renderSelect = (label: string, value: string, onPress: () => void, placeholder: string, displayValue?: string) => (
        <SelectField label={label} value={value} onPress={onPress} placeholder={placeholder} displayValue={displayValue} />
    );

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
                    {renderSelect(
                        'Certificate Type', //Title of the select Field
                        formData.certificateType,
                        () => setOpenPicker('certificateType'),
                        'How would you classify the certificate you lost?'

                    )}

                    <View className="mb-4">
                        <Text className="text-lg font-semibold text-gray-600 mb-2">Last Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded p-3"
                            placeholder="Enter your last name"
                            value={formData.lastName}
                            onChangeText={(text) => updateFormData('lastName', text)}
                        />

                    </View>

                    {/* Pickers */}

                    <OptionPicker
                        visible={openPicker === 'certificateType'}
                        title="Select Certificate type"
                        options={SCERTIFICATE_TYPES as unknown as string[]}
                        onSelect={(val) => updateFormData('certificateType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />
                </ScrollView>
            </View>
        </Modal>
    );
};

export default SearchScertificateModal;