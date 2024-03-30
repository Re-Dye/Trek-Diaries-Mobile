import { View, Text } from "react-native";
import React from "react";
import { Button } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({navigation}) {
  return (
    <View className="bg-slate-500 flex-1 justify-center items-center space-y-6">
      <Text className="font-bold text-3xl">Welcome to Trek Diaries</Text>
      <Text>LoginScreen</Text>
      <View>
      <Button
        title="Go to Home page"
        onPress={() => navigation.navigate("Home", { name: "Home" })}
      />
      </View>
    </View>
  );
}
