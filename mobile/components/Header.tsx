import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabStyles } from '@/styles/tabStyles';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const externalStyles = useTabStyles();

  return (
    <View style={[
      styles.headerContainer,
      { top: insets.top }, // Dynamic positioning
      externalStyles.header
    ]}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Header;