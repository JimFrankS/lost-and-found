import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundCard from '@/components/BackGroundCard';
import { tabStyles } from '@/styles/tabStyles';

import ReportScreen from '@/components/screens/ReportScreen';
import SearchScreen from '@/components/screens/SearchScreen';
import { Feather } from '@expo/vector-icons';


const HomeScreen = () => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'search' | 'report'>('home');

  const handleNavigation = (screen: 'search' | 'report') => {
    setActiveScreen(screen);
  };

  const handleBackToHome = () => {
    setActiveScreen('home');
  };

  // If a screen is active, render only that screen
  if (activeScreen === 'search') {
    return <SearchScreen onBack={handleBackToHome} />;
  }

  if (activeScreen === 'report') {
    return <ReportScreen onBack={handleBackToHome} />;
  }

  // Otherwise, show the home screen with buttons
  return (
    <View style={{ flex: 1 }}>
      <BackGroundCard />
      <SafeAreaView style={tabStyles.safeArea}>
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full max-w-md">
            <TouchableOpacity
              onPress={() => handleNavigation('report')}
              className="bg-blue-400 border  border-gray-100 p-3 rounded-2xl mb-4 flex-row items-center justify-center"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Report Lost Items"
              accessibilityHint="Opens the report lost items screen"
            >

                <Feather name='edit' size={20} color={"black"} className="mr-8" />
              <Text className="text-gray-900 text-center text-base font-bold">
                Report Lost Items
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigation('search')}
              className="bg-green-400 border  border-gray-100 p-3 rounded-2xl flex-row items-center justify-center"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Search for Lost Items"
              accessibilityHint="Opens the search for lost items screen"
            >
                <Feather name='search' size={20} color={"black"} className="mr-8" />
              <Text className="text-gray-900 text-center text-base font-bold">
                Search for Lost Items
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
