import { View } from 'react-native';
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


const HomeScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <BackGroundCard />
      <SafeAreaView style={tabStyles.safeArea}>
        <View style={tabStyles.container}>
          <ReportBaggageCard />
          <ReportBCertificateCard />
          <ReportDLicenseCard />
          <ReportNatIdCard />
          <ReportPassportCard />
          <ReportSCertificateCard />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;