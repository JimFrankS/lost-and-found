import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackGroundCard from '@/components/BackGroundCard'

const Search = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackGroundCard />
        <View style={styles.content}>
          
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default Search