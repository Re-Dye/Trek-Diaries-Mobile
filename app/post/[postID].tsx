import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import Toast from 'react-native-toast-message';
import { useInfiniteQuery } from '@tanstack/react-query';
import handleRegisteredTime from '@/lib/utilities/handleRegisteredTime';
import { images } from '@/constants';
import CommentCard from '@/components/comments/CommentCard';
import AddComment from '@/components/comments/AddComment';
import ViewPost from '@/components/post/viewPost';
import { ReturnComment } from '@/lib/zodSchema/dbTypes';
import { CONSTANTS } from '@/lib/constants';
import { router } from 'expo-router';
import { IOScrollView, InView } from 'react-native-intersection-observer';

interface Response {
  comments: Array<ReturnComment>;
  next: string;
}

export default function Post() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [inView, setInView] = useState(false);
  const { session } = useSessionStore();
  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const { postID } = useLocalSearchParams();

  const { data, status, fetchNextPage } = useInfiniteQuery<Response, Error>({
    queryKey: ['comments', 'feed', postID as string],
    queryFn: async ({ pageParam = '00000000-0000-0000-0000-000000000000' }) => {
      const res = await fetch(
        `/api/post/comment?postId=${postID as string}&limit=${CONSTANTS.COMMENTS_PER_SCROLL}&last=${pageParam}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      if (res.status === 200) {
        // console.log(res);
        return res.json();
      } else if (res.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: 'Please try again with valid parameters',
        });
      } else if (res.status === 401) {
        Toast.show({
          type: 'error',
          text1: 'Unauthorized',
          text2: 'Please login to view feed',
        });
        router.push('/sign-in');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again later',
        });
      }
    },
    getNextPageParam: (lastPage) => lastPage?.next ?? null,
    initialPageParam: '00000000-0000-0000-0000-000000000000', // Add this line
  });
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    // <Text> HI</Text>
    <SafeAreaView className="bg-primary h-full">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <IOScrollView>
          <View>
            <ViewPost postID={postID as string} />
          </View>
          {/* <Text className='text-base text-white'>Post Feed</Text> */}
          {status === 'pending' ? (
            // <LoadingPost />
            <ActivityIndicator
              size="large"
              color="#00ff00"
              className="flex justify-center items-center"
            />
          ) : status === 'error' ? (
            <Text>Something went wrong. Please try again later</Text>
          ) : (
            status === 'success' &&
            data.pages.map((page, i) => {
              if (page === undefined || page.comments === undefined) {
                return (
                  <Text key={i} className="text-base text-white">
                    Not Found!
                  </Text>
                );
              } else if (page.comments.length === 0 && i === 0) {
                return (
                  <Text key={i} className="text-base text-white">
                    No Comments Found!
                  </Text>
                );
              } else {
                return page.comments.map((comment, i) => (
                  <CommentCard
                    content={comment.content}
                    owner={comment.user_name}
                    registeredTime={comment.registered_time}
                  />
                ));
              }
            })
          )}
          <InView onChange={(inView: boolean) => setInView(inView)}>
            <Text> </Text>
          </InView>
        </IOScrollView>
      </ScrollView>
      <View>
        <AddComment postID={postID as string} userId={session.id} />
      </View>
    </SafeAreaView>
  );
}
