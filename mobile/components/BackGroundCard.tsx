import { Image, StyleSheet } from 'react-native';
import React from 'react';

const BackGroundCard = () => {
  return (
    <Image
      source={require('../assets/images/map.jpg')}
      style={styles.background}
      resizeMode="cover" // Ensures the image covers the entire area
    />
  );
};

const styles = StyleSheet.create({ // Styles for the background image
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.25,
  },
});

export default BackGroundCard;