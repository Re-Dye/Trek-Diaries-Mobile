import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferData, preferSchema } from '@/lib/zodSchema/preference';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Forms from './Forms';
import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { ReturnPreference, InsertPreference } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';
import Toast from 'react-native-toast-message';

const trails = [
  { label: 'Aanbu Kahireni Trail', value: 'Aanbu Kahireni Trail' },
  { label: 'Annapurna Base Camp Heli Trek', value: 'Annapurna Base Camp Heli Trek' },
  { label: 'Everest Base Camp', value: 'Everest Base Camp' },
  { label: 'Dhaulagiri Cricuit Trek', value: 'Dhaulagiri Cricuit Trek' },
  { label: 'Langtang Trek', value: 'Langtang Trek' },
];

export default function Preferences({ preference }: { preference: ReturnPreference | string }) {
  const { session } = useSessionStore();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trail: preference && typeof preference !== 'string' ? preference.trail : '',
      type: preference && typeof preference !== 'string' ? preference.type : 'easy',
      features: (() => {
        if (typeof preference !== 'string' && Array.isArray(preference?.features)) {
          return preference.features;
        } else {
          return ['village']; // Default to an array with a default feature if no preference or invalid data
        }
      })(),
      month: preference && typeof preference !== 'string' ? preference.month : 'jan',
      distance:
        preference && typeof preference !== 'string' && preference.distance
          ? preference.distance.toString()
          : '',
      altitude:
        preference && typeof preference !== 'string' && preference.altitude
          ? preference.altitude.toString()
          : '',
    },
    resolver: zodResolver(preferSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: preferData) => {
      console.log('inside mutate');
      const req: InsertPreference = {
        altitude: +data.altitude,
        distance: +data.distance,
        features: JSON.stringify(data.features),
        month: data.month,
        trail: data.trail,
        type: data.type,
        user_id: session!.id,
      };
      const res = await fetch(`/api/preference/add`, {
        method: preference && !(typeof preference === 'string') ? 'PATCH' : 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(req),
      });

      const message = await res.json();
      const status = res.status;
      console.log(message, status);
      return { message, status };
    },
    onSuccess: (data) => {
      if (data.status === 201) {
        queryClient.invalidateQueries({ queryKey: ['preference', session!.id] });
        queryClient.invalidateQueries({ queryKey: ['get-recommendations', session!.id] });
        queryClient.invalidateQueries({ queryKey: ['recommendation', 'feed', session!.id], });
        Toast.show({
          type: "success",
          text1: "Success!",   
          text2: "Preference updated successfully",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      } else if (data.status === 400) {
        alert('Invalid data. Please try again with valid data');
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid data. Please try again with valid data",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      } else {
        alert('Error updating preference');
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error updating preference",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      }
    },
    onError: (error) => {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${error.message}\nPlease try again later`,
        position: "bottom",
        visibilityTime: 3000,
        bottomOffset: 15,
        keyboardOffset: 20,
      });
    },
  });

  const handlePref = async (data: any) => {
    mutate(data);
  };

  return (
    <View className="flex-col space-y-6">
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
              <View className="flex-col space-y-1">
                <Text className="text-base text-gray-100 font-pmedium">Trekking Difficulty</Text>
                <View className="border-2 border-black-200 bg-black-100 rounded-2xl">
                  <Picker
                    style={{ color: 'gray', fontWeight: 'bold' }}
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
              <View className="flex-col space-y-1">
                <Text className="text-base text-gray-100 font-pmedium">Interested Trails</Text>
                <View className="border-2 border-black-200 bg-black-100 rounded-2xl">
                  <Picker
                    style={{ color: 'gray', fontWeight: 'bold' }}
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
          name="distance"
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
          name="altitude"
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
              <View className="flex-col space-y-1">
                <Text className="text-base text-gray-100 font-pmedium">
                  Preferred Trekking Month
                </Text>
                <View className="border-2 border-black-200 bg-black-100 rounded-2xl">
                  <Picker
                    style={{ color: 'gray', fontWeight: 'bold' }}
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
        <CustomButton
          title="Submit"
          handlePress={handleSubmit((data) => {
            handlePref(data);
          })}
          containerStyles="mt-2 bg-sky-500"
        />
      </View>
    </View>
  );
}
