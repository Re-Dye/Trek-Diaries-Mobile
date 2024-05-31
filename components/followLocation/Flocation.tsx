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
    <View>
      <TouchableOpacity onPress={handleClick}>
        <FontAwesome6 name="location-dot" size={24} color="black" />
        <Text className="text-black">{address}</Text>
      </TouchableOpacity>
    </View>
  );
}
