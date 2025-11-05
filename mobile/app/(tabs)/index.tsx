import { View, ScrollView, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundCard from '@/components/BackGroundCard';
import { tabStyles } from '@/styles/tabStyles';

import ReportScreen from '@/components/screens/ReportScreen';
import SearchScreen from '@/components/screens/SearchScreen';
import { Feather } from '@expo/vector-icons';


const HomeScreen = () => {
  const [activeScreen, setActiveScreen] = useState<'home' | 'search' | 'report'>('home');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (screen: 'search' | 'report') => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveScreen(screen);
      setIsLoading(false);
    }, 500);
  };

  const handleBackToHome = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveScreen('home');
      setIsLoading(false);
    }, 500);
  };

  // Show loading indicator during transitions
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <BackGroundCard />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    );
  }

  // If a screen is active, render only that screen
  if (activeScreen === 'search') {
    return (
      <SearchScreen onBack={handleBackToHome} onToggleToReport={() => {
        setIsLoading(true);
        setTimeout(() => {
          setActiveScreen('report');
          setIsLoading(false);
        }, 500);
      }} />
    );
  }

  if (activeScreen === 'report') {
    return (
      <ReportScreen onBack={handleBackToHome} onToggleToSearch={() => {
        setIsLoading(true);
        setTimeout(() => {
          setActiveScreen('search');
          setIsLoading(false);
        }, 500);
      }} />
    );
  }

  // Otherwise, show the home screen with buttons
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
            Home
          </Text>
        </View>
        <View className="flex-1 justify-center items-center px-4" style={{ paddingTop: 60 }}>
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
