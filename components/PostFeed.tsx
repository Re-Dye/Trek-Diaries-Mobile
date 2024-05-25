'use client';

import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import FeedCard from './FeedCard';
// import LoadingPost from '../LoadingPost/LoadingPost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CONSTANTS } from '@/lib/constants';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';
import Toast from 'react-native-toast-message';
// import { useInView } from 'react-native-intersection-observer';

interface Response {
  posts: Array<ReturnPost>;
  next: string;
}

export default function PostFeed({ userId }: { userId: string }) {
  const { ref, inView } = useInView();
  const { data, status, fetchNextPage } = useInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      try {
        const res = await fetch(
          `/api/feed?userId=${userId}&last=${pageParam}&limit=${CONSTANTS.POSTS_PER_SCROLL}`,
          {
            cache: 'no-store',
            method: 'GET',
          }
        );
        const status = res.status;
        if (status === 200) {
          const data: Response = await res.json();
          return data;
        } else if (status === 400) {
          Toast.show({
            type: 'error',
            text1: 'Invalid Request',
            text2: 'Please try again with valid parameters',
          });
          return;
        } else {
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'Please try again later',
          });
          return;
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', error.message);
        return;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage === undefined) {
        return null;
      } else {
        return lastPage.next;
      }
    },
    initialPageParam: '00000000-0000-0000-0000-000000000000',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const renderItem = ({ item }) => (
    <FeedCard
      userId={userId}
      id={item.id}
      registered_time={item.registered_time}
      location={{
        id: item.location_id,
        address: item.location_address,
      }}
      description={item.description}
      likes={item.likes_count}
      imageURL={item.picture_url}
      owner={{
        id: item.owner_id,
        name: item.owner_name,
      }}
      rating={item.rating || 0}
    />
  );

  const renderFooter = () => {
    // if (status === 'loading') return <LoadingPost />;
    if (status === 'error') return <Text>Something went wrong. Please try again later.</Text>;
    return <View ref={ref} />;
  };

  return (
    <FlatList
      data={data ? data.pages.flatMap((page) => page.posts) : []}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id || index.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={() => {
        if (inView) fetchNextPage();
      }}
      onEndReachedThreshold={0.1}
    />
  );
}
