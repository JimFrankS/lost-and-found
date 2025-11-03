import { Text, View, ScrollView, Modal, Alert, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PHONE_NUMBER_REGEX, licenceNumberRegex, escapeRegex } from "@/constants/allowedValues";
import { isValidZimbabweIdNumber, sanitizeZimbabweIdNumber } from "@/utils/idValidator";
import { showAlerts } from "@/utils/alerts";

interface ReportDLicenseModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        licenceNumber: string;
        lastName: string;
        firstName: string;
        idNumber: string;
        docLocation: string;
        finderContact: string;
    };
    reportDLicense: () => void;
    updateFormData: (field: string, value: string) => void;
    isReporting: boolean;
} // Props to be used in the modal and their data types and arguments.

const ReportDLicenseModal = ({ isVisible, onClose, formData, reportDLicense, updateFormData, isReporting }: ReportDLicenseModalProps) => {

    const insets = useSafeAreaInsets();

    const isPhoneValid = PHONE_NUMBER_REGEX.test(formData.finderContact); // check for validating zim phone numbers during data entry.
    const isLicenceValid = licenceNumberRegex.test(formData.licenceNumber); // check for validating licence number.
    const isIdValid = isValidZimbabweIdNumber(formData.idNumber); // check for validating id number.

    const isFormComplete = Boolean(
        formData.licenceNumber &&
        formData.lastName &&
        formData.firstName &&
        formData.idNumber &&
        formData.docLocation &&
        formData.finderContact
    ); // define the compulsory fields that must be filled before the form can be submitable.

    const handleSave = () => {
        if (!isFormComplete) {
            Alert.alert("Error", "Please fill in all the required fields.");
            return;
        }

        if (!isLicenceValid) {
            Alert.alert("Error", "Invalid licence number format. Example: 123456AB");
            return;
        }

        if (!isIdValid) {
            Alert.alert("Error", "Invalid ID number format.");
            return;
        }

        if (!isPhoneValid) {
            Alert.alert("Error", "Invalid phone number format. Example: 0719729537");
            return;
        }
        reportDLicense();
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View
                className="flex-1 bg-white"
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right
                }}
            >
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

                    <TouchableOpacity onPress={handleSave} disabled={isReporting || !isFormComplete || !isLicenceValid || !isIdValid || !isPhoneValid}>
                        {(!isFormComplete || !isLicenceValid || !isIdValid || !isPhoneValid) ? (
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
                                maxHeight: Dimensions.get('window').height - insets.top - insets.bottom,
                                overflow: 'scroll',
                            } : undefined
                    }>

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Licence Number</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the licence number"
                        value={formData.licenceNumber}
                        onChangeText={(value) => updateFormData('licenceNumber', escapeRegex(value))}
                        maxLength={8}
                    />

                    {formData.licenceNumber.length > 0 && !isLicenceValid && (
                        <Text className="text-red-600 text-xs mb-7">Invalid licence number format. Example: 123456AB</Text>
                    )}
                    {formData.licenceNumber.length === 0 && (
                        <View className="mb-7" />
                    )}

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Last Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the last name of the licence owner"
                        value={formData.lastName}
                        onChangeText={(value) => updateFormData('lastName', value.replace(/[^a-zA-Z\s'-]/g, ''))}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">First Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the first name of the licence owner"
                        value={formData.firstName}
                        onChangeText={(value) => updateFormData('firstName', value.replace(/[^a-zA-Z\s'-]/g, ''))}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">ID Number</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the ID number of the licence owner"
                        value={formData.idNumber}
                        onChangeText={(value) => updateFormData('idNumber', sanitizeZimbabweIdNumber(value))}
                    />

                    {formData.idNumber.length > 0 && !isIdValid && (
                        <Text className="text-red-600 text-xs mb-7">Invalid ID number format.</Text>
                    )}
                    {formData.idNumber.length === 0 && (
                        <View className="mb-7" />
                    )}

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Driver's Licence Location</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Where can the owner come to collect the driving licence?"
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
                        <Text className="text-red-600 text-xs mb-7">Invalid phone number format. Example: 0719729537</Text>
                    )}
                    {formData.finderContact.length === 0 && (
                        <View className="mb-7" />
                    )}

                </ScrollView>
            </View>
        </Modal>
    );
};

export default ReportDLicenseModal;
