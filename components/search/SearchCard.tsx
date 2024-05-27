import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { images } from '@/constants';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';

export default function SearchCard({
  id,
  address,
  description,
}: {
  id: string;
  address: string;
  description: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/location/${id}`);
  };
  return (
    <View>
      <View className="m-3 p-4 bg-black-100 rounded-2xl">
        <View className="flex-row m-2 items-center">
          <View className="mr-4">
            <Entypo name="location" size={24} color="white" className="m" />
          </View>
          <View>
            <Text className="text-white font-psemibold" onPress={handleClick}>
              {address}
            </Text>
          </View>
        </View>
        <View className="m-2">
          <Text className="text-white font-pbook">{description}</Text>
        </View>
      </View>
    </View>
  );
}
