import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import Forms from '../../components/commons/Forms';
import CustomButton from '../../components/commons/CustomButton';
import { Link, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { SignupData, SignupFormData } from '@/lib/zodSchema/signup';
import { useForm, Controller } from 'react-hook-form';
import { signupFormSchema } from '@/lib/zodSchema/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignUp() {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dob: new Date().toISOString(),
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signupFormSchema),
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
        router.push('/sign-in');
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

  const handleSignUp = async (data: SignupFormData) => {
    const res: SignupData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      dob: data.dob,
      password: data.password,
    };
    mutate(res);
  };

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[200px] h-[50px]" />
          <Text className="text-2xl text-white font-psemibold mt-10">Sign Up to TrekDiaries</Text>
          <Controller
            control={control}
            name={'firstName'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="First Name"
                  placeholder="First Name"
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
          <Controller
            control={control}
            name={'lastName'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Last Name"
                  placeholder="Last Name"
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
            name={'dob'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <View className="flex-col mt-6">
                  <Text className="text-white">Date of Birth</Text>
                  <View className="flex-row justify-between h-16 px-4 mt-3 border-2 border-black-200 bg-black-100 text-gray-600 rounded-2xl focus:border-secondary items-center ">
                    <Text className="text-gray-500 text-base">
                      {new Date(value).toLocaleDateString()}
                    </Text>
                    <MaterialIcons
                      name="date-range"
                      size={32}
                      color="grey"
                      onPress={showDatepicker}
                      className="flex justify-end"
                    />
                  </View>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(value)}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShow(false);
                      onChange(selectedDate?.toISOString() || value);
                      onChangeDate(event, selectedDate);
                    }}
                  />
                )}
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
                  placeholder="set your password"
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
          <Controller
            control={control}
            name={'confirmPassword'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Confirm Password"
                  placeholder="confirm your password"
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
            handlePress={handleSubmit(handleSignUp)}
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
