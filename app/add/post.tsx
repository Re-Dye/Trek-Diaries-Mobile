import { View, Text, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
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
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Forms from '../../components/commons/Forms';
import { InsertPost } from '@/lib/zodSchema/dbTypes';
import { ConsoleLogWriter } from 'drizzle-orm';

export default function Create() {
  const { session } = useSessionStore();
  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const { location_id } = useLocalSearchParams();
  let validLocationID = '';
  if (typeof location_id === 'string') {
    validLocationID = location_id;
  } else if (Array.isArray(location_id) && location_id.length > 0) {
    validLocationID = location_id[0]; // join the array
  } else {
    // Handle the case when postID is undefined or an empty array
    validLocationID = '0d16715b-b275-49c7-9c6e-db46c470458b'; // Provide a default or fallback postID
  }
  useEffect(() => {
    console.log(validLocationID);
  }, []);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      trail_condition: 0,
      weather: 0,
      accessibility: 0,
      image_url: '',
      location_id: validLocationID,
      owner_id: session.id,
    },
    resolver: zodResolver(AddPost.addPostRequestSchema),
  });

  const handleAddPost: SubmitHandler<AddPost.AddPostRequestData> = (data) => {
    console.log(data.accessibility);
    console.log('inside submit handler...');
  };

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
              handlePress={() => router.push('/home')}
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
          <CustomButton
            title="Submit"
            handlePress={handleSubmit(handleAddPost)}
            containerStyles="mt-7"
            // isLoading={isPending}
          />
          <View>
            <ImagePick />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ImagePick() {
  const [image, setImage] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState<string | null>(null);

  const openImagePicker = async () => {
    // No permissions request is necessary for launching the image library
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
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
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    console.log(imageLink);
  }, [imageLink]);

  const removeImage = () => {
    setImage(null);
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
      <TouchableOpacity onPress={openImagePicker}>
        <Image
          source={icons.addImage}
          resizeMode="contain"
          tintColor="#7b7b8b"
          className="w-8 h-8"
        />
      </TouchableOpacity>
    </View>
  );
}
