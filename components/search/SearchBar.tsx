// components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { icons } from '../../constants';

const SearchBar = ({ initialQuery }: { initialQuery: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || '');

  return (
    <View className="flex-row justify-between items-center p-2 mx-3 bg-black-100 rounded-xl border-2 border-[#333]">
      <View>
        <TextInput
          className="text-[#fff]"
          value={query}
          placeholder="Search a location"
          placeholderTextColor="#CDCDE0"
          onChangeText={setQuery}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            if (query === '') {
              Alert.alert(
                'Missing Query',
                'Please input something to search results across database'
              );
              return;
            }

            if (pathname.startsWith('/search')) {
              router.setParams({ query });
            } else {
              router.push(`/search/${query}`);
            }
          }}
        >
          <Image source={icons.search} resizeMode="contain" className="w-5 h-5 " />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
