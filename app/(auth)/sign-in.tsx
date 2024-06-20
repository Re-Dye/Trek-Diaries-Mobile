import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import Forms from '@/components/commons/Forms';
import CustomButton from '@/components/commons/CustomButton';
import { Link, router } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import { Session, sessionSchema } from '@/lib/zodSchema/session';
import { useMutation } from '@tanstack/react-query';
import { setStorageItemAsync } from '@/lib/storage';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '@/lib/zodSchema/login';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

export default function SignIn() {
  const { setSession } = useSessionStore();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const { mutate: signin, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await fetch(`/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      return { status: res.status, data: await res.json() };
    },
    onSuccess: ({ data, status }) => {
      if (status === 200) {
        const session: Session = sessionSchema.parse(data);
        setSession(session);
        setStorageItemAsync('session', JSON.stringify(session));
        router.push('/home');
      } else if (status === 400) {
        alert(data);
      } else {
        Toast.show({
          type: "error",
          text1: "Sign In Failed",   
          text2: "Failed to sign in. Please try again.",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      }
    },
    onError: (error) => {
      console.log('Error', error);
      alert('Some error occured. Please try again later.');
    },
  });
  const handleSignIn = async (data: LoginFormData) => {
    signin(data);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[200px] h-[50px]" />
          <Text className="text-2xl text-white font-psemibold mt-10">Login to TrekDiaries</Text>
          <Controller
            control={control}
            name={'email'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Email"
                  placeholder="ram@gmail.com"
                  value={value}
                  onChangeText={onChange}
                  otherStyles="mt-7"
                  keyboardType="email-address"
                />
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name={'password'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Password"
                  placeholder="enter your password"
                  value={value}
                  onChangeText={onChange}
                  otherStyles="mt-7"
                />
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <CustomButton
            title="Submit"
            handlePress={handleSubmit(handleSignIn)}
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
