import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform, TextInput } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showAlerts } from "@/utils/alerts";
import { isValidZimbabweIdNumber, idNumberRegex, sanitizeZimbabweIdNumber } from "@/utils/idValidator";
import { OptionPicker, SelectField } from "../FormsHelper";
import { escapeRegex } from "@/constants/allowedValues";
import { DLicenceSearchParams } from "@/types";
import ModalWrapper from "../ModalWrapper";

interface SearchDLicenceModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        category: string;
        identifier: string;
    };
    searchDLicence: (params: DLicenceSearchParams) => Promise<any>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
};

const SearchDLicenceModal = ({ isVisible, onClose, formData, searchDLicence, updateFormData, isSearching, resetSearch }: SearchDLicenceModalProps) => {
    const insets = useSafeAreaInsets();
    const [openPicker, setOpenPicker] = useState<null | 'category'>(null);

    const validateInput = (category: string, value: string) => {
        if (!value.trim()) return true; // Allow empty for now, but check on submit
        switch (category) {
            case 'licenceNumber':
                return /^[A-Z0-9]{6,10}$/i.test(value); // Basic licence number validation
            case 'idNumber':
                return isValidZimbabweIdNumber(value);
            case 'surname':
                return /^[a-zA-Z\s\-']+$/.test(value.trim()); // Basic name validation
            default:
                return true;
        }
    };

    const isFormComplete = Boolean(formData.category && formData.identifier && validateInput(formData.category, formData.identifier));

    const handleSearch = async () => {
        if (!formData.category) {
            showAlerts("Error", "Please select a search category");
            return;
        }
        if (!formData.identifier.trim()) {
            showAlerts("Error", "Please fill in the identifier field");
            return;
        }
        if (!validateInput(formData.category, formData.identifier)) {
            const messages = {
                licenceNumber: "Invalid licence number format.",
                idNumber: "Invalid Zimbabwean ID number format. Example: 12-1234567A12",
                surname: "Surname should contain only letters, spaces, hyphens, and apostrophes"
            };
            showAlerts("Error", messages[formData.category as keyof typeof messages] || "Invalid input");
            return;
        }
        //Reset Previous results before searching
        resetSearch();
        try {
            await searchDLicence(formData);
        } catch (error) {
            showAlerts("Error", "Failed to search driving licence. Please try again.");
            console.error("Search error:", error);
        }
    };

    return (
        <ModalWrapper visible={isVisible} onClose={onClose}>
            <View className="flex-1">
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
                    <TouchableOpacity onPress={handleSearch} disabled={isSearching || !isFormComplete || (formData.identifier.length > 0 && !validateInput(formData.category, formData.identifier))}>
                        {(!isFormComplete || (formData.identifier.length > 0 && !validateInput(formData.category, formData.identifier))) ? (
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

                    <SelectField
                        label="Search Category"
                        value={formData.category}
                        placeholder="Select search category"
                        onPress={() => setOpenPicker('category')}
                    />

                    <OptionPicker
                        visible={openPicker === 'category'}
                        title="Select Search Category"
                        options={['licenceNumber', 'idNumber', 'surname']}
                        onSelect={(val) => {
                            updateFormData('category', val);
                            updateFormData('identifier', ''); // Clear identifier when category changes
                        }}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v) => v === 'licenceNumber' ? 'Licence Number' : v === 'idNumber' ? 'ID Number' : 'Surname'}
                    />

                    {formData.category ? (
                        <View className="mb-4">
                            <Text className="text-lg font-semibold text-gray-600 mb-2">
                                {formData.category === 'licenceNumber' ? 'Licence Number' : formData.category === 'idNumber' ? 'ID Number' : 'Surname'}
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded p-3"
                                placeholder={
                                    formData.category === 'licenceNumber' ? 'e.g., ABC123456' :
                                    formData.category === 'idNumber' ? 'e.g., 12-1234567A12' :
                                    'Enter surname'
                                }
                                value={formData.identifier}
                                onChangeText={(value) => {
                                    if (formData.category === 'licenceNumber') {
                                        updateFormData('identifier', escapeRegex(value.toUpperCase()).slice(0, 10));
                                    } else if (formData.category === 'idNumber') {
                                        updateFormData('identifier', sanitizeZimbabweIdNumber(value));
                                    } else {
                                        updateFormData('identifier', value.trim().slice(0, 100));
                                    }
                                }}
                                autoCapitalize={formData.category === 'surname' ? 'words' : 'none'}
                                maxLength={formData.category === 'licenceNumber' ? 10 : formData.category === 'idNumber' ? 13 : 100}
                            />
                            {formData.identifier.length > 0 && !validateInput(formData.category, formData.identifier) && (
                                <Text className="text-red-600 text-xs mt-1">
                                    {formData.category === 'licenceNumber' ? 'Invalid licence number format.' :
                                     formData.category === 'idNumber' ? 'Invalid ID number format.' :
                                     'Surname should contain only letters, spaces, hyphens, and apostrophes'}
                                </Text>
                            )}
                            {formData.identifier.length === 0 && (
                                <View className="mt-7" />
                            )}
                        </View>
                    ) : null}

                </ScrollView>
            </View>
        </ModalWrapper>
    );
};

export default SearchDLicenceModal;
