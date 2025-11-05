import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ReportMBaggageModa from '@/components/mBaggage/ReportMBaggageModa';
import { useMBaggage } from '@/hooks/useMBaggage';
import CardWrapper from '@/styles/CardWrapper';

const ReportMBaggageCard = () => {
  const {
    isBaggageModalVisible,
    formData,
    openBaggageModal,
    closeBaggageModal,
    reportBaggage,
    updateFormData,
    isReporting,
  } = useMBaggage();

  return (
    <>
      <CardWrapper onPress={openBaggageModal} accessibilityLabel="Report lost mBaggage">
        <Text className="ml-2 text-gray-600 font-bold text-lg">Report Items Lost & Found at a Gathering or Event </Text>
      </CardWrapper>

      <ReportMBaggageModa
        isVisible={isBaggageModalVisible}
        onClose={closeBaggageModal}
        formData={formData}
        reportBaggage={reportBaggage}
        updateFormData={updateFormData}
        isReporting={isReporting}
      />
    </>
  );
};

export default ReportMBaggageCard;