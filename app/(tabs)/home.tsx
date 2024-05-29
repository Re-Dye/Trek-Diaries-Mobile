import { View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/search/SearchBar';
import PostFeed from '@/components/home/PostFeed';
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
