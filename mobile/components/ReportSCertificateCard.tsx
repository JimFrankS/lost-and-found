import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { tabStyles } from '@/styles/tabStyles';
import ReportSCertificateModal from './ReportSCertificateModal';
import { useSCertificate } from '@/hooks/useSCertificate';

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
            <TouchableOpacity
                onPress={openSCertificateModal}
                className='m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center'
            >
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost School Certificate</Text>
            </TouchableOpacity>

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
