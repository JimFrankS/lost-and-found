import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { tabStyles } from '@/styles/tabStyles';
import ReportDLicenseModal from './reportDLicenseModal';
import { useDLicense } from '@/hooks/useDLicense';

const ReportDLicenseCard = () => {
    const {
        isDLicenseModalVisible,
        formData,
        openDLicenseModal,
        closeDLicenseModal,
        reportDLicense,
        updateFormData,
        isReporting,
    } = useDLicense();

    return (
        <>
            <View style={tabStyles.content}>
                <TouchableOpacity
                    onPress={openDLicenseModal}
                    className='m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center'
                >
                    <Feather name='plus' size={24} color={"black"} />
                    <Text className="ml-2 text-gray-600 font-bold text-lg">Report Found Driving Licence</Text>
                </TouchableOpacity>
            </View>

            <ReportDLicenseModal
                isVisible={isDLicenseModalVisible}
                onClose={closeDLicenseModal}
                formData={formData}
                reportDLicense={reportDLicense}
                updateFormData={updateFormData}
                isReporting={isReporting}
            />
        </>
    );
};

export default ReportDLicenseCard;
