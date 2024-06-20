import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function CustomButton({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  disabled,
}: {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        handlePress();
      }}
      activeOpacity={0.7}
      className={`bg-green-500 rounded-xl justify-center items-center min-h-[62px] ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading || disabled}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
}
