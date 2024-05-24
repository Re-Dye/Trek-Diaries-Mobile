import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { getStorateItemAsync } from '@/lib/storage';
import { useSessionStore } from '@/lib/zustand/session';
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  const { setSession } = useSessionStore();

  useEffect(() => {
    (async () => {
      const session = await getStorateItemAsync('session');
      if (session) {
        setSession(JSON.parse(session));
      }
    })();
  }, []);

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="/search/[query]" options={{ headerShown: false }} /> */}
      </Stack>
    </QueryClientProvider>
  );
}
