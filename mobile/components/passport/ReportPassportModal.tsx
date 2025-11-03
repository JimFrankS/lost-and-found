import { Text, View, ScrollView, Modal, Alert, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PHONE_NUMBER_REGEX, passportNumberRegex, escapeRegex } from "@/constants/allowedValues";
import { isValidZimbabweIdNumber, sanitizeZimbabweIdNumber } from "@/utils/idValidator";
import { showAlerts } from "@/utils/alerts";

interface ReportPassportModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        passportNumber: string;
        lastName: string;
        firstName: string;
        idNumber: string;
        docLocation: string;
        finderContact: string;
    };
    reportPassport: () => void;
    updateFormData: (field: string, value: string) => void;
    isReporting: boolean;
} // Props to be used in the modal and their data types and arguments.

const ReportPassportModal = ({ isVisible, onClose, formData, reportPassport, updateFormData, isReporting }: ReportPassportModalProps) => {

    const insets = useSafeAreaInsets();

    const isPhoneValid = PHONE_NUMBER_REGEX.test(formData.finderContact); // check for validating zim phone numbers during data entry.
    const isPassportValid = passportNumberRegex.test(formData.passportNumber); // check for validating passport number.
    const isIdValid = isValidZimbabweIdNumber(formData.idNumber); // check for validating id number.

    const isFormComplete = Boolean(
        formData.passportNumber &&
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

        if (!isPassportValid) {
            Alert.alert("Error", "Invalid passport number format. Example: AB123456");
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
        reportPassport();
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

                    <TouchableOpacity onPress={handleSave} disabled={isReporting || !isFormComplete || !isPassportValid || !isIdValid || !isPhoneValid}>
                        {(!isFormComplete || !isPassportValid || !isIdValid || !isPhoneValid) ? (
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

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Passport Number</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the passport number"
                        value={formData.passportNumber}
                        onChangeText={(value) => updateFormData('passportNumber', escapeRegex(value))}
                        maxLength={8}
                    />

                    {formData.passportNumber.length > 0 && !isPassportValid && (
                        <Text className="text-red-600 text-xs mb-7">Invalid passport number format. Example: AB123456</Text>
                    )}
                    {formData.passportNumber.length === 0 && (
                        <View className="mb-7" />
                    )}

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Last Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the last name of the passport owner"
                        value={formData.lastName}
                        onChangeText={(value) => updateFormData('lastName', value)}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">First Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the first name of the passport owner"
                        value={formData.firstName}
                        onChangeText={(value) => updateFormData('firstName', value)}
                        multiline
                        maxLength={100}
                    />

                    <Text className="text-lg font-semibold text-gray-600 mb-2">ID Number</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Kindly enter the ID number on the passport"
                        value={formData.idNumber}
                        onChangeText={(value) => updateFormData('idNumber', sanitizeZimbabweIdNumber(value))}
                        maxLength={13}
                    />

                    {formData.idNumber.length > 0 && !isIdValid && (
                        <Text className="text-red-600 text-xs mb-7">Invalid ID number format.</Text>
                    )}
                    {formData.idNumber.length === 0 && (
                        <View className="mb-7" />
                    )}

                    <Text className="text-lg font-semibold text-gray-600 mb-2">Passport Location</Text>
                    <TextInput
                        className="border border-gray-300 rounded p-2 mb-4"
                        placeholder="Where can the owner come to collect the passport?"
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

export default ReportPassportModal;
