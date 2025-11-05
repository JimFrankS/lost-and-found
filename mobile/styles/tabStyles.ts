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
    paddingBottom: 120, // Add padding to account for the absolute positioned tab bar and gradient (80px height + 40px extra space)
  },
  content: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    maxWidth: 800, // Constrain width on large screens
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
  },
});
