// app/search/[query].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SearchCard from '@/components/SearchCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import ImagePick from '@/components/ImagePicker';
import SearchBar from '@/components/SearchBar';

const SearchResults = () => {
  const { locationID } = useLocalSearchParams();

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View>
          <View className="m-4">
            <Text className="text-white font-pmedium">Location id: {locationID}</Text>
          </View>
          <View>
            <SearchCard />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;
