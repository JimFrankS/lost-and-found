import React from 'react';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { tabStyles } from '@/styles/tabStyles';
import ReportPassportModal from './ReportPassportModal';
import { usePassport } from '@/hooks/usePassport';
import CardWrapper from '@/styles/CardWrapper';

const ReportPassportCard = () => {
    const {
        isPassportModalVisible,
        formData,
        openPassportModal,
        closePassportModal,
        reportPassport,
        updateFormData,
        isReporting,
    } = usePassport();

    return (
        <>
            <CardWrapper onPress={openPassportModal} accessibilityLabel="Report lost passport">
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost Passport</Text>
            </CardWrapper>

            <ReportPassportModal
                isVisible={isPassportModalVisible}
                onClose={closePassportModal}
                formData={formData}
                reportPassport={reportPassport}
                updateFormData={updateFormData}
                isReporting={isReporting}
            />
        </>
    );
};

export default ReportPassportCard;
