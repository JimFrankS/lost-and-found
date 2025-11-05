import { Text, View, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import { MBAGGAGE_TYPES, gatheringTypes, PROVINCES, PROVINCE_DISTRICT_MAP, PHONE_NUMBER_REGEX, PHONE_EXAMPLE } from "@/constants/allowedValues";
import { OptionPicker, SelectField, toTitleCase } from "../FormsHelper";
import { showAlerts } from "@/utils/alerts";
import ModalWrapper from "../ModalWrapper";

interface ReportBaggageModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        baggageType: string;
        gatheringType: string;
        destinationProvince: string;
        destinationDistrict: string;
        gatheringLocation: string;
        docLocation: string;
        finderContact: string;
    };
    reportBaggage: () => void;
    updateFormData: (field: string, value: string) => void;
    isReporting: boolean;
}


const ReportBaggageModal = ({ isVisible, onClose, formData, reportBaggage, updateFormData, isReporting }: ReportBaggageModalProps) => {
    const [openPicker, setOpenPicker] = useState<null | 'baggageType' | 'gatheringType' | 'destinationProvince' | 'destinationDistrict'>(null);

    const insets = useSafeAreaInsets();

    const districts = useMemo(() => {
        const prov = formData.destinationProvince as keyof typeof PROVINCE_DISTRICT_MAP;
        return prov ? (PROVINCE_DISTRICT_MAP[prov] ?? []) : [];
    }, [formData.destinationProvince]);

    const isPhoneValid = PHONE_NUMBER_REGEX.test(formData.finderContact);
    const isFormComplete = Boolean(
        formData.baggageType &&
        formData.gatheringType &&
        formData.destinationProvince &&
        formData.destinationDistrict &&
        formData.gatheringLocation &&
        formData.docLocation &&
        formData.finderContact
    );

    const handleSave = () => {
        if (!isFormComplete) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }
        if (!isPhoneValid) {
            Alert.alert("Error", `Invalid phone number format. Example: ${PHONE_EXAMPLE}`);
            return;
        }
        reportBaggage();
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
                        'Lost Item Type', // Title of the select field, as per the form requirements in Baggage.Helpers.tsx
                        formData.baggageType, // Current selected value for baggage type
                        () => setOpenPicker('baggageType'), // Function to open the baggage type picker
                        'How would you classify the lost item you found?' // Placeholder text when no value is selected
                    )}

                    {renderSelect(
                        'Gathering or Event Type',
                        formData.gatheringType,
                        () => setOpenPicker('gatheringType'),
                        'What type of gathering, event, or activity were you attending?'
                    )}

                    {renderSelect(
                        'Province of occurrence',
                        formData.destinationProvince,
                        () => setOpenPicker('destinationProvince'),
                        'In which Province was the activity or event happenning?',
                    )}

                    <SelectField
                        label="District of occurrence"
                        value={formData.destinationDistrict}
                        displayValue={formData.destinationProvince ? (formData.destinationDistrict ? toTitleCase(formData.destinationDistrict) : '') : ''}
                        placeholder={formData.destinationProvince ? 'In which district was the activity or event happenning?' : 'Select province first'}
                        onPress={() => formData.destinationProvince && setOpenPicker('destinationDistrict')}
                        disabled={!formData.destinationProvince}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Gathering Location</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder='Where were you when you found the lost item?'
                        value={formData.gatheringLocation}
                        onChangeText={(value) => updateFormData('gatheringLocation', value)}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Item Location</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Where can the owner come to collect the item?"
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
                        <Text className="text-red-600 text-xs mb-7">Invalid phone number format. Example: {PHONE_EXAMPLE}</Text>
                    )}
                    {formData.finderContact.length === 0 && (
                        <View className="mb-7" />
                    )}

                    {/* Pickers */}
                    <OptionPicker
                        visible={openPicker === 'baggageType'}
                        title="Lost Item Type"
                        options={MBAGGAGE_TYPES}
                        onSelect={(val: string) => updateFormData('baggageType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'gatheringType'}
                        title="Gathering or Event Type"
                        options={gatheringTypes}
                        onSelect={(val: string) => updateFormData('gatheringType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                    <OptionPicker
                        visible={openPicker === 'destinationProvince'}
                        title="Province of occurrence"
                        options={PROVINCES}
                        onSelect={(val: string) => {
                            updateFormData('destinationProvince', String(val).toLowerCase());
                            // reset district when province changes
                            updateFormData('destinationDistrict', '');
                        }}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v: string) => toTitleCase(v)}
                    />

                    <OptionPicker
                        visible={openPicker === 'destinationDistrict'}
                        title="District of occurrence"
                        options={districts}
                        onSelect={(val: string) => updateFormData('destinationDistrict', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                        getLabel={(v: string) => toTitleCase(v)}
                    />
                </ScrollView>
            </View>
        </ModalWrapper>
    );
};

export default ReportBaggageModal;