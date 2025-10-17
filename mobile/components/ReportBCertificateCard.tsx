import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { tabStyles } from '@/styles/tabStyles';
import ReportBCertificateModal from './ReportBCertificateModal';
import { useBCertificate } from '@/hooks/useBCertificate';

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
            <View style={tabStyles.content}>
                <TouchableOpacity
                    onPress={openBCertificateModal}
                    className='m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center'
                >
                    <Feather name='plus' size={24} color={"black"} />
                    <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost Birth Certificate</Text>
                </TouchableOpacity>
            </View>

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