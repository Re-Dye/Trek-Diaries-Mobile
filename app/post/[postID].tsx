import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Forms from '@/components/commons/Forms';
import CustomButton from '@/components/commons/CustomButton';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';

export default function AddComment() {
  const { session } = useSessionStore();
  
  const { postID } = useLocalSearchParams();

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }
  const router = useRouter();
  
  const { control, handleSubmit } = useForm({
    defaultValues: {
      comment: '',
    },
  });
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5">
          <Text className="text-2xl text-white font-psemibold">Comments</Text>
          <Controller
            control={control}
            name={'comment'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title=""
                  placeholder="write your comment ..."
                  value={value}
                  onChangeText={onChange}
                />
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <View className="flex-row justify-around">
            <CustomButton
              title="cancel"
              handlePress={() => router.push('/(tabs)/home')}
              containerStyles="mt-7 w-[150px] bg-sky-600"
              // isLoading={isPending}
            />
            <CustomButton
              title="comment"
              handlePress={() => ''}
              containerStyles="mt-7 w-[150px]"
              // isLoading={isPending}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
