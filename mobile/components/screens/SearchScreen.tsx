import React from 'react'
import SearchBaggage from '@/components/baggage/SearchBaggage'
import SearchScertificate from '@/components/scertificate/SearchScertificate'
import SearchBCertificate from '@/components/birthcertificate/SearchBCertificate'
import SearchDLicence from '@/components/dLicence/SearchDLicence'
import SearchNatId from '@/components/natId/SearchNatId'
import SearchPassport from '@/components/passport/SearchPassport'
import SearchMBaggage from '@/components/mBaggage/SearchMBaggage'
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { tabStyles, HEADER_TOP_SPACING } from '@/styles/tabStyles';
import BackGroundCard from '@/components/BackGroundCard'
import ResponsiveContainer from '@/components/ResponsiveContainer'
import { useBaggage } from '@/hooks/useBaggage'
import { useSCertificate } from '@/hooks/useSCertificate'
import { useBCertificate } from '@/hooks/useBCertificate'
import { useDLicense } from '@/hooks/useDLicense'
import { useNatID } from '@/hooks/useNatID'
import { usePassport } from '@/hooks/usePassport'
import { useMBaggage } from '@/hooks/useMBaggage'
import BackToHomeButton from '@/components/BackToHomeButton'
import Header from '@/components/Header'

interface SearchScreenProps {
  onBack?: () => void;
  onToggleToReport?: () => void;
}

const SearchScreen = ({ onBack, onToggleToReport }: SearchScreenProps) => {
  const { safeArea, container } = tabStyles();
  const baggageHook = useBaggage();
  const scertificateHook = useSCertificate();
  const bcertificateHook = useBCertificate();
  const dlicenceHook = useDLicense();
  const natIdHook = useNatID();
  const passportHook = usePassport();
  const mBaggageHook = useMBaggage();

  const showFullScreenResults =
    baggageHook.searchFound ||
    scertificateHook.searchFound ||
    bcertificateHook.searchFound ||
    bcertificateHook.searchPerformed ||
    dlicenceHook.searchFound ||
    dlicenceHook.searchPerformed ||
    natIdHook.searchFound ||
    passportHook.searchFound ||
    mBaggageHook.searchFound ||
    baggageHook.searchPerformed ||
    scertificateHook.searchPerformed ||
    natIdHook.searchPerformed ||
    passportHook.searchPerformed ||
    mBaggageHook.searchPerformed;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackGroundCard />
      <SafeAreaView style={safeArea}>
        {!showFullScreenResults && (
          /* Sticky Header */
          <Header title="Search Lost Items" />
        )}
        {showFullScreenResults ? (
          <View style={{ flex: 1 }}>
            {(baggageHook.searchFound || baggageHook.searchPerformed) && <SearchBaggage baggageHook={baggageHook} />}
            {(scertificateHook.searchFound || scertificateHook.searchPerformed) && (
              <SearchScertificate scertificateHook={scertificateHook} />
            )}
            {(bcertificateHook.searchPerformed) && <SearchBCertificate bcertificateHook={bcertificateHook} />}
            {(dlicenceHook.searchPerformed) && <SearchDLicence dlicenceHook={dlicenceHook} />}
            {(natIdHook.searchFound || natIdHook.searchPerformed) && <SearchNatId natIdHook={natIdHook} />}
            {(passportHook.searchFound || passportHook.searchPerformed) && <SearchPassport passportHook={passportHook} />}
            {(mBaggageHook.searchFound || mBaggageHook.searchPerformed) && <SearchMBaggage baggageHook={mBaggageHook} />}
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[container, { paddingTop: HEADER_TOP_SPACING }]}
          >
            <ResponsiveContainer>
              <SearchBaggage baggageHook={baggageHook} />
              <SearchBCertificate bcertificateHook={bcertificateHook} />
              <SearchDLicence dlicenceHook={dlicenceHook} />
              <SearchNatId natIdHook={natIdHook} />
              <SearchPassport passportHook={passportHook} />
              <SearchScertificate scertificateHook={scertificateHook} />
              <SearchMBaggage baggageHook={mBaggageHook} />
              {onBack && <BackToHomeButton onPress={onBack} onToggle={onToggleToReport} toggleLabel="Go to Report" />}
            </ResponsiveContainer>
          </ScrollView>
        )}
        {/* Gradient fade overlay at bottom to hide content behind tab bar */}
        {!showFullScreenResults && (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)', 'transparent']}
            style={styles.fadeGradient}
            pointerEvents="none"
          />
        )}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 10,
  },
});



export default SearchScreen
