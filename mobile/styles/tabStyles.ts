import { StyleSheet } from 'react-native';

export const tabStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'relative',
    alignItems: 'center', // Center content horizontally on large screens
    paddingHorizontal: 16, // Add horizontal padding
  },
  content: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    maxWidth: 800, // Constrain width on large screens
  },
});