import { View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundCard from '@/components/BackGroundCard';
import { tabStyles } from '@/styles/tabStyles';
import ReportBaggageCard from '@/components/ReportBaggageCard';
import ReportBCertificateCard from '@/components/ReportBCertificateCard';
import ReportDLicenseCard from '@/components/ReportDLicenseCard';
import ReportNatIdCard from '@/components/ReportNatIdCard';
import ReportPassportCard from '@/components/ReportPassportCard';
import ReportSCertificateCard from '@/components/ReportSCertificateCard';


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