import React from 'react';
import { Text } from 'react-native';
import ReportBaggageModal from '@/components/baggage/ReportBaggageModal';
import { useBaggage } from '@/hooks/useBaggage';
import CardWrapper from '@/styles/CardWrapper';

const ReportBaggageCard = () => {
  const {
    isBaggageModalVisible,
    formData,
    openBaggageModal,
    closeBaggageModal,
    reportBaggage,
    updateFormData,
    isReporting,
  } = useBaggage();

  return (
    <>
      <CardWrapper onPress={openBaggageModal} accessibilityLabel="Report lost baggage">
        <Text className="text-gray-600 font-bold text-lg">Report Lost Baggage</Text>
      </CardWrapper>

      <ReportBaggageModal
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

export default ReportBaggageCard;