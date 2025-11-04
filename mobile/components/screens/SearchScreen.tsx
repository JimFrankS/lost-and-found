import React from 'react'
import SearchBaggage from '@/components/baggage/SearchBaggage'
import SearchScertificate from '@/components/scertificate/SearchScertificate'
import SearchBCertificate from '@/components/birthcertificate/SearchBCertificate'
import SearchDLicence from '@/components/dLicence/SearchDLicence'
import SearchNatId from '@/components/natId/SearchNatId'
import SearchPassport from '@/components/passport/SearchPassport'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { tabStyles } from '@/styles/tabStyles';
import BackGroundCard from '@/components/BackGroundCard'
import ResponsiveContainer from '@/components/ResponsiveContainer'
import { useBaggage } from '@/hooks/useBaggage'
import { useSCertificate } from '@/hooks/useSCertificate'
import { useBCertificate } from '@/hooks/useBCertificate'
import { useDLicense } from '@/hooks/useDLicense'
import { useNatID } from '@/hooks/useNatID'
import { usePassport } from '@/hooks/usePassport'

interface SearchScreenProps {
  onBack?: () => void;
}

const SearchScreen = ({ onBack }: SearchScreenProps) => {
  const baggageHook = useBaggage();
  const scertificateHook = useSCertificate();
  const bcertificateHook = useBCertificate();
  const dlicenceHook = useDLicense();
  const natIdHook = useNatID();
  const passportHook = usePassport();

  const showFullScreenResults =
    baggageHook.searchFound ||
    scertificateHook.searchFound ||
    bcertificateHook.searchPerformed ||
    dlicenceHook.searchPerformed ||
    natIdHook.searchFound ||
    passportHook.searchFound;

  return (
    <View style={{ flex: 1 }}>
      <BackGroundCard />
      <SafeAreaView style={tabStyles.safeArea}>
        {showFullScreenResults ? (
          <View style={{ flex: 1 }}>
            {baggageHook.searchFound && <SearchBaggage baggageHook={baggageHook} />}
            {scertificateHook.searchFound && (
              <SearchScertificate scertificateHook={scertificateHook} />
            )}
            {(bcertificateHook.searchPerformed) && <SearchBCertificate bcertificateHook={bcertificateHook} />}
            {(dlicenceHook.searchPerformed) && <SearchDLicence dlicenceHook={dlicenceHook} />}
            {natIdHook.searchFound && <SearchNatId natIdHook={natIdHook} />}
            {passportHook.searchFound && <SearchPassport passportHook={passportHook} />}
          </View>
        ) : (
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={tabStyles.container}
          >
            <ResponsiveContainer>
              {onBack && (
                <TouchableOpacity 
                  onPress={onBack}
                  className="bg-gray-500 p-3 rounded-lg mb-4 flex-row items-center justify-center"
                >
                  <Text className="text-white text-center text-base font-semibold">
                    ← Back to Home
                  </Text>
                </TouchableOpacity>
              )}
              <SearchBaggage baggageHook={baggageHook} />
              <SearchBCertificate bcertificateHook={bcertificateHook} />
              <SearchDLicence dlicenceHook={dlicenceHook} />
              <SearchNatId natIdHook={natIdHook} />
              <SearchPassport passportHook={passportHook} />
              <SearchScertificate scertificateHook={scertificateHook} />
            </ResponsiveContainer>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  )
}

export default SearchScreen
