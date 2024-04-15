import { View, Text } from 'react-native'
import React from 'react'
import { Button } from "react-native";

export default function LoginScreen({navigation}) {
  return (
    <View className="bg-orange-200 flex-1 justify-center items-center">
      <Text>Home Screen</Text>
      <Button
        title="Go to Login page"
        onPress={() => navigation.goBack()}
      />
    </View>
  )
}