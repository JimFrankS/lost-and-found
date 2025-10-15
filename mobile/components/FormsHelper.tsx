import React from 'react';
import { Modal, View, ScrollView, TouchableOpacity, Text } from 'react-native';

// Text helpers
export const toTitleCase = (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()); // Function to convert a string to title case

// Generic option picker modal
export interface OptionPickerProps { // Props for the OptionPicker component
  visible: boolean;
  title: string;
  options: readonly string[] | string[];
  onSelect: (value: string) => void;
  onClose: () => void;
  getLabel?: (value: string) => string;
}

export const OptionPicker = ({ visible, title, options, onSelect, onClose, getLabel }: OptionPickerProps) => { // Function to render a modal for selecting options from a list
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-xl p-4 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {options.map((opt) => (
              <TouchableOpacity
                key={String(opt)}
                className="py-3 border-b border-gray-100"
                onPress={() => {
                  onSelect(String(opt));
                  onClose();
                }}
              >
                <Text className="text-base">{getLabel ? getLabel(String(opt)) : toTitleCase(String(opt))}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Reusable select field (label + touchable)
export interface SelectFieldProps { // Props for the SelectField component
  label: string;
  value?: string;
  displayValue?: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}

export const SelectField = ({ label, value, displayValue, placeholder, onPress, disabled }: SelectFieldProps) => { // Function to render a select field with label and touchable area
  const showText = displayValue ?? (value ? toTitleCase(value) : '');
  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-gray-600 mb-2">{label}</Text>
      <TouchableOpacity
        className={`border border-gray-300 rounded p-3 ${disabled ? 'bg-gray-100' : ''}`}
        onPress={onPress}
        disabled={disabled}
      >
        <Text className={value ? 'text-black' : 'text-gray-400'}>
          {value ? showText : placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


// This file includes utility functions, regex definitions, and reusable components for option selection and form fields, which I integrated into integrated into the main report baggage modal to streamline the user interface and improve code maintainability.