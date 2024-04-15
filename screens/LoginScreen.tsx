import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  return (
    <View className="bg-green-950 flex-1">
      <View className="flex-1 justify-center space-y-3">
        <View className="flex-row justify-center">
          <Image source={require("../assets/trekkbg.png")} style={{ width: 300, height: 300 }} />
        </View>

        <Text className="flex text-center font-bold text-2xl text-white">Welcome to Trek Diaries</Text>
      </View>
      <View className="flex-1 bg-white rounded-t-3xl">
        <View className="flex flex-col space-y-4 p-8">
          <View className="flex-col space-y-2">
            <Text>Email</Text>
            <TextInput
              className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
              placeholder="enter your email"
            />
          </View>
          <View className="flex-col space-y-2">
            <Text>Password</Text>
            <TextInput
              className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
              placeholder="enter your password"
              secureTextEntry
            />
          </View>
          <View>
            <Text className="text-blue-600">Forgot password?</Text>
          </View>
          <View>
            <TouchableOpacity className="bg-blue-600 p-3 flex items-center rounded-xl" onPress={() => navigation.navigate("Home", { name: "Home" })}>
              <Text className="text-white">Login</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row space-x-2 justify-center">
            <Text>Not a member?</Text>
            <Text className="text-blue-600">Register now</Text>
          </View>
          <View className="border-b border-gray-300"></View>
          <View className="flex-row space-x-5 justify-center">
            <FontAwesome5 name="facebook" size={32} color="blue" />
            <FontAwesome name="apple" size={32} color="black" />
            <AntDesign name="google" size={32} color="#fc6203" />
          </View>
        </View>
      </View>
    </View>
  );
}
