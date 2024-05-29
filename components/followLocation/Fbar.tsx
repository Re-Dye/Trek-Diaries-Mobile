import React from 'react';
import { View } from 'react-native';
import Flocation from './Flocation';
import { useLocationStore } from '@/lib/zustand/location';

export default function Fbar() {
  const locations = useLocationStore((state) => state.locations);
  return (
    <View className="flex-column">
      {locations.map((location) => (
        <Flocation key={location.locationId} id={location.locationId} address={location.address} />
      ))}
    </View>
  );
}
