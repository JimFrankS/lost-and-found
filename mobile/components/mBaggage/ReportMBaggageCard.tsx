import React from 'react';
import {  Text } from 'react-native';
import ReportMBaggageModal from '@/components/mBaggage/ReportMBaggageModal';
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
      <CardWrapper onPress={openBaggageModal} accessibilityLabel="Report found mBaggage">
        <Text className="ml-2 text-gray-600 font-bold text-lg">Report Found Items from Gatherings, Events, or Other Locations</Text>
      </CardWrapper>

      <ReportMBaggageModal
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