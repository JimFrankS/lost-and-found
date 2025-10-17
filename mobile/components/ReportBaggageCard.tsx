import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { tabStyles } from '@/styles/tabStyles';
import ReportBaggageModal from '@/components/ReportBaggageModal';
import { useBaggage } from '@/hooks/useBaggage';

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
      <View style={tabStyles.content}>
        <TouchableOpacity
          onPress={openBaggageModal}
          className="m-4 p-4 bg-transparent rounded-lg shadow flex-row items-center justify-center"
        >
          <Feather name="plus" size={24} color="black" />
          <Text className="ml-2 text-gray-600 font-bold text-lg">Report Lost Baggage</Text>
        </TouchableOpacity>
      </View>
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