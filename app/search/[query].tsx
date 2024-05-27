// app/search/[query].tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SearchCard from '@/components/search/SearchCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/commons/CustomButton';
import ImagePick from '@/components/commons/ImagePicker';
import SearchBar from '@/components/search/SearchBar';

const SearchResults = () => {
  const { query } = useLocalSearchParams();

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View>
          <SearchBar initialQuery={''} />
        </View>
        <View>
          <View className="m-4">
            <Text className="text-white font-pmedium">Search Results for: {query}</Text>
          </View>
          <View>
            <SearchCard id={''} address={''} description={''} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;
