import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import CustomButton from '@/components/commons/CustomButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Forms from '@/components/commons/Forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCommentFormData, addCommentFormSchema } from '@/lib/zodSchema/addComment';
import { useSessionStore } from '@/lib/zustand/session';

export default function AddComment({ postID, userId }: { postID: string; userId: string }) {
  const { session } = useSessionStore();
  useEffect(() => {
    console.log('the user id is: ', userId, 'the post id is: ', postID);
  }, []);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      post_id: postID?.toString() || '',
      content: '',
      user_id: userId || '',
    },
    resolver: zodResolver(addCommentFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: addCommentFormData) => {
      const res = await fetch('/api/post/comment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const message: string = await res.json();
      const status = res.status;
      return { message, status };
    },
    onError: (error) => {
      console.log(error);
      alert(error);
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['comments', 'feed', postID] });
        reset(); // Reset the form values
        return;
      }

      if (data.status === 409) {
        alert('Location already exists.');
        return;
      }

      if (data.status === 400) {
        alert('Invalid Request');
        return;
      }
      alert('Error occured while adding comments. Please try again later.');
    },
  });

  const handleAddComment: SubmitHandler<addCommentFormData> = (data) => {
    mutate(data); // Call mutate here to execute the mutation
  };

  return (
    <View className="w-full mt-4 px-5">
      <Text className="text-2xl text-white font-psemibold">Comments</Text>
      <Controller
        control={control}
        name={'content'}
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
        <TouchableOpacity onPress={handleSubmit(handleAddComment)}>
          <View className="m-4 flex-row items-center justify-center h-[40px] w-[150px] bg-green-600 rounded-xl ">
            <Text className="text-white font-psemibold">Comment</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
