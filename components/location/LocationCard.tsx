import { View, Text } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';

export default function LocationCard({
  address,
  description,
}: {
  address: string;
  description: string;
}) {
  return (
    <View>
      <View className="m-3 p-4 bg-black-100 rounded-2xl">
        <View className="flex-row m-2 items-center">
          <View className="mr-4">
            <Entypo name="location" size={24} color="white" className="m" />
          </View>
          <View>
            <Text className="text-white font-psemibold">{address}</Text>
          </View>
        </View>
        <View className="m-2">
          <Text className="text-white font-pbook">{description}</Text>
        </View>
      </View>
    </View>
  );
}
