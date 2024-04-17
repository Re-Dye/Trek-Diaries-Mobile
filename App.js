import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import { StatusBar } from "react-native";
import SignUpScreen from "./screens/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" hidden={false} />
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
         <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={{ title: "Signup" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
