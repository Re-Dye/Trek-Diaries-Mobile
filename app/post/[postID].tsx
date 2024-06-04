import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Forms from '@/components/commons/Forms';
import CustomButton from '@/components/commons/CustomButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { addCommentFormData, addCommentFormSchema } from '@/lib/zodSchema/addComment';
import { ReturnLocation, selectLocationSchema } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';

export default function AddComment() {
  const { session } = useSessionStore();
  const { postID } = useLocalSearchParams();
  useEffect(() => {
    console.log(postID);
  }, []);
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      post_id: postID?.toString() || '',
      content: '',
      user_id: session?.id || '',
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
        console.log('added comments');
        return;
      }

      if (data.status === 409) {
        alert('Location already exists.');
        // toast({
        //   className: "fixed rounded-md top-0 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   description: "Location already exists."
        // })
        return;
      }

      if (data.status === 400) {
        alert('Invalid Request');
        // toast({
        //   className: "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   title: "Invalid Request",
        //   description: "Please try again later with proper information."
        // })
        return;
      }
      alert('Error occured while adding comments. Please try again later.');
      // toast({
      //   variant: "destructive",
      //   className: "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
      //   description: "Error occured while adding location. Please try again later.",
      //   action: <ToastAction altText="Try again">Try again</ToastAction>,
      // })
    },
  });

  const handleAddComment: SubmitHandler<addCommentFormData> = (data) => mutate(data);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5">
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
            <CustomButton
              title="cancel"
              handlePress={() => router.push('/(tabs)/home')}
              containerStyles="mt-7 w-[150px] bg-sky-600"
              // isLoading={isPending}
            />
            <CustomButton
              title="comment"
              handlePress={handleSubmit(handleAddComment)}
              containerStyles="mt-7 w-[150px]"
              // isLoading={isPending}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
