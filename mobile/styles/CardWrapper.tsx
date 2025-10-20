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
    backgroundColor: 'inherit', //#fff
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'inherit', //#E5E7EB
    // elevation / shadow for native
    shadowColor: 'inherit', //#000
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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