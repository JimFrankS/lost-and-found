import { Text, View, ScrollView, Modal, TouchableOpacity, ActivityIndicator, Dimensions, Platform, TextInput } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { showAlerts } from "@/utils/alerts";
import { isValidZimbabweIdNumber, idNumberRegex, sanitizeZimbabweIdNumber } from "@/utils/idValidator";
import { OptionPicker, SelectField } from "../FormsHelper";
import { escapeRegex } from "@/constants/allowedValues";

interface SearchPassportModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        category: string;
        identifier: string;
    };
    searchPassport: (params: any) => Promise<any>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
};

const SearchPassportModal = ({ isVisible, onClose, formData, searchPassport, updateFormData, isSearching, resetSearch }: SearchPassportModalProps) => {
    const insets = useSafeAreaInsets();
    const [openPicker, setOpenPicker] = useState<null | 'category'>(null);

    const validateInput = (category: string, value: string) => {
        if (!value.trim()) return true; // Allow empty for now, but check on submit
        switch (category) {
            case 'passportNumber':
                return /^[A-Z]{2}\d{6}$/i.test(value);
            case 'idNumber':
                return isValidZimbabweIdNumber(value);
            case 'surname':
                return /^[a-zA-Z\s\-']+$/.test(value.trim()); // Basic name validation
            default:
                return true;
        }
    };

    const isFormComplete = Boolean(formData.category && formData.identifier && validateInput(formData.category, formData.identifier));

    const isSearchDisabled = isSearching || !isFormComplete || (formData.identifier.length > 0 && !validateInput(formData.category, formData.identifier));

    const handleSearch = async () => {
        if (!formData.category) {
            showAlerts("Error", "Please select a search category");
            return;
        }
        const trimmedIdentifier = formData.identifier.trim();
        if (!trimmedIdentifier) {
            showAlerts("Error", "Please fill in the identifier field");
            return;
        }
        if (!validateInput(formData.category, trimmedIdentifier)) {
            const messages = {
                passportNumber: "Invalid passport number format. Example: AB123456",
                idNumber: "Invalid Zimbabwean ID number format. Example: 12-1234567A12",
                surname: "Surname should contain only letters, spaces, hyphens, and apostrophes"
            };
            showAlerts("Error", messages[formData.category as keyof typeof messages] || "Invalid input");
            return;
        }
        //Reset Previous results before searching
        resetSearch();
        try {
            await searchPassport({ ...formData, identifier: trimmedIdentifier });
        } catch (error) {
            showAlerts("Error", "Failed to search passport. Please try again.");
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
                    <TouchableOpacity onPress={handleSearch} disabled={isSearchDisabled}>
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
                        options={['passportNumber', 'idNumber', 'surname']}
                        onSelect={(val) => {
                            updateFormData('category', val);
                            updateFormData('identifier', ''); // Clear identifier when category changes
                        }}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v) => v === 'passportNumber' ? 'Passport Number' : v === 'idNumber' ? 'ID Number' : 'Surname'}
                    />

                    {formData.category ? (
                        <View className="mb-4">
                            <Text className="text-lg font-semibold text-gray-600 mb-2">
                                {formData.category === 'passportNumber' ? 'Passport Number' : formData.category === 'idNumber' ? 'ID Number' : 'Surname'}
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded p-3"
                                placeholder={
                                    formData.category === 'passportNumber' ? 'e.g., AB123456' :
                                    formData.category === 'idNumber' ? 'e.g., 12-1234567A12' :
                                    'Enter surname'
                                }
                                value={formData.identifier}
                                onChangeText={(value) => {
                                    if (formData.category === 'passportNumber') {
                                        updateFormData('identifier', escapeRegex(value.toUpperCase()).slice(0, 8));
                                    } else if (formData.category === 'idNumber') {
                                        updateFormData('identifier', sanitizeZimbabweIdNumber(value));
                                    } else {
                                        // Strip disallowed characters (allow letters, spaces, hyphens, apostrophes) and enforce max length
                                        const sanitized = value.replace(/[^a-zA-Z\s\-']/g, '').slice(0, 100);
                                        updateFormData('identifier', sanitized);
                                    }
                                }}
                                autoCapitalize={formData.category === 'surname' ? 'words' : 'none'}
                                maxLength={formData.category === 'passportNumber' ? 8 : formData.category === 'idNumber' ? 13 : 100}
                            />
                            {formData.identifier.length > 0 && !validateInput(formData.category, formData.identifier) && (
                                <Text className="text-red-600 text-xs mt-1">
                                    {formData.category === 'passportNumber' ? 'Invalid passport number format.' :
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
        </Modal>
    );
};

export default SearchPassportModal;
