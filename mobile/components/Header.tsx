import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabStyles } from '@/styles/tabStyles';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const styles = tabStyles();

  return (
    <View style={[
      {
        position: 'absolute',
        top: insets.top,
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
      },
      styles.header
    ]}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
        {title}
      </Text>
    </View>
  );
};

export default Header;