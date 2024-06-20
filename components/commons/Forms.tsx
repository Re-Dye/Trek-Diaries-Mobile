import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { icons } from '../../constants';

export default function Forms({
  keyboardType,
  title,
  value,
  placeholder,
  onChangeText,
  defaultValue,
  otherStyles,
}: {
  title: string;
  value: string;
  placeholder: string;
  onChangeText: (e: string) => void;
  otherStyles?: string;
  defaultValue?: string;
  keyboardType?: 'email-address' | 'default';
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full flex-row h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center ">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          defaultValue={defaultValue}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={onChangeText}
          secureTextEntry={(title === 'Password' || title === 'Confirm Password') && !showPassword}
        />
        {(title === 'Password' || title === 'Confirm Password') && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
