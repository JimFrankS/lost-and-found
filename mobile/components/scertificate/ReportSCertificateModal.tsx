import { Text, View, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PHONE_NUMBER_REGEX, SCERTIFICATE_TYPES, PHONE_EXAMPLE } from "@/constants/allowedValues";
import { OptionPicker, SelectField } from "../FormsHelper";
import { showAlerts } from "@/utils/alerts";
import { searchResultStyles } from "@/styles/searchResultStyles";
import ModalWrapper from "../ModalWrapper";
import ReportedSuccessfully from "../ReportedSuccessfullyCard";
import BackToHomeButton from "../BackToHomeButton";

interface ReportSCertificateModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        certificateType: string;
        lastName: string;
        firstName: string;
        docLocation: string;
        finderContact: string;
    };
    reportSCertificate: () => void;
    updateFormData: (field: string, value: string) => void;
    isReporting: boolean;
} // Props to be used in the modal and their data types and arguments.

const ReportSCertificateModal = ({ isVisible, onClose, formData, reportSCertificate, updateFormData, isReporting }: ReportSCertificateModalProps) => {

    const [openPicker, setOpenPicker] = useState<null | 'certificateType'>(null);
    const [reportedSuccessfully, setReportedSuccessfully] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setReportedSuccessfully(false);
        }
    }, [isVisible]);

    const insets = useSafeAreaInsets();

    const isPhoneValid = PHONE_NUMBER_REGEX.test(formData.finderContact); // check for validating zim phone numbers during data entry.

    const isFormComplete = Boolean(
        formData.certificateType &&
        formData.lastName &&
        formData.firstName &&
        formData.docLocation &&
        formData.finderContact
    ); // define the compulsory fields that must be filled before the form can be submitable.

    const handleSave = async () => {
        if (!isFormComplete) {
            showAlerts("Error", "Please fill in all the required fields.");
            return;
        }

        if (!isPhoneValid) {
            Alert.alert("Error", `Invalid phone number format. Example: ${PHONE_EXAMPLE}`);
            return;
        }
        try {
            await reportSCertificate();
            setReportedSuccessfully(true);
        } catch (error) {
            // Error is handled by the hook
        }
    };

    const renderSelect = (label: string, value: string, onPress: () => void, placeholder: string, displayValue?: string) => (
        <SelectField label={label} value={value} onPress={onPress} placeholder={placeholder} displayValue={displayValue} />
    );

    return (
        <ModalWrapper visible={isVisible} onClose={onClose}>
            <View className="flex-1">
                {reportedSuccessfully && !isReporting ? (
                    <View style={{ flex: 1, position: "relative" }}>
                        <View
                            style={[
                                { flex: 1, zIndex: 1, paddingTop: insets.top, paddingBottom: 0 },
                            ]}
                        >
                            <View style={searchResultStyles.header}>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={searchResultStyles.backButton}
                                >
                                    <Text style={searchResultStyles.backText}>Back</Text>
                                </TouchableOpacity>
                                <Text style={searchResultStyles.headerTitle}>Success</Text>
                                <View style={searchResultStyles.headerSpacer} />
                            </View>
                            <ReportedSuccessfully hookname="School Certificate" />
                        </View>
                    </View>
                ) : (
                    <View className="flex-1">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
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

                        {/* Input Form */}
                        <ScrollView className="flex-1 p-4"
                            style={
                                Platform.OS === 'web'
                                    ? {
                                        overflow: 'scroll',
                                    } : undefined
                            }>

                    {renderSelect(
                        'Certificate Type',
                        formData.certificateType,
                        () => setOpenPicker('certificateType'),
                        'What type of school certificate is it?'
                    )}

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Last Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the last name of the certificate owner"
                        value={formData.lastName}
                        onChangeText={(value) => updateFormData('lastName', value)}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">First Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the first name of the certificate owner"
                        value={formData.firstName}
                        onChangeText={(value) => updateFormData('firstName', value)}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Certificate Location</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Where can the owner come to collect the school certificate?"
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
                        visible={openPicker === 'certificateType'}
                        title="Select Certificate Type"
                        options={SCERTIFICATE_TYPES}
                        onSelect={(val) => updateFormData('certificateType', String(val).toLowerCase())}
                        onClose={() => setOpenPicker(null)}
                    />

                </ScrollView>
                    </View>
                )}
            </View>
        </ModalWrapper>
    );
};

export default ReportSCertificateModal;
