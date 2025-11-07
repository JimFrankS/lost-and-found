import React, { useMemo } from 'react'
import SearchBaggage from '@/components/baggage/SearchBaggage'
import SearchScertificate from '@/components/scertificate/SearchScertificate'
import SearchBCertificate from '@/components/birthcertificate/SearchBCertificate'
import SearchDLicence from '@/components/dLicence/SearchDLicence'
import SearchNatId from '@/components/natId/SearchNatId'
import SearchPassport from '@/components/passport/SearchPassport'
import SearchMBaggage from '@/components/mBaggage/SearchMBaggage'
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTabStyles, HEADER_TOP_SPACING, TAB_BAR_HEIGHT, EXTRA_SPACE } from '@/styles/tabStyles';
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

const staticStyles = StyleSheet.create({
  contentPadding: { paddingTop: HEADER_TOP_SPACING },
});

interface SearchScreenProps {
  onBack?: () => void;
  onToggleToReport?: () => void;
}

const SearchScreen = ({ onBack, onToggleToReport }: SearchScreenProps) => {
  const { safeArea, container } = useTabStyles();
  const insets = useSafeAreaInsets();
  const baggageHook = useBaggage();
  const scertificateHook = useSCertificate();
  const bcertificateHook = useBCertificate();
  const dlicenceHook = useDLicense();
  const natIdHook = useNatID();
  const passportHook = usePassport();
  const mBaggageHook = useMBaggage();

  const hooks = [baggageHook, scertificateHook, bcertificateHook, dlicenceHook, natIdHook, passportHook, mBaggageHook];
  const showFullScreenResults = hooks.some(hook => hook.searchFound || hook.searchPerformed);

  const styles = useMemo(() => StyleSheet.create({
    fadeGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: TAB_BAR_HEIGHT + EXTRA_SPACE + insets.bottom,
      zIndex: 10,
    },
  }), [insets.bottom]);

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
            {(bcertificateHook.searchFound || bcertificateHook.searchPerformed) && <SearchBCertificate bcertificateHook={bcertificateHook} />}
            {(dlicenceHook.searchFound || dlicenceHook.searchPerformed) && <SearchDLicence dlicenceHook={dlicenceHook} />}
            {(natIdHook.searchFound || natIdHook.searchPerformed) && <SearchNatId natIdHook={natIdHook} />}
            {(passportHook.searchFound || passportHook.searchPerformed) && <SearchPassport passportHook={passportHook} />}
            {(mBaggageHook.searchFound || mBaggageHook.searchPerformed) && <SearchMBaggage baggageHook={mBaggageHook} />}
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[container, staticStyles.contentPadding]}
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
            colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.8)']}
            style={styles.fadeGradient}
            pointerEvents="none"
          />
        )}
      </SafeAreaView>
    </View>
  )
}



export default SearchScreen
