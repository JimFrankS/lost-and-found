import React from 'react';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReportDLicenseModal from './ReportDLicenseModal';
import { useDLicense } from '@/hooks/useDLicense';
import CardWrapper from '@/styles/CardWrapper';

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
            <CardWrapper onPress={openDLicenseModal} accessibilityLabel="Report lost driving licence">
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost Driving Licence</Text>
            </CardWrapper>

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
