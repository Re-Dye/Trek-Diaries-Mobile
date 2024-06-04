import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import Toast from 'react-native-toast-message';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import { images } from '@/constants';
import AddComment from '@/components/comments/AddComment';
import Star from '@/components/post/rating';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';

export default function ViewPost({ postID }: { postID: string }) {
  const { session } = useSessionStore();
  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const [post, setPost] = useState<ReturnPost | null>(null);

  const { status, data } = useQuery({
    queryKey: ['post', postID],
    queryFn: async () => {
      try {
        const res: Response = await fetch(`/api/post/getPost?postId=${postID}`, {
          method: 'GET',
        });
        const json = await res.json();
        const status = res.status;

        return { json, status };
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    if (data.status === 200) {
      setPost(data.json.res);
      return;
    }

    if (data.status === 400) {
      Toast.show({
        text1: 'Error',
        text2: 'Invalid request. Please try again later with valid data.',
        type: 'error',
      });
      return;
    }

    Toast.show({
      text1: 'Error',
      text2: 'Error occured. Please try again later.',
      type: 'error',
    });
  }, [data]);

  return (
    // <Text> HI</Text>
        <View className="mt-5 p-4 rounded-2xl">
          <View className="flex-row items-center mt-4 gap-5 p-2 relative">
            <View>
              <Image source={images.userLogo} className="w-14 h-14" resizeMode="contain" />
            </View>
            <View className="flex-row space-x-2">
              <View className="flex-col">
                <Text className="text-white  font-psemibold">{post?.owner_name}</Text>
                <Text className="text-slate-400 font-pmedium text-[12px]">
                  {post?.location_address}
                </Text>
                <Text className="text-slate-500 font-pbook text-[12px]">
                  {handleRegisteredTime(post?.registered_time || '')}
                </Text>
              </View>
            </View>
          </View>
          <View className="m-2">
            <Text className="text-white font-pbook my-2 text-justify">{post?.description}</Text>
          </View>
          <View className="my-2 rounded-2xl">
            {/* <Text className="text-white">{imageURL}</Text> */}

            <Image
              source={{ uri: post?.picture_url }}
              className="h-60 w-full rounded-2xl"
              resizeMode="contain"
              onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
            />
          </View>

          <View className="flex-row justify-around mt-1 ">
            <View className="flex-col justify-center align-middle text-center ">
              <Text className="text-white font-pbook text-[12px]">Trail Conditon:</Text>
              <Star stars={post?.trail_condition || 0} />
            </View>
            <View className="flex-col justify-center align-middle text-center">
              <Text className="text-white font-pbook text-[12px]">Weather:</Text>
              <Star stars={post?.weather || 0} />
            </View>
            <View className="flex-col justify-center align-middle text-center">
              <Text className="text-white font-pbook text-[12px]">Accessibility:</Text>
              <Star stars={post?.accessibility || 0} />
            </View>
          </View>
        </View>
  );
}
