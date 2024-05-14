import { View, Text, ScrollView, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePick from "../../components/ImagePicker";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

export default function Create() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full mt-6 min-h-[85vh] px-5 space-y-10">
          <View className="flex-row justify-between items-center">
          <Text className="text-white ml-4 font-psemibold text-lg">Create Post</Text>
          <CustomButton 
            title="post"
            containerStyles="min-h-[30px] px-3 bg-gray-600 mr-4 rounded-3xl"
            textStyles="text-sm font-medium text-white"
            handlePress={()=> router.push("/home")}
          />
          </View>
          <View className="w-full flex-row h-32 px-4 border-2 border-black-200 bg-black-100 rounded-2xl focus:border-secondary items-center ">
          <TextInput 
            placeholder="what's on your mind?"
            className="text-white"
            placeholderTextColor="#7b7b8b"
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
          />
          </View>
          <View>
          <ImagePick />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
