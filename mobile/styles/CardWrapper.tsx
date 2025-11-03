import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type CardWrapperProps = {
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const CardWrapper = ({ onPress, children, style, accessibilityLabel }: CardWrapperProps) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={styles.touchable}
      >
        {children ?? <Text style={styles.fallbackText}>Action</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center', // center inner touchable horizontally
  },
  touchable: {
    width: '100%',
    maxWidth: 760, // constrain on large screens / web
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'rgba(107, 114, 128, 0.5)', // more visible border (gray-500 with higher opacity)
    // Remove elevation and shadows for transparent background
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CardWrapper;