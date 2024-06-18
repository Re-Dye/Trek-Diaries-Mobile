import { View, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/search/SearchBar';
import PostFeed from '@/components/home/PostFeed';
import { Redirect, router } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';

export default function Home() {
  const { session } = useSessionStore();

  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefetchComplete = useCallback(() => {
    setRefreshing(false);
    setRefreshTrigger((prev) => !prev); // Trigger refresh in PostFeed
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Call refetch indirectly through refreshTrigger change in PostFeed
    setRefreshTrigger((prev) => !prev);
  }, []);

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  return (
    <SafeAreaView className=" h-full mt-2 bg-primary">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          <SearchBar initialQuery="" />
          {session && (
            <PostFeed
              userId={session.id}
              refreshTrigger={refreshTrigger}
              onRefetchComplete={handleRefetchComplete}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
