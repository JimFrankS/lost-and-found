import { View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundCard from '@/components/BackGroundCard';
import { tabStyles } from '@/styles/tabStyles';
import ReportBaggageCard from '@/components/baggage/ReportBaggageCard';
import ReportBCertificateCard from '@/components/birthcertificate/ReportBCertificateCard';
import ReportDLicenseCard from '@/components/dLicence/ReportDLicenseCard';
import ReportNatIdCard from '@/components/natId/ReportNatIdCard';
import ReportPassportCard from '@/components/passport/ReportPassportCard';
import ReportSCertificateCard from '@/components/scertificate/ReportSCertificateCard';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import BackToHomeButton from '@/components/BackToHomeButton';


interface ReportScreenProps {
  onBack?: () => void;
}

const ReportScreen = ({ onBack }: ReportScreenProps) => {
  return (
    <View style={{ flex: 1 }}>
      <BackGroundCard />
      <SafeAreaView style={tabStyles.safeArea}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={tabStyles.container}
        >
          <ResponsiveContainer>
            {onBack && <BackToHomeButton onPress={onBack} />}
            <ReportBaggageCard />
            <ReportBCertificateCard />
            <ReportDLicenseCard />
            <ReportNatIdCard />
            <ReportPassportCard />
            <ReportSCertificateCard />
          </ResponsiveContainer>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ReportScreen;