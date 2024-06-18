import { View, Text, Image, ImageSourcePropType, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { icons } from '../../constants';
import { useSessionStore } from '@/lib/zustand/session';
import { useLocationStore } from '@/lib/zustand/location';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
const TabIcon = ({
  icon,
  color,
  name,
  focused,
}: {
  icon: ImageSourcePropType | undefined;
  color: string;
  name: string;
  focused: boolean;
}) => {
  const { session } = useSessionStore();

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
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: 'Please try again later with proper information.',
        });
      } else {
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
  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  return (
    <View className="flex items-center justify-center gap-2">
      <Image source={icon} resizeMode="contain" tintColor={color} className="w-6 h-6" />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.explore} color={color} name="Explore" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
            ),
          }}
        />
      </Tabs>
      <StatusBar barStyle="light-content" backgroundColor="#161622" />
    </>
  );
}
