import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 80; // Actual tab bar height
const EXTRA_SPACE = 40;    // Extra space to avoid content being too close to the tab bar

export const tabStyles = () => {
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      position: 'relative',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: TAB_BAR_HEIGHT + EXTRA_SPACE + insets.bottom,
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
};