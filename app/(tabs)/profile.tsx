import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { Suspense } from 'react';
import CustomButton from '@/components/commons/CustomButton';
import { useSessionStore } from '@/lib/zustand/session';
import { setStorageItemAsync } from '@/lib/storage';
import { useRouter, router, Redirect } from 'expo-router';
import Fbar from '@/components/followLocation/Fbar';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Preferences from '@/components/commons/Preferences';
import { useQuery } from '@tanstack/react-query';
import { ReturnPreference } from '@/lib/zodSchema/dbTypes';

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

  const {
    data: preference,
    isPending: isPreferencePending,
    isError: isPreferenceError,
  } = useQuery({
    queryKey: ['preference', session?.id],
    queryFn: async () => {
      try {
        const res: Response = await fetch(`/api/preference?userId=${session?.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        });
        const json: ReturnPreference | string = await res.json();
        const status = res.status;

        return { json, status };
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (isPreferenceError) {
    throw new Error('Error while loading preferences.');
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="min-h-[85vh] my-20 p-3 space-y-12">
          <View className="flex-col space-y-3 bg-black-100 p-5 rounded-2xl">
            <View className="flex-row justify-center items-center space-x-2">
              <Text className="text-2xl font-bold text-sky-500">Followed Locations</Text>
              <FontAwesome6 name="magnifying-glass-location" size={24} color="mediumseagreen" />
            </View>
            <View className="mt-2">{session && <Fbar />}</View>
          </View>
          <View>{preference && <Preferences preference={preference!.json} />}</View>
          <View>
            <CustomButton title="Logout" handlePress={handleLogout} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
