import { Redirect, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSessionStore } from '@/lib/zustand/session';

export default function AuthLayout() {
  const { session } = useSessionStore();

  if (session && new Date < new Date(session.ein + session.iat)) {
    return <Redirect href={'/home'} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            title: 'SignIn',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            title: 'SignUp',
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="#161622" />
    </>
  );
}
