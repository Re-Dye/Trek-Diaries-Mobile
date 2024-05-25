import { View, ScrollView, Text } from 'react-native';
import React from 'react';
import FeedCard from '@/components/FeedCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/SearchBar';
import PostFeed from '@/components/PostFeed';
import { TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  return (
    <SafeAreaView className=" h-full mt-2 bg-primary">
      <ScrollView>
        <View>
          <SearchBar initialQuery="" />
          {/* <FeedCard /> */}
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              router.push(`/location/hehe`);
            }}
          >
            <View className="w-11/12 h-12 m-4 items-center justify-center bg-white p-4">
              <Text className="text-black">Dummy Location Page</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
