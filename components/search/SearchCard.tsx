import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { images } from '@/constants';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import Entypo from '@expo/vector-icons/Entypo';

export default function SearchCard() {
  return (
    <View>
      <View className="m-3 p-4 bg-black-100 rounded-2xl">
        <View className="flex-row m-2 items-center">
          <View className="mr-4">
            <Entypo name="location" size={24} color="white" className="m" />
          </View>
          <View>
            <Text className="text-white font-psemibold"> Location Name</Text>
          </View>
        </View>
        <View className="m-2">
          <Text className="text-white font-pbook">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </Text>
        </View>
      </View>
    </View>
  );
}
