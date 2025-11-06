import { View, ScrollView, StatusBar } from 'react-native';
import React, {  } from 'react';
import BackGroundCard from '@/components/BackGroundCard';
import { tabStyles } from '@/styles/tabStyles';
import ReportBaggageCard from '@/components/baggage/ReportBaggageCard';
import ReportBCertificateCard from '@/components/birthcertificate/ReportBCertificateCard';
import ReportDLicenseCard from '@/components/dLicence/ReportDLicenseCard';
import ReportNatIdCard from '@/components/natId/ReportNatIdCard';
import ReportPassportCard from '@/components/passport/ReportPassportCard';
import ReportSCertificateCard from '@/components/scertificate/ReportSCertificateCard';
import ReportMBaggageCard from '@/components/mBaggage/ReportMBaggageCard';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackToHomeButton from '@/components/BackToHomeButton';
import Header from '@/components/Header'



interface ReportScreenProps {
  onBack?: () => void;
  onToggleToSearch?: () => void;
}

const ReportScreen = ({ onBack, onToggleToSearch }: ReportScreenProps) => {
  const tabViewStyles = tabStyles();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackGroundCard />
      <SafeAreaView style={tabViewStyles.safeArea}>
        {/* Sticky Header */}
        <Header title="Report Lost Items" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[tabViewStyles.container, { paddingTop: tabViewStyles.HEADER_TOP_SPACING }]}
        >
          <ResponsiveContainer>
            <ReportBaggageCard />
            <ReportBCertificateCard />
            <ReportDLicenseCard />
            <ReportNatIdCard />
            <ReportPassportCard />
            <ReportSCertificateCard />
            <ReportMBaggageCard />
            {onBack && <BackToHomeButton onPress={onBack} onToggle={onToggleToSearch} toggleLabel="Go to Search" />}
          </ResponsiveContainer>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default ReportScreen;
