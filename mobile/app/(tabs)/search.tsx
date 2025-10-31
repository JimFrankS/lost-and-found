import React from 'react'
import SearchBaggage from '@/components/baggage/SearchBaggage'
import SearchScertificate from '@/components/scertificate/SearchScertificate'
import SearchBCertificate from '@/components/birthcertificate/SearchBCertificate'
import SearchDLicence from '@/components/dLicence/SearchDLicence'
import SearchNatId from '@/components/natId/SearchNatId'
import SearchPassport from '@/components/passport/SearchPassport'
import { View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { tabStyles } from '@/styles/tabStyles';
import BackGroundCard from '@/components/BackGroundCard'
import { useBaggage } from '@/hooks/useBaggage'
import { useSCertificate } from '@/hooks/useSCertificate'
import { useBCertificate } from '@/hooks/useBCertificate'
import { useDLicense } from '@/hooks/useDLicense'
import { useNatID } from '@/hooks/useNatID'
import { usePassport } from '@/hooks/usePassport'

const Search = () => {
  const baggageHook = useBaggage();
  const scertificateHook = useSCertificate();
  const bcertificateHook = useBCertificate();
  const dlicenceHook = useDLicense();
  const natIdHook = useNatID();
  const passportHook = usePassport();

  const showFullScreenResults = baggageHook.searchFound || scertificateHook.searchFound || bcertificateHook.searchFound || dlicenceHook.searchFound || natIdHook.searchFound || passportHook.searchFound;

  return (
    <View style = {{ flex: 1 }}>
      <BackGroundCard />
      <SafeAreaView style={tabStyles.safeArea}>
        {showFullScreenResults ? (
          <ScrollView contentContainerStyle={tabStyles.container}>
            {baggageHook.searchFound && <SearchBaggage baggageHook={baggageHook} />}
            {scertificateHook.searchFound && (
              <SearchScertificate scertificateHook={scertificateHook} />
            )}
            {bcertificateHook.searchFound && <SearchBCertificate bcertificateHook={bcertificateHook} />}
            {dlicenceHook.searchFound && <SearchDLicence dlicenceHook={dlicenceHook} />}
            {natIdHook.searchFound && <SearchNatId natIdHook={natIdHook} />}
            {passportHook.searchFound && <SearchPassport passportHook={passportHook} />}
          </ScrollView>
        ) : (
          <View style={tabStyles.container}>
            <SearchBaggage baggageHook={baggageHook} />
            <SearchScertificate scertificateHook={scertificateHook} />
            <SearchBCertificate bcertificateHook={bcertificateHook} />
            <SearchDLicence dlicenceHook={dlicenceHook} />
            <SearchNatId natIdHook={natIdHook} />
            <SearchPassport passportHook={passportHook} />
          </View>
        )}
      </SafeAreaView>

    </View>
  )
}

export default Search
