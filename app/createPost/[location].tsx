import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/commons/CustomButton';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { icons } from '../../constants';
import { getCloudinaryPresetName, getCloudinaryName } from '@/lib/secrets';
import * as AddPost from '@/lib/zodSchema/addPost';
import { useForm, Controller, SubmitHandler, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Forms from '../../components/commons/Forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreatePost() {
  const { session } = useSessionStore();
  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }
  const { location } = useLocalSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(location);
  }, []);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      description: '',
      trail_condition: 0,
      weather: 0,
      accessibility: 0,
      image: '',
    },
    resolver: zodResolver(AddPost.addPostFormSchema),
  });

  const imageValue = watch('image'); // Watch the image value

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddPost.AddPostFormData) => {
      const req: AddPost.AddPostRequestData = {
        accessibility: data.accessibility,
        description: data.description,
        image_url: data.image,
        location_id: location as string,
        owner_id: session.id,
        trail_condition: data.trail_condition,
        weather: data.weather,
      };
      const res = await fetch('/api/location/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
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
        queryClient.invalidateQueries({ queryKey: ['search', location] });
        router.push(`/location/${location}`);
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
      alert('Error occurred while adding location. Please try again later.');
    },
  });
  const handleAddPost: SubmitHandler<AddPost.AddPostFormData> = (data) => mutate(data);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full mt-6 min-h-[85vh] px-5 space-y-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-sky-500 ml-4 font-psemibold text-xl">Add Post</Text>
            <CustomButton
              title="Create Post"
              containerStyles="min-h-[35px] w-[120px] px-2 mr-2 rounded-2xl"
              textStyles="text-sm font-medium text-white"
              handlePress={handleSubmit(handleAddPost)}
              disabled={!imageValue || isPending} // Disable if image is not uploaded or mutation is pending
            />
          </View>
          <Controller
            control={control}
            name={'description'}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Forms
                  title="Description"
                  placeholder="What is in your mind?"
                  value={value}
                  onChangeText={onChange}
                  otherStyles="mt-7"
                />
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="trail_condition"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <View className="flex-col space-y-1">
                  <Text className="text-white font-semibold">Trial Condition</Text>
                  <View className="border-2 border-black-200 bg-black-100 rounded-2xl">
                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item
                        label="Select a rating ..."
                        value={null}
                        style={{ color: 'gray' }}
                      />
                      <Picker.Item label="★ (Poor)" value={1} style={{ color: 'red' }} />
                      <Picker.Item label="★★ (Average)" value={2} style={{ color: 'tomato' }} />
                      <Picker.Item label="★★★ (Good)" value={3} style={{ color: 'orange' }} />
                      <Picker.Item
                        label="★★★★ (Outstanding)"
                        value={4}
                        style={{ color: 'violet' }}
                      />
                      <Picker.Item label="★★★★★ (Excellent)" value={5} style={{ color: 'green' }} />
                    </Picker>
                  </View>
                </View>
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="weather"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <View className="flex-col space-y-1">
                  <Text className="text-white font-semibold">Weather</Text>
                  <View className="border-2 border-black-200 bg-black-100 rounded-2xl">
                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item
                        label="Select a rating ..."
                        value={null}
                        style={{ color: 'gray' }}
                      />
                      <Picker.Item label="★ (Poor)" value={1} style={{ color: 'red' }} />
                      <Picker.Item label="★★ (Average)" value={2} style={{ color: 'tomato' }} />
                      <Picker.Item label="★★★ (Good)" value={3} style={{ color: 'orange' }} />
                      <Picker.Item
                        label="★★★★ (Outstanding)"
                        value={4}
                        style={{ color: 'violet' }}
                      />
                      <Picker.Item label="★★★★★ (Excellent)" value={5} style={{ color: 'green' }} />
                    </Picker>
                  </View>
                </View>
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="accessibility"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <View className="flex-col space-y-1">
                  <Text className="text-white font-semibold">Accessibility</Text>
                  <View className="border-2 border-black-200 bg-black-100 rounded-2xl">
                    <Picker selectedValue={value} onValueChange={onChange}>
                      <Picker.Item
                        label="Select a rating ..."
                        value={null}
                        style={{ color: 'gray' }}
                      />
                      <Picker.Item label="★ (Poor)" value={1} style={{ color: 'red' }} />
                      <Picker.Item label="★★ (Average)" value={2} style={{ color: 'tomato' }} />
                      <Picker.Item label="★★★ (Good)" value={3} style={{ color: 'orange' }} />
                      <Picker.Item
                        label="★★★★ (Outstanding)"
                        value={4}
                        style={{ color: 'violet' }}
                      />
                      <Picker.Item label="★★★★★ (Excellent)" value={5} style={{ color: 'green' }} />
                    </Picker>
                  </View>
                </View>
                {error && (
                  <Text className="flex justify-center items-center text-base text-red-700">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          <View>
            <ImagePick setValue={setValue} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ImagePickProps = {
  setValue: UseFormSetValue<AddPost.AddPostFormData>;
};

function ImagePick({ setValue }: ImagePickProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); // New state for uploading

  const openImagePicker = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setUploading(true); // Set uploading to true when starting the upload
      let base64Img = `data:image/jpg;base64,${pickerResult.assets[0].base64}`;
      let data = {
        file: base64Img,
        upload_preset: getCloudinaryPresetName(),
      };

      fetch(`https://api.cloudinary.com/v1_1/${getCloudinaryName()}/upload`, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
      })
        .then(async (r) => {
          let data = await r.json();
          setImageLink(data.url);
          setValue('image', data.url); // Update image_url field in useForm
        })
        .catch((err) => console.log(err))
        .finally(() => setUploading(false)); // Set uploading to false when upload is complete
    }
  };

  useEffect(() => {
    console.log(imageLink);
  }, [imageLink]);

  const removeImage = () => {
    setImage(null);
    setValue('image', ''); // Clear the image_url field in useForm
  };

  return (
    <View className="flex space-y-4">
      {image && (
        <View className="relative w-full pt-6 pb-3 px-4 border-2 border-black-200">
          <Image
            source={{ uri: image }}
            className="w-full h-[250px] rounded-xl"
            resizeMode="cover"
          />
          <TouchableOpacity onPress={removeImage} className="absolute top-2 right-2 rounded-3xl">
            <Image
              source={icons.closeImage}
              resizeMode="contain"
              tintColor="#7b7b8b"
              className="w-4 h-4"
            />
          </TouchableOpacity>
        </View>
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <TouchableOpacity onPress={openImagePicker}>
          <Image
            source={icons.addImage}
            resizeMode="contain"
            tintColor="#7b7b8b"
            className="w-8 h-8"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
