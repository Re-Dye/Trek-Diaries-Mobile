import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

export default function Forms({title, value, placeholder, handleChangeText,
otherStyles, ...props}) {

  const[showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full flex-row h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center ">
        <TextInput 
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
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
