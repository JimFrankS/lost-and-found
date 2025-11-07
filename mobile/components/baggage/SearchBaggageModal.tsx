import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { BAGGAGE_TYPES, TRANSPORT_TYPES, ROUTE_TYPES, PROVINCES, PROVINCE_DISTRICT_MAP } from "@/constants/allowedValues";
import { OptionPicker, SelectField, toTitleCase } from "../FormsHelper";
import { showAlerts } from "@/utils/alerts";
import { Baggage, BaggageSearchParams } from "@/types";
import ModalWrapper from "../ModalWrapper";

interface SearchBaggageModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        baggageType: string;
        transportType: string;
        routeType: string;
        destinationProvince: string;
        destinationDistrict: string;
    };
    searchBaggage: (params: BaggageSearchParams) => Promise<Baggage[]>;
    updateFormData: (field: string, value: string) => void;
    isSearching: boolean;
    resetSearch: () => void;
}


const SearchBaggageModal = ({ isVisible, onClose, formData, searchBaggage, updateFormData, isSearching, resetSearch }: SearchBaggageModalProps) => {
    const [openPicker, setOpenPicker] = useState<null | 'baggageType' | 'transportType' | 'routeType' | 'destinationProvince' | 'destinationDistrict'>(null);

    const districts = useMemo(() => {
        const prov = formData.destinationProvince as keyof typeof PROVINCE_DISTRICT_MAP;
        return prov ? (PROVINCE_DISTRICT_MAP[prov] ?? []) : [];
    }, [formData.destinationProvince]);

    const isFormComplete = Boolean(
        formData.baggageType &&
        formData.transportType &&
        formData.routeType &&
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
            showAlerts("Error", "Failed to search baggage. Please try again.");
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
                        'Baggage Type', // Title of the select field, as per the form requirements in Baggage.Helpers.tsx
                        formData.baggageType, // Current selected value for baggage type
                        () => setOpenPicker('baggageType'), // Function to open the baggage type picker
                        'How would you classify the baggage you lost?' // Placeholder text when no value is selected
                    )}

                    {renderSelect(
                        'Transport Type',
                        formData.transportType,
                        () => setOpenPicker('transportType'),
                        'How would you classify the mode of transport you were using?'
                    )}

                    {renderSelect(
                        'Route Type',
                        formData.routeType,
                        () => setOpenPicker('routeType'),
                        'Were you traveling within the same area / town (local) or from one town to another (intercity)?'
                    )}

                    {renderSelect(
                        'Destination Province',
                        formData.destinationProvince,
                        () => setOpenPicker('destinationProvince'),
                        'Which province was the vehicle traveling to (or within, if local)?',
                    )}

                    <SelectField
                        label="Destination District"
                        value={formData.destinationDistrict}
                        displayValue={formData.destinationProvince ? (formData.destinationDistrict ? toTitleCase(formData.destinationDistrict) : '') : ''}
                        placeholder={formData.destinationProvince ? 'Which district was the vehicle traveling to (or within, if local)?' : 'Select province first'}
                        onPress={() => formData.destinationProvince && setOpenPicker('destinationDistrict')}
                        disabled={!formData.destinationProvince}
                    />


                    {/* Pickers */}
                    <OptionPicker
                        visible={openPicker === 'baggageType'}
                        title="Select Baggage Type"
                        options={BAGGAGE_TYPES}
                        onSelect={(val) => updateFormData('baggageType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'transportType'}
                        title="Select Transport Type"
                        options={TRANSPORT_TYPES}
                        onSelect={(val) => updateFormData('transportType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'routeType'}
                        title="Select Route Type"
                        options={ROUTE_TYPES}
                        onSelect={(val) => updateFormData('routeType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'destinationProvince'}
                        title="Select Destination Province"
                        options={PROVINCES}
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
                        title="Select Destination District"
                        options={districts}
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
