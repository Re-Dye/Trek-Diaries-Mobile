// app/search/[query].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SearchCard from '@/components/search/SearchCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ReturnLocation } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';
import LocationFeed from '@/components/location/LocationFeed';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const SearchResults = () => {
  const { locationID } = useLocalSearchParams();
  const { session } = useSessionStore();
  const [location, setLocation] = useState<ReturnLocation | null>(null);
  const { data, isPending } = useQuery({
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

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    if (data.status === 200) {
      const location: ReturnLocation = data.json;
      setLocation(location);
    }

    if (data.status === 400) {
      alert(data.json);
      router.push('/home');
    }

    if (data.status === 500) {
      alert('Some error occurred. Please try again later.');
      router.push('/home');
    }

    if (data.status === 401) {
      alert('Unauthorized. Please login first.');
      router.push('/sign-in');
    }
  }, [data]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View>
          {isPending || location === null ? (
            <Text>Loading...</Text>
          ) : (
            <View>
              <View className='flex m-3 bg-black-100 rounded-2xl'>
                <SearchCard
                  id={location.id}
                  address={location.address}
                  description={location.description}
                />
                <View className='flex-row gap-8 justify-center items-center mb-4'>
                  <TouchableOpacity className="hover:text-gray-500 border-2 bg-primary px-4 py-2 border-green-500 rounded-xl flex-row items-center space-x-2">
                    <Text className='font-medium uppercase text-white'>Follow</Text>
                    <SimpleLineIcons name="user-follow" size={15} color="white" />
                    {/* <SimpleLineIcons name="user-following" size={20} color="white" /> */}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>router.push("/add/post")}
                    className='hover:text-gray-500 border-2 bg-primary px-4 py-2 border-green-500 rounded-xl flex-row items-center space-x-2'
                    >
                    <Text className='font-medium uppercase text-white'>Add Post</Text>
                    <Ionicons name="add-circle" size={15} color="white" />
                  </TouchableOpacity>
                  </View>
              </View>
              <View>
                <LocationFeed locationId={location.id} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;
