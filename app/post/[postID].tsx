import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import Toast from 'react-native-toast-message';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import { images } from '@/constants';
import CommentCard from '@/components/comments/CommentCard';
import AddComment from '@/components/comments/AddComment';
import ViewPost from '@/components/post/viewPost';
import Star from '@/components/post/rating';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';

export default function Post() {
  const { session } = useSessionStore();
  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const { postID } = useLocalSearchParams();
  let validPostID = '';
  if (typeof postID === 'string') {
    validPostID = postID;
  } else if (Array.isArray(postID) && postID.length > 0) {
    validPostID = postID[0]; // join the array
  } else {
    // Handle the case when postID is undefined or an empty array
    validPostID = '0d16715b-b275-49c7-9c6e-db46c470458b'; // Provide a default or fallback postID
  }

  const [post, setPost] = useState<ReturnPost | null>(null);

  const [inView, setInView] = useState(false);
  return (
    // <Text> HI</Text>
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-col">
          <View>
            <ViewPost postID={validPostID} />
          </View>
          <View>
            <AddComment postID={validPostID} userId={session.id} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
