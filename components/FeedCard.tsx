import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { images } from '@/constants';

export default function FeedCard() {
  return (
    <View>
      <View className="m-3 p-4 bg-black-100 rounded-2xl">
        <View className="flex-row items-center mt-4 gap-5 p-2 relative">
          <View>
            <Image source={images.userLogo} className="w-14 h-14" resizeMode="contain" />
          </View>
          <View className="flex-row space-x-2">
            <View className="flex-col">
              <Text className="text-white  font-psemibold">Username</Text>
              <Text className="text-slate-400 font-pmedium text-[12px]">Location</Text>
            </View>
            <Text className="text-slate-500 font-pbook text-[12px] ml-4 mt-[2px]">12h</Text>
          </View>
          <View className="absolute right-3 top-5">
            <TouchableOpacity className="hover:text-gray-500">
              <SimpleLineIcons name="user-follow" size={20} color="white" />
              {/* <SimpleLineIcons name="user-following" size={20} color="white" /> */}
            </TouchableOpacity>
          </View>
        </View>
        <View className="m-2">
          <Text className="text-white font-pbook my-2 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste cum, quo error officia
            officiis vitae ipsam enim magnam excepturi ratione beatae inventore. Cumque aliquam
            blanditiis temporibus. Harum tempore expedita vitae.
          </Text>
        </View>
        <View className="my-2 rounded-2xl">
          <Image source={images.userLogo} className="w-full h-200" resizeMode="contain" />
        </View>
        <View className="flex-row space-x-4 items-center my-2">
          <Ionicons name="heart" size={32} color="red" />
          <FontAwesome5 name="comment-alt" size={25} color="grey" />
        </View>
      </View>
    </View>
  );
}
