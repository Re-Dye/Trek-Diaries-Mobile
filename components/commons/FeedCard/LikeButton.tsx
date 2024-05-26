import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LikePost } from '@/lib/zodSchema/likePost';
import { useEffect, useRef, useState } from 'react';

type Action = 'like' | 'dislike';

export default function LikeButton({
  likes,
  postId,
  userId,
}: {
  likes: number;
  postId: string;
  userId: string;
}) {
  const [Likes, setLike] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const actionRef = useRef<Action>('like');

  const { status, data } = useQuery({
    queryKey: ['isLiked', postId],
    queryFn: async () => {
      try {
        const res: Response = await fetch(`/api/post/like?userId=${userId}&postId=${postId}`, {
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
      const _data: { isLiked: boolean } = data.json;
      setIsLiked(_data.isLiked);
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


  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const data: LikePost = {
        postId,
        userId,
      };

      try {
        if (isLiked) {
          actionRef.current = 'dislike';
          setLike((likes) => likes - 1);
          setIsLiked(false);
        } else {
          actionRef.current = 'like';
          setLike((likes) => likes + 1);
          setIsLiked(true);
        }

        const res: Response = await fetch(`/api/post/${actionRef.current}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const message = await res.json();
        const status = res.status;
        return { message, status };
      } catch (error) {
        console.log(error);
        return;
      }
    },
    onError: (error) => {
      console.log(error);
      if (actionRef.current == 'dislike') {
        setLike((likes) => likes + 1);
        setIsLiked(true);
      } else {
        setLike((likes) => likes - 1);
        setIsLiked(false);
      }
    },
    onSuccess: (data) => {
      if (data === undefined) {
        return;
      }

      if (data.status === 201) {
        const _data: { likes: number } = data.message;
        setLike(_data.likes);
        setIsLiked(() => (actionRef.current === 'like' ? true : false));
        return;
      }

      if (actionRef.current == 'dislike') {
        setLike((likes) => likes + 1);
        setIsLiked(true);
      } else {
        setLike((likes) => likes - 1);
        setIsLiked(false);
      }

      if (data.status === 409) {
        Toast.show({
          text1: 'Error',
          text2: `Post already ${actionRef.current}d.`,
          type: 'error',
        });
        return;
      }

      if (data.status === 404) {
        Toast.show({
          text1: 'Error',
          text2: 'Post not found. The post has been deleted or does not exist.',
          type: 'error',
        });
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
    },
  });

  const handleLike = () => {
    if (isPending) {
      Toast.show({
        text1: 'Error',
        text2: 'Previous request is still pending. Please wait for it to complete.',
        type: 'error',
      });
    } else {
      mutate();
    }
  };

  return (
    <>
      {status === "pending" ? (
        <Text>Loading...</Text>
      ) : (
      <View className="flex-row items-center  ">
        <Ionicons name="heart" size={32} color="red" onPress={handleLike} />
        <Text className="text-white font-pmdedium text-[20px] text-center m-2 pb-1">{Likes}</Text>
      </View>
      )}
    </>
  );
}
