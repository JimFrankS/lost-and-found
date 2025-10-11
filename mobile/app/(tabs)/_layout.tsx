import { Tabs } from 'expo-router'
import React from 'react'
import { Text } from 'react-native' 
import { Feather } from '@expo/vector-icons' // icon library
import { useSafeAreaInsets } from 'react-native-safe-area-context' // to handle safe area insets which is useful for devices with notches or rounded corners


const TabsLayout = () => {

    const insets = useSafeAreaInsets(); // get the safe area insets
  return (
    <Tabs screenOptions={{ 
        headerShown: false, // hide headers for each tab
        tabBarShowLabel: false, // hide tab labels for each tab
         tabBarActiveTintColor: '#1DA1F2', // active tab color
        tabBarInactiveTintColor: '#657786', // inactive tab color

        tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1, // border width
            borderTopColor: '#E1E8ED', // border color
            height: 50 + insets.bottom, // height of tab bar plus safe area inset
            paddingTop: 8, // padding top
        },
        }}> 
        <Tabs.Screen
        name='index'
        options={{
            title : "",
            tabBarLabel: () => <Text>Home</Text>,
            tabBarIcon: ({color, size}) => <Feather name='home' size={size} color={color} />
        }}
        />
        <Tabs.Screen
        name='search'
        options={{
            title : "",
            tabBarLabel: () => <Text>Search</Text>,
            tabBarIcon: ({color, size}) => <Feather name='search' size={size} color={color} />
        }}
        />
        
    </Tabs>
  )
}

export default TabsLayout