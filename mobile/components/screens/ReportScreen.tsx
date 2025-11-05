import { View, ScrollView, Text, StatusBar } from 'react-native';
import React from 'react';
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



interface ReportScreenProps {
  onBack?: () => void;
  onToggleToSearch?: () => void;
}

const ReportScreen = ({ onBack, onToggleToSearch }: ReportScreenProps) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackGroundCard />
      <SafeAreaView style={tabStyles.safeArea}>
        {/* Sticky Header */}
        <View style={[{
          position: 'absolute',
          top: StatusBar.currentHeight || 0,
          left: 0,
          right: 0,
          paddingVertical: 10,
          paddingHorizontal: 16,
          zIndex: 1,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }, tabStyles.header]}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center',
          }}>
            Report Lost Items
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[tabStyles.container, { paddingTop: 60 }]}
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
