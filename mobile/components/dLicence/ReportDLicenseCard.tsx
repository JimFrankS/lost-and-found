import React from 'react';
import { Text } from 'react-native';
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
                <Text className="text-gray-600 font-bold text-lg">Report Lost Driving Licence</Text>
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
