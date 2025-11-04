import { TouchableOpacity, Text } from 'react-native';

interface BackToHomeButtonProps {
  onPress: () => void;
}

const BackToHomeButton = ({ onPress }: BackToHomeButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-gray-500 p-3 rounded-lg mb-4 flex-row items-center justify-center"
    accessibilityRole="button"
    accessibilityLabel="Go back to home screen"
  >
    <Text className="text-white text-center text-base font-semibold">
      ← Back to Home
    </Text>
  </TouchableOpacity>
);

export default BackToHomeButton;