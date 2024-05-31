import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

export default function Flocation({ id, address }: { id: string; address: string }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/location/${id}`);
  };
  return (
    <View className='flex-col'>
      <TouchableOpacity onPress={handleClick} className='flex-row space-x-2 mt-4'>
        <FontAwesome6 name="location-dot" size={24} color="red" />
        <Text className="text-white font-semibold">{address}</Text>
      </TouchableOpacity>
    </View>
  );
}
