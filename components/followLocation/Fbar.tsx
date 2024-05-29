import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Flocation from './Flocation';
import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from '@/lib/zustand/location';
import { useSessionStore } from '@/lib/zustand/session';
import Toast from 'react-native-toast-message';

export default function Fbar() {
  const { session } = useSessionStore();
  const locations = useLocationStore((state) => state.locations);
  const setLocations = useLocationStore((state) => state.setLocations);
  const { data, error, status } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await fetch(`/api/location/follow?userId=${session?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      const message = await res.json();
      const status = res.status;
      return { message, status };
    },
  });

  useEffect(() => {
    if (status === 'success') {
      if (data === undefined) {
        console.log('Null data received');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error occurred while following location. Please try again later.',
        });
        return;
      }
      if (data.status === 200) {
        setLocations(data.message);
        return;
      } else if (data.status === 400) {
        console.log(data.message);
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: 'Please try again later with proper information.',
        });
      } else {
        console.log(data.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error occurred while following location. Please try again later.',
        });
      }
    }

    if (status === 'error') {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error occurred while following location. Please try again later.',
      });
    }
  }, [status, data]);
  console.log(locations);
  return (
    <View className="flex-column">
      {locations.map((location) => (
        <Flocation key={location.locationId} id={location.locationId} address={location.address} />
      ))}
    </View>
  );
}
