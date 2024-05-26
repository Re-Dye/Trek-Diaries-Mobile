import { View, ScrollView, Text } from 'react-native';
import React from 'react';
import FeedCard from '@/components/FeedCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/SearchBar';
import PostFeed from '@/components/PostFeed';
import { TouchableOpacity, Image, Alert } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';

export default function Home() {
  const { session } = useSessionStore();

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/home'} />;
  }

  return (
    <SafeAreaView className=" h-full mt-2 bg-primary">
      <ScrollView>
        <View>
          <SearchBar initialQuery="" />
          {session && <PostFeed userId={session.id} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DummyLocation() {
  return (
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
  );
}
