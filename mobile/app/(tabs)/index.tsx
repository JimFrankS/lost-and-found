import { View, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackGroundCard from '@/components/BackGroundCard';
import { useTabStyles } from '@/styles/tabStyles';

import ReportScreen from '@/components/screens/ReportScreen';
import SearchScreen from '@/components/screens/SearchScreen';
import { Feather } from '@expo/vector-icons';
import { useNavigationWithLoading } from '@/components/useNavigationWithLoading';
import Header from '@/components/Header';


const HomeScreen = () => {
  const { activeScreen, isLoading, navigate } = useNavigationWithLoading('home');
  const handleNavigation = (screen: 'search' | 'report') => navigate(screen);
  const styles = useTabStyles();
  const handleBackToHome = () => navigate('home');

  // Show loading indicator during transitions
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <BackGroundCard />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  // If a screen is active, render only that screen
  if (activeScreen === 'search') {
    return (
      <SearchScreen onBack={handleBackToHome} onToggleToReport={() => navigate('report')} />
    );
  }

  if (activeScreen === 'report') {
    return (
      <ReportScreen onBack={handleBackToHome} onToggleToSearch={() => navigate('search')} />
    );
  }

  // Otherwise, show the home screen with buttons
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <BackGroundCard />
      <SafeAreaView style={styles.safeArea}>
        {/* Sticky Header */} 
        <Header title="Home" />
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
