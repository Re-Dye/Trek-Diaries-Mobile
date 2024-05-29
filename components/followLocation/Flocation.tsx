import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useRouter } from "expo-router";

export default function Flocation({ id, address }: { id: string; address: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/location/${id}`);
  };

  return (
    <View
      className="flex gap-1 lg:gap-2 items-center truncate hover:text-blue-400 text-[8px] sm:text-xs lg:text-lg"

    >
      <TouchableOpacity onPress={handleClick}>
        <FontAwesome6 name="location-dot" size={24} color="white" />
        <Text className='text-white'>{address}</Text>
      </TouchableOpacity>
    </View>
  );
}
