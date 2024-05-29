import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from '@/components/commons/CustomButton';
import { useSessionStore } from '@/lib/zustand/session';
import { setStorageItemAsync } from '@/lib/storage';
import { useRouter, router, Redirect } from 'expo-router';
import Fbar from '@/components/followLocation/Fbar';

export default function Profile() {
  const { clearSession } = useSessionStore();
  const router = useRouter();

  const { session } = useSessionStore();

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/profile'} />;
  }

  const handleLogout = () => {
    (async () => {
      await setStorageItemAsync('session', null);
      clearSession();
      router.push('/sign-in');
    })();
  };

  return (
    <View className="flex-col">
      <View>
        <Text className="text-black">Profile</Text>
      </View>
      <View>
        <CustomButton title="Logout" handlePress={handleLogout} containerStyles="mt-7" />
      </View>
      <View>{session && <Fbar />}</View>
    </View>
  );
}
