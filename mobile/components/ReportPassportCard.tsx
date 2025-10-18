import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { tabStyles } from '@/styles/tabStyles';
import ReportPassportModal from './ReportPassportModal';
import { usePassport } from '@/hooks/usePassport';

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
            <TouchableOpacity
                onPress={openPassportModal}
                className='m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center'
            >
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost Passport</Text>
            </TouchableOpacity>

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
