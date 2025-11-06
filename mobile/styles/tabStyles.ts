// Static styles created once
const staticStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  baseContainer: {
    flexGrow: 1,
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 80; // Actual tab bar height
export const EXTRA_SPACE = 40;    // Extra space to avoid content being too close to the tab bar
export const HEADER_TOP_SPACING = 60; // Spacing for header top padding

export const useTabStyles = () => {
  const insets = useSafeAreaInsets();

  return {
    ...staticStyles,
    container: [
      staticStyles.baseContainer,
      { paddingBottom: TAB_BAR_HEIGHT + EXTRA_SPACE + insets.bottom }
    ],
  };
};
