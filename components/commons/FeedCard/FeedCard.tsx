import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { images } from '@/constants';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import LikeButton from './LikeButton';
import { useRouter } from 'expo-router';

interface Owner {
  id: string;
  name: string;
}

interface Location {
  id: string;
  address: string;
}

export default function FeedCard({
  userId,
  id,
  location,
  registered_time,
  description,
  likes,
  imageURL,
  owner,
  rating,
}: {
  userId: string;
  id: string;
  location: Location;
  registered_time: string;
  description: string;
  likes: number;
  imageURL: string;
  owner: Owner;
  rating: number;
}) {
  const router = useRouter();
  return (
    <View>
      <View className="m-3 p-4 bg-black-100 rounded-2xl">
        <View className="flex-row items-center mt-4 gap-5 p-2 relative">
          <View>
            <Image source={images.userLogo} className="w-14 h-14" resizeMode="contain" />
          </View>
          <View className="flex-row space-x-2">
            <View className="flex-col">
              <Text className="text-white  font-psemibold">{owner?.name}</Text>
              <Text className="text-slate-400 font-pmedium text-[12px]">{location.address}</Text>
              <Text className="text-slate-500 font-pbook text-[12px]">
                {handleRegisteredTime(registered_time)}
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
            source={{ uri: imageURL }}
            className="h-60 w-full rounded-2xl"
            resizeMode="contain"
            onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
          />
        </View>
        <View className="flex-row space-x-4 items-center justify-start my-2">
          <LikeButton likes={likes} postId={id} userId={userId} />
          <TouchableOpacity onPress={() => router.push(`/post/${id}`)}>
            <FontAwesome5 name="comment-alt" size={25} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
