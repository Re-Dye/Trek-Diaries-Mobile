'use client';

import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import FeedCard from './FeedCard';
// import LoadingPost from '../LoadingPost/LoadingPost';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CONSTANTS } from '@/lib/constants';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';
import Toast from 'react-native-toast-message';
import { InView } from 'react-native-intersection-observer';

interface Response {
  posts: Array<ReturnPost>;
  next: string;
}

export default function PostFeed({ userId }: { userId: string }) {
  const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery<Response, Error>({
    queryKey: ['posts', 'feed', userId],
    queryFn: async ({ pageParam = '00000000-0000-0000-0000-000000000000' }) => {
      const res = await fetch(
        `/api/feed?userId=${userId}&last=${pageParam}&limit=${CONSTANTS.POSTS_PER_SCROLL}`,
        {
          cache: 'no-store',
          method: 'GET',
        }
      );
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: 'Please try again with valid parameters',
        });
        throw new Error('Invalid Request');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again later',
        });
        throw new Error('Something went wrong');
      }
    },
    getNextPageParam: (lastPage) => lastPage?.next ?? null,
    initialPageParam: '00000000-0000-0000-0000-000000000000', // Add this line
  });

  useEffect(() => {
    if (InView) {
      fetchNextPage();
    }
  }, [InView]);

  const renderItem = ({ item }: { item: ReturnPost }) => (
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
    if (status === 'pending') return <ActivityIndicator />;
    if (status === 'error') return <Text>Something went wrong. Please try again later.</Text>;
    if (hasNextPage)
      return (
        <InView onChange={(inView) => inView && fetchNextPage()}>
          <View style={{ height: 1 }} />
        </InView>
      );
    return null;
  };

  return (
    <FlatList
      data={data ? data.pages.flatMap((page) => page.posts) : []}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id || index.toString()}
      ListFooterComponent={renderFooter}
    />
  );
}
