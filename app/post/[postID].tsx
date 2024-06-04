import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Forms from '@/components/commons/Forms';
import CustomButton from '@/components/commons/CustomButton';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import { images } from '@/constants';
import CommentCard from '@/components/comments/CommentCard';
import Star from '@/components/comments/rating';

export default function ViewPost({
  userId,
  address,
  locationId,
  name,
  likes,
  registeredTime,
  description,
  pictureURL,
  postID,
  rating,
}: {
  userId: string | undefined;
  address: string;
  name: string;
  likes: number;
  locationId: string;
  registeredTime: string;
  description: string;
  pictureURL: string;
  postID: string;
  rating: {
    TrailCondition: number;
    Weather: number;
    Accessibility: number;
    overallScore: number;
  };
}) {
  const rate = 3;
  const { session } = useSessionStore();

  // const { postID } = useLocalSearchParams();

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
        <View className="mt-5 p-4 rounded-2xl">
          <View className="flex-row items-center mt-4 gap-5 p-2 relative">
            <View>
              <Image source={images.userLogo} className="w-14 h-14" resizeMode="contain" />
            </View>
            <View className="flex-row space-x-2">
              <View className="flex-col">
                <Text className="text-white  font-psemibold">{name}</Text>
                <Text className="text-slate-400 font-pmedium text-[12px]">{address}</Text>
                <Text className="text-slate-500 font-pbook text-[12px]">
                  {handleRegisteredTime(registeredTime)}
                </Text>
              </View>
            </View>
          </View>
          <View className="m-2">
            <Text className="text-white font-pbook my-2 text-justify">{description}</Text>
          </View>
          <View className="my-2 rounded-2xl">
            {/* <Text className="text-white">{imageURL}</Text> */}

            <Image
              source={{ uri: pictureURL }}
              className="h-60 w-full rounded-2xl"
              resizeMode="contain"
              onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
            />
          </View>

          <View className="flex-row justify-around mt-1 ">
            <View className="flex-col justify-center align-middle text-center ">
              <Text className="text-white font-pbook text-[12px]">Trail Conditon:</Text>
              <Star stars={rating.TrailCondition} />
            </View>
            <View className="flex-col justify-center align-middle text-center">
              <Text className="text-white font-pbook text-[12px]">Weather:</Text>
              <Star stars={rating.Weather} />
            </View>
            <View className="flex-col justify-center align-middle text-center">
              <Text className="text-white font-pbook text-[12px]">Accessibility:</Text>
              <Star stars={rating.Accessibility} />
            </View>
          </View>
          <View>
            <View className="w-full mt-3">
              <Text className="text-xl text-white font-pbook">Comments</Text>
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
                <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                  <View className="m-4 flex-row items-center justify-center h-[40px] w-[150px] bg-blue-600 rounded-xl ">
                    <Text className="text-white font-psemibold">Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
                  <View className="m-4 flex-row items-center justify-center h-[40px] w-[150px] bg-green-600 rounded-xl ">
                    <Text className="text-white font-psemibold">Comment</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="">{/* <CommentCard {...} /> */}</View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
