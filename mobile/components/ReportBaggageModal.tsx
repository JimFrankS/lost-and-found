import { Text, View, ScrollView, Modal, Alert, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { BAGGAGE_TYPES, TRANSPORT_TYPES, ROUTE_TYPES, PROVINCES, PROVINCE_DISTRICT_MAP, PHONE_NUMBER_REGEX } from "@/constants/allowedValues";
import { OptionPicker, SelectField, toTitleCase } from "./FormsHelper";
import { showAlerts } from "@/utiils/alerts";

interface ReportBaggageModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        baggageType: string;
        transportType: string;
        routeType: string;
        destinationProvince: string;
        destinationDistrict: string;
        destination: string;
        docLocation: string;
        finderContact: string;
    };
    reportBaggage: () => void;
    updateFormData: (field: string, value: string) => void;
    isReporting: boolean;
}


const ReportBaggageModal = ({ isVisible, onClose, formData, reportBaggage, updateFormData, isReporting }: ReportBaggageModalProps) => {
    const [openPicker, setOpenPicker] = useState<null | 'baggageType' | 'transportType' | 'routeType' | 'destinationProvince' | 'destinationDistrict'>(null);

    const insets = useSafeAreaInsets();

    const districts = useMemo(() => {
        const prov = formData.destinationProvince as keyof typeof PROVINCE_DISTRICT_MAP;
        return prov ? (PROVINCE_DISTRICT_MAP[prov] ?? []) : [];
    }, [formData.destinationProvince]);

    const isPhoneValid = PHONE_NUMBER_REGEX.test(formData.finderContact);
    const isFormComplete = Boolean(
        formData.baggageType &&
        formData.transportType &&
        formData.routeType &&
        formData.destinationProvince &&
        formData.destinationDistrict &&
        formData.destination &&
        formData.docLocation &&
        formData.finderContact
    );

    const handleSave = () => {
        if (!isFormComplete) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }
        if (!isPhoneValid) {
            Alert.alert("Error", "Invalid phone number format. Example: 0719729537");
            return;
        }
        reportBaggage();
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
                }}
            >
                {/* Header */}
                <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
                    <TouchableOpacity onPress={() => {
                        showAlerts("Cancel", "Are you sure you want to cancel?", [
                            { text: "No", style: "cancel" },
                            {
                                text: "Yes",
                                style: "destructive",
                                onPress: onClose,
                            },
                        ]);
                    }}>
                        <Text className="text-red-500 font-semibold">Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} disabled={isReporting || !isFormComplete || !isPhoneValid}>
                        {(!isFormComplete || !isPhoneValid) ? (
                            <Text className="text-gray-500 font-semibold">Upload</Text>
                        ) :
                            isReporting ? (
                                <ActivityIndicator size="small" color="blue" />
                            ) : (
                                <Text className="text-blue-500 font-bold">Upload</Text>
                            )}
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView className="flex-1 p-4"
                    style={
                        Platform.OS === 'web'
                            ? {
                                maxHeight: Dimensions.get('window').height - insets.top - insets.bottom,
                                overflow: 'scroll',
                            }
                            : undefined
                    }>
                    {renderSelect(
                        'Baggage Type', // Title of the select field, as per the form requirements in Baggage.Helpers.tsx
                        formData.baggageType, // Current selected value for baggage type
                        () => setOpenPicker('baggageType'), // Function to open the baggage type picker
                        'How would you classify the baggage you found?' // Placeholder text when no value is selected
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
                        'Where you traveling within the same area / town (local) or from one town to another (intercity)?'
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

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Destination</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder='Where was the vehicle "ending its trip"?'
                        value={formData.destination}
                        onChangeText={(value) => updateFormData('destination', value)}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Baggage Location</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Where can the owner come to collect the baggage?"
                        value={formData.docLocation}
                        onChangeText={(value) => updateFormData('docLocation', value)}
                        multiline
                        maxLength={200}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Finder Contact</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="On what number can the owner reach you?"
                        value={formData.finderContact}
                        onChangeText={(value) => {
                            const digits = value.replace(/\D/g, '');
                            updateFormData('finderContact', digits);
                        }}
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                    {formData.finderContact.length > 0 && !isPhoneValid && (
                        <Text className="text-red-600 text-xs mb-7">Invalid phone number format. Example: 0712345678</Text>
                    )}
                    {formData.finderContact.length === 0 && (
                        <View className="mb-7" />
                    )}

                    {/* Pickers */}
                    <OptionPicker
                        visible={openPicker === 'baggageType'}
                        title="Select Baggage Type"
                        options={BAGGAGE_TYPES as unknown as string[]}
                        onSelect={(val) => updateFormData('baggageType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'transportType'}
                        title="Select Transport Type"
                        options={TRANSPORT_TYPES as unknown as string[]}
                        onSelect={(val) => updateFormData('transportType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'routeType'}
                        title="Select Route Type"
                        options={ROUTE_TYPES as unknown as string[]}
                        onSelect={(val) => updateFormData('routeType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'destinationProvince'}
                        title="Select Destination Province"
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
                        title="Select Destination District"
                        options={districts as unknown as string[]}
                        onSelect={(val) => updateFormData('destinationDistrict', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v) => toTitleCase(v)}
                    />
                </ScrollView>
            </View>
        </Modal >
    );
};

export default ReportBaggageModal;
