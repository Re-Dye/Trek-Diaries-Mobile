import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from "../../constants"
import Forms from "../../components/Forms"
import CustomButton from "../../components/CustomButton"
import { Link, router } from 'expo-router'

export default function SignIn() {

  const[form,setForm] = useState({
    email: "",
    password: ""
  })

  const [isSubmit, setIsSubmit] = useState(false)

  const submit = () => {
    router.push("/home")
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-5 my-6">
          <Image 
            source={images.logo}
            resizeMode='contain'
            className="w-[200px] h-[50px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">Login to TrekDiaries</Text>
          <Forms 
            title="Email"
            placeholder="ram@gmail.com"
            value={form.email}
            handleChangeText={(e)=> setForm({ ...form, email:e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <Forms 
            title="Password"
            placeholder="enter your password"
            value={form.password}
            handleChangeText={(e)=> setForm({ ...form, password:e})}
            otherStyles="mt-7"
          />
          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmit}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href="/sign-up" className='text-sm font-psemibold text-green-500'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}