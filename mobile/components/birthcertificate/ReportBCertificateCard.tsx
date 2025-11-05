import React from 'react';
import { Text } from 'react-native';
import ReportBCertificateModal from './ReportBCertificateModal';
import { useBCertificate } from '@/hooks/useBCertificate';
import CardWrapper from '@/styles/CardWrapper';

const ReportBCertificateCard = () => {
    const {
        isBCertificateModalVisible,
        formData,
        openBCertificateModal,
        closeBCertificateModal,
        reportBCertificate,
        updateFormData,
        isReporting,
    } = useBCertificate();

    return (
        <>
            <CardWrapper onPress={openBCertificateModal} accessibilityLabel="Report lost birth certificate">
                <Text className="text-gray-600 font-bold text-lg">Report Lost Birth Certificate</Text>
            </CardWrapper>

            <ReportBCertificateModal
                isVisible={isBCertificateModalVisible}
                onClose={closeBCertificateModal}
                formData={formData}
                reportBCertificate={reportBCertificate}
                updateFormData={updateFormData}
                isReporting={isReporting}
            />
        </>
    );
};

export default ReportBCertificateCard;
