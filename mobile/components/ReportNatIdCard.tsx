import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReportNatIdModal from './reportNatIdModal';
import { useNatID } from '@/hooks/useNatID';

const ReportNatIdCard = () => {
    const {
        isNatIDModalVisible,
        formData,
        openNatIDModal,
        closeNatIDModal,
        reportNatID,
        updateFormData,
        isReporting,
    } = useNatID();

    return (
        <>
            <TouchableOpacity
                onPress={openNatIDModal}
                className='m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center'
            >
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost National ID</Text>
            </TouchableOpacity>

            <ReportNatIdModal
                isVisible={isNatIDModalVisible}
                onClose={closeNatIDModal}
                formData={formData}
                reportNatID={reportNatID}
                updateFormData={updateFormData}
                isReporting={isReporting}
            />
        </>
    );
};

export default ReportNatIdCard;
