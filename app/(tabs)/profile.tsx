import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import CustomButton from '@/components/commons/CustomButton';
import { useSessionStore } from '@/lib/zustand/session';
import { setStorageItemAsync } from '@/lib/storage';
import { useRouter, router, Redirect } from 'expo-router';
import Fbar from '@/components/followLocation/Fbar';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Profile() {
  const { clearSession } = useSessionStore();
  const router = useRouter();

  const { session } = useSessionStore();

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const handleLogout = async () => {
    await setStorageItemAsync('session', null);
    clearSession();
    router.push('/sign-in');
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="min-h-[60vh] p-3 justify-center">
          <View className="flex-row justify-center items-center space-x-2">
            <Text className="text-2xl font-bold text-sky-500">Followed Locations</Text>
            <FontAwesome6 name="magnifying-glass-location" size={24} color="mediumseagreen" />
          </View>
          <View className="mt-5">{session && <Fbar />}</View>
          <View>
            <CustomButton title="Logout" handlePress={handleLogout} containerStyles="mt-8" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
