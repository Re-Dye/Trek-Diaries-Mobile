import { Text, View, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };
  return (
    <View className='flex-1 mt-10 p-6 space-y-6'>
      <View className='flex-col space-y-1'>
        <Text className="flex font-bold text-lg text-black">SignUp</Text>
        <Text className="flex font-bold text-sm text-gray-400">Create an account to get started</Text>
      </View>
      <View className="flex-col space-y-4">
        <View className="flex-col space-y-2">
          <Text>First Name</Text>
          <TextInput
            className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
            placeholder="enter your first name"
          />
        </View>
        <View className="flex-col space-y-2">
          <Text>Last Name</Text>
          <TextInput
            className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
            placeholder="enter your last name"
          />
        </View>
        <View className="flex-col space-y-2">
          <Text>Email Address</Text>
          <TextInput
            className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
            placeholder="name@gmail.com"
            keyboardType={'email-address'}
          />
        </View>
        <View className="flex-col space-y-2">
          <Text>Date of Birth</Text>
          <View className="flex-row justify-between items-center p-3 bg-gray-200 rounded-xl text-gray-600">
            <Text className='text-gray-500'>Your DOB: {date.toLocaleString()}</Text>
            <MaterialIcons name="date-range" size={32} color="black" onPress={showDatepicker} className='flex justify-end'/>
          </View>
        </View>
        <View className="flex-col space-y-2">
          <Text>Password</Text>
          <View className='flex space-y-4'>
            <TextInput
              className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
              placeholder="Create a password"
              secureTextEntry
            />
            <TextInput
              className="flex p-3 bg-gray-200 rounded-xl text-gray-600"
              placeholder="Confirm password"
              secureTextEntry
            />
          </View>
        </View>
        <View>
          <TouchableOpacity className="bg-blue-600 p-3 flex items-center rounded-xl">
            <Text className="text-white">Register</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row space-x-2 justify-center">
          <Text>Already a member?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login", { name: "Login" })}><Text className="text-blue-600" >Login now</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  )
}