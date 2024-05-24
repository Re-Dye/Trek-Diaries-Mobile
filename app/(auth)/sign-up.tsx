import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import Forms from '../../components/Forms';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { SignupData } from '@/lib/zodSchema/signup';

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: new Date().toISOString(),
    password: '',
    confirmpassword: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignupData) => {
      const res = await fetch(`/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return { status: res.status, data: await res.json() };
    },
    onSuccess: ({ data, status }) => {
      if (status === 201) {
        alert(
          'The verification mail has been sent to your email. Please verify your email to login.'
        );
      } else if (status === 400) {
        alert(data);
      } else if (status === 409) {
        alert('Email already exists. Please try with another email.');
      } else {
        alert('Server Error occured. Please try again later.');
      }
    },
    onError: (error) => {
      console.log('Error', error);
      alert('Some error occured. Please try again later.');
    },
  });

  const handleSignUp = async () => {
    const res: SignupData = {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      dob: form.dob,
      password: form.password,
    };
    console.log(res);
    mutate(res);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[200px] h-[50px]" />
          <Text className="text-2xl text-white font-psemibold mt-10">Sign Up to TrekDiaries</Text>
          <Forms
            title="First Name"
            placeholder="First Name"
            value={form.firstName}
            handleChangeText={(e) => setForm({ ...form, firstName: e })}
            otherStyles="mt-7"
          />
          <Forms
            title="Last Name"
            placeholder="Last Name"
            value={form.lastName}
            handleChangeText={(e) => setForm({ ...form, lastName: e })}
            otherStyles="mt-7"
          />
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
            placeholder="set your password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <Forms
            title="Confirm Password"
            placeholder="confirm your password"
            value={form.confirmpassword}
            handleChangeText={(e) => setForm({ ...form, confirmpassword: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSignUp}
            containerStyles="mt-7"
            isLoading={isPending}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">Already have an account?</Text>
            <Link href="/sign-in" className="text-sm font-psemibold text-green-500">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
