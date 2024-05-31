import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import Forms from '../../components/commons/Forms';
import CustomButton from '../../components/commons/CustomButton';
import { Link, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { AddLocationFormData, AddLocationFormSchema } from '@/lib/zodSchema/addLocation';
import { ReturnLocation, selectLocationSchema } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';

export default function AddLocation() {
  const { session } = useSessionStore();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      place: '',
      state: '',
      country: '',
      description: '',
    },
    resolver: zodResolver(AddLocationFormSchema)
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddLocationFormData) => {
      const res = await fetch("/api/location/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ session?.token }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const message: string = await res.json();
      const status = res.status;
      return { message, status };
    },
    onError: (error) => {
      console.log(error);
      alert(error);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        const location: ReturnLocation = selectLocationSchema.parse(data.message);
        router.push(`/location/${location.id}`);
        return;
      }

      if (data.status === 409) {
        alert("Location already exists.");
        // toast({
        //   className: "fixed rounded-md top-0 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   description: "Location already exists."
        // })
        return;
      }

      if (data.status === 400) {
        alert("Invalid Request");
        // toast({
        //   className: "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   title: "Invalid Request",
        //   description: "Please try again later with proper information."
        // })
        return;
      }
      alert("Error occured while adding location. Please try again later.");
      // toast({
      //   variant: "destructive",
      //   className: "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
      //   description: "Error occured while adding location. Please try again later.",
      //   action: <ToastAction altText="Try again">Try again</ToastAction>,
      // })
    },
  });

  const handleAddLocation: SubmitHandler<AddLocationFormData> = (data) => mutate(data);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-6">
          <View className='flex-row justify-center items-center space-x-3'>
            <Text className="text-2xl text-white font-psemibold">Add Location</Text>
            <FontAwesome6 name="location-crosshairs" size={24} color="green" />
          </View>
          <Controller
            control={control}
            name={'place'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Address"
                  placeholder="Address"
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
            name={'state'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="District/State"
                  placeholder="district/state name"
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
            name={'country'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Country"
                  placeholder="country"
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
            name={'description'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Description"
                  placeholder="type full description"
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
            handlePress={handleSubmit(handleAddLocation)}
            containerStyles="mt-7"
            isLoading={isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}