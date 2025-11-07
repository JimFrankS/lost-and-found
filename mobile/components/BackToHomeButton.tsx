import { TouchableOpacity, Text, View } from 'react-native';

interface BackToHomeButtonProps {
  onPress: () => void;
  onToggle?: () => void;
  toggleLabel?: string;
}

const BackToHomeButton = ({ onPress, onToggle, toggleLabel }: BackToHomeButtonProps) => (
  <View className="flex-row mb-4">
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-500 p-3 rounded-lg flex-1 mr-2 flex-row items-center justify-center"
      accessibilityRole="button"
      accessibilityLabel="Go back to home screen"
    >
      <Text className="text-white text-center text-base font-semibold">
        ← Back to Home
      </Text>
    </TouchableOpacity>
    {onToggle && toggleLabel && (
      <TouchableOpacity
        onPress={onToggle}
        className="bg-blue-500 p-3 rounded-lg flex-1 ml-2 flex-row items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel={toggleLabel}
      >
        <Text className="text-white text-center text-base font-semibold">
          {toggleLabel}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

export default BackToHomeButton;