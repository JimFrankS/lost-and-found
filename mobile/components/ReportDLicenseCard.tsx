import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
            <TouchableOpacity
                onPress={openDLicenseModal}
                className='m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center'
            >
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost Driving Licence</Text>
            </TouchableOpacity>

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
