import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
        <Feather name="plus" size={20} color="black" />
        <Text style={{ marginLeft: 10, color: '#374151', fontWeight: '700' }}>Report Lost Baggage</Text>
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