import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from '@/components/CustomButton';
import { useSessionStore } from '@/lib/zustand/session';
import { setStorageItemAsync } from '@/lib/storage';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { clearSession } = useSessionStore();
  const router = useRouter();
  
  const handleLogout = () => {
    (async () => {
      await setStorageItemAsync('session', null);
      clearSession();
      router.push('/sign-in');
    })();
  }

  return (
    <View>
      <Text>Profile</Text>
      <CustomButton
        title="Logout"
        handlePress={handleLogout}
        containerStyles="mt-7"
      />
    </View>
  );
}
