import { View, Text, Image } from 'react-native';
import { images } from '@/constants';
import React from 'react';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';

export default function CommentCard({
  content,
  owner,
  registeredTime,
}: {
  content: string;
  owner: string;
  registeredTime: string;
}) {
  const registered_Time = handleRegisteredTime(registeredTime);
  return (
    <View className="flex-col mt-4 p-2 bg-black-100 rounded-xl">
      <View className="flex-row items-center gap-3">
        <View className="flex-row">
          <Image source={images.userLogo} className="w-10 h-10" resizeMode="contain" />
        </View>
        <View className="flex-col">
          <Text className="text-white  font-psemibold">{owner}</Text>
          <Text className="text-slate-500 font-pbook text-[12px]">{registered_Time}</Text>
        </View>
      </View>
      <View>
        <Text className="text-white font-pmedium mt-2">{content}</Text>
      </View>
    </View>
  );
}
