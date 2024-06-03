import React, { useState } from 'react';
import { SafeAreaView, TextInput, View, Button, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferData, preferSchema } from '@/lib/zodSchema/preference';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Forms from './Forms';
import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from './CustomButton';

const trails = [
  { label: "Aanbu Kahireni Trail", value: "Aanbu Kahireni Trail" },
  { label: "Annapurna Base Camp Heli Trek", value: "Annapurna Base Camp Heli Trek" },
  { label: "Annapurna Base Camp Short Trek", value: "Annapurna Base Camp Short Trek" },
  { label: "Annapurna Base Camp Trek", value: "Annapurna Base Camp Trek" },
];

const features = [
  { id: "village", label: "village" },
  { id: "forest", label: "forest" },
  { id: "mountain", label: "mountain" },
  { id: "snow", label: "snow" },
  { id: "viewpoint", label: "viewpoint" },
  { id: "lake", label: "lake" },
];

export default function Preferences() {
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      type: '',
      trail: '',
      distance: '',
      altitude: '',
      month: '',
      features: ''
    },
    resolver: zodResolver(preferSchema),
  });

  const handlePref = async (data: preferData) => {
  }

  return (
    <View className='flex-col space-y-6'>

      <View className="flex-row justify-center items-center space-x-2">
        <Text className="text-2xl font-bold text-sky-500 text-center">My Preferences</Text>
        <MaterialIcons name="center-focus-strong" size={24} color="mediumseagreen" />
      </View>

      <View>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <View className='flex-col space-y-1'>
                <Text className='text-base text-gray-100 font-pmedium'>Trekking Difficulty</Text>
                <View className='border-2 border-black-200 bg-black-100 rounded-2xl'>
                  <Picker
                    style={{ color: "gray", fontWeight: "bold" }}
                    selectedValue={value}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Easy" value="easy" />
                    <Picker.Item label="Moderate" value="moderate" />
                    <Picker.Item label="Challenging" value="challenging" />
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
      </View>

      <View>
        <Controller
          control={control}
          name="trail"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <View className='flex-col space-y-1'>
                <Text className='text-base text-gray-100 font-pmedium'>Interested Trails</Text>
                <View className='border-2 border-black-200 bg-black-100 rounded-2xl'>
                  <Picker
                    style={{ color: "gray", fontWeight: "bold" }}
                    selectedValue={value}
                    onValueChange={onChange}
                  >
                    {trails.map((trail) => (
                      <Picker.Item key={trail.value} label={trail.label} value={trail.value} />
                    ))}
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
      </View>

      <View>
        <Controller
          control={control}
          name='distance'
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Forms
                title="Distance"
                placeholder="prefered trekking distance"
                value={value}
                onChangeText={onChange}
              />
              {error && (
                <Text className="flex justify-center items-center text-base text-red-700">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />
      </View>

      <View>
        <Controller
          control={control}
          name={'altitude'}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Forms
                title="Altitude"
                placeholder="prefered altitude"
                value={value}
                onChangeText={onChange}
              />
              {error && (
                <Text className="flex justify-center items-center text-base text-red-700">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />
      </View>

      <View>
        <Controller
          control={control}
          name="month"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <View className='flex-col space-y-1'>
                <Text className='text-base text-gray-100 font-pmedium'>Prefered Trekking Month</Text>
                <View className='border-2 border-black-200 bg-black-100 rounded-2xl'>
                  <Picker
                    style={{ color: "gray", fontWeight: "bold" }}
                    selectedValue={value}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="January" value="jan" />
                    <Picker.Item label="February" value="feb" />
                    <Picker.Item label="March" value="mar" />
                    <Picker.Item label="April" value="apr" />
                    <Picker.Item label="May" value="may" />
                    <Picker.Item label="June" value="jun" />
                    <Picker.Item label="July" value="jul" />
                    <Picker.Item label="August" value="aug" />
                    <Picker.Item label="September" value="sep" />
                    <Picker.Item label="October" value="oct" />
                    <Picker.Item label="November" value="nov" />
                    <Picker.Item label="December" value="dec" />
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
      </View>

      <View>
          <Controller
            control={control}
            name="features"
            render={({ field }) => (
              <>
             <View className='flex-col space-y-1'>
                <Text className='text-base text-gray-100 font-pmedium'>Other Interests</Text>
                <View className='border-2 border-black-200 bg-black-100 rounded-2xl p-3 flex-row flex-wrap space-x-2'>
                {features.map((item) => (
                  <View key={item.id} className='flex-row items-center space-x-1'>
                    <Checkbox
                      color='mediumseagreen'
                      status={field.value.includes(item.id) ? 'checked' : 'unchecked'}
                      onPress={() => {
                        const newValue = field.value.includes(item.id)
                          ? field.value.filter((val) => val !== item.id)
                          : [...field.value, item.id];
                        field.onChange(newValue);
                      }}
                    />
                    <Text className='text-base text-gray-100 font-pregular'>{item.label}</Text>
                  </View>
                ))}
              </View>
              </View>
              </>
            )}
          />
      </View>
      <View>
        <CustomButton title="Submit" handlePress={() => ""} containerStyles="mt-2 bg-sky-500" />
      </View>
    </View>
  );
}
