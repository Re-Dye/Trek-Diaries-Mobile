import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ReturnLocation } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';
import LocationFeed from '@/components/location/LocationFeed';
import { Ionicons } from '@expo/vector-icons';
import LocationCard from '@/components/location/LocationCard';
import FollowButton from '@/components/location/FollowButton';
import Toast from 'react-native-toast-message';

const SearchResults = () => {
  const { locationID } = useLocalSearchParams();
  const { session } = useSessionStore();

  const [location, setLocation] = useState<ReturnLocation | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const { data, isPending, refetch } = useQuery({
    queryKey: ['search', locationID],
    queryFn: async () => {
      const res = await fetch(`/api/location?locationId=${locationID}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      const status = res.status;
      const json = await res.json();
      return { status, json };
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
      setRefreshTrigger((prev) => !prev); // Trigger refresh in LocationFeed
    });
  }, [refetch]);

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    if (data.status === 200) {
      const location: ReturnLocation = data.json;
      setLocation(location);
    } else if (data.status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Request',
        text2: 'Please try again with valid parameters',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 15,
        keyboardOffset: 20,
      });
      router.push('/home');
    } else if (data.status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Some error occurred. Please try again later.',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 15,
        keyboardOffset: 20,
      });
      router.push('/home');
    } else if (data.status === 401) {
      Toast.show({
        type: 'error',
        text1: 'Unauthorized',
        text2: 'Please login to view feed',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 15,
        keyboardOffset: 20,
      });
      router.push('/sign-in');
    }
  }, [data]);

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
          {isPending || location === null ? (
            <ActivityIndicator
              size="large"
              color="#00ff00"
              className="flex justify-center items-center"
            />
          ) : (
            <View>
              <View className="flex m-3 bg-black-100 rounded-2xl">
                <LocationCard address={location.address} description={location.description} />
                <View className="flex-row gap-8 justify-center items-center mb-4">
                  <View>
                    <FollowButton locationID={location!.id} userId={session!.id} />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(`Inside on press: ${locationID}`);
                      router.push(`/createPost/${locationID}`);
                    }}
                    className="hover:text-gray-500 border-2 bg-primary px-4 py-2 border-green-500 rounded-xl flex-row items-center space-x-2"
                  >
                    <Text className="font-medium uppercase text-white">Add Post</Text>
                    <Ionicons name="add-circle" size={15} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <LocationFeed locationId={location.id} refreshTrigger={refreshTrigger} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;
