import { View, Text, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePick from '../../components/commons/ImagePicker';
import CustomButton from '../../components/commons/CustomButton';
import { Redirect, router } from 'expo-router';
import { useSessionStore } from '@/lib/zustand/session';
import { Picker } from '@react-native-picker/picker';

export default function Create() {
  const { session } = useSessionStore();

  if (!session || new Date() >= new Date(session.ein + session.iat)) {
    return <Redirect href={'/sign-in'} />;
  }

  const [selectedTrial, setSelectedTrial] = useState();
  const [selectedWeather, setSelectedWeather] = useState();
  const [selectedAccess, setSelectedAccess] = useState();
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
          <View className="w-full flex-row h-28 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center ">
            <TextInput
              placeholder="what's on your mind?"
              className="text-white"
              placeholderTextColor="#7b7b8b"
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          <View className='flex-col space-y-3'>
            <View className='flex-col space-y-1'>
              <Text className='text-white font-semibold'>Trial Condition</Text>
              <View className='border-2 border-black-200 bg-black-100 rounded-2xl'>
                <Picker
                  selectedValue={selectedTrial}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedTrial(itemValue)
                  }>
                  <Picker.Item label='Select a rating ...' value={null} style={{ color: "gray" }} />
                  <Picker.Item label="★ (Poor)" value="1" style={{ color: "red" }} />
                  <Picker.Item label="★★ (Average)" value="2" style={{ color: "tomato" }} />
                  <Picker.Item label="★★★ (Good)" value="3" style={{ color: "orange" }} />
                  <Picker.Item label="★★★★ (Outstanding)" value="4" style={{ color: "violet" }} />
                  <Picker.Item label="★★★★★ (Excellent)" value="5" style={{ color: "green" }} />
                </Picker>
              </View>
            </View>
            <View className='flex-col space-y-1'>
              <Text className='text-white font-semibold'>Weather</Text>
              <View className='border-2 border-black-200 bg-black-100 rounded-2xl'>
                <Picker
                  selectedValue={selectedWeather}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedWeather(itemValue)
                  }>
                  <Picker.Item label='Select a rating ...' value={null} style={{ color: "gray" }} />
                  <Picker.Item label="★ (Poor)" value="1" style={{ color: "red" }} />
                  <Picker.Item label="★★ (Average)" value="2" style={{ color: "tomato" }} />
                  <Picker.Item label="★★★ (Good)" value="3" style={{ color: "orange" }} />
                  <Picker.Item label="★★★★ (Outstanding)" value="4" style={{ color: "violet" }} />
                  <Picker.Item label="★★★★★ (Excellent)" value="5" style={{ color: "green" }} />
                </Picker>
              </View>
            </View>
            <View className='flex-col space-y-1'>
              <Text className='text-white font-semibold'>Accessibility</Text>
              <View className='border-2 border-black-200 bg-black-100 rounded-2xl'>
                <Picker
                  selectedValue={selectedAccess}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedAccess(itemValue)
                  }>
                  <Picker.Item label='Select a rating ...' value={null} style={{ color: "gray" }} />
                  <Picker.Item label="★ (Poor)" value="1" style={{ color: "red" }} />
                  <Picker.Item label="★★ (Average)" value="2" style={{ color: "tomato" }} />
                  <Picker.Item label="★★★ (Good)" value="3" style={{ color: "orange" }} />
                  <Picker.Item label="★★★★ (Outstanding)" value="4" style={{ color: "violet" }} />
                  <Picker.Item label="★★★★★ (Excellent)" value="5" style={{ color: "green" }} />
                </Picker>
              </View>
            </View>
          </View>
          <View>
            <ImagePick />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
