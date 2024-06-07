import { View, ScrollView, Text } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/search/SearchBar';
import { Redirect, useRouter } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import ExploreFeed from '@/components/explore/ExploreFeed';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export default function Explore() {
  const { session } = useSessionStore();
  const router = useRouter();

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const { data: locations, isPending } = useQuery({
    queryKey: ['get-recommendations', session.id],
    queryFn: async () => {
      const res = await fetch(`/api/recommendation/locations?userId=${session.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      const json: { recommended_locations: string[] } = await res.json();
      return {
        json,
        status: res.status,
      };
    },
  });

  useEffect(() => {
    if (!locations) return;

    if (locations?.status === 401) {
      router.push('/sign-in');
    } else if (locations?.status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Request',
        text2: 'Please try again with valid parameters',
      });
    } else if (locations?.status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
      });
    } else if (locations?.status === 404) {
      Toast.show({
        type: 'error',
        text1: 'Preference not found',
        text2: 'Please set your preferences',
      });
    }
  }, [locations?.status]);

  return (
    <SafeAreaView className=" h-full mt-2 bg-primary">
      <ScrollView>
        <View>
          <SearchBar initialQuery="" />
          {isPending ? (
            <Text>Loading...</Text>
          ) : (
            session &&
            !isPending &&
            locations?.json &&
            <ExploreFeed userId={session.id} locations={locations.json.recommended_locations} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
