import React from 'react';
import { View, Modal, StyleSheet, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ModalWrapperProps {
  visible: boolean;
  children: React.ReactNode;
  transparent?: boolean;
  onClose?: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  children,
  transparent = true,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={transparent}
      onRequestClose={() => onClose?.()}
    >
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
        // Tapping on backdrop should close modal
        onStartShouldSetResponder={() => true}
        onResponderRelease={(e) => {
          // Only trigger close if release happens on the backdrop and not on content
          // We'll rely on the content wrapper to stop propagation via pointerEvents
          onClose?.();
        }}
      >
        <View style={styles.contentWrapper} pointerEvents="box-none">
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