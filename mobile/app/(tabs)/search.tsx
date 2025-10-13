import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackGroundCard from '@/components/BackGroundCard'
import { tabStyles } from '@/styles/tabStyles'

const Search = () => {
  return (
    <SafeAreaView style={tabStyles.safeArea}>
      <View style={tabStyles.container}>
        <BackGroundCard />
        <View style={tabStyles.content}>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default Search