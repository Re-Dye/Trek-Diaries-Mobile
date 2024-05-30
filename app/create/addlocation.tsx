import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import Forms from '../../components/commons/Forms';
import CustomButton from '../../components/commons/CustomButton';
import { Link, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function AddLocation() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      address: '',
      state: '',
      country: '',
      description: '',
    },
  });
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
            name={'address'}
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
            handlePress={()=>""}
            containerStyles="mt-7"
            // isLoading={isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}