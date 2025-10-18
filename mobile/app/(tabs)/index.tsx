import { View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundCard from '@/components/BackGroundCard';
import { tabStyles } from '@/styles/tabStyles';
import ReportBaggageCard from '@/components/ReportBaggageCard';
import ReportBCertificateCard from '@/components/ReportBCertificateCard';
import ReportDLicenseCard from '@/components/ReportDLicenseCard';
import ReportNatIdCard from '@/components/ReportNatIdCard';


const HomeScreen = () => {
  return (
    <SafeAreaView style={tabStyles.safeArea}>
      <View style={tabStyles.container}>
        <BackGroundCard />
      
        <ReportBaggageCard />
        <ReportBCertificateCard />
        <ReportDLicenseCard />
        <ReportNatIdCard />
        
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;