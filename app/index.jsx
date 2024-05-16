import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {images} from '../constants';
import CustomButton from "../components/CustomButton";

export default function App() {
  return (
    <SafeAreaView className= "bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[90vh] px-5">
          <Image 
            source={images.logo}
            className="w-[250px] h-[90px]"
            resizeMode="contain"
          />
          <Image 
            source={images.trekLogo}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="mt-5">
            <Text className="text-white text-2xl font-bold text-center">Meet trekk
            enthusiasts and connect with {''}<Text className="text-green-500">TrekDiaries</Text>
            </Text> 
          </View>
          <Text className="text-sm text-gray-100 text-center mt-7 font-pregular">Embark on an Adventure: Connect together and Explore Limitless Trails with TrekDiaries</Text>
          <CustomButton 
            title="Continue with email"
            handlePress={()=> router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
}
