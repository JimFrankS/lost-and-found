import React from 'react';
import { Text } from 'react-native';
import { tabStyles } from '@/styles/tabStyles';
import ReportSCertificateModal from './ReportSCertificateModal';
import { useSCertificate } from '@/hooks/useSCertificate';
import CardWrapper from '@/styles/CardWrapper';

const ReportSCertificateCard = () => {
    const {
        isSCertificateModalVisible,
        formData,
        openSCertificateModal,
        closeSCertificateModal,
        reportSCertificate,
        updateFormData,
        isReporting,
    } = useSCertificate();

    return (
        <>
            <CardWrapper onPress={openSCertificateModal} accessibilityLabel="Report lost school certificate">
                <Text className="text-gray-600 font-bold text-lg">Report Lost School Certificate</Text>
            </CardWrapper>

            <ReportSCertificateModal
                isVisible={isSCertificateModalVisible}
                onClose={closeSCertificateModal}
                formData={formData}
                reportSCertificate={reportSCertificate}
                updateFormData={updateFormData}
                isReporting={isReporting}
            />
        </>
    );
};

export default ReportSCertificateCard;
