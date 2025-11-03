import React from 'react';
import { View, Modal, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ModalWrapperProps {
  visible: boolean;
  children: React.ReactNode;
  transparent?: boolean;
}

/**
 * A reusable modal wrapper that provides:
 * - Transparent background with blur effect
 * - Width constraint on large screens
 * - Safe area insets
 * - Consistent styling across all modals
 */
const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  children,
  transparent = false
}) => {
  const insets = useSafeAreaInsets();

  console.log('ModalWrapper: transparent prop:', transparent);
  console.log('ModalWrapper: visible:', visible);

  return (
    <Modal visible={visible} animationType="slide" transparent={transparent}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }
        ]}
      >
        <View style={styles.contentWrapper}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.9)', // Semi-transparent white background
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600, // Constrain width on large screens
    alignSelf: 'center', // Center on large screens
  },
});

export default ModalWrapper;