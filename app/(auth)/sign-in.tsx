import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import Forms from '@/components/Forms';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import { Session, sessionSchema } from '@/lib/zodSchema/session';
import { useMutation } from '@tanstack/react-query';

export default function SignIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const { mutate: signin, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      return { status: res.status, data: await res.json() };
    },
    onSuccess: ({ data, status }) => {
      if (status === 200) {
        const session: Session = sessionSchema.parse(data);
        setSession(session);
        router.push('/home');
      } else if (status === 400) {
        alert(data);
      } else {
        alert('Server Error occured. Please try again later.');
      }
    },
    onError: (error) => {
      console.log('Error', error);
      alert('Some error occured. Please try again later.');
    },
  });

  const { setSession } = useSessionStore();

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[200px] h-[50px]" />
          <Text className="text-2xl text-white font-psemibold mt-10">Login to TrekDiaries</Text>
          <Forms
            title="Email"
            placeholder="ram@gmail.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <Forms
            title="Password"
            placeholder="enter your password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={signin}
            containerStyles="mt-7"
            isLoading={isPending}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href="/sign-up" className="text-sm font-psemibold text-green-500">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
