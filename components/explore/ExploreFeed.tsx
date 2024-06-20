import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import FeedCard from '../commons/FeedCard/FeedCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CONSTANTS } from '@/lib/constants';
import { ReturnPost } from '@/lib/zodSchema/dbTypes';
import Toast from 'react-native-toast-message';
import { IOScrollView, InView } from 'react-native-intersection-observer';
import { useSessionStore } from '@/lib/zustand/session';
import { router } from 'expo-router';

interface Response {
  posts: Array<ReturnPost>;
  next: string;
}

export default function ExploreFeed({
  userId,
  locations,
  refreshTrigger,
  onRefetchComplete,
}: {
  userId: string;
  locations: string[];
  refreshTrigger: boolean;
  onRefetchComplete: () => void;
}) {
  const [inView, setInView] = useState(false);
  const { session } = useSessionStore();

  const { data, status, fetchNextPage, refetch } = useInfiniteQuery<Response, Error>({
    enabled: userId !== undefined && locations.length > 0,
    queryKey: ['recommendation', 'feed', userId],
    queryFn: async ({ pageParam = '00000000-0000-0000-0000-000000000000' }) => {
      const searchParams = new URLSearchParams({
        location: JSON.stringify(locations),
        limit: CONSTANTS.POSTS_PER_SCROLL.toString(),
        last: pageParam as string | '',
      });
      const res = await fetch(`/api/recommendation/feed?${searchParams}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      if (res.status === 200) {
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

  useEffect(() => {
    if (refreshTrigger) {
      refetch().then(() => {
        onRefetchComplete(); // Notify Home component that refetch is complete
      });
    }
  }, [refreshTrigger]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <IOScrollView>
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
          if (page === undefined || page.posts === undefined) {
            return (
              <Text key={i} className="text-base text-white">
                Not Found!
              </Text>
            );
          } else if (page.posts.length === 0 && i === 0) {
            return (
              <Text key={i} className="text-base text-white">
                No Posts Found!
              </Text>
            );
          } else {
            return page.posts.map((post, i) => (
              <FeedCard
                userId={userId}
                key={i}
                id={post.id}
                registered_time={post.registered_time}
                location={{
                  id: post.location_id,
                  address: post.location_address,
                }}
                description={post.description}
                likes={post.likes_count}
                imageURL={post.picture_url}
                owner={{
                  id: post.owner_id,
                  name: post.owner_name,
                }}
                rating={post.rating || 0}
              />
            ));
          }
        })
      )}

      <InView onChange={(inView: boolean) => setInView(inView)}>
        <Text> </Text>
      </InView>
    </IOScrollView>
  );
}
