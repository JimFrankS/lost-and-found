import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

/**
 * A container component that centers content and constrains width on large screens
 * while maintaining full width on mobile devices
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  style,
  maxWidth = 800 
}) => {
  return (
    <View style={[styles.container, { maxWidth }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center', // Center the container horizontally
  },
});

export default ResponsiveContainer;