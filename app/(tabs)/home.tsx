import { View, ScrollView } from 'react-native';
import React from 'react';
import FeedCard from '@/components/FeedCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <SafeAreaView className=" h-full mt-2 bg-primary">
      <ScrollView>
        <View>
          <SearchBar />
          {/* <FeedCard /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
