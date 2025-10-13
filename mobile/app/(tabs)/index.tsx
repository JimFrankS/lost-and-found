import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import BackGroundCard from '@/components/BackGroundCard'
import { tabStyles } from '@/styles/tabStyles'

const HomeScreen = () => {
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

export default HomeScreen