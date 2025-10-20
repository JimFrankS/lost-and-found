import React from 'react';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReportNatIdModal from './ReportNatIdModal';
import { useNatID } from '@/hooks/useNatID';
import CardWrapper from '@/styles/CardWrapper';

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
            <CardWrapper onPress={openNatIDModal} accessibilityLabel="Report lost national ID">
                <Feather name='plus' size={24} color={"black"} />
                <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost National ID</Text>
            </CardWrapper>

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
