
import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackGroundCard from './BackGroundCard';

const ModalWrapper: React.FC<{
  visible: boolean;
  children: React.ReactNode;
  transparent?: boolean;
  onClose?: () => void;
}> = ({
  visible,
  children,
  transparent = false,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768; // Tablet or larger

  return (
    <Modal
      visible={visible}
      animationType={isLargeScreen ? "fade" : "slide"}
      transparent={transparent}
      onRequestClose={() => { if (!transparent) onClose?.(); }}
    >
      {transparent ? (
        <View style={styles.transparentContainer}>
          {children}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={[
              styles.container,
              isLargeScreen && styles.largeScreenContainer,
              {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
              }
            ]}
          >
            {isLargeScreen && <BackGroundCard />}
            <TouchableWithoutFeedback>
              <View style={[
                styles.contentWrapper,
                isLargeScreen && styles.largeScreenContentWrapper
              ]}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.9)', // Semi-transparent white background
  },
  transparentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  largeScreenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600, // Constrain width on large screens
    alignSelf: 'center', // Center on large screens
  },
  largeScreenContentWrapper: {
    flex: 0, // Not flex on large screens
    width: '90%',
    maxWidth: 600,
    minHeight: '70%', // Increased minimum height for better usability
    maxHeight: '95%', // Increased maximum height for more space
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
});

export default ModalWrapper;
