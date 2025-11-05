import { Text, View, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { MBAGGAGE_TYPES, gatheringTypes, PROVINCES, PROVINCE_DISTRICT_MAP } from "@/constants/allowedValues";
import { OptionPicker, SelectField, toTitleCase } from "../FormsHelper";
import { showAlerts } from "@/utils/alerts";
import { MBaggageSearchParams } from "@/types";
import ModalWrapper from "../ModalWrapper";

interface SearchBaggageModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        baggageType: string;
        gatheringType: string;
        destinationProvince: string;
        destinationDistrict: string;
    };
    searchBaggage: (params: MBaggageSearchParams) => Promise<boolean>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}


const SearchBaggageModal = ({ isVisible, onClose, formData, searchBaggage, updateFormData, isSearching, resetSearch }: SearchBaggageModalProps) => {
    const [openPicker, setOpenPicker] = useState<null | 'baggageType' | 'gatheringType' | 'destinationProvince' | 'destinationDistrict'>(null);

    const insets = useSafeAreaInsets();

    const districts = useMemo(() => {
        const prov = formData.destinationProvince as keyof typeof PROVINCE_DISTRICT_MAP;
        return prov ? (PROVINCE_DISTRICT_MAP[prov] ?? []) : [];
    }, [formData.destinationProvince]);

    const isFormComplete = Boolean(
        formData.baggageType &&
        formData.gatheringType &&
        formData.destinationProvince &&
        formData.destinationDistrict
    );

    const handleSearch = async () => {
        if (!isFormComplete) {
            showAlerts("Error", "Please fill in all required fields.");
            return;
        }
        // Reset previous search results before searching
        resetSearch();
        try {
            await searchBaggage(formData);
        } catch (error) {
            showAlerts("Error", "Failed to search for the lost items. Please try again.");
            console.error("Search error:", error);
        }
    };

    const renderSelect = (label: string, value: string, onPress: () => void, placeholder: string, displayValue?: string) => (
        <SelectField label={label} value={value} onPress={onPress} placeholder={placeholder} displayValue={displayValue} />
    );

    return (
        <ModalWrapper visible={isVisible} onClose={onClose}>
            <View className="flex-1">
                {/* Header */}
                <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
                    <TouchableOpacity onPress={() => {
                        showAlerts("Cancel", "Are you sure you want to cancel?", [
                            { text: "No", style: "cancel" },
                            { text: "Yes", style: "destructive", onPress: onClose },
                        ]);
                    }}>
                        <Text className="text-red-500 font-semibold">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSearch} disabled={isSearching || !isFormComplete }>
                        {(!isFormComplete) ? (
                            <Text className="text-gray-500 font-semibold">Search</Text>
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
                                overflow: 'scroll',
                            }
                            : undefined
                    }>
                    {renderSelect(
                        'Lost Item Type', // Title of the select field, as per the form requirements in Baggage.Helpers.tsx
                        formData.baggageType, // Current selected value for baggage type
                        () => setOpenPicker('baggageType'), // Function to open the baggage type picker
                        'How best would you classify the item you lost?' // Placeholder text when no value is selected
                    )}

                    {renderSelect(
                        'Gathering or Event Type',
                        formData.gatheringType,
                        () => setOpenPicker('gatheringType'),
                        'What type of gathering were you attending?'
                    )}

                    {renderSelect(
                        'Province of occurrence',
                        formData.destinationProvince,
                        () => setOpenPicker('destinationProvince'),
                        'In which province were you when you lost the item?',
                    )}

                    <SelectField
                        label="District of occurance"
                        value={formData.destinationDistrict}
                        displayValue={formData.destinationProvince ? (formData.destinationDistrict ? toTitleCase(formData.destinationDistrict) : '') : ''}
                        placeholder={formData.destinationProvince ? 'Which district were you in when you loat the item?' : 'Select province first'}
                        onPress={() => formData.destinationProvince && setOpenPicker('destinationDistrict')}
                        disabled={!formData.destinationProvince}
                    />


                    {/* Pickers */}
                    <OptionPicker
                        visible={openPicker === 'baggageType'}
                        title="Select Lost Item Type"
                        options={MBAGGAGE_TYPES as unknown as string[]}
                        onSelect={(val) => updateFormData('baggageType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'gatheringType'}
                        title="Select Gathering or Event Type"
                        options={gatheringTypes as unknown as string[]}
                        onSelect={(val) => updateFormData('gatheringType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'destinationProvince'}
                        title="Select Province of occurrence"
                        options={PROVINCES as unknown as string[]}
                        onSelect={(val) => {
                            updateFormData('destinationProvince', String(val).toLowerCase());
                            // reset district when province changes
                            updateFormData('destinationDistrict', '');
                        }}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v) => toTitleCase(v)}
                    />

                    <OptionPicker
                        visible={openPicker === 'destinationDistrict'}
                        title="Select District of occurance"
                        options={districts as unknown as string[]}
                        onSelect={(val) => updateFormData('destinationDistrict', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v) => toTitleCase(v)}
                    />
                </ScrollView>
            </View>
        </ModalWrapper>
    );
};

export default SearchBaggageModal;
